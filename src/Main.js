import React, { useRef, useState } from 'react';
import { useBlockstack } from 'react-blockstack';
import { signProfileToken, verifyProfileToken } from 'blockstack';
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
  const { userSession, userData } = useBlockstack();
  const textfield = useRef();
  const spinner = useRef();
  const [payment, setPayment] = useState();

  const paymentReceivedAction = () => {
    spinner.current.classList.remove('d-none');
    const payerID = textfield.current.value;
    const paymentDetails = {
      payer: payerID,
      amount: 5.0,
      unit: 'STX',
    };
    const token = signProfileToken(paymentDetails, userData.appPrivateKey);
    userSession
      .putFile(`payments/${payerID}`, token, { encrypt: false })
      .then(receiptUrl => {
        setPayment({ receiptUrl, paymentDetails });
        spinner.current.classList.add('d-none');
      });
  };

  return (
    <div className="PaymentReceivedField input-group ">
      <div className="input-group-prepend">
        <span className="input-group-text">Payer</span>
      </div>
      <input
        type="text"
        ref={textfield}
        className="form-control"
        defaultValue={''}
        placeholder="Blockstack ID"
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
      <div>
        {payment && (
          <>
            <a href={`${payment.receiptUrl}`}>{`${payment.receiptUrl}`}</a>
            <div>
              {payment.paymentDetails.amount} {payment.paymentDetails.unit}{' '}
              received from {payment.paymentDetails.payer}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MembershipPaymentField({ title, placeholder }) {
  const { userSession, userData } = useBlockstack();
  const textfield = useRef();
  const spinner = useRef();
  const [memberShip, setMemberShip] = useState();
  const [error, setError] = useState();
  const handlePaymentReceiptAction = () => {
    spinner.current.classList.remove('d-none');
    fetch(textfield.current.value)
      .then(response => response.text())
      .then(receiptContent => {
        const appPublicKey =
          '023055040a2662b9cbd62ef7062afc12e7283a32a6ab4a2b1ab2e8c9e33ce43ccb';
        var receipt;
        try {
          receipt = verifyProfileToken(receiptContent, appPublicKey);
        } catch (e) {
          setError(e);
          spinner.current.classList.add('d-none');
          return;
        }
        const memberID = receipt.payload.claim.payer;
        const amount = receipt.payload.claim.amount;
        const unit = receipt.payload.claim.unit;
        if (unit !== 'STX') {
          setError(new Error('invalid unit ' + unit));
          spinner.current.classList.add('d-none');
          return;
        }
        const iat = new Date(receipt.payload.iat);
        const exp = new Date(
          new Date().setTime(iat.getTime() + amount * 30 * 24 * 3600 * 1000)
        );
        const signedToken = signProfileToken(
          { member: true, group: 'Blockstack Legends' },
          userData.appPrivateKey,
          memberID,
          undefined,
          'ES256K',
          new Date(),
          exp
        );
        userSession
          .putFile(`membership/${memberID}`, signedToken, {
            encrypt: false,
          })
          .then(tokenUrl => {
            setMemberShip({ tokenUrl, exp });
            spinner.current.classList.add('d-none');
          });
      });
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
      <div>
        {memberShip && (
          <>
            <a href={`${memberShip.tokenUrl}`}>{`${memberShip.tokenUrl}`}</a>
            <div>Membership expires at {memberShip.exp.toString()}</div>
          </>
        )}
        {error && <div>{error.toString()}</div>}
      </div>
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
        <div className="mx-auto col col-sm-10 col-md-8 px-4">
          <PaymentReceivedField />
        </div>
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
