export type SerializedJob = {
  date: string | null;
  url: string;
  title: string;
  company: string;
  companyUrl: string;
  country: string;
  city: string;
  remote: string;
  salary: string;
  sector: string;
  description: string;
};

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

  // ISO format: YYYY-MM-DD
  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);
    const d = new Date(Date.UTC(year, month - 1, day));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // DD/MM/YYYY format
  const parts = trimmed.split('/').map((p) => parseInt(p, 10));
  if (parts.length === 3 && !parts.some((n) => Number.isNaN(n))) {
    const [day, month, year] = parts;
    const d = new Date(Date.UTC(year, month - 1, day));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  return null;
}

export async function fetchJobs(): Promise<SerializedJob[]> {
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
