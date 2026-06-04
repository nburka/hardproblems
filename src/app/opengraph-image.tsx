import { ImageResponse } from 'next/og';
import { OG_SIZE, OGCard } from '../lib/og-template';

export const alt = 'Hard Problems — a non-profit helping tech people work on hard problems';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <OGCard
        title="Helping tech people work on hard problems"
        subtitle="A non-profit focused on public health, climate change, and good government."
      />
    ),
    size
  );
}
