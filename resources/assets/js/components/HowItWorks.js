import React, { Component } from "react";
import { CSSTransition } from "react-transition-group";

class HowItWorks extends Component {
  state = {
    open: false
  };

  componentDidMount() {
    if (this.props.autoOpen) {
      this.setState({ open: true });
    }
  }

  handleClick = e => {
    this.setState({
      open: !this.state.open
    });
  };

  render() {
    const icon = this.state.open ? `<i class="fal fa-fw fa-angle-up"></i>` : `<i class="fal fa-fw fa-angle-down"></i>`;

    return (
      <React.Fragment>
        {this.props.closeButton && (
          <a href="javascript:" className="hiw--close" title="" onClick={this.props.toggleOverlay}>
            <i className="fal fa-times" />
          </a>
        )}
        <a href="javascript:" title="" onClick={this.handleClick} className="hiw--title">
          <div className="container">
            <span>
              <i dangerouslySetInnerHTML={{ __html: icon }} /> How it Works
            </span>
            <span>Info about ordering/delivery/payment</span>
            <span>&nbsp;</span>
          </div>
        </a>
        <CSSTransition in={this.state.open} timeout={0} classNames="hiw-" unmountOnExit>
          {state => (
            <div className="hiw--body">
              <div className="container">
                <div className="row">
                  <div className="col-xs-12 col-md-4">
                    <h3>order info</h3>
                    <ul>
                      <li>Order directly via <a href="https://api.whatsapp.com/send?phone=+6282147097110" title="" target="_blank">WhatsApp</a> or <a href="http://bit.ly/GoFitnessFood" title="" target="_blank">Gojek</a></li>
                      <li>Order daily from 11:30 am - 07:30 pm</li>
                    </ul>
                  </div>
                  <div className="col-xs-12 col-md-4">
                    <h3>delivery info</h3>
                    <ul>
                      <li>Canggu / Berawa free delivery</li>
                      <li>All other locations vary from 20,000 IDR - 50,000 IDR daily fee</li>
                      <li>We use eco-friendly packaging. WE RECYCLE, if you have our bottles or jars at home, please let us know as we are happy to send our drivers to pick it up. Thank you!</li>
                    </ul>
                  </div>
                  <div className="col-xs-12 col-md-4">
                    <h3>payment info</h3>
                    <ul>
                      <li>Cash payment to our driver</li>
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
