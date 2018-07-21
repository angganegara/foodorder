window.$ = window.jQuery = require('jquery');

import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { store, view } from 'react-easy-state';

import station from '../store/station';
import snackState from '../store/snacks';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Home from './Home';
import Details from './Details';
import Customize from './Customize';
import Detox from './Detox';
import CustomSpecialized from '../components/CustomSpecialized';
import Checkout from './Checkout';
import Terms from '../components/Terms';

class App extends Component
{
  componentDidMount() {
    axios
      .post('/api/partners')
      .then(res => station.stations = res.data);
    axios
      .get('/api/items')
      .then(res => snackState.items = res.data);
  }

  render() {
    return (
      <React.Fragment>
        <Header {...this.props}/>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/custom-specialized" component={CustomSpecialized} />
          <Route path="/checkout/thank-you" component={Checkout} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/customize-cart/:id" component={Customize} />
          <Route path="/terms-and-conditions" component={Terms} />
          <Route path="/detox/8" component={Detox} />
          <Route path="/:slug/:id" component={Details} />
        </Switch>
        <Footer />
      </React.Fragment>
    );
  }
}

export default withRouter(view(App));
