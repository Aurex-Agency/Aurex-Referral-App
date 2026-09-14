import test from 'node:test';
import assert from 'node:assert/strict';
import { createECDH } from 'node:crypto';
import { createPairing, readPairing, validateSubscription } from '../src/lib/push-demo.ts';

const ecdh = createECDH('prime256v1');
ecdh.generateKeys();
const sub = { endpoint: 'https://web.push.apple.com/test-device', keys: { p256dh: ecdh.getPublicKey().toString('base64url'), auth: Buffer.alloc(16, 1).toString('base64url') } };
test('pairing survives separate requests and is scoped to the device and origin', () => {
  const { token } = createPairing(sub, 'test-only-secret', 'https://demo.example', 1000);
  assert.deepEqual(readPairing(token, 'test-only-secret', 'https://demo.example', 2000), sub);
  assert.throws(() => readPairing(token, 'test-only-secret', 'https://other.example', 2000));
  assert.throws(() => readPairing(token, 'wrong-secret', 'https://demo.example', 2000));
  assert.throws(() => readPairing(token, 'test-only-secret', 'https://demo.example', 1000 + 24 * 60 * 60 * 1000));
  const bytes = Buffer.from(token, 'base64url'); bytes[35] ^= 1;
  assert.throws(() => readPairing(bytes.toString('base64url'), 'test-only-secret', 'https://demo.example', 2000));
});
test('push destination rejects local, spoofed, non-HTTPS and credential-bearing endpoints', () => {
  for (const endpoint of ['http://web.push.apple.com/a', 'https://127.0.0.1/a', 'https://web.push.apple.com.evil.example/a', 'https://web.push.apple.com@evil.example/a', 'https://user:pass@web.push.apple.com/a', 'https://web.push.apple.com:8080/a']) {
    assert.throws(() => validateSubscription({ ...sub, endpoint }));
  }
});
test('subscription requires a valid P-256 key and authentication secret', () => {
  assert.throws(() => validateSubscription({ ...sub, keys: { ...sub.keys, auth: 'short' } }));
  assert.throws(() => validateSubscription({ ...sub, keys: { ...sub.keys, p256dh: Buffer.alloc(65).toString('base64url') } }));
});
