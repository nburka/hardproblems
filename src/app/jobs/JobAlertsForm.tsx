'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, Check, Loader2, X, MailPlus, BadgeInfo } from 'lucide-react';
import { filtersSummary, serializeFilters } from '../../lib/alerts/filters';
import styles from './jobAlerts.module.scss';

type Status = 'idle' | 'submitting' | 'sent' | 'error';

// Sits at the top of the job board. Reads current URL filters so a
// signup automatically captures the criteria the user is looking at.
// On desktop the callout renders inline in the filter sidebar; on
// mobile it collapses to a single "Get email alerts for jobs" link
// that opens a modal containing the same form.
export default function JobAlertsForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Track email-input focus so we can reveal the "Alerts for: …"
  // summary only while the user is actively engaging with the form.
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Portals need document.body — only render the modal after mount so
  // we don't touch DOM during SSR.
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // ESC-to-close + scroll-lock while the modal is open, plus initial
  // focus on the close button for keyboard users.
  useEffect(() => {
    if (!modalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setModalOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [modalOpen]);

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

  // The "Check your inbox" panel — replaces the form after submit.
  const renderSent = (): ReactNode => (
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
  );

  // The form + supporting rows. Rendered inside both the desktop
  // wrapper and the mobile modal.
  const renderForm = (): ReactNode => (
    <>
      {hasFilters ? (
        <p className={styles.summary}>
          Alerts for: <strong>{summary}</strong>
        </p>
      ) : (
        <p className={styles.hint}>
          <BadgeInfo
            className={styles.hintIcon}
            size={18}
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <span>
            <strong>Filter first?</strong> Add filters to get targeted job
            emails for your location or type of role.
          </span>
        </p>
      )}
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
      {error && <p className={styles.error}>{error}</p>}
      <p className={styles.terms}>
        We&rsquo;ll only email you jobs. See{' '}
        <Link href="/privacy">Privacy notice</Link>.
      </p>
    </>
  );

  return (
    <>
      {/* Trigger link — same on desktop and mobile. Opens the modal
          where the actual signup form lives. */}
      <button
        type="button"
        className={styles.mobileLink}
        onClick={() => setModalOpen(true)}
      >
        <MailPlus size={16} strokeWidth={1.75} aria-hidden="true" />
        <span>
          {hasFilters
            ? 'Get email alerts for jobs that match filters'
            : 'Get email alerts'}
        </span>
      </button>

      {/* Modal — mounts into document.body via portal so it escapes any
          transformed / overflow-hidden ancestors. */}
      {mounted &&
        modalOpen &&
        createPortal(
          <div
            className={styles.modalBackdrop}
            role="presentation"
            onClick={() => setModalOpen(false)}
          >
            <div
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="alerts-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={closeButtonRef}
                type="button"
                className={styles.modalClose}
                aria-label="Close"
                onClick={() => setModalOpen(false)}
              >
                <X size={18} aria-hidden="true" />
              </button>
              <div className={styles.header}>
                <div>
                  <strong id="alerts-modal-title">Custom daily alerts</strong>
                  <p className={styles.headerBody}>
                    One daily email with new jobs that match your filters.
                    Unsubscribe anytime.
                  </p>
                </div>
              </div>
              {status === 'sent' ? renderSent() : renderForm()}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
