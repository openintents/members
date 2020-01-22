import React from 'react';
import { useBlockstack } from 'react-blockstack';
import { Blockstack } from 'react-blockstack/dist/context';
import Main from './Main.js';
import Landing from './Landing.js';
import { StripeProvider } from 'react-stripe-elements';

export default function App(props) {
  const { userData, person, signIn, userSession } = useBlockstack();
  console.log(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  return (
    <Blockstack>
      {signIn && <Landing />}

      {userData && (
        <StripeProvider apiKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}>
          <Main userData={userData} person={person} userSession={userSession} />
        </StripeProvider>
      )}
    </Blockstack>
  );
}
