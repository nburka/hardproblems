import { ImageResponse } from 'next/og';
import { OG_SIZE, OGCard } from '../../lib/og-template';

export const alt = 'Hard Problems podcast';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <OGCard
        title="Podcast"
        subtitle="Interviews with the tech people doing the work on hard problems."
      />
    ),
    size
  );
}
