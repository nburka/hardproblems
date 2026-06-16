import { redirect } from 'next/navigation';

// /articles content now lives at the site root. Redirect any old links
// or bookmarks to the homepage so we don't serve duplicate content.
export default function ArticlesPage() {
  redirect('/');
}
