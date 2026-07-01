'use client';

import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setMessage(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, hp: honeypot })
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (res.ok && data.ok) {
        setStatus('success');
        setMessage("Thanks — check your inbox to confirm.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(
          data.error ?? "Couldn't subscribe you. Please try again."
        );
      }
    } catch {
      setStatus('error');
      setMessage("Couldn't reach the newsletter service. Please try again.");
    }
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
      {/* Honeypot — hidden from real users, filled in by dumb bots. */}
      <label className="newsletter-form-honeypot" aria-hidden="true">
        Leave this field empty
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </label>

      <input
        className="newsletter-form-email"
        type="email"
        name="email"
        required
        placeholder="you@example.com"
        aria-label="Your email address"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'loading' || status === 'success'}
      />
      <button
        type="submit"
        className="newsletter-form-submit"
        disabled={status === 'loading' || status === 'success'}
      >
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </button>

      {message && (
        <p
          className={`newsletter-form-status newsletter-form-status--${status}`}
          role={status === 'error' ? 'alert' : 'status'}
        >
          {message}
        </p>
      )}
    </form>
  );
}
