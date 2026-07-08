'use client';

import { useRouter } from 'next/navigation';
import styles from '../app/articles/page.module.scss';

// Mobile-only dropdown counterpart to CategoriesSidebar. Renders a
// native <select> so the on-device picker (iOS wheel, Android sheet)
// handles the choice — much faster to browse than tapping through a
// long stacked list at mobile widths.
//
// Entries are pre-computed by the parent server component so this
// file can stay purely client-side (no fs / path imports leaking
// through the article helpers).
export type CategoryEntry = {
  key: string;
  label: string;
  href: string;
  count: number;
};

export default function CategoriesDropdown({
  entries,
  activeKey
}: {
  entries: CategoryEntry[];
  activeKey?: string;
}) {
  const router = useRouter();
  const current =
    entries.find((e) => e.key === activeKey)?.href ??
    entries[0]?.href ??
    '/articles/type/all';

  return (
    <select
      className={styles.categoriesDropdown}
      value={current}
      onChange={(e) => {
        router.push(e.target.value);
      }}
      aria-label="Choose a content category"
    >
      {entries.map((entry) => (
        <option key={entry.key} value={entry.href}>
          {entry.label} ({entry.count})
        </option>
      ))}
    </select>
  );
}
