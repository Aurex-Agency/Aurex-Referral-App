# Aurex Referral App — product and pilot plan

Version 2 · September 14, 2026 · Demo direction confirmed

**Confirmed decisions:** Start with Magnolia Mobile Detailing; an installable web app is acceptable; demo deadline is September 15, 2026; use Supabase project `okikocimzeqnvtaxfnpd` when connection access is available; accommodate owners using Square, QuickBooks, and other tools; Aurex handles setup and support.

**Current implementation:** A working local Next.js demo includes customer and owner views, browser-saved appointments, text chat, referral/loyalty rules, in-app updates, service price editing, and a resettable walkthrough. Production authentication, Supabase persistence, external notifications, and payment/accounting integrations remain pilot work. See README.md for the implemented scope and SUPABASE-HANDOFF.md for backend integration.

All business names, people, prices, rewards, metrics, and original pilot timelines below are fictional examples or planning assumptions unless explicitly sourced or confirmed above. No customer research has been completed. The repository was initially empty; the following plan describes the broader pilot target beyond the current demo.

## 1. Product direction

Build a branded customer app for local service businesses that helps customers book again, refer friends, earn rewards, and reach the business. Give each owner a private, simple dashboard to run those interactions. Aurex manages the platform and business onboarding.

Suggested positioning: **“Give your customers one easy place to book, earn rewards, and send their friends.”**

Sell the business outcome: more completed repeat and referred appointments, with less administrative follow-up. App downloads alone are not success.

Use one shared software platform with separate business workspaces. Each business gets its own logo, colors, services, customer records, reward rules, and branded link. Customers arriving through a business link see that business immediately. Reward balances and customer histories remain separate between businesses.

Launch with an installable web app (PWA) that also works directly from a browser link. Treat individual App Store listings as a later distribution decision. Apple applies specific rules to template-generated apps; separate listings should not be promised as a simple duplication exercise. [Apple guidelines, sections 4.2 and 4.3](https://developer.apple.com/app-store/review/guidelines/).

## 2. Who it is for

Initial customer hypothesis: independently owned service businesses with approximately 1–15 staff, one location or service territory, an existing customer base, and repeatable services. The owner or office manager is the buyer; reception/support staff and service providers use the dashboard.

| Business type | Fit | Scheduling considerations |
|---|---|---|
| Auto and mobile detailing | First demonstration and initial pilot focus | Service durations, vehicle details, travel buffers, weather |
| Residential cleaning | Strong next candidate | Addresses, crew capacity, recurring requests, quotes |
| Pet grooming | Strong later candidate | Pet profiles, provider capacity, intake requirements |
| Salons and barbers | Strong repeat/reward use case | Staff-specific appointments; existing scheduling adoption needs validation |
| Lawn care and pressure washing | Later expansion | Quotes, weather, routes, seasonal demand |
| Emergency trades and regulated care | Outside first release | Dispatch or specialist workflows exceed this pilot scope |

Avoid forcing every industry into one generic booking form. Share the platform foundation, then add a small number of tested industry templates.

Start in the North Mississippi area where the founder can personally recruit and support three owners. Tupelo/Lee County is the proposed demonstration setting; Oxford/Lafayette County and Southaven/DeSoto County are later recruitment options, depending on actual relationships.

Local product choices: configurable service ZIP codes, address instructions, travel buffers, Central Time with daylight-saving handling, weather rescheduling, phone booking entry, a visible call button, lightweight pages, and QR codes on receipts and business cards. These are workflow hypotheses to test with local owners, not claims that every North Mississippi customer behaves the same way.

Oxford's reported household broadband subscription rate is 90.7%, while Southaven's is 93.5% for 2020–2024. That supports offering digital access, but does not establish willingness to install a business app. Test real customer behavior. [Oxford Census QuickFacts](https://www.census.gov/quickfacts/geo/chart/oxfordcitymississippi/INT100223), [Southaven Census QuickFacts](https://www.census.gov/quickfacts/fact/table/southavencitymississippi/COM100224).

Existing products already offer service-business customer portals. Our proposed advantage is easy branded rewards and referrals plus hands-on local onboarding; validate that advantage against what owners already use. Do not claim unique functionality or require a business to enter every booking into two systems. [Jobber client hub](https://www.getjobber.com/features/client-hub/).

## 3. Fictional demonstration business

**Magnolia Mobile Detailing — fictional Tupelo business, with no affiliation to any similarly named company.** Use a clear demo label throughout.

Owner: Jordan Reed. Office/support: Casey Morgan. Two detailers operating as one crew. Service area: a configured set of Tupelo-area ZIP codes, with final address confirmation by the owner. Hours: Tuesday–Saturday, 8 a.m.–5 p.m. Central.

| Service | Demo price | Demo duration |
|---|---:|---:|
| Maintenance wash | $65 | 60 minutes |
| Interior refresh | $125 | 120 minutes |
| Full detail | $225 | 180 minutes |
| Oversized vehicle / specialty work | Quote required | Owner assigns after review |

Reserve a 30-minute travel/setup buffer between bookings. These times are demonstration settings, not route optimization. Do not offer appointments whose service plus buffer exceeds the crew's schedule.

Pilot booking mode: the customer requests an available time; the business confirms it after checking address, travel, and service details. Display **“Requested — awaiting confirmation”** until confirmation occurs. Hold capacity for pending requests; expire stale requests under a documented rule and notify the customer. Instant booking can follow once the availability workflow is reliable.

**Demonstration journey:** Taylor books an interior refresh, receives confirmation, messages the office about parking, completes the appointment, and earns one loyalty stamp. Taylor shares a personal referral link. Morgan opens it, sees a $15 first-service discount, books an eligible service, and pays after completion. Taylor receives $15 credit for a future booking. The owner sees the completed referred booking, its revenue, and reward cost.

Seed 20 synthetic customers, 30 bookings across several statuses, a small message history, and referrals that are pending, earned, redeemed, and reversed. Seed a second fictional business to demonstrate that its owner cannot access Magnolia's records. Demo mode uses simulated payments and intercepted notifications; resets are limited to demo data.

## 4. Customer app

Five navigation items: **Home, Book, Rewards, Messages, Account**. Home features the next appointment, available reward, and a large Book Again button.

| Capability | First-release behavior |
|---|---|
| Booking | Browse services/prices without signing in; choose service, address, time, and verify contact before submitting |
| Appointment management | See request/confirmation status; cancel or request a new time under clearly displayed business rules |
| Referral sharing | Personal link and code, native share action, visible eligibility and pending/earned states |
| Loyalty | Simple visit progress and available credits; toggle loyalty and referral programs independently |
| Support chat | Persistent text conversations with business staff, unread indicators, expected response hours |
| Notifications | Booking changes, reminders, new message alerts, earned rewards, and optional promotional announcements |
| Profile | Contact details, service address, vehicle details, notification choices, booking history, account support |

Keep initial signup short: name and a verified email using a login code or link. Collect a phone number when useful for the service, with separate messaging preferences. Add phone-code login if interviews show it is necessary and account for messaging cost and abuse limits.

No account is required to inspect services or a referral offer. Protect bookings, messages, and rewards behind authentication. Owner-assisted bookings let people who prefer calling participate; their record can later be linked through verified contact ownership.

Design acceptance targets: readable type, strong contrast, labeled large touch targets, screen-reader support, clear error messages, and no loss of entered data after ordinary validation errors. Essential writes require a live connection; never display a confirmed booking or redeemed reward while offline.

Push requires device support and user permission. On iOS/iPadOS 16.4+, web push is available for Home Screen web apps. Explain installation after the customer receives value; keep email and the in-app inbox available when push is unavailable or declined. Provider acceptance is not proof that the customer read a message. [WebKit documentation](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/).

## 5. Business owner and staff experience

Each owner receives a real login to their business workspace. On a phone, the opening screen answers: **What needs my attention today?**

Show today's schedule, booking requests to confirm, unread customer conversations, and reward exceptions. Primary actions: Confirm Booking, Add Booking, Message Customer, Mark Complete, and Record Payment. Keep detailed settings and reports out of this daily flow.

Navigation: **Today, Calendar, Customers, Inbox, Rewards**; place business settings and reports under More on smaller screens.

| Area | Owner controls |
|---|---|
| Calendar | Confirm requests, add phone bookings, assign crew, block time, reschedule, record cancellations/no-shows |
| Services | Names, descriptions, prices, durations, booking mode, buffers, eligible rewards |
| Customers | Search, appointment history, private staff notes, reward history, verified contact details |
| Inbox | Staff assignment, saved replies, response hours, unresolved conversations |
| Rewards | Turn referrals/loyalty on or off, select a simple preset, inspect earned/redeemed totals, adjust with a reason |
| Announcements | Draft message, choose opted-in audience, preview recipient count, send a test, then confirm send |
| Reporting | Completed bookings, verified or manually recorded revenue, referred customers, repeat bookings, outstanding credits |
| Team/settings | Invite/revoke staff, permissions, hours, service area, logo/colors, customer preview, data export |

Use progressive setup: business profile → three services → hours and service area → reward preset → invite staff → preview → test booking. Target 20 minutes with an Aurex-assisted setup; measure it before making it a marketing promise.

Roles:

- **Customer:** own records at the business.
- **Service staff:** assigned bookings and authorized conversations; no campaign or reward-policy administration.
- **Manager:** daily bookings, customers, and inbox; explicit permission for exports or reward adjustments.
- **Owner:** full control of their business, team, reward settings, and subscription.
- **Aurex administrator:** tenant setup and platform operations. Support access is restricted, explicit, and logged.

Never make demo role-switch buttons the production authentication model. Removing staff must revoke their access.

## 6. Reward rules that can survive real use

Use familiar dollars and stamps for the pilot. Each business can choose referrals only, loyalty only, both, or neither.

**Referral preset:** a new customer gets $15 off their first eligible service with a $100 pre-discount service subtotal; the referrer earns $15 future-service credit when that job is completed and payment is recorded. The future credit also requires a $100 eligible subtotal. One referrer per new customer per business; one welcome discount per customer. Capture a code at booking and snapshot its terms. Do not retroactively change earned entitlements when the owner edits a program.

**Loyalty preset:** one stamp per eligible completed and paid appointment with at least $50 collected for services, excluding taxes and tips. After five stamps, issue a $25 credit usable on a future service with a $100 eligible subtotal. Earning a stamp is separate from redeeming a discount. One reward discount per booking; no stacking. No cash redemption or transfers between businesses. No expiry during the pilot, so the owner must see outstanding balances.

Shared phone numbers or addresses trigger review when appropriate, not automatic rejection of legitimate households. Block obvious self-referrals, rate-limit attempts, and log overrides. Show referrers only limited reward status, not the friend's private booking, address, or payment details.

Use a transaction ledger for credits, reservations, redemptions, and reversals. Reserve credit when applying it to a booking; redeem once at settlement; release it on cancellation. Duplicate completion events and payment webhooks must not issue duplicate rewards.

Cancelled/unpaid jobs do not earn rewards. Full refunds reverse earned rewards and stamps; partial refunds trigger eligibility recalculation or owner review. If an affected credit was already spent, flag the account for review instead of silently charging a customer. Preserve a reasoned audit history.

Margin check: the referral example can cost $30 in incentives across two customers; a five-visit $25 loyalty reward averages $5 per qualifying visit if redeemed. Compare incentives with each service's actual contribution margin before launch. These are face-value arithmetic examples, not profitability forecasts.

## 7. Technical build approach

**Proposed stack:** Next.js and TypeScript for the customer PWA and responsive owner dashboard; Supabase for PostgreSQL, authentication, persistent chat/realtime updates, and private file storage when attachments are added. The choice is a maintainability recommendation, subject to the team's capabilities. [Next.js PWA guide](https://nextjs.org/docs/app/guides/progressive-web-apps).

Use managed web hosting, a transactional email provider, standards-based Web Push, and a durable background-job worker for reminders/retries. Pick providers and paid plans after the pilot budget is known. Start with manual payment recording for cash/card paid outside the app; label it as owner-recorded. Add hosted online checkout/deposits when a pilot owner needs it. Customer service payments and the business's Aurex subscription are separate billing flows.

Core records: businesses, memberships/roles, customers per business, services, staff/resources, availability, bookings, payment records, conversations/messages, reward programs and versions, referral claims, reward ledger entries, notification preferences/jobs, and audit events.

Every private record belongs to a business. Enforce both business membership and role permissions at the server/database boundary; checking a business ID in the interface is insufficient. Database policies can restrict rows by authenticated identity. Protect private storage and realtime channels too. [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security).

Critical implementation requirements:

- Atomically reserve resources and reject conflicting bookings, including simultaneous requests.
- Store timestamps consistently and render business-local Central Time; handle daylight-saving transitions.
- Apply booking and reward state changes on the server with retry-safe event handling.
- Persist chat messages before showing them as sent; provide retries and unread state.
- Restrict service credentials to the server; require stronger authentication for privileged accounts.
- Separate development/demo, staging, and production; keep synthetic demo data out of live analytics.
- Use database migrations, error monitoring, backups, a restore drill, and a documented support procedure.
- Record notification preferences per business/channel. Keep operational notices and marketing choices separate, with appropriate opt-out controls and frequency limits.
- Do not cache private account data in a shared offline cache. Support exports and account/data requests through documented flows.

For scheduling, choose one source of truth per pilot business. The first pilot should use our calendar if it has no essential existing scheduler. If an established owner must keep another system, validate its API, plan access, and synchronization behavior before committing to an integration. A plain booking link can bridge adoption but cannot prove completed/paid referral conversions on its own.

## 8. Delivery sequence and scope

Planning envelope: approximately **8–12 weeks for a constrained live pilot**, assuming one experienced full-stack builder, prompt founder decisions, and no complex integrations or native-store launch. Re-estimate after discovery. A polished fictional demo is an earlier milestone, not production readiness.

| Phase | Approximate duration | Reviewable result / exit condition |
|---|---|---|
| Discovery | Week 1 | Interview five owners and five customers; document current scheduling, referral rules, message handling, and willingness to pay |
| Demonstration | Weeks 2–3 | Magnolia customer and owner flows with synthetic data; users can complete book → confirm → message → reward journey |
| Working foundation | Weeks 4–6 | Real accounts, isolated businesses, service/availability setup, persistent bookings and inbox, owner daily screen |
| Rewards and notifications | Weeks 7–8 | Audited referral/loyalty ledger, opt-in push, email reminders, owner reports, safe announcement preview |
| Pilot hardening | Weeks 9–12 as needed | Device/accessibility checks, security and concurrency tests, restore drill, owner onboarding and live trial |

First release includes all four core promises: bookings, staff chat, referral/loyalty rewards, and notifications, plus owner management. Announcements start with simple audiences and templates.

Defer native apps, marketplace discovery, cross-business points, advanced recurring contracts, dispatch/route optimization, AI support, payroll, complex multi-location rules, deep accounting integrations, and full marketing automation. Add SMS and online payments only when the pilot needs them and their operating requirements are funded.

## 9. Proving it works

Test critical behavior before live use: a second owner cannot read another business's records; simultaneous bookings cannot exceed capacity; duplicate events cannot award twice; cancelled bookings release holds; refunds adjust rewards; ordinary staff cannot change rewards; denied push still leaves accessible confirmation; notification retries do not duplicate sends; customer data is absent after logout on a shared device.

Observe real people using ordinary iPhones, Android phones, and a desktop browser. Suggested usability gates: at least four of five customers finish a booking without help in under two minutes; at least four of five owners confirm a booking and answer a message without coaching. These are proposed acceptance targets.

Pilot with three businesses in one category and a manageable cohort of roughly 20–50 invited existing customers each. Run at least 60–90 days for business outcomes because rewards and repeat service take time. Capture a pre-pilot baseline where available.

Track: completed referred bookings; referral visitor-to-completed-booking conversion; repeat bookings within the chosen service cycle; reward dollars redeemed and outstanding; cancellations/no-shows; support response time; weekly owner use; and time spent per booking. Track reward costs and manually recorded versus verified payment values separately. Treat attributed revenue as attribution, not proof that all revenue was incremental.

Decision gate: retain the product if owners use it weekly, customers complete core tasks, critical correctness tests pass, and at least two of three pilot owners are willing to pay a price that covers service/support costs. Revise flows before adding industries if manual follow-up or double entry remains high.

## 10. Commercial and operating model

Recommend one simple monthly subscription per business/location, with optional paid setup/import assistance. Test willingness to pay around **$99–$199/month** during interviews; this is a pricing hypothesis, not a researched market rate or revenue forecast. Avoid unlimited SMS or custom development promises.

Budget separately for initial build labor, hosting/database/auth, email and messaging, monitoring/backups, support time, domains, and any payment-processing charges. Obtain current vendor quotes once message volumes, active users, retention requirements, and integrations are known. The business funds its own discounts and credits; Aurex must make those obligations visible.

Aurex should handle the first setups personally: configure three services, add hours, pick a reward preset, run a test booking, and provide a QR card and a short owner walkthrough. Offer a clear support contact and response expectation. The differentiator must include low effort after onboarding, not just a good initial demo.

## 11. What the founder needs to provide

Before choosing the first implementation scope:

1. The town/service area where you can recruit owners, plus introductions to three to five businesses.
2. Whether mobile detailing is a good first category or you already have stronger access to another industry.
3. Whether an installable web app meets the initial promise or App Store distribution is a launch requirement.
4. Available build budget, monthly operating budget, team capacity, and desired demo/pilot dates.
5. Any booking, payments, customer-list, or messaging systems those owners already rely on.

Before the live pilot: owner service lists, prices, actual durations/buffers, business hours, cancellation practices, reward margins/terms, staff roles, branding, and who answers chats. Agree who handles customer disputes, platform support, onboarding, and imports.

Before production setup: confirm ownership of hosting/domain/service accounts and provide access through secure invitations or secret management, not pasted credentials. Prepare business-facing subscription terms and customer-facing service, reward, and privacy terms appropriate to the real pilot workflows.

**Recommended next build milestone:** a complete Magnolia demonstration with both customer and owner views, synthetic bookings/messages/rewards, and a second business for isolation testing. Use it in owner interviews before committing to integrations or individual native apps.
