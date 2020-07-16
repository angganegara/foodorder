import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { view, store } from 'react-easy-state';

import HowItWorks from '../components/HowItWorks';
import HomeFoods from './HomeFoods';

import { scrollTop } from '../helpers/utils';

class Home extends Component
{
  componentDidMount() {
    scrollTop();
  }

  componentDidUpdate() {
    scrollTop();
  }

  render() {
    return (
      <React.Fragment>
        <section className="top home intro">
          <div className="container">
            <h1>Meal Plans</h1>
            <p>
              <strong>Clean eating, designed for optimal nutrition.</strong><br />
              100% Homemade & Fresh - Whole Foods - Organic - No Refined Sugar.<br />
              Order daily between 8am - 12pm for the following day.<br />
              Only on Sunday we need 48hrs notice.
            </p>
          </div>
          <div className="bg"></div>
        </section>
        <HomeFoods />
      </React.Fragment>
    );
  }
}

export default view(Home);
