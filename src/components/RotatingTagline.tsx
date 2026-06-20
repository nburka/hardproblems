'use client';

import { useEffect, useState } from 'react';

// Words cycled at the end of the site tagline. Order is the order the
// rotation runs through.
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
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade the current word out, swap text at the bottom of the
      // fade, then fade the next word in. Total cycle = VISIBLE_MS +
      // FADE_MS * 2.
      setVisible(false);
      const swap = setTimeout(() => {
        setIndex((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, FADE_MS);
      return () => clearTimeout(swap);
    }, VISIBLE_MS + FADE_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="site-tagline">
      We are a nonprofit that helps designers transition to full-time
      careers focused on urgent global challenges like{' '}
      <strong
        className="site-tagline-rotator"
        aria-live="polite"
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease`
        }}
      >
        {WORDS[index]}
      </strong>
    </p>
  );
}
