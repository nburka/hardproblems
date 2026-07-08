import { NextResponse } from 'next/server';
import { fetchJobs } from '../../../jobs/fetchJobs';
import { filterJobs, parseFiltersFromParams } from '../../../jobs/filters';
import { digestHtml } from '../../../../lib/alerts/emails';
import {
  filtersToSearchParams,
  serializeFilters
} from '../../../../lib/alerts/filters';
import { siteUrl } from '../../../../lib/alerts/http';

// GET /api/alerts/preview
// Dev-only debugging endpoint — renders the daily digest HTML in the
// browser using real jobs from the sheet, so we can iterate on the
// email design without actually sending anything.
//
// Reuses the same URL params the /jobs page uses so preview URLs like
// /api/alerts/preview?sector=climate render exactly what a subscriber
// on those filters would receive. An optional ?limit=N caps the count.

export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Preview disabled in production.', {
      status: 404
    });
  }

  const url = new URL(request.url);
  const filters = parseFiltersFromParams(url.searchParams);
  const jobs = await fetchJobs();
  const filtered = filterJobs(jobs, filters);
  const limitStr = url.searchParams.get('limit');
  const limit = limitStr ? parseInt(limitStr, 10) : 10;
  const preview = filtered.slice(0, Number.isFinite(limit) ? limit : 10);

  // Rebuild the serialized-filters shape the email templates expect.
  const record: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    record[key] = value;
  });
  const filterJson = serializeFilters(record);

  const boardParams = filtersToSearchParams(filterJson).toString();
  const boardUrl = boardParams
    ? `${siteUrl()}/jobs?${boardParams}`
    : `${siteUrl()}/jobs`;

  const html = digestHtml({
    jobs: preview,
    filters: filterJson,
    unsubscribeUrl: `${siteUrl()}/api/alerts/unsubscribe?token=PREVIEW`,
    boardUrl
  });

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
