# Magnolia Mobile Detailing

A functional, fictional service-business demo for Aurex. Built with Next.js, React, and TypeScript. Magnolia and its customers are synthetic examples, with no affiliation to similarly named businesses.

## Run

Requires Node.js 20.9 or newer; Node.js 24 is recommended for the included TypeScript tests.

```sh
npm ci
npm run dev
```

Open http://localhost:3000 for the customer app and http://localhost:3000/owner for the owner workspace.

```sh
npm run typecheck
npm test
npm run build
npm start
```

## Demo walkthrough

1. Start as Taylor in the customer app. There is an upcoming Interior refresh, $15 in credit, and three of five loyalty stamps.
2. Book a future detail, choose an available time, and optionally apply reward credit. Existing requests reserve crew capacity; travel time is included.
3. Open the owner workspace using the demo bar. Review the booking request, confirm it, and record the simulated visit as completed and paid.
4. Return to the customer app. The status and reward balance have changed. Complete five qualifying visits to issue $25 credit.
5. Send a customer message, switch to the owner inbox, and reply. Both views use the same browser-saved data and synchronize across tabs on the same origin.
6. Open **Demo guide → Try Morgan’s referral booking**. Choose an available day/time. Morgan gets a $15 welcome discount on an eligible service. Confirm and complete this appointment in the owner workspace; Taylor receives $15 referral credit.
7. Customer Account contains notification preferences. Enable Occasional offers, then use owner Rewards to preview an announcement and add it to the demo in-app inbox.
8. Owner Business contains editable service prices and a confirmed **Reset demo data** action to restore the walkthrough. Price changes affect new bookings only.

## Implemented

- Responsive customer and owner interfaces, customer profile updates, service price editing.
- Booking requests, crew availability, travel buffers, confirmations, cancellations, and completion/payment recording.
- Held reward credit, release on cancellation, repeat-safe completion, referral eligibility, loyalty stamps and credit issuance.
- Customer/owner text chat with saved history and unread state.
- In-app notifications and announcement previews that respect the demo member's offer preference.
- Installable app manifest, local icon, service worker with a public offline fallback. Private application data is not cached by the service worker.
- Browser-local persistence and cross-tab updates. The local storage key is `magnolia-demo-v1`.

## Explicit demo boundaries

This is not production software. Use sample data only.

- Both roles are openly available demo views, not authenticated identities. There is no production owner login, staff permission enforcement, or tenant isolation yet.
- Data stays in this browser. Different devices and different origins do not share it. Clearing browser storage resets it. Concurrent writes from different tabs can race; production reservation correctness must live in the database.
- Payments are recorded simulations, never charged. Square is not connected. QuickBooks accounting sync is not connected and is separate from payment collection.
- Messages stay inside the demo. No real external support messages, email, SMS, or automatic push are sent. Account provides a manually triggered real push test for an opted-in device; the bell still shows browser-local in-app updates.
- The crew works Tuesday–Saturday, 8 AM–5 PM, with a fixed 30-minute buffer. Availability uses demo dates; geographic routing, real holiday calendars, expired holds, and production time-zone enforcement are not implemented.
- Rescheduling is handled by messaging; cancellation and a new request can demonstrate the result. Refund/reversal workflows, uploads, and an Aurex administrator portal are future pilot work.
- Referral links open the demo welcome-offer preview for synthetic customer Morgan. They are not a production account-creation or attribution mechanism.

## Supabase project

The user selected project `okikocimzeqnvtaxfnpd`:

https://supabase.com/dashboard/project/okikocimzeqnvtaxfnpd

No Supabase credentials are embedded, and no remote schema changes have been made. The connection was not callable in the active tool session during the initial demo build. See `SUPABASE-HANDOFF.md` for the integration boundary and next implementation steps.

## Deployment

### Vercel from GitHub

1. Merge the app pull request into `main` in `Aurex-Agency/Aurex-Referral-App`.
2. In Vercel, create a new project and import that GitHub repository. Grant Vercel access to the Aurex-Agency repository if it is not listed.
3. Use the **Next.js** framework preset and the repository root as the root directory. Keep the default output directory; the build command is `npm run build`. The booking demo needs no environment variables. Real test push requires the VAPID keys described below.
4. Deploy, then open the generated HTTPS URL. `/` is the customer app and `/owner` is the owner demo workspace.
5. On iPhone, open the deployed URL in Safari and use **Share → Add to Home Screen**. On Android, open it in Chrome and use **Install app** or **Add to Home Screen**.

Vercel supports Next.js without a custom `vercel.json`. See [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs) and [GitHub integration](https://vercel.com/docs/git/vercel-for-github).

The hosted demo starts with its own sample data: browser storage from localhost is not transferred, and separate devices do not sync bookings or messages. Both demo roles remain publicly accessible. Configure real authentication and data access controls before collecting real customer information; keep demo mode clearly labeled while sharing it.

Creating or merging the pull request does not itself configure a hosting account, publish a URL, or connect the production database.

## iPhone video: real test notifications

Aurex's Vercel project has VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY configured. For another deployment, generate a pair with npx web-push generate-vapid-keys and add both server environment variables. Never commit the private key. Without keys, the app still works and shows that push setup is pending.

1. Open the deployed app from its iPhone home-screen icon (iOS 16.4+), then open **Account**.
2. Tap **Enable phone notifications** and allow the iOS permission request.
3. Use **Share sender link to computer** (AirDrop, or copy/open the link on your computer). Do this before recording. The private link grants permission to send predefined test notifications to this phone for 24 hours.
4. Leave the phone on its home screen or lock it. In the computer's sender page, choose Appointment confirmed, New message, or Referral reward and click **Send test notification**.
5. Tap the arriving notification to open Magnolia. A successful server response means the push provider accepted it; delivery and banner presentation depend on phone connectivity, notification settings, and Focus.
6. Use **Turn off test notifications** in Account when finished. This unsubscribes the phone; old sender links no longer reach that subscription.

These are real Web Push deliveries with sample content. They do not update bookings, chat, or reward balances. The encrypted, authenticated pairing link holds one validated subscription, expires after 24 hours, and is bound to its deployment origin. It is a limited video demonstration, not a production staff/broadcast notification system. There is no shared in-memory subscriber list, so pairing works across Vercel function instances. Do not publish the sender link in a recording.

## iPhone layout and orientation

Mobile service actions fit within their cards. The booking dialog constrains native date controls and locks background scrolling. Bottom navigation handles touch release directly while retaining mouse and keyboard click activation; hover styles apply only to a mouse/trackpad.

The manifest requests portrait orientation. iOS does not reliably enforce a web app's orientation lock, so phones show an upright-phone prompt when the physical screen rotates, preserving the underlying page and form. It uses screen orientation rather than viewport height to avoid reacting to the software keyboard. Enable **Portrait Orientation Lock** in iPhone Control Center to prevent rotation entirely while filming.
