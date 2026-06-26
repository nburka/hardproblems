'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  GraduationCap,
  Heart,
  Landmark,
  Sprout,
  type LucideIcon
} from 'lucide-react';

// Words cycled at the end of the site tagline. Each pairs with the
// same icon used by the matching sector tag on the job board.
const WORDS: { label: string; Icon: LucideIcon }[] = [
  { label: 'public health', Icon: Heart },
  { label: 'healthcare', Icon: Activity },
  { label: 'climate change', Icon: Sprout },
  { label: 'good government', Icon: Landmark },
  { label: 'education', Icon: GraduationCap }
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
        {WORDS.map(({ label, Icon }, i) => (
          <span
            key={label}
            className="site-tagline-rotator-word"
            aria-hidden={i === index ? undefined : 'true'}
            style={{
              opacity: i === index ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease`
            }}
          >
            <Icon
              className="site-tagline-rotator-icon"
              aria-hidden="true"
            />
            {label}
          </span>
        ))}
      </strong>
    </p>
  );
}
