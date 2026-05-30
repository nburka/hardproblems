import { NextRequest, NextResponse } from 'next/server';

// Country codes (ISO 3166-1 alpha-2) for jurisdictions where we require
// explicit consent before loading non-essential cookies/analytics.
const CONSENT_REQUIRED_COUNTRIES = new Set<string>([
  // European Union (27)
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE',
  // EEA non-EU
  'IS', 'LI', 'NO',
  // UK + Switzerland
  'GB', 'CH',
  // Other GDPR-style regimes
  'BR', // Brazil (LGPD)
  'CA'  // Canada (PIPEDA + Quebec Law 25)
]);

function consentRequired(
  country: string | null,
  region: string | null
): boolean {
  // Fail safe: if we can't determine the country, treat as consent-required.
  if (!country) return true;
  const c = country.toUpperCase();
  if (CONSENT_REQUIRED_COUNTRIES.has(c)) return true;
  if (c === 'US') {
    // California (CCPA/CPRA) requires consent. If the US state can't be
    // resolved (e.g. Cloudflare's free plan doesn't expose region headers),
    // we default to consent-required for the entire US — safer fallback.
    if (!region) return true;
    return region.toUpperCase() === 'CA';
  }
  return false;
}

export function middleware(request: NextRequest) {
  // Cloudflare adds cf-ipcountry; Vercel adds x-vercel-ip-country.
  // Prefer Cloudflare (closer to the edge) then Vercel as fallback.
  const country =
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-vercel-ip-country');
  // Region info is plan-dependent on Cloudflare; Vercel exposes US state via
  // x-vercel-ip-country-region. May be null on lower plans.
  const region = request.headers.get('x-vercel-ip-country-region');

  const value = consentRequired(country, region) ? 'true' : 'false';

  const response = NextResponse.next();
  response.cookies.set('hp-consent-required', value, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 // 1 hour; middleware refreshes on every navigation
  });
  return response;
}

// Run on every page request, but skip API routes and static assets.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
