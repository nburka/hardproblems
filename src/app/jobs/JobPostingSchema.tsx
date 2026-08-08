// Renders a single <script type="application/ld+json"> block containing
// schema.org JobPosting entries for each job. Google reads this and
// surfaces matching listings in the Jobs Card at the top of search
// results for queries like "designer job [location]".
//
// One <script> per page with all jobs inside a JSON array is fine
// (Google recommends but doesn't require one JSON-LD block per job).
// We concatenate them into a single block to minimise render overhead.
//
// Docs: https://developers.google.com/search/docs/appearance/structured-data/job-posting

import type { SerializedJob } from './fetchJobs';

const SITE_URL = 'https://hardproblems.com';

// Map the sheet's free-text remote field into schema.org's controlled
// vocabulary for `jobLocationType`. Anything unknown → omit the field
// (Google treats missing jobLocationType as onsite).
function jobLocationType(remote: string): 'TELECOMMUTE' | undefined {
  const r = remote.toLowerCase();
  if (r.includes('remote') || r.includes('anywhere')) return 'TELECOMMUTE';
  return undefined;
}

// Build one schema.org JobPosting object for a single job row. Fields
// omitted when the sheet value is missing (Google is fine with sparse
// data; required-for-Jobs-Card fields are title, description, and
// datePosted, all of which we always have).
function buildJobPosting(job: SerializedJob) {
  const posting: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || job.title,
    datePosted: job.date || undefined,
    hiringOrganization: job.company
      ? {
          '@type': 'Organization',
          name: job.company,
          sameAs: job.companyUrl || undefined
        }
      : undefined,
    directApply: false,
    // Direct link to the external listing so Google's Jobs Card sends
    // clicks straight to the employer.
    url: job.url || undefined,
    // Location. Schema.org's model expects either a Place (physical
    // address) or applicantLocationRequirements (for remote roles).
    jobLocation: job.city || job.country
      ? {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: job.city || undefined,
            addressCountry: job.country || undefined
          }
        }
      : undefined,
    jobLocationType: jobLocationType(job.remote)
  };

  // Salary is free-text in the sheet ("$80k-120k", "£45,000",
  // "Competitive", etc). Google prefers structured MonetaryAmount but
  // will accept a plain description field. We use the latter to avoid
  // over-parsing.
  if (job.salary && job.salary.toLowerCase() !== 'n/a') {
    posting.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: 'USD', // best-guess default; sheet doesn't tag currency
      value: {
        '@type': 'QuantitativeValue',
        unitText: 'YEAR',
        value: job.salary
      }
    };
  }

  return posting;
}

export default function JobPostingSchema({
  jobs
}: {
  jobs: SerializedJob[];
}) {
  if (jobs.length === 0) return null;
  const postings = jobs.map(buildJobPosting);
  // Concatenate into a single script tag; Google's crawler processes
  // arrays of JobPosting entries at the same URL.
  const json = JSON.stringify(postings);
  return (
    <script
      type="application/ld+json"
      // The JSON is built server-side from vetted sheet data — no
      // untrusted user input reaches this string.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export { SITE_URL };
