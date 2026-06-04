import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 } as const;

// Load Inter Regular + Bold once and cache for the lifetime of the worker.
// We use fs.readFile rather than fetch(import.meta.url) because Turbopack
// doesn't yet support binary-asset URLs at dev time.
let cachedFonts: Awaited<ReturnType<typeof loadInterFontsUncached>> | null = null;

async function loadInterFontsUncached() {
  const fontsDir = join(process.cwd(), 'src/lib/fonts');
  const [regular, bold] = await Promise.all([
    readFile(join(fontsDir, 'Inter-Regular.woff')),
    readFile(join(fontsDir, 'Inter-Bold.woff'))
  ]);
  return [
    { name: 'Inter', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'Inter', data: bold, weight: 700 as const, style: 'normal' as const }
  ];
}

async function loadInterFonts() {
  if (!cachedFonts) cachedFonts = await loadInterFontsUncached();
  return cachedFonts;
}

// Returns an ImageResponse rendering the OG card with the page's title and
// optional subtitle. Inter is loaded once and reused.
export async function createOGImage({
  title,
  subtitle
}: {
  title: string;
  subtitle?: string;
}) {
  const fonts = await loadInterFonts();
  return new ImageResponse(<OGCard title={title} subtitle={subtitle} />, {
    ...OG_SIZE,
    fonts
  });
}

function OGCard({
  title,
  subtitle
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: 'linear-gradient(to bottom, #ffffff, #eefcf5)',
        borderTop: '20px solid #84d9a6',
        padding: '64px 80px 80px 80px',
        fontFamily: 'Inter'
      }}
    >
      {/* Logo: weight 700, with the green period */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: '-0.04em',
          color: '#333'
        }}
      >
        <span>Hard Problems</span>
        <span style={{ color: '#3aa36d' }}>.</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Title: weight 700 */}
      <div
        style={{
          display: 'flex',
          fontSize: 92,
          fontWeight: 700,
          color: '#231f20',
          lineHeight: 1.05,
          letterSpacing: '-0.04em',
          maxWidth: 1040
        }}
      >
        {title}
      </div>

      {subtitle ? (
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 32,
            fontWeight: 400,
            color: '#444',
            lineHeight: 1.3,
            maxWidth: 1040
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}
