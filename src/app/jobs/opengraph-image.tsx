import { ImageResponse } from 'next/og';
import { OG_SIZE, OGCard } from '../../lib/og-template';

export const alt = 'Jobs board for designers who want to work on hard problems';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <OGCard
        title="Jobs board"
        subtitle="Jobs for designers who want to work on hard problems like healthcare, public health, and climate change."
      />
    ),
    size
  );
}
