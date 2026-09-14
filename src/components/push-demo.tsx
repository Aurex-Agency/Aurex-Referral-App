'use client';

import { useEffect, useState } from 'react';

async function api(body?: object) {
  const response = await fetch('/api/push', body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : { cache: 'no-store' });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Could not reach the notification service.');
  return data;
}
function applicationKey(value: string) {
  return Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4)), c => c.charCodeAt(0));
}

export function PushDemo({ sender = false }: { sender?: boolean }) {
  const [config, setConfig] = useState<{ enabled: boolean; publicKey: string } | null>(null);
  const [supported, setSupported] = useState(false);
  const [installed, setInstalled] = useState(true);
  const [link, setLink] = useState('');
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [active, setActive] = useState(false);
  const [kind, setKind] = useState('appointment');
  useEffect(() => {
    setSupported('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window);
    setInstalled(!/iPhone|iPad|iPod/.test(navigator.userAgent) || matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    api().then(setConfig).catch(() => setStatus('Could not load notification setup. Check your connection and reopen Account.'));
    if ('serviceWorker' in navigator) navigator.serviceWorker.ready.then(r => r.pushManager?.getSubscription()).then(s => setActive(Boolean(s))).catch(() => {});
    if (sender) {
      setToken(new URLSearchParams(location.hash.slice(1)).get('device') || '');
      // Keep the capability out of the address bar after loading.
      history.replaceState(null, '', location.pathname);
    }
  }, [sender]);
  async function enable() {
    if (!config?.publicKey) return;
    setBusy(true); setStatus('');
    try {
      // Request from the direct tap, before any network awaits (required by iOS).
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') throw new Error('Notifications are blocked. Allow Magnolia notifications in iPhone Settings, then try again.');
      await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      subscription ??= await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: applicationKey(config.publicKey) });
      setActive(true);
      const paired = await api({ action: 'pair', subscription: subscription.toJSON() });
      setLink(location.origin + '/push-demo#device=' + paired.token);
      setStatus('Your phone is ready. Open the private sender link on your computer, then return this phone to its home screen.');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Could not enable notifications.'); }
    finally { setBusy(false); }
  }
  async function stop() {
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      await subscription?.unsubscribe();
      setLink(''); setActive(false); setStatus('Test notifications are off. Existing sender links can no longer reach this subscription.');
    } catch { setStatus('Could not turn off notifications. Try again or disable Magnolia notifications in iPhone Settings.'); }
    finally { setBusy(false); }
  }
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: 'Magnolia test notification sender', url: link });
      else { await navigator.clipboard.writeText(link); setStatus('Sender link copied. Open it on your computer.'); }
    } catch (error) { if ((error as Error).name !== 'AbortError') setStatus('Select and copy the sender link below.'); }
  }
  async function send() {
    setBusy(true); setStatus('');
    try {
      await api({ action: 'send', token, kind });
      setStatus('Accepted by the push service. Check your phone. If no banner appears, check Focus and Magnolia notification settings.');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Could not send the test.'); }
    finally { setBusy(false); }
  }
  return <section className="push-panel">
    <p className="eyebrow">VIDEO DEMO · REAL PUSH</p>
    <h2>{sender ? 'Send to your paired phone' : 'Phone notifications'}</h2>
    <p className="muted">{sender ? 'Return your paired phone to the home screen or lock it, then send a sample notification.' : 'Receive a real Magnolia test notification, even when the app is closed.'}</p>
    {config && !config.enabled && <p className="inline-note">Notification setup is pending. Reopen this page after Aurex finishes setup.</p>}
    {sender ? <>
      {!token && <p className="inline-note">Open Account on your phone, enable notifications, and share its private sender link to this computer.</p>}
      <label className="form-stack">Test notification<select value={kind} onChange={e => setKind(e.target.value)}><option value="appointment">Appointment confirmed</option><option value="message">New message</option><option value="reward">Referral reward</option></select></label>
      <button className="button primary" disabled={busy || !token || !config?.enabled} onClick={send}>{busy ? 'Sending…' : 'Send test notification'}</button>
    </> : <>
      {!installed ? <p className="inline-note">On iPhone, add Magnolia to your home screen, then open it using that icon to enable notifications.</p> : !supported ? <p className="inline-note">This browser does not support push. Use the installed app on iOS 16.4 or later.</p> : <div className="button-row">
        <button className="button primary" disabled={busy || !config?.enabled} onClick={enable}>{busy ? 'Working…' : active ? 'Create sender link' : 'Enable phone notifications'}</button>
        {active && <button className="button secondary" disabled={busy} onClick={stop}>Turn off test notifications</button>}
      </div>}
      {link && <><button className="button secondary push-link" onClick={share}>Share sender link to computer</button><label className="form-stack">Private sender link<input readOnly value={link} onFocus={e => e.target.select()} /></label><p className="fine-print">Valid for 24 hours. Anyone with this link can send sample notifications to this phone. Keep the link out of your recording.</p></>}
    </>}
    {status && <p role="status" className="push-status">{status}</p>}
    <p className="fine-print">Sample notifications only. This does not confirm a booking, send a chat message, or change rewards.</p>
  </section>;
}
