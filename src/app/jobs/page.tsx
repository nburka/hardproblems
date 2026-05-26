import Link from 'next/link';
import { Footer } from '../../components/Footer';
import JobsList, { SerializedJob } from './JobsList';
import styles from './page.module.scss';

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1Vpvb3T_wVAdtvhxuYfg4YBYysE7_hE1qmP1qyiZWfk8/export?format=csv&gid=0';

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function parseDate(s: string): Date | null {
  const trimmed = s.trim();
  if (!trimmed) return null;
  const parts = trimmed.split('/').map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [day, month, year] = parts;
  const d = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

async function fetchJobs(): Promise<SerializedJob[]> {
  const res = await fetch(SHEET_CSV_URL, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const text = await res.text();
  const rows = parseCSV(text).filter((r) => r.some((c) => c.trim().length > 0));
  if (rows.length < 2) return [];

  const dataRows = rows.slice(1);
  const jobs = dataRows.map((r) => {
    const date = parseDate(r[0] ?? '');
    return {
      date: date ? date.toISOString() : null,
      url: (r[1] ?? '').trim(),
      title: (r[2] ?? '').trim(),
      company: (r[3] ?? '').trim(),
      companyUrl: (r[4] ?? '').trim(),
      country: (r[5] ?? '').trim(),
      city: (r[6] ?? '').trim(),
      remote: (r[7] ?? '').trim(),
      salary: (r[8] ?? '').trim(),
      sector: (r[9] ?? '').trim(),
      description: (r[10] ?? '').trim()
    } satisfies SerializedJob;
  });

  jobs.sort((a, b) => {
    const at = a.date ? new Date(a.date).getTime() : -Infinity;
    const bt = b.date ? new Date(b.date).getTime() : -Infinity;
    return bt - at;
  });

  return jobs;
}

export default async function Page() {
  const jobs = await fetchJobs();

  return (
    <>
      <section className={styles.board}>
        <h2>Jobs</h2>
        <p className="intro">
          Jobs for designers who want to work on hard problems like healthcare,
          public health, and climate change. Our favorite job sources are{' '}
          <Link href="https://linkedin.come">LinkedIn</Link>,{' '}
          <Link href="https://designgigsforgood.org">Design Gigs for Good</Link>
          , <Link href="https://techjobsforgood.com">Tech Jobs for Good</Link>,{' '}
          <Link href="https://climatebase.org">Climate Base</Link>, and{' '}
          <Link href="https://digitalrights.community/job-board">
            Digital Rights
          </Link>
          .
        </p>

        {jobs.length === 0 ? (
          <p>
            We&rsquo;re having trouble loading the job board right now. Please
            check back soon.
          </p>
        ) : (
          <JobsList jobs={jobs} />
        )}
      </section>
      <Footer />
    </>
  );
}
