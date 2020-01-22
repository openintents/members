import React, { Component } from 'react';
import BlockstackContext from 'react-blockstack/dist/context';
import { BlockstackButton } from 'react-blockstack-button';

export default class Landing extends Component {
  static contextType = BlockstackContext;
  render() {
    const { signIn } = this.context;
    return (
      <div className="Landing">
        <div className="jumbotron jumbotron-fluid pt-3 mb-0">
          <div className="container">
            <div className="panel-landing text-center mt-3">
              <h1 className="landing-heading">
                Blockstack Legends <small>and</small> Members
              </h1>
              <p className="lead">
                A paid subscription that works across sites without centralized
                membership database
              </p>

              <p className="alert alert-info  border-info">
                This is an{' '}
                <a
                  href="https://github.com/friedger/members"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  open source
                </a>{' '}
                project providing a proof of concept with the purpose of showing
                how to implement
                <strong>
                  paid subscriptions using{' '}
                  <a
                    href="https://blockstack.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Blockstack
                  </a>
                </strong>{' '}
                together with JWTs accepting credit cards via stripe or cash
                payments.
              </p>

              <div className="card mt-4 border-info">
                <div className="card-header">
                  <h5 className="card-title">Members (the software)</h5>
                </div>
                <div className="row">
                  <div className="col col-md-6 p-4 text-right border-right">
                    The software does not control or know which 3rd parties
                    accept a certain type of membership cards.
                    <br />
                    <br />
                    Members of the club are in control to whom they reveal their
                    membership of a certain club.
                  </div>
                  <div className="col col-md-6 p-4 text-left border-left">
                    Possible use cases are
                    <ul>
                      <li>
                        Museeum passes for publicly funded museeums where a
                        museum is in control whether the pass is accepted for a
                        special exhibition.
                      </li>
                      <li>
                        Youth hostel memberships where shops nearby a hostel are
                        in control whether they give a special discount to
                        members.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="card mt-4 border-info">
                <div className="card-header">
                  <h5 className="card-title">Blockstack Legends</h5>
                </div>
                <div className="card-body">
                  <p className="card-text mb-3 mt-4 mx-5 px-5">
                    Blockstack Legends is a club of app users who pay a monthly
                    subscription fee to access premium features of apps.
                  </p>
                  <p className="card-text mb-3 mt-4 mx-5 px-5">
                    The received funds are distributed to app developers for
                    proposed work. The work proposal are presented to the
                    members of Blockstack Legends and voted on by them.
                  </p>
                </div>

                <p className="card-link mb-5">
                  <BlockstackButton onClick={signIn} />
                </p>

                <div className="card-footer text-info">
                  <strong>Support the Blockstack app ecosystem now!</strong>
                </div>
              </div>

              <div className="card mt-4  border-info">
                <div className="card-header">
                  <h5 classNme="card-title">Start your own club</h5>
                </div>
                <div className="card-body">
                  <p className="card-text mx-5 my-3">
                    Assuming you have accounts on{' '}
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Github
                    </a>
                    &nbsp; and{' '}
                    <a
                      href="https://netlify.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Netlify
                    </a>{' '}
                    you can automatically{' '}
                    <strong>
                      generate and host for free a website that has
                      your&nbsp;own&nbsp;clone&nbsp;of&nbsp;this&nbsp;club&nbsp;site:
                    </strong>
                  </p>
                  <a
                    className="btn btn-secondary p-0"
                    type="button"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://app.netlify.com/start/deploy?repository=https://github.com/friedger/members"
                  >
                    <img
                      src="https://www.netlify.com/img/deploy/button.svg"
                      alt="&nbsp;Deploy to Netlify&nbsp;"
                    />
                  </a>
                </div>
                <div className="card-footer">
                  Use the deployed app as a staring point for your club site.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
