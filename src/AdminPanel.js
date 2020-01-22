import React, { useRef, useState } from 'react';
import { signProfileToken, verifyProfileToken, makeUUID4 } from 'blockstack';
import { createMembershipCard } from './utils';

export function PaymentReceivedField({ userSession, userData }) {
  const textfield = useRef();
  const spinner = useRef();
  const [payment, setPayment] = useState();

  const paymentReceivedAction = (amount, unit) => {
    spinner.current.classList.remove('d-none');
    const payerID = textfield.current.value;
    const paymentDetails = {
      payer: payerID,
      amount,
      unit,
    };
    const token = signProfileToken(paymentDetails, userData.appPrivateKey);
    userSession
      .putFile(`payments/${makeUUID4()}`, token, { encrypt: false })
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
          if (e.key === 'Enter') paymentReceivedAction(5, 'STX');
        }}
      />
      <div className="input-group-append">
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => paymentReceivedAction(5, 'STX')}
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

export function MembershipPaymentField({
  title,
  placeholder,
  clubPublicKey,
  userSession,
  userData,
  groupName,
}) {
  const textfield = useRef();
  const spinner = useRef();
  const [memberShip, setMemberShip] = useState();
  const [error, setError] = useState();
  const handlePaymentReceiptAction = () => {
    spinner.current.classList.remove('d-none');
    fetch(textfield.current.value)
      .then(response => response.text())
      .then(receiptContent => {
        var receipt;
        try {
          receipt = verifyProfileToken(receiptContent, clubPublicKey);
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
        createMembershipCard(
          memberID,
          groupName,
          new Date(receipt.payload.iat),
          amount,
          userData.appPrivateKey,
          signProfileToken
        ).then(({ signedToken, exp }) => {
          userSession
            .putFile(`membership/${makeUUID4()}`, signedToken, {
              encrypt: false,
            })
            .then(tokenUrl => {
              setMemberShip({ tokenUrl, exp });
              spinner.current.classList.add('d-none');
            });
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
