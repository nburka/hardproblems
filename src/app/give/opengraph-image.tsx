import { ImageResponse } from 'next/og';
import { OG_SIZE, OGCard } from '../../lib/og-template';

export const alt = 'Give to Hard Problems';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <OGCard
        title="Give"
        subtitle="Support our non-profit work helping tech people tackle the world's hard problems."
      />
    ),
    size
  );
}
