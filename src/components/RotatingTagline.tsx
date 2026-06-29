'use client';

import { useEffect, useState } from 'react';
import { getSectorIcon } from '../app/jobs/sectorIcons';

// Words cycled at the end of the site tagline. Each label is looked up
// against the shared sector → icon map (jobs/sectorIcons.ts) so the
// header animation, the homepage jobs preview, and the /jobs board
// pills all stay in sync from one source of truth.
const WORDS = [
  'public health',
  'healthcare',
  'climate change',
  'good government',
  'education'
];

const VISIBLE_MS = 2200;
const FADE_MS = 450;

export default function RotatingTagline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, VISIBLE_MS + FADE_MS);
    return () => clearInterval(interval);
  }, []);

  // All words render into the same grid cell so the rotator's box width
  // = the widest word. Only the active word is fully opaque; the others
  // sit invisibly underneath to reserve the layout space. Crossfade is
  // a simple opacity transition between sibling words.
  return (
    <p className="site-tagline">
      Good design solves problems.
      <br className="site-tagline-break" /> Great design solves problems
      that matter:{' '}
      <strong className="site-tagline-rotator" aria-live="polite">
        {WORDS.map((label, i) => {
          const Icon = getSectorIcon(label);
          return (
            <span
              key={label}
              className="site-tagline-rotator-word"
              aria-hidden={i === index ? undefined : 'true'}
              style={{
                opacity: i === index ? 1 : 0,
                transform: i === index ? 'scale(1)' : 'scale(0.7)',
                transformOrigin: 'left center',
                transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1)`
              }}
            >
              {Icon && (
                <Icon
                  className="site-tagline-rotator-icon"
                  aria-hidden="true"
                />
              )}
              {label}
            </span>
          );
        })}
      </strong>
    </p>
  );
}
