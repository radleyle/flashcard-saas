
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const formatAmountForStripe = (amount) => {
  return Math.round(amount * 100); // Convert dollars to cents
};

export async function POST(req) {
  try {
    const { planType } = await req.json();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/result?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/result?session_id={CHECKOUT_SESSION_ID}`;

    const planPrices = {
      basic: 5,
      pro: 10,
    };

    const priceInDollars = planPrices[planType];
    if (!priceInDollars) {
      throw new Error('Invalid plan type');
    }

    const unitAmount = formatAmountForStripe(priceInDollars);

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Subscription`,
            },
            unit_amount: unitAmount,
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ id: checkoutSession.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
