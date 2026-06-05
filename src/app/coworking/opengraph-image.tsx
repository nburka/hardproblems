import { OG_SIZE, createOGImage } from '../../lib/og-template';

export const alt = 'Hard Problems co-working space in London';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return createOGImage({
    title: 'Co-working space',
    subtitle:
      'We have a small co-working space in London for people working on hard problems.'
  });
}
