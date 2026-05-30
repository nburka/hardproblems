'use client';

import styles from './manageTracking.module.scss';

const STORAGE_KEY = 'hp-analytics-consent';
const FORCE_PROMPT_KEY = 'hp-force-prompt';

export default function ManageTrackingLink() {
  const handleClick = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      // Flag so ConsentManager shows the modal after reload even for
      // visitors in regions that would otherwise be auto-accepted.
      window.sessionStorage.setItem(FORCE_PROMPT_KEY, 'true');
    } catch {
      // ignore storage errors
    }
    // Reload so any already-loaded GA scripts/cookies don't keep collecting
    // until the visitor re-makes their choice.
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={styles.button}
      aria-label="Manage analytics tracking preferences"
    >
      Manage cookie tracking
    </button>
  );
}
