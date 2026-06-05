import { OG_SIZE, createOGImage } from '../../lib/og-template';

export const alt = 'Hard Problems podcast';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return createOGImage({
    title: 'Podcast',
    subtitle:
      'Interviews with the designers doing the work on hard problems.'
  });
}
