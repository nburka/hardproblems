import { OG_SIZE, createOGImage } from '../../lib/og-template';

export const alt = 'Hard Problems coworking space in London';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return createOGImage({
    title: 'Coworking space',
    subtitle:
      'We have a small coworking space in London for people working on hard problems.'
  });
}
