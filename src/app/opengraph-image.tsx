import { OG_SIZE, createOGImage } from '../lib/og-template';

export const alt = 'We help designers to work on hard problems';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return createOGImage({
    title: 'We help designers to work on hard problems',
    subtitle:
      'A non-profit focused on healthcare, climate change, and good government.'
  });
}
