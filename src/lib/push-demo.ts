import { createCipheriv, createDecipheriv, createHash, ECDH, randomBytes } from 'node:crypto';

export type Subscription = { endpoint: string; keys: { p256dh: string; auth: string } };
export const PUSH_MESSAGES = {
  appointment: { title: 'Magnolia', body: 'Your detailing appointment is confirmed. We look forward to seeing you!' },
  message: { title: 'Magnolia · New message', body: 'Your detailer: We’re on our way. See you soon!' },
  reward: { title: 'Magnolia · Reward earned', body: 'You earned $15 in referral credit. Thanks for sharing Magnolia!' },
} as const;

export function validateSubscription(value: unknown): Subscription {
  if (!value || typeof value !== 'object') throw new Error('Invalid subscription');
  const s = value as Subscription;
  const url = new URL(s.endpoint);
  // Never send server-side requests to arbitrary client-provided URLs.
  const allowed = ['web.push.apple.com', 'fcm.googleapis.com', 'updates.push.services.mozilla.com'];
  if (url.protocol !== 'https:' || !allowed.includes(url.hostname) || url.port || url.username || url.password || url.hash || s.endpoint.length > 2048) throw new Error('Unsupported push service');
  if (!s.keys || !/^[A-Za-z0-9_-]{87}$/.test(s.keys.p256dh) || !/^[A-Za-z0-9_-]{22}$/.test(s.keys.auth)) throw new Error('Invalid subscription keys');
  const point = Buffer.from(s.keys.p256dh, 'base64url');
  if (point.length !== 65 || point[0] !== 4 || ECDH.convertKey(point, 'prime256v1').length !== 65) throw new Error('Invalid subscription key');
  return { endpoint: url.href, keys: { p256dh: s.keys.p256dh, auth: s.keys.auth } };
}

function encryptionKey(secret: string) { return createHash('sha256').update('magnolia-push-demo-v1:' + secret).digest(); }

export function createPairing(subscription: Subscription, secret: string, origin: string, now = Date.now()) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(secret), iv);
  const expires = now + 24 * 60 * 60 * 1000;
  const data = Buffer.from(JSON.stringify({ subscription: validateSubscription(subscription), origin, expires }));
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  return { token: Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url'), expires };
}

export function readPairing(token: string, secret: string, origin: string, now = Date.now()): Subscription {
  if (!/^[A-Za-z0-9_-]{50,6000}$/.test(token)) throw new Error('Invalid pairing');
  const bytes = Buffer.from(token, 'base64url');
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(secret), bytes.subarray(0, 12));
  decipher.setAuthTag(bytes.subarray(12, 28));
  const data = JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]).toString());
  if (data.origin !== origin || !Number.isFinite(data.expires) || data.expires <= now) throw new Error('Pairing expired');
  return validateSubscription(data.subscription);
}
