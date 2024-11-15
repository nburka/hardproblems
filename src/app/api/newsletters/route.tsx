export async function GET() {
  const data = await fetch('https://rss.beehiiv.com/feeds/wQIRuYfjAg.xml');
  const text = await data.text();
  return new Response(text);
}
