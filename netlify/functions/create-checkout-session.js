const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Build the base URL from the incoming request headers
  const origin = event.headers.origin || `https://${event.headers.host}`;

  // Read customer details passed from the appointment form
  const { name = 'Valued Customer', email, service = 'Auto Repair Service' } =
    JSON.parse(event.body || '{}');

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Auto Repair Service Deposit',
              description: `Deposit for: ${service}`,
            },
            unit_amount: 10000, // $100.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Store form data in metadata so the webhook can use it
      metadata: { customer_name: name, customer_email: email || '', service },
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/appointment.html`,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Stripe error:', error.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
