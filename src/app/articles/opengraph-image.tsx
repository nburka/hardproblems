import { OG_SIZE, createOGImage } from '../../lib/og-template';

export const alt = 'Articles — Hard Problems';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return createOGImage({
    title: 'Articles',
    subtitle:
      'Reflections, book reviews, and writing about impact-driven careers and the work happening on the world’s hard problems.'
  });
}
