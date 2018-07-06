import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { view, store } from 'react-easy-state';

import HowItWorks from '../components/HowItWorks';
import HomeFoods from './HomeFoods';

class Home extends Component
{
  render() {
    return (
      <React.Fragment>
        <section className="top home intro">
          <div className="container">
            <h1>Meal Plans</h1>
            <p>
              <strong>Clean eating, designed for optimal nutrition delivered to your home or office.</strong><br />
              100% Homemade & Fresh - Whole Foods - Organic - No Refined Sugar.<br />
              All Motion Meals are available as Vegan / Vegetarian / Gluten-Free / Dairy-Free option.
            </p>
          </div>
          <div className="bg"></div>
          <div className="foods"></div>
        </section>
        <section className="home hiw">
          <HowItWorks closeButton={false} />
        </section>
        <HomeFoods />
      </React.Fragment>
    );
  }
}

export default view(Home);
