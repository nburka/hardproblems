import {
  Activity,
  GraduationCap,
  Heart,
  Sprout,
  Landmark,
  HandHelping,
  Earth,
  Users,
  Palette,
  type LucideIcon
} from 'lucide-react';

// Single source of truth for the sector → Lucide icon mapping used by:
//   - JobsList    (tag pills on the /jobs board)
//   - JobsTeaser  (kickers in the homepage jobs preview)
//   - RotatingTagline (icon next to the rotating word in the header)
//
// Keys are the _displayed_ sector string lower-cased so the lookup
// survives displaySector() pretty-printing. Returns null when there's
// no dedicated icon for that sector yet — the consumer should fall
// back to rendering the tag without an icon.
export function getSectorIcon(displayed: string): LucideIcon | null {
  const key = displayed.toLowerCase().trim();
  switch (key) {
    case 'healthcare':
      return Activity;
    case 'public health':
      return Users;
    case 'education':
      return GraduationCap;
    case 'personal health':
      return Heart;
    case 'climate tech':
    case 'climate change':
      return Sprout;
    case 'public services':
    case 'good gov':
    case 'good government':
      return Landmark;
    case 'nonprofit support':
    case 'non-profit support':
      return HandHelping;
    case 'culture':
      return Palette;
    case 'other':
      return Earth;
    default:
      return null;
  }
}
