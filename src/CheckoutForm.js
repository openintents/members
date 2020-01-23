import React from 'react';
import { injectStripe, CardElement } from 'react-stripe-elements';

function PaymentRequestField() {
  return (
    <div>
      Pay Membership fees (1€/month)
      <div className="m-1">
        <CardElement />
      </div>
    </div>
  );
}

class CheckoutForm extends React.Component {
  state = {};
  componentDidMount() {
    console.log({ env: process.env });
    fetch(process.env.REACT_APP_LAMBDA_ENDPOINT, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ username: this.props.username }),
    })
      .then(r => r.json())
      .then(response => {
        console.log(response);
        this.setState({ clientSecret: response.clientSecret });
      });
  }

  showError = (result, clientSecret) => {
    this.setState({ error: result.error });
    this.props.stripe.retrievePaymentIntent(clientSecret).then(result => {
      var paymentIntent = result.paymentIntent;
      this.setState({ error: result.error, paymentIntent });
    });
  };

  orderComplete = clientSecret => {
    this.props.stripe.retrievePaymentIntent(clientSecret).then(result => {
      var paymentIntent = result.paymentIntent;
      this.setState({ error: undefined, paymentIntent });
    });
  };

  handleSubmit = ev => {
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault();

    const clientSecret = this.state.clientSecret;
    this.props.stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.props.elements.getElement('card'),
          billing_details: {
            name: this.props.groupName,
          },
        },
      })
      .then(result => {
        console.log(result);
        if (result.error) {
          // Show error to your customer
          this.showError(result, clientSecret);
        } else {
          // The payment has been processed!
          this.orderComplete(clientSecret);
        }
      });
  };

  render() {
    const { error, clientSecret, paymentIntent } = this.state;
    const { username } = this.props;
    const membershipCardUrl = `https://gaia.blockstack.org/hub/14WtxuuA2nRJNiXuknwz4QmKJUZHvTNG8z/membership/${username}`;
    return (
      <>
        {!clientSecret && (
          <>Stripe not yet initialized... maybe refresh the page</>
        )}
        {(!paymentIntent || paymentIntent.status !== 'succeeded') && (
          <form onSubmit={this.handleSubmit} className="text-center mt-3 mb-3">
            <PaymentRequestField />
            <button
              disabled={!clientSecret}
              className="btn btn-outline-secondary"
            >
              Buy membership
            </button>
          </form>
        )}
        {paymentIntent && paymentIntent.status === 'succeeded' && (
          <>
            Your membership card is stored at{' '}
            <a href={membershipCardUrl}>{membershipCardUrl}</a>
          </>
        )}
        {error && <div>{error.message}</div>}
      </>
    );
  }
}

export default injectStripe(CheckoutForm);
