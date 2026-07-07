'use client';

import { useEffect, useRef, useState } from 'react';

// Client-side favicon <img> with a Globe-icon fallback. The /api/favicon
// proxy 404s Google's fuzzy-globe stand-in for missing favicons, so
// when we see an error here it means either the real favicon didn't
// exist or the proxy couldn't reach Google — either way, show the
// generic globe glyph instead of the browser's broken-image icon.
//
// The <img> is server-rendered, so the browser may 404 the favicon
// before React attaches the onError listener during hydration. In
// that case the error event is lost, and without the useEffect check
// below the broken image would sit visible forever. After mount we
// re-inspect `complete` + `naturalWidth`; a completed image with zero
// natural width failed to load, so we flip to the fallback.

export default function CompanyFavicon({
  src,
  alt,
  className,
  fallback
}: {
  src: string;
  alt: string;
  className?: string;
  fallback: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  if (failed) return <>{fallback}</>;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      width={16}
      height={16}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
