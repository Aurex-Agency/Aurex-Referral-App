export type Mode = 'customer' | 'owner';
export type Status = 'requested' | 'confirmed' | 'completed' | 'cancelled';
export type Service = { id: string; name: string; subtitle: string; price: number; minutes: number; features: string[]; tag?: string };
export type Customer = { id: string; name: string; email: string; phone: string; vehicle: string; address: string };
export type Booking = { id: string; customerId: string; serviceId: string; serviceName: string; price: number; minutes: number; date: string; time: string; status: Status; address: string; vehicle: string; notes: string; credit: number; welcome: number; referrerId?: string; payment?: string };
export type Entry = { id: string; customerId: string; bookingId: string; kind: 'credit' | 'stamp'; amount: number; label: string; date: string };
export type Message = { id: string; customerId: string; from: Mode; text: string; time: string; read: boolean };
export type Notice = { id: string; title: string; body: string; read: boolean; date: string };
export type State = { version: 1; customers: Customer[]; services: Service[]; bookings: Booking[]; ledger: Entry[]; messages: Message[]; notices: Notice[]; preferences: { reminders: boolean; rewards: boolean; offers: boolean }; settings: { name: string; hours: string; referralEnabled: boolean; loyaltyEnabled: boolean }; announcements: { id: string; text: string; date: string }[] };
export const CURRENT_CUSTOMER = 'taylor';
export const money = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
export const uid = () => crypto.randomUUID();
export function dateAfter(days: number) { const d = new Date(); d.setDate(d.getDate() + days); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
export function nextWorkday(offset = 1) { let i = offset; while ([0, 1].includes(new Date(`${dateAfter(i)}T12:00:00`).getDay())) i++; return dateAfter(i); }
export function prettyDate(date: string, short = false) { return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', short ? { month: 'short', day: 'numeric' } : { weekday: 'short', month: 'short', day: 'numeric' }); }
export function prettyTime(time: string) { const [h, m] = time.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; }
export const services: Service[] = [
  { id: 'wash', name: 'Maintenance wash', subtitle: 'A fresh start for your everyday drive.', price: 6500, minutes: 60, features: ['Hand wash & dry', 'Wheels & tires', 'Exterior glass'] },
  { id: 'interior', name: 'Interior refresh', subtitle: 'Make the inside feel like new again.', price: 12500, minutes: 120, features: ['Deep vacuum', 'Surfaces & upholstery', 'Interior glass'], tag: 'A customer favorite' },
  { id: 'full', name: 'The full detail', subtitle: 'A little extra love. Inside and out.', price: 22500, minutes: 180, features: ['Complete interior refresh', 'Hand wash & paint protection', 'Wheels, tires & finishing touches'], tag: 'The complete treatment' },
];
export function initialState(): State {
  const date = nextWorkday();
  return {
    version: 1,
    customers: [
      { id: 'taylor', name: 'Taylor Brooks', email: 'taylor@example.com', phone: '', vehicle: '2022 Toyota RAV4 · Pearl white', address: '123 Demo Lane, Tupelo, MS 38801' },
      { id: 'avery', name: 'Avery Ellis', email: 'avery@example.com', phone: '', vehicle: '2023 Ford F-150 · Silver', address: '456 Sample Drive, Tupelo, MS 38801' },
      { id: 'morgan', name: 'Morgan Hayes', email: 'morgan@example.com', phone: '', vehicle: '2021 Honda CR-V · Black', address: '789 Example Court, Tupelo, MS 38804' },
    ],
    services: structuredClone(services),
    bookings: [
      { id: 'MAG-1042', customerId: 'taylor', serviceId: 'interior', serviceName: 'Interior refresh', price: 12500, minutes: 120, date, time: '09:00', status: 'confirmed', address: '123 Demo Lane, Tupelo, MS 38801', vehicle: '2022 Toyota RAV4 · Pearl white', notes: 'Please park in the driveway.', credit: 0, welcome: 0 },
      { id: 'MAG-1043', customerId: 'avery', serviceId: 'full', serviceName: 'The full detail', price: 22500, minutes: 180, date, time: '12:30', status: 'requested', address: '456 Sample Drive, Tupelo, MS 38801', vehicle: '2023 Ford F-150 · Silver', notes: 'A little extra attention to the truck bed, please.', credit: 0, welcome: 0 },
      { id: 'MAG-1021', customerId: 'taylor', serviceId: 'wash', serviceName: 'Maintenance wash', price: 6500, minutes: 60, date: dateAfter(-21), time: '10:00', status: 'completed', address: '123 Demo Lane, Tupelo, MS 38801', vehicle: '2022 Toyota RAV4 · Pearl white', notes: '', credit: 0, welcome: 0, payment: 'Demo · Square (recorded)' },
    ],
    ledger: [
      { id: 'seed-credit', customerId: 'taylor', bookingId: 'seed-referral', kind: 'credit', amount: 1500, label: 'Referral thank-you · Jamie', date: dateAfter(-4) },
      ...[35, 28, 21].map((days, i) => ({ id: `seed-stamp-${i}`, customerId: 'taylor', bookingId: `seed-visit-${i}`, kind: 'stamp' as const, amount: 1, label: 'Completed detail', date: dateAfter(-days) })),
    ],
    messages: [
      { id: 'msg-1', customerId: 'taylor', from: 'owner', text: 'Hey Taylor! You’re all set for your next refresh. We’ll bring everything we need — just leave us a little room in the driveway.', time: new Date().toISOString(), read: false },
      { id: 'msg-2', customerId: 'avery', from: 'customer', text: 'Hi! Is it okay if the truck is parked under the carport?', time: new Date().toISOString(), read: false },
    ],
    notices: [{ id: 'notice-1', title: 'Your next detail is confirmed', body: `${prettyDate(date)} at 9:00 AM. We’ll meet you in your driveway.`, read: false, date: new Date().toISOString() }],
    preferences: { reminders: true, rewards: true, offers: false },
    settings: { name: 'Magnolia Mobile Detailing', hours: 'Tuesday–Saturday, 8 AM–5 PM', referralEnabled: true, loyaltyEnabled: true },
    announcements: [],
  };
}
export function credits(state: State, customerId = CURRENT_CUSTOMER) {
  const total = state.ledger.filter(e => e.customerId === customerId && e.kind === 'credit').reduce((sum, e) => sum + e.amount, 0);
  const held = state.bookings.filter(b => b.customerId === customerId && ['requested', 'confirmed'].includes(b.status)).reduce((sum, b) => sum + b.credit, 0);
  return { total, held, available: Math.max(0, total - held) };
}
export function stamps(state: State, customerId = CURRENT_CUSTOMER) { return state.ledger.filter(e => e.customerId === customerId && e.kind === 'stamp').reduce((sum, e) => sum + e.amount, 0) % 5; }
const minute = (time: string) => { const [h, m] = time.split(':').map(Number); return h * 60 + m; };
export function available(state: State, date: string, time: string, duration: number, ignoreId?: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return false;
  const day = new Date(`${date}T12:00:00`).getDay();
  if (date < dateAfter(0) || [0, 1].includes(day) || Number.isNaN(day)) return false;
  const start = minute(time), end = start + duration + 30;
  if (!Number.isFinite(start) || start < 480 || end > 1020) return false;
  return !state.bookings.some(b => b.id !== ignoreId && b.date === date && b.status !== 'cancelled' && start < minute(b.time) + b.minutes + 30 && end > minute(b.time));
}
export function timesFor(state: State, date: string, duration: number) { return Array.from({ length: 18 }, (_, i) => `${String(8 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`).filter(time => available(state, date, time, duration)); }
export function addBooking(state: State, input: { customerId: string; serviceId: string; date: string; time: string; address: string; vehicle: string; notes: string; useCredit: boolean; referrerId?: string }): State {
  const service = state.services.find(s => s.id === input.serviceId);
  if (!service || !state.customers.some(c => c.id === input.customerId)) throw new Error('Please select a valid customer and service.');
  if (!input.address.trim() || !input.vehicle.trim()) throw new Error('Add your service address and vehicle.');
  if (!/\b3880[14]\b/.test(input.address)) throw new Error('This demo serves Tupelo ZIP codes 38801 and 38804.');
  if (!available(state, input.date, input.time, service.minutes)) throw new Error('That time is no longer available. Please choose another.');
  if (input.referrerId && (!state.settings.referralEnabled || input.referrerId === input.customerId || !state.customers.some(c => c.id === input.referrerId))) throw new Error('This referral is not eligible.');
  if (input.referrerId && state.bookings.some(b => b.customerId === input.customerId && b.status !== 'cancelled')) throw new Error('The welcome offer is for first-time customers only.');
  const welcome = input.referrerId && service.price >= 10000 ? 1500 : 0;
  if (input.referrerId && !welcome) throw new Error('The referral welcome offer requires a service of $100 or more.');
  const credit = input.useCredit && !welcome && service.price >= 10000 ? Math.min(credits(state, input.customerId).available, 2500, service.price) : 0;
  const booking: Booking = { id: `MAG-${uid().slice(0, 6).toUpperCase()}`, customerId: input.customerId, serviceId: service.id, serviceName: service.name, price: service.price, minutes: service.minutes, date: input.date, time: input.time, address: input.address.trim(), vehicle: input.vehicle.trim(), notes: input.notes.trim(), status: 'requested', credit, welcome, referrerId: input.referrerId };
  return { ...state, bookings: [...state.bookings, booking] };
}
export function updateBooking(state: State, id: string, action: 'confirm' | 'cancel' | 'complete', payment = 'Demo · Cash (recorded)'): State {
  const booking = state.bookings.find(b => b.id === id);
  if (!booking) throw new Error('Appointment not found.');
  if (action === 'complete' && booking.status === 'completed') return state;
  if (action === 'confirm' && booking.status !== 'requested') throw new Error('Only a requested booking can be confirmed.');
  if (action === 'complete' && booking.status !== 'confirmed') throw new Error('Confirm this appointment before completing it.');
  if (action === 'cancel' && !['requested', 'confirmed'].includes(booking.status)) throw new Error('This appointment cannot be cancelled.');
  const status: Status = action === 'confirm' ? 'confirmed' : action === 'cancel' ? 'cancelled' : 'completed';
  const next = structuredClone(state);
  next.bookings = next.bookings.map(b => b.id === id ? { ...b, status, ...(action === 'complete' ? { payment } : {}) } : b);
  if (action === 'complete') {
    const entry = (customerId: string, kind: Entry['kind'], amount: number, label: string) => next.ledger.push({ id: uid(), customerId, bookingId: id, kind, amount, label, date: dateAfter(0) });
    if (booking.credit) entry(booking.customerId, 'credit', -booking.credit, `Used on ${booking.serviceName.toLowerCase()}`);
    if (state.settings.loyaltyEnabled && booking.price - booking.credit - booking.welcome >= 5000) {
      const before = stamps(next, booking.customerId);
      entry(booking.customerId, 'stamp', 1, booking.serviceName);
      if (before === 4) entry(booking.customerId, 'credit', 2500, 'Five visits · loyalty thank-you');
    }
    if (booking.referrerId && booking.welcome) {
      entry(booking.referrerId, 'credit', 1500, `Referral thank-you · ${state.customers.find(c => c.id === booking.customerId)?.name.split(' ')[0]}`);
      if (booking.referrerId === CURRENT_CUSTOMER) next.notices.unshift({ id: uid(), title: 'A friend came by. You earned $15!', body: 'Your referral credit is ready for your next eligible detail.', read: false, date: new Date().toISOString() });
    }
  }
  if (booking.customerId === CURRENT_CUSTOMER) next.notices.unshift({ id: uid(), title: `Appointment ${status}`, body: `${booking.serviceName} · ${prettyDate(booking.date)} at ${prettyTime(booking.time)}${action === 'complete' ? '. Thank you for choosing Magnolia!' : '.'}`, read: false, date: new Date().toISOString() });
  return next;
}
