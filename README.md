# Members - A paid subscription that works across sites without centralized membership database

This is an web app showcasing paid subscriptions using Blockstack together with JWTs accepting credit cards via stripe or cash payments.

## Description

This web app is the membership site for `Blockstack Legends`. `Blockstack Legends` is a club of app users who pay a monthly subscription fee to access premium features of apps.

After logging in, users can make a payment via credit card (currently, test payments only; use one of Strip's [testing cards](https://stripe.com/docs/testing#cards) for testing) and will received the location of their membership card as a web url.

Alternatively, they can go to an administrator of `Blockstack Legends` and pay by cash. In this case the admin creates a payment receipt for the cash payment by entering their Blockstack username. Again this is a web url. The user can go to another admin and show the payment receipt. The admin enters the location of the payment reciept in the web app. If that payment receipt is valid then a membership card is created and the admin is will show the location of the membership card (web url) to the user.

Members of `Blockstack Legends` can enter the location of their membership card in the web app. If it is valid then the expiration time of the membership is shown.

Once the user has retrieved the membership card, the admin can savely delete their version. In the current version, this is not yet implemented

Users of the app can start also their own club immediately by clicking on `Visit your club`. They are the administrator of the club and can accept cash and issue membership cards.

Possible use cases that can be built on top of this project are for example

- Museeum passes for publicly funded museeums where a museum is in control whether the pass is accepted for a special exhibition.
- Youth hostel memberships where shops nearby a hostel are in control whether they give a special discount to members.

Note, that the site or site owner does not control or know which 3rd parties accept a certain type of membership cards. Furthermore, members of the club are in control to whom they reveal their membership of `Blockstack Legends` because only they can proof that they are the owner of their membership card.

**This is the first Blockstack app that allows Blockstack users to pay for a subscription and take full control of it.**

## Road Map

### Security & Privacy

In the proof of concept, membership cards are stored unencrypted and the location can be guessed by third-parties. This is to simplify demonstration of the data flow. In the next steps memberships card will be encrypted and the location will be randomized.

### Blockstack Legends

In the next phase for the club, real money will be accepted. The received funds will be re-distributed to app developers for proposed work. The work proposal will be presented to the members of Blockstack Legends and voted on using their membership cards.

### Club Platform

Currently, clubs are identified by an owner address. In the future, clubs can be identified by Blockstack usernames.

Club members should be able to pay with various payment providers. The Web Payment Request API will be used.

Members will receive a club membership number on their card without creating a centralized user database.

In the future, clubs can have more than one adminstrator.

## Use of Blockstack technology

### Blockstack Auth

The web app uses Blockstack Auth to authenticate users. The appPrivateKey of users is used to sign `JWT` tokens when issuing membership cards. Furthermore, the appPrivateKey is used to define their own club:

```
Not your keys, not your club!
```

### Gaia Storage

Membership cards are stored on the gaia storage of the admin of a club. Once, the member has retrieved the club card this data can be removed.

Payment receipts for cash payments are stored on the gaia storage of the admin of a club. These receipts can be used by admins to create membership cards.

### Signed JWT

Membership cards and payment receipts are signed JSON web tokens. The app private key of the user is used to sign the tokens. The methods `signProfileToken` and `verifyProfileToken` are used.

### BNS (in the future)

The Club is uniquely identified by the address derived from the private key. Admins of a club could assign a Blockstack username to the club and make the identifier human friendly.

### Atlas (in the future)

Club members could receive a club membership number on their card. As there is no centralized user database. The club would publish their last used number on the Atlas network and derive a new club membership number from the current value.

### Smart contracts (in the future)

Blockstack Legends could use a smart contract to handle worker proposals in the future. Clubs in general could use a smart contract to manage rules about who is administrator of a club.

## Demo video of the Proof of Concept

[Demo video without sound](https://youtu.be/QyD1WLWCD7E)

## Development

First run:

### `yarn install`

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

A development server for netlify functions is started concurrently.
