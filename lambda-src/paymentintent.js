require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const statusCode = 200;
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event, context) => {
  //-- We only care to do anything if this is our POST request.
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100,
    currency: 'eur',
    metadata: {
      username: event.username,
    },
  });

  return {
    statusCode,
    headers,
    body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
  };
};
