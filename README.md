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
- Messages stay inside the demo. No real external support messages, email, SMS, or background push are sent. The bell shows in-app updates.
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
3. Use the **Next.js** framework preset and the repository root as the root directory. Keep the default output directory; the build command is `npm run build`. No environment variables are required for this browser-local demo.
4. Deploy, then open the generated HTTPS URL. `/` is the customer app and `/owner` is the owner demo workspace.
5. On iPhone, open the deployed URL in Safari and use **Share → Add to Home Screen**. On Android, open it in Chrome and use **Install app** or **Add to Home Screen**.

Vercel supports Next.js without a custom `vercel.json`. See [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs) and [GitHub integration](https://vercel.com/docs/git/vercel-for-github).

The hosted demo starts with its own sample data: browser storage from localhost is not transferred, and separate devices do not sync bookings or messages. Both demo roles remain publicly accessible. Configure real authentication and data access controls before collecting real customer information; keep demo mode clearly labeled while sharing it.

Creating or merging the pull request does not itself configure a hosting account, publish a URL, or connect the production database.
