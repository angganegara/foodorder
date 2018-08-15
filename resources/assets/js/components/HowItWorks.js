import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';

class HowItWorks extends Component
{
  state = {
    open: false
  };

  componentDidMount() {
    if (this.props.autoOpen) {
      this.setState({open: true});
    }
  }

  handleClick = e => {
    this.setState({
      open: ! this.state.open
    })
  }

  render() {
    const icon = this.state.open ? `<i class="fal fa-fw fa-angle-up"></i>` : `<i class="fal fa-fw fa-angle-down"></i>`;

    return (
      <React.Fragment>
        {this.props.closeButton && <a href="javascript:" className="hiw--close" title="" onClick={this.props.toggleOverlay}><i className="fal fa-times"></i></a>}
        <a href="javascript:" title="" onClick={this.handleClick} className="hiw--title">
          <div className="container">
            <span><i dangerouslySetInnerHTML={{__html: icon}}></i> How it Works</span>
            <span>Info about ordering/delivery/payment</span>
            <span>&nbsp;</span>
          </div>
        </a>
        <CSSTransition
          in={this.state.open}
          timeout={0}
          classNames="hiw-"
          unmountOnExit
        >
          {state => (
            <div className="hiw--body">
              <div className="bottle"></div>
              <div className="container">
                <div className="row">
                  <div className="col-xs-12 col-md-4">
                    <h3>order info</h3>
                    <ul>
                      <li>Starting days for your diet: Mondays to Saturdays</li>
                      <li>Order must be placed 48hrs in advance to give us time to prepare your diet</li>
                      <li>Sundays we are closed for orders and food production</li>
                      <li>Latest order for Monday until Friday 17:00.</li>
                      <li>Office times for possible queries: Mon. - Fri. 08:00 - 17:00.</li>
                    </ul>
                  </div>
                  <div className="col-xs-12 col-md-4">
                    <h3>delivery info</h3>
                    <ul>
                      <li>One delivery per day with all meals/drinks</li>
                      <li>Delivery days: Monday to Saturday (Slim Sunday will be delivered Saturday)</li>
                      <li>Delivery times: between 07:30 am. and 09:00 am</li>
                      <li>Change of delivery address: minimum 24hrs in advance</li>
                      <li>Eco Effort: please return all our re-usable glasses/bottles to our drivers</li>
                    </ul>
                  </div>
                  <div className="col-xs-12 col-md-4">
                    <h3>payment info</h3>
                    <ul>
                      <li>Free delivery to Kuta/Seminyak/Canggu area</li>
                      <li>Delivery surcharge of 50,000 IDR/day for other areas (e.g. Sanur/Ubud/Bukit)</li>
                      <li>Cash payment: on first day of delivery to driver upon receipt</li>
                      <li>Online payment: by bank transfer / Paypal</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CSSTransition>
      </React.Fragment>
    );
  }
}

export default HowItWorks;
