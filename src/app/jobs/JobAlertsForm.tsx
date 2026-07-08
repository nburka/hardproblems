'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, Check, Loader2 } from 'lucide-react';
import {
  filtersSummary,
  serializeFilters
} from '../../lib/alerts/filters';
import styles from './jobAlerts.module.scss';

type Status = 'idle' | 'submitting' | 'sent' | 'error';

// Sits at the top of the job board. Reads current URL filters so a
// signup automatically captures the criteria the user is looking at.
export default function JobAlertsForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  // Serialize + describe the current filters. Memoized so we only
  // recompute on searchParams change, not on every keystroke.
  const { filters, summary, hasFilters } = useMemo(() => {
    const record: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      record[key] = value;
    });
    const f = serializeFilters(record);
    return {
      filters: f,
      summary: filtersSummary(f),
      hasFilters: Object.keys(f).length > 0
    };
  }, [searchParams]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setError(null);
    try {
      const res = await fetch('/api/alerts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, filters, hp: honeypot })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('sent');
    } catch {
      setError("We couldn't reach the server. Please try again.");
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className={styles.wrapper}>
        <div className={styles.sent}>
          <Check
            size={20}
            className={styles.sentIcon}
            strokeWidth={2.5}
            aria-hidden="true"
          />
          <div>
            <strong>Check your inbox</strong>
            <p className={styles.sentBody}>
              We sent a confirmation link to <em>{email}</em>. Click it to
              activate your daily job alerts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <strong>Daily email digest</strong>
          <p className={styles.headerBody}>
            One daily email with new jobs that match your filters.
            Unsubscribe anytime.
          </p>
        </div>
      </div>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <label className={styles.field}>
          <span className="sr-only">Email address</span>
          <Mail
            className={styles.fieldIcon}
            size={16}
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'submitting'}
            className={styles.input}
          />
          <button
            type="submit"
            className={styles.submit}
            disabled={status === 'submitting'}
            aria-label={status === 'submitting' ? 'Subscribing' : 'Subscribe'}
            aria-busy={status === 'submitting'}
          >
            {status === 'submitting' ? (
              <Loader2
                className={styles.submitIconSpin}
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            ) : (
              <Check size={16} strokeWidth={2.5} aria-hidden="true" />
            )}
          </button>
        </label>
        {/* Honeypot — hidden from real users, tempting to bots. */}
        <label className={styles.honeypot} aria-hidden="true">
          Company
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </form>
      {hasFilters && (
        <p className={styles.summary}>
          Alerts for: <strong>{summary}</strong>
        </p>
      )}
      {error && <p className={styles.error}>{error}</p>}
      <p className={styles.terms}>
        We&rsquo;ll only email you the daily digest. See our{' '}
        <Link href="/privacy">privacy notice</Link> for details.
      </p>
    </div>
  );
}
