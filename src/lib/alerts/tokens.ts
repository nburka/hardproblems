import { randomBytes } from 'crypto';

// 32 bytes of entropy → 43-char base64url string. Used for both
// confirmation and unsubscribe links; opaque (no signature) so we
// look them up in the DB on every use, which makes revocation trivial.
export function newToken(): string {
  return randomBytes(32)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
