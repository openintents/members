import React, { useRef, useState, useEffect } from 'react';
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
  const [error, setError] = useState();
  const [membershipCardUrl, setMembershipCardUrl] = useState();

  const storeCard = membershipCardUrl => {
    var allCards;
    if (cards) {
      allCards = JSON.parse(cards);
    } else {
      allCards = {};
    }
    var clubCards = allCards[clubPublicKey] || [];
    clubCards = [membershipCardUrl];
    allCards[clubPublicKey] = clubCards;
    setCards(JSON.stringify(allCards));
  };

  useEffect(() => {
    setCard(usersCard);
  }, [usersCard]);

  useEffect(() => {
    if (cards) {
      const allCards = JSON.parse(cards) || {};
      var clubCards = allCards[clubPublicKey] || [];
      setMembershipCardUrl(clubCards);
    }
  }, [cards, clubPublicKey]);

  const addMembershipCard = () => {
    spinner.current.classList.remove('d-none');
    const membershipCardUrl = textfield.current.value;

    fetchCard(membershipCardUrl, clubPublicKey)
      .then(newCard => {
        if (newCard) {
          setCard(newCard);
          storeCard(membershipCardUrl);
          setError(undefined);
          spinner.current.classList.add('d-none');
        } else {
          setError('Invalid card');
          spinner.current.classList.add('d-none');
        }
      })
      .catch(e => {
        console.log(e);
        setError(e.toString());
        spinner.current.classList.add('d-none');
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
        {error && <>Error: {error}</>}
      </div>

      <div className="MembershipCard input-group ">
        <div className="input-group-prepend">
          <span className="input-group-text">Membership Card Url</span>
        </div>
        <input
          type="text"
          ref={textfield}
          className="form-control"
          defaultValue={membershipCardUrl || ''}
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
      <div>
        <small>
          You can use your membership card also at the demo app{' '}
          <a href="https://nervous-davinci-5f67db.netlify.com/">
            https://nervous-davinci-5f67db.netlify.com/
          </a>
          . It will give you access to "premium" features.
        </small>
      </div>
    </>
  );
};
