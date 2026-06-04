// Shared layout for every page's social-share card. Returns JSX that
// next/og's ImageResponse can render into a 1200x630 PNG.

export const OG_SIZE = { width: 1200, height: 630 } as const;

export function OGCard({
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
        background: '#fff',
        // Green top accent matching the site's body border.
        borderTop: '20px solid #84d9a6',
        padding: '64px 80px 80px 80px',
        fontFamily:
          'Helvetica, Arial, "SF Pro Text", -apple-system, sans-serif'
      }}
    >
      {/* "Hard Problems." logo, mirroring the site's h1 */}
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

      {/* Spacer pushes title+subtitle to the lower half of the card */}
      <div style={{ flex: 1 }} />

      {/* Page title */}
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
