
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Function to format amount for Stripe (cents)
const formatAmountForStripe = (amount) => {
  return Math.round(amount * 100); // Convert dollars to cents
};

// POST endpoint to create a Checkout Session
export async function POST(req) {
  try {
    // Define the base URL for redirect URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Construct URLs for success and cancel pages
    const successUrl = `${baseUrl}/result?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/result?session_id={CHECKOUT_SESSION_ID}`;

    // Create a Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription', // Change to 'subscription' for subscription checkout
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Pro Subscription',
            },
            unit_amount: formatAmountForStripe(10), // Price per unit (in cents)
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1, // Quantity of the product
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // Return the session ID for client-side redirection
    return NextResponse.json({ id: checkoutSession.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}

// GET endpoint to retrieve a Checkout Session
export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');

  try {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    // Retrieve the Checkout Session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json(checkoutSession);
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
