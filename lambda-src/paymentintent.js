require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const statusCode = 200;
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event, context) => {
  let body;
  if (event.isBase64Encoded) {
    body = new Buffer(event.body, 'base64').toString();
  } else {
    body = event.body;
  }
  try {
    body = JSON.parse(body);
  } catch (e) {
    console.log(e.toString());
    return {
      statusCode,
      headers,
      body: JSON.stringify({}),
    };
  }
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100,
    currency: 'eur',
    metadata: {
      username: body.username,
    },
  });

  return {
    statusCode,
    headers,
    body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
  };
};
