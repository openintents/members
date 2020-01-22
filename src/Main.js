import React, { useState, useEffect } from 'react';
import { useFile } from 'react-blockstack';
import { getPublicKeyFromPrivate, publicKeyToAddress } from 'blockstack';
import { Elements } from 'react-stripe-elements';
import InjectedStripeForm from './CheckoutForm';
import { MembershipCard, fetchCard } from './MembershipCard';
import { PaymentReceivedField, MembershipPaymentField } from './AdminPanel';

const avatarFallbackImage =
  'https://s3.amazonaws.com/onename/avatar-placeholder.png';
const appPublicKey =
  '023055040a2662b9cbd62ef7062afc12e7283a32a6ab4a2b1ab2e8c9e33ce43ccb';
export const FILE_MEMBERSHIPS = 'memberships.json';
export const FILE_MY_CLUB = 'clubpublickey.json';

function Profile({ person }) {
  return (
    <div className="Profile">
      <div className="avatar-section text-center">
        <img
          src={(person && person.avatarUrl()) || avatarFallbackImage}
          className="img-rounded avatar"
          id="avatar-image"
          alt="Avatar"
        />
      </div>
      <h2 className="text-center mt-2">
        Hello,{' '}
        <span id="heading-name">
          {(person && person.name()) || 'App Developer'}
        </span>
        !
      </h2>
    </div>
  );
}

export default function Main({ userData, person, userSession }) {
  const [myClub, setMyClub] = useFile(FILE_MY_CLUB);
  console.log({ myClub });
  const clubPublicKey = myClub || appPublicKey;
  const clubName = myClub ? person.name() + ' Club' : 'Blockstack Legends';
  const isBlockstackLegends = clubPublicKey === appPublicKey;

  const isAdmin =
    getPublicKeyFromPrivate(userData.appPrivateKey) === clubPublicKey;
  const [cards] = useFile(FILE_MEMBERSHIPS);
  const [card, setCard] = useState();

  useEffect(() => {
    if (cards) {
      console.log(cards);
      const allCards = JSON.parse(cards) || {};
      const clubCards = allCards[clubPublicKey] || [];
      if (clubPublicKey.length > 0) {
        fetchCard(clubCards[0], clubPublicKey)
          .then(currentCard => {
            if (currentCard) {
              setCard(currentCard);
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
    }
  }, [cards, clubPublicKey]);

  return (
    <main className="panel-welcome mt-5">
      <div className="row">
        <div className="mx-auto col-sm-10 col-md-8 px-4">
          <p className="text-center mt-2">Membership Page for</p>
          <h1 className="text-center mt-2">{clubName}</h1>
          <p className="text-center mt-2">
            ({publicKeyToAddress(clubPublicKey)})
          </p>
        </div>
      </div>
      <div className="row mt-5">
        <div className="mx-auto col-sm-10 col-md-8 px-4">
          <Profile person={person} />
        </div>
      </div>

      <div className="lead row mt-5">
        {isBlockstackLegends && (
          <div className="mx-auto col col-sm-10 col-md-8 px-4">
            <Elements>
              <InjectedStripeForm
                username={userData.username}
                groupName={clubName}
              />
            </Elements>
          </div>
        )}
        <div className="mx-auto col col-sm-10 col-md-8 px-4 mt-4 mb-4">
          <MembershipCard clubPublicKey={clubPublicKey} usersCard={card} />
        </div>
        {isAdmin && (
          <div className="mx-auto col col-sm-10 col-md-8 px-4">
            Your are an admin of {clubName}
            <div>
              <PaymentReceivedField
                userSession={userSession}
                userData={userData}
              />
              <MembershipPaymentField
                title="Payment receipt url"
                placeholder="https://gaia..."
                clubPublicKey={clubPublicKey}
                userSession={userSession}
                userData={userData}
                groupName={clubName}
              />
            </div>
          </div>
        )}
        {!isAdmin && (
          <div className="mx-auto col col-sm-10 col-md-8 px-4 mt-4 mb-4">
            You are not Admins of {clubName}
            <br />
            <button
              onClick={() => {
                setMyClub(getPublicKeyFromPrivate(userData.appPrivateKey));
              }}
            >
              Visit your own Club!
            </button>
          </div>
        )}
        {!isBlockstackLegends && (
          <div className="mx-auto col col-sm-10 col-md-8 px-4 mt-4 mb-4">
            <button
              onClick={() => {
                setMyClub(null);
              }}
            >
              Visit Blockstack Legends
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
