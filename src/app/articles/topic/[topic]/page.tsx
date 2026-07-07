import { redirect } from 'next/navigation';

// Legacy route — /articles/topic/[topic] pages have moved to
// /articles/type/[topic]. Redirect so any old links or bookmarks land
// on the new unified page.
type Props = { params: Promise<{ topic: string }> };

export default async function LegacyTopicPage({ params }: Props) {
  const { topic } = await params;
  redirect(`/articles/type/${topic}`);
}
