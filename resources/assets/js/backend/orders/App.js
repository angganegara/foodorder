import React, { Component } from "react";
import { view } from "react-easy-state";
import orderState from "../store/order";
import GuestDetails from "./GuestDetails";
import Schedule from "./Schedule";
import Preview from "./Preview";

class App extends Component {
  switchPage = (e, page) => (orderState.activePage = page);

  render() {
    const { activePage } = orderState;
    return (
      <React.Fragment>
        <div className="app-nav">
          <a href="javascript:" title="" className={activePage == 1 ? "active" : ""} onClick={e => this.switchPage(e, 1)}>
            Customer Details
          </a>
          <a href="javascript:" title="" className={activePage == 2 ? "active" : ""} onClick={e => this.switchPage(e, 2)}>
            Schedule
          </a>
          <a href="javascript:" title="" className={activePage == 3 ? "active" : ""}>
            Finish
          </a>
        </div>
        <div className="container-fullscreen">
          <GuestDetails active={activePage == 1} goto={this.switchPage} />
          <Schedule active={activePage == 2} goto={this.switchPage} />
          <Preview active={activePage == 3} goto={this.switchPage} />
        </div>
      </React.Fragment>
    );
  }
}

export default view(App);
