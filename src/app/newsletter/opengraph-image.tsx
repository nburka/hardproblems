import { OG_SIZE, createOGImage } from '../../lib/og-template';

export const alt = 'Hard Problems newsletter';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return createOGImage({
    title: 'Newsletter',
    subtitle:
      'The email newsletter for technologists, engineers, designers, and product managers who want to work on hard problems.'
  });
}
