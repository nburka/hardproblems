import { ImageResponse } from 'next/og';
import { OG_SIZE, OGCard } from '../../lib/og-template';

export const alt = 'Hard Problems newsletter';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <OGCard
        title="Newsletter"
        subtitle="The email newsletter for technologists, engineers, designers, and product managers who want to work on hard problems."
      />
    ),
    size
  );
}
