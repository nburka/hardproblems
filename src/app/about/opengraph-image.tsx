import { OG_SIZE, createOGImage } from '../../lib/og-template';

export const alt = 'About Hard Problems';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return createOGImage({
    title: 'About',
    subtitle:
      'We help designers to work on the hard problems that matter — public health, healthcare, climate change, and good government.'
  });
}
