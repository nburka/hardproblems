import { createHash } from 'crypto';
import { NextResponse } from 'next/server';

// Server-side favicon proxy. Google's s2/favicons endpoint always
// returns 200 OK — even when the domain has no favicon, in which case
// it hands back a small, fuzzy globe placeholder. This route fetches
// the icon, detects that specific placeholder by SHA-1, and 404s in
// its place so the client's <img onError> handler can swap in our own
// GlobeIcon fallback instead of showing Google's blurry stand-in.
//
// The placeholder is byte-identical across every unknown host, so a
// single hash covers the entire fallback case.
const GOOGLE_FALLBACK_SHA1 = '2d7c9b60d1e2b4f4726141de2e4ab738110b9287';

// Loose hostname check — must contain a dot, only URL-safe chars.
// Blocks obvious garbage without pretending to be a full validator.
const HOSTNAME_RE = /^[a-z0-9.-]+\.[a-z0-9-]+$/i;

// Cache aggressively at the edge — favicons don't change often, and
// paying a Google round-trip on every job render would be wasteful.
const CACHE_HEADERS = {
  // Public + long CDN cache. The client browser also caches for a day.
  'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable'
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const host = (searchParams.get('host') || '').trim().toLowerCase();

  if (!host || !HOSTNAME_RE.test(host)) {
    return new NextResponse(null, { status: 400 });
  }

  const upstream = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
    host
  )}&sz=64`;

  let res: Response;
  try {
    res = await fetch(upstream, {
      // Follow Google's redirect from google.com → gstatic.
      redirect: 'follow',
      // Cache on the Next server side for a day to avoid hammering
      // Google when the same host appears in many jobs.
      next: { revalidate: 86400 }
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }

  if (!res.ok) {
    return new NextResponse(null, { status: 404 });
  }

  const buf = new Uint8Array(await res.arrayBuffer());
  const sha1 = createHash('sha1').update(buf).digest('hex');

  if (sha1 === GOOGLE_FALLBACK_SHA1) {
    return new NextResponse(null, { status: 404, headers: CACHE_HEADERS });
  }

  const contentType = res.headers.get('content-type') || 'image/png';
  return new NextResponse(buf, {
    status: 200,
    headers: {
      ...CACHE_HEADERS,
      'Content-Type': contentType
    }
  });
}
