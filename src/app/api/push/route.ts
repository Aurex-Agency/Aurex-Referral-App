import webpush from 'web-push';
import { createPairing, readPairing, validateSubscription, PUSH_MESSAGES } from '@/lib/push-demo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'no-store' };
const reply = (body: object, status = 200) => Response.json(body, { status, headers });

export function GET() {
  const enabled = Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
  return reply({ enabled, publicKey: enabled ? process.env.VAPID_PUBLIC_KEY : null });
}

export async function POST(request: Request) {
  // Next's internal request URL may use its bind address. Compare the browser's
  // origin with the HTTP Host instead, for both localhost and Vercel domains.
  const origin = request.headers.get('origin') || '';
  let sameOrigin = false;
  try {
    const url = new URL(origin);
    sameOrigin = url.origin === origin && url.host === request.headers.get('host') &&
      (url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)));
  } catch {}
  if (!sameOrigin || !request.headers.get('content-type')?.startsWith('application/json')) return reply({ error: 'Request not allowed.' }, 403);
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return reply({ error: 'Push setup is not complete yet.' }, 503);
  let body;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error('Missing body');
    let size = 0;
    const chunks = [];
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 8192) { await reader.cancel(); return reply({ error: 'Request too large.' }, 413); }
      chunks.push(value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString());
    if (!body || typeof body !== 'object') throw new Error('Invalid body');
  } catch { return reply({ error: 'Invalid request.' }, 400); }
  if (body.action === 'pair') {
    try { return reply(createPairing(validateSubscription(body.subscription), privateKey, origin)); }
    catch { return reply({ error: 'This phone subscription is not supported. Try enabling notifications again.' }, 400); }
  }
  if (body.action !== 'send' || typeof body.token !== 'string' || !Object.hasOwn(PUSH_MESSAGES, body.kind)) return reply({ error: 'Choose a test notification.' }, 400);
  let subscription;
  try { subscription = readPairing(body.token, privateKey, origin); }
  catch { return reply({ error: 'This sender link is invalid or expired. Create a new link on your phone.' }, 401); }
  try {
    await webpush.sendNotification(subscription, JSON.stringify(PUSH_MESSAGES[body.kind as keyof typeof PUSH_MESSAGES]), {
      vapidDetails: { subject: 'https://aurex-referral-app.vercel.app', publicKey, privateKey },
      TTL: 60, urgency: 'high', timeout: 10000,
    });
    return reply({ sent: true });
  } catch (error) {
    const code = (error as { statusCode?: number }).statusCode;
    return reply({ error: code === 404 || code === 410 ? 'This phone has unsubscribed. Enable notifications on the phone again.' : 'The push service could not accept this test. Please try again.' }, code === 404 || code === 410 ? 410 : 502);
  }
}
