import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { view, store } from 'react-easy-state';

import HowItWorks from '../components/HowItWorks';
import HomeFoods from './HomeFoods';
import HomeMeals from './HomeMeals';

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
            <h5 className="mb-2">Clean eating, designed for optimal nutrition.</h5>
            <p>
              100% Homemade & Fresh - Whole Foods - Organic - No Refined Sugar.<br />
              All meals are also available vegan.<br />
              Order daily between 8am - 12pm for the following day.<br />
              Only on Sunday we need 48hrs notice.
            </p>
          </div>
          <div className="bg"></div>
        </section>
        <HomeFoods />
        <section className="home intro fitmeals-intro">
          <div className="container">
            <h1>Fit Meals</h1>
            <h5 className="mb-2">
              Choose from 24 whole food dishes, created by nutritionists, from Paleo to Vegan<br />
              with complete macros. Freshly cooked and delivered daily to your home or office.
            </h5>
            <p>100% Homemade & Fresh - Whole Foods - Organic - No Refined Sugar.
            <br />Order directly via <a href="https://wa.me/6282147097110" title="" target="_blank" rel="nofollow">WhatsApp</a> or <a href="http://bit.ly/GoFitnessFood" title="" target="_blank">Gojek</a> from 10:30 am - 07:30 pm</p>
          </div>
          <div className="bg"></div>
        </section>
        <section className="home hiw">
          <HowItWorks closeButton={false} />
        </section>
        <HomeMeals />
      </React.Fragment>
    );
  }
}

export default view(Home);
