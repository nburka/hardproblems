import { OG_SIZE, createOGImage } from '../../lib/og-template';

export const alt = 'Give to Hard Problems';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return createOGImage({
    title: 'Give',
    subtitle:
      "Support our nonprofit work helping designers tackle the world's hard problems."
  });
}
