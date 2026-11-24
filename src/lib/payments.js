// Fase 2 — Stripe Connect.
// Punto de integración limpio: cuando se active, cada vendedor conecta su cuenta Stripe
// (Express account), y el checkout crea un PaymentIntent con application_fee_amount
// (comisión de Asmyne) y transfer_data.destination = seller.stripeAccountId.
// Variables previstas: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, PLATFORM_FEE_PERCENT.
const enabled = () => Boolean(process.env.STRIPE_SECRET_KEY) && process.env.PAYMENTS_ENABLED === 'true';

async function createCheckout(/* { listing, buyer, quantity } */) {
  if (!enabled()) return { ok: false, reason: 'payments_disabled' };
  throw new Error('Stripe Connect not implemented yet (phase 2)');
}

async function createSellerOnboardingLink(/* seller */) {
  if (!enabled()) return { ok: false, reason: 'payments_disabled' };
  throw new Error('Stripe Connect onboarding not implemented yet (phase 2)');
}

module.exports = { enabled, createCheckout, createSellerOnboardingLink };
