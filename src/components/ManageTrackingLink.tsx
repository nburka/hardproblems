'use client';

import styles from './manageTracking.module.scss';

const STORAGE_KEY = 'hp-analytics-consent';

export default function ManageTrackingLink() {
  const handleClick = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
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
      Manage tracking
    </button>
  );
}
