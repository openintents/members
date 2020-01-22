require('dotenv').config();

const blockstack = require('blockstack');
const utils = require('../src/utils');

const clubPrivateKey = process.env.BLOCKSTACK_LEGENDS_PRIVATE_KEY;

const statusCode = 200;
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event, context) => {
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const metadata = paymentIntent.metadata;
    const memberID = metadata.memberID;
    const amount = paymentIntent.amount / 100;
    const iat = new Date(paymentIntent.created);

    const { signedToken } = await utils.createMembershipCard(
      memberID,
      'Blockstack Legends',
      iat,
      amount,
      clubPrivateKey,
      blockstack.signProfileToken
    );
    const gaiaConfig = await blockstack.connectToGaiaHub(
      'https://hub.blockstack.org',
      clubPrivateKey
    );
    const membershipUrl = blockstack.uploadToGaiaHub(
      `membership/${memberID}`,
      signedToken,
      gaiaConfig,
      'application/json'
    );
    return {
      statusCode,
      headers,
      body: `{membershipUrl:"${membershipUrl}"}`,
    };
  } else {
    return {
      statusCode,
      headers,
      body: '',
    };
  }
};
