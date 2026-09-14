# Supabase integration handoff

Selected project: `okikocimzeqnvtaxfnpd`. The working demo currently stores synthetic data in local storage. No remote changes have been applied.

## Confirmed founder decisions — September 14, 2026

- First example: fictional Magnolia Mobile Detailing in Tupelo.
- Installable web app is acceptable.
- Demo needed by September 15, 2026.
- Supabase is the intended backend.
- Prospective owners may use Square, QuickBooks, or other products.
- Aurex will handle setup and ongoing support.

## Integration order

1. Inspect the selected project's current schema and settings through the connected Supabase tools once they are available. Do not overwrite an existing application's tables or authentication configuration.
2. Add an isolated Magnolia schema through versioned migrations: businesses, business memberships, customers scoped to businesses, services, availability/resources, bookings, messages, reward-program versions, reward ledger, referral claims, notifications, and audit events.
3. Enable row-level security and least-privilege grants. Access must check both business membership and role. Customer queries must additionally check ownership. Keep service-role credentials server-side.
4. Add genuine customer and owner sign-in. Create sample owners through the normal invitation flow. The demo role links must not become a production authorization mechanism.
5. Replace local mutation boundaries with authenticated server operations. Bookings and reward updates require database transactions, conflict constraints, and stable idempotency keys. Bind business/customer identity to the verified session, not client-supplied role flags.
6. Store messages durably; authorize both message rows and subscriptions. Attach files only after private storage access rules exist.
7. Introduce a durable reminder queue with per-business channel preferences and delivery attempts. Request browser notification consent only after explaining its purpose; save push subscriptions securely. Keep in-app updates independent from push success.
8. Choose one scheduling source of truth per real pilot business. Validate each provider's permissions, API plan, webhook signatures, retry semantics, and data ownership before implementing synchronization.
9. Keep service payments distinct from Aurex subscription billing. Square payment status and QuickBooks accounting synchronization should use separate provider adapters. Reward eligibility needs verified completion and settlement, or a clearly audited authorized manual record.
10. Gate the live pilot on owner/customer authorization tests, cross-business isolation tests, concurrent booking/reward tests, refund/reversal behavior, device checks, backups, and a restoration drill.

## Reusable code

`src/lib/domain.ts` contains typed demonstration entities and pure booking/reward transitions. Its tests define expected eligibility, reservation, cancellation, and repeat-safe completion behavior. Reuse the rules as specifications, but enforce authoritative production changes server-side.

`src/components/magnolia-app.tsx` currently centralizes reads/writes through the `run` boundary. Split it into a real repository/query layer and individual UI modules when adding backend loading, authorization, optimistic updates, and network retry behavior.

Do not expose the entire local State object as a publicly writable JSON record in Supabase. That would bypass the business and role boundaries this application needs.
