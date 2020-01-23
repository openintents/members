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
  try {
    const body = JSON.parse(event.body);

    const paymentIntent = body.object;
    const metadata = paymentIntent.metadata;
    const memberID = metadata.username;
    const amount = paymentIntent.amount / 100;
    const iat = new Date(paymentIntent.created * 1000);
    console.log(iat, paymentIntent.created);
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
    const membershipUrl = await blockstack.uploadToGaiaHub(
      `membership/${memberID}`,
      signedToken,
      gaiaConfig,
      'text/plain'
    );
    return {
      statusCode,
      headers,
      body: `{membershipUrl:"${membershipUrl}"}`,
    };
  } catch (e) {
    return {
      statusCode,
      headers,
      body: `${e.toString()}`,
    };
  }
};
