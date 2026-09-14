import test from 'node:test';
import assert from 'node:assert/strict';
import { addBooking, available, credits, dateAfter, initialState, nextWorkday, stamps, timesFor, updateBooking, type State } from '../src/lib/domain.ts';

function input(state: State, overrides = {}) {
  const date = nextWorkday(3);
  return { customerId: 'taylor', serviceId: 'interior', date, time: timesFor(state, date, 120)[0], address: '123 Demo Lane, Tupelo, MS 38801', vehicle: 'Toyota RAV4', notes: '', useCredit: false, ...overrides };
}
test('pending bookings reserve crew capacity including the travel buffer', () => {
  const state = initialState(); const day = nextWorkday(3);
  const next = addBooking(state, input(state, { date: day, time: '08:00' }));
  assert.equal(available(next, day, '10:00', 60), false);
  assert.equal(available(next, day, '10:30', 60), true);
  assert.throws(() => addBooking(next, input(next, { date: day, time: '08:30' })), /no longer available/);
});
test('service plus travel buffer must fit opening hours', () => {
  const s = initialState(), date = nextWorkday(3);
  assert.equal(available(s, date, '16:00', 60), false);
  assert.equal(available(s, date, '15:30', 60), true);
  assert.equal(available(s, date, '07:30', 60), false);
  assert.equal(available(s, dateAfter(-1), '08:00', 60), false);
});
test('reward credit is reserved at booking and released on cancellation', () => {
  const s = initialState(); const booked = addBooking(s, input(s, { useCredit: true })); const id = booked.bookings.at(-1)!.id;
  assert.deepEqual(credits(booked), { total: 1500, held: 1500, available: 0 });
  const cancelled = updateBooking(booked, id, 'cancel');
  assert.deepEqual(credits(cancelled), { total: 1500, held: 0, available: 1500 });
  assert.equal(available(cancelled, booked.bookings.at(-1)!.date, booked.bookings.at(-1)!.time, 120), true);
});
test('completed and paid visit consumes held credit and awards a single stamp', () => {
  const s = initialState(); const booked = addBooking(s, input(s, { useCredit: true })); const id = booked.bookings.at(-1)!.id;
  assert.throws(() => updateBooking(booked, id, 'complete'), /Confirm/);
  const complete = updateBooking(updateBooking(booked, id, 'confirm'), id, 'complete');
  assert.equal(credits(complete).available, 0); assert.equal(stamps(complete), 4);
  assert.deepEqual(updateBooking(complete, id, 'complete'), complete);
  assert.throws(() => updateBooking(complete, id, 'cancel'), /cannot be cancelled/);
});
test('a fifth qualifying visit issues exactly one $25 loyalty credit', () => {
  const s = initialState(); s.ledger.push({ id: 'fourth', customerId: 'taylor', bookingId: 'fourth', kind: 'stamp', amount: 1, label: 'Fourth visit', date: dateAfter(-1) });
  const complete = updateBooking(s, 'MAG-1042', 'complete');
  assert.equal(stamps(complete), 0); assert.equal(credits(complete).available, 4000);
  assert.equal(updateBooking(complete, 'MAG-1042', 'complete').ledger.length, complete.ledger.length);
});
test('a referred new customer earns the referrer credit only after completed payment', () => {
  const s = initialState(); const booked = addBooking(s, input(s, { customerId: 'morgan', referrerId: 'taylor', useCredit: true })); const id = booked.bookings.at(-1)!.id;
  assert.equal(booked.bookings.at(-1)!.welcome, 1500); assert.equal(booked.bookings.at(-1)!.credit, 0); assert.equal(credits(booked).available, 1500);
  const complete = updateBooking(updateBooking(booked, id, 'confirm'), id, 'complete');
  assert.equal(credits(complete).available, 3000); assert.equal(stamps(complete, 'morgan'), 1);
  assert.equal(credits(updateBooking(complete, id, 'complete')).available, 3000);
});
test('self referrals, returning-customer welcome offers, and ineligible services are rejected', () => {
  const s = initialState();
  assert.throws(() => addBooking(s, input(s, { referrerId: 'taylor' })), /not eligible/);
  assert.throws(() => addBooking(s, input(s, { referrerId: 'avery' })), /first-time/);
  assert.throws(() => addBooking(s, input(s, { customerId: 'morgan', serviceId: 'wash', referrerId: 'taylor' })), /\$100/);
});
test('price changes do not rewrite existing booking prices', () => {
  const s = initialState(); s.services.find(x => x.id === 'interior')!.price = 15000;
  const booked = addBooking(s, input(s));
  assert.equal(booked.bookings.find(b => b.id === 'MAG-1042')!.price, 12500);
  assert.equal(booked.bookings.at(-1)!.price, 15000);
});
test('out-of-area addresses cannot be booked', () => {
  const s = initialState(); assert.throws(() => addBooking(s, input(s, { address: '123 Example St, Oxford, MS 38655' })), /ZIP codes/);
});
