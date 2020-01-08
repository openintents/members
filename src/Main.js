import React, { useRef, useState } from 'react';
import { useBlockstack } from 'react-blockstack';
import { verifyReceipt } from './PaymentVerification';
import { signProfileToken, decodeToken } from 'blockstack';
const avatarFallbackImage =
  'https://s3.amazonaws.com/onename/avatar-placeholder.png';

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
      <h1 className="text-center mt-2">
        Hello,{' '}
        <span id="heading-name">
          {(person && person.name()) || 'App Developer'}
        </span>
        !
      </h1>
    </div>
  );
}
function PaymentReceivedField() {
  const textfield = useRef();
  const spinner = useRef();
  const { userSession, userData } = useBlockstack();
  const [paymentReceiptUrl, setPaymentReceiptUrl] = useState('');

  const paymentReceivedAction = () => {
    const memberID = textfield.current.value;
    const token = signProfileToken(
      {
        memberID,
        amount: 5.0,
        unit: 'STX',
      },
      userData.appPrivateKey
    );
    userSession
      .putFile(`payments/${memberID}`, token, { encrypt: false })
      .then(url => setPaymentReceiptUrl(url));
  };

  return (
    <div className="PaymentReceivedField input-group ">
      <div className="input-group-prepend">
        <span className="input-group-text">Payment received</span>
      </div>
      <input
        type="text"
        ref={textfield}
        className="form-control"
        defaultValue={''}
        placeholder="Member ID"
        onKeyUp={e => {
          if (e.key === 'Enter') paymentReceivedAction();
        }}
      />
      <div className="input-group-append">
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={paymentReceivedAction}
        >
          <div
            ref={spinner}
            role="status"
            className="d-none spinner-border spinner-border-sm text-info align-text-top mr-2"
          />
          Payment Received (in cash)
        </button>
      </div>
      <div>{`${paymentReceiptUrl}`}</div>
    </div>
  );
}

function MembershipPaymentField({ title, placeholder }) {
  const [memberShipTokenUrl, setMemberShipTokenUrl] = useState('');
  const textfield = useRef();
  const spinner = useRef();
  const { userSession, userData } = useBlockstack();
  const handlePaymentReceiptAction = () => {
    spinner.current.classList.remove('d-none');
    fetch(textfield.current.value)
      .then(response => response.text())
      .then(receiptContent => {
        const receipt = decodeToken(receiptContent);
        verifyReceipt(receipt);
        const memberID = receipt.payload.claim.memberID;
        const amount = receipt.payload.claim.amount;
        const unit = receipt.payload.claim.unit;
        if (unit !== 'STX') throw new Error('invalid unit ' + unit);
        const issuedAt = new Date(receipt.payload.iat);
        const expiresAt = new Date(
          new Date().setTime(
            issuedAt.getTime() + amount * 30 * 24 * 3600 * 1000
          )
        );
        console.log({ expiresAt });
        const signedToken = signProfileToken(
          { member: true, group: 'Blockstack Legends' },
          userData.appPrivateKey,
          memberID,
          undefined,
          'ES256K',
          new Date(),
          expiresAt
        );
        userSession
          .putFile(`membership/${memberID}`, signedToken, {
            publicKey: memberID,
          })
          .then(url => {
            setMemberShipTokenUrl(url);
            spinner.current.classList.add('d-none');
          });
      });
    setTimeout(() => spinner.current.classList.add('d-none'), 1500);
  };
  return (
    <div className="MembershipPaymentField input-group ">
      <div className="input-group-prepend">
        <span className="input-group-text">{title}</span>
      </div>
      <input
        type="text"
        ref={textfield}
        className="form-control"
        defaultValue={''}
        placeholder={placeholder}
        onKeyUp={e => {
          if (e.key === 'Enter') handlePaymentReceiptAction();
        }}
      />
      <div className="input-group-append">
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={handlePaymentReceiptAction}
        >
          <div
            ref={spinner}
            role="status"
            className="d-none spinner-border spinner-border-sm text-info align-text-top mr-2"
          />
          Handle Payment Receipt
        </button>
      </div>
      <div>{`${memberShipTokenUrl}`}</div>
    </div>
  );
}

export default function Main({ person }) {
  return (
    <main className="panel-welcome mt-5">
      <div className="row">
        <div className="mx-auto col-sm-10 col-md-8 px-4">
          <Profile person={person} />
        </div>
      </div>
      <div className="lead row mt-5">
        <div className="mx-auto col col-sm-10 col-md-8 px-4">1.</div>
        <div className="mx-auto col col-sm-10 col-md-8 px-4">
          <PaymentReceivedField />
        </div>
        <div className="mx-auto col col-sm-10 col-md-8 px-4">2.</div>
        <div className="mx-auto col col-sm-10 col-md-8 px-4">
          <MembershipPaymentField
            title="Payment receipt url"
            placeholder="https://gaia..."
          />
        </div>
      </div>
    </main>
  );
}
