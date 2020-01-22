import React, { useRef, useState } from 'react';
import { useFile } from 'react-blockstack';
import { verifyProfileToken } from 'blockstack';
import { FILE_MEMBERSHIPS } from './Main';

export function fetchCard(url, clubPublicKey) {
  if (!url) {
    return Promise.reject('no url');
  }
  return fetch(url)
    .then(response => response.text())
    .then(cardContent => {
      if (cardContent) {
        var newCard;
        try {
          newCard = verifyProfileToken(cardContent, clubPublicKey);
        } catch (e) {
          console.log(e);
          return Promise.reject(e);
        }
        return newCard;
      } else {
        return Promise.reject('no card');
      }
    });
}

export const MembershipCard = ({ clubPublicKey, usersCard }) => {
  const [cards, setCards] = useFile(FILE_MEMBERSHIPS);
  const textfield = useRef();
  const spinner = useRef();
  const [card, setCard] = useState();

  const storeCard = membershipCardUrl => {
    const allCards = JSON.parse(cards) || {};
    var clubCards = allCards[clubPublicKey] || [];
    clubCards = [membershipCardUrl];
    allCards[clubPublicKey] = clubCards;
    setCards(JSON.stringify(allCards));
  };

  const addMembershipCard = () => {
    spinner.current.classList.remove('d-none');
    const membershipCardUrl = textfield.current.value;

    fetchCard(membershipCardUrl, clubPublicKey)
      .then(newCard => {
        if (newCard) {
          setCard(newCard);
          storeCard(membershipCardUrl);
          spinner.current.classList.add('d-none');
        } else {
          spinner.current.classList.add('d-none');
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <>
      <div>
        {card && (
          <>
            Membership for {card.payload.subject.username} expires at{' '}
            {card.payload.exp}
          </>
        )}
        {!card && <>Enter the location of your membership card</>}
      </div>

      <div className="MembershipCard input-group ">
        <div className="input-group-prepend">
          <span className="input-group-text">Membership Card Url</span>
        </div>
        <input
          type="text"
          ref={textfield}
          className="form-control"
          defaultValue={''}
          placeholder="https://"
          onKeyUp={e => {
            if (e.key === 'Enter') addMembershipCard();
          }}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => addMembershipCard()}
          >
            <div
              ref={spinner}
              role="status"
              className="d-none spinner-border spinner-border-sm text-info align-text-top mr-2"
            />
            Add card
          </button>
        </div>
      </div>
    </>
  );
};
