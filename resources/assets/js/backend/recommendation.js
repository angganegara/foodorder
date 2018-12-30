const axios = (window.axios = require("axios"));
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

import React, { Component } from "react";
import { render } from "react-dom";
import { Button, Icon, Intent, Spinner, Toaster, Position } from "@blueprintjs/core";
import { DateRange, DateRangeInput, IDateFormatProps } from "@blueprintjs/datetime";

import moment from "moment";
import numeral from "numeral";

const parsePrice = price => {
  price = parseInt(price);
  return numeral(price).format("0,0");
};

const jsDateFormatter = {
  formatDate: date => date.toLocaleDateString(),
  parseDate: str => new Date(str),
  placeholder: "MM/DD/YYYY"
};

const appToaster = Toaster.create({ position: Position.TOP_RIGHT });

class Recommendation extends Component {
  state = {
    dates: null,
    loading: false,
    orders: null
  };

  changeDate = range => this.setState({ dates: range });

  handleSubmit = async () => {
    this.setState({ loading: true });
    try {
      const res = await this.getReport();
      this.setState({
        loading: false,
        orders: res.data
      });
    } catch (error) {
      const err = error.response.data;
      appToaster.show({ message: err, intent: Intent.DANGER });
      this.setState({ loading: false });
    }
  };

  getReport = () => {
    const { dates } = this.state;
    return axios.post("/admin/orders/recommendation", { dates });
  };

  handleExport = (e, format) => {
    const { dates } = this.state;
    axios
      .post("/admin/orders/recommendation/export", { dates, format })
      .then(res => (window.location.href = res.data))
      .catch(err => console.log(err.response.data));
  };

  render() {
    const { loading, orders, dates } = this.state;
    const startDate = dates && moment(dates[0]).format("DD MMMM YY");
    const finishDate = dates && moment(dates[1]).format("DD MMMM YY");

    return (
      <div className="inner">
        <div className="columns is-multiline no-padding">
          <div className="column is-narrow">
            <label className="custom-label">Select dates</label>
            <DateRangeInput onChange={this.changeDate} {...jsDateFormatter} minDate={new Date(2017, 12)} maxDate={new Date(2024, 12)} />
          </div>
          <div className="column is-narrow">
            <label className="custom-label">&nbsp;</label>
            <Button rightIcon="small-tick" text="SUBMIT" intent={Intent.PRIMARY} onClick={this.handleSubmit} />
          </div>
        </div>
        <div className={`loading ${loading ? "loading-active" : ""}`}>
          <Spinner />
        </div>
        {/* should have use child component here - refactor soon */}
        {orders && (
          <React.Fragment>
            <h2>
              <b>{startDate}</b> to <b>{finishDate}</b>{" "}
            </h2>
            <table width="100%" className="tbl">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Where Did You Learn About Us?</th>
                  <th>Motion Name</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td>
                      <a href={`/admin/orders/${order.order_number}/${order.id}`} title="">
                        <b>{order.order_number}</b>
                      </a>
                    </td>
                    <td>{order.date}</td>
                    <td>
                      <a href="#" target="_blank">
                        <b>{order.name}</b>
                      </a>
                    </td>
                    <td>{order.learn_how}</td>
                    <td>{order.learn_name ? order.learn_name : "-"}</td>
                  </tr>
                ))}
                {orders.length <= 0 && (
                  <tr>
                    <td colSpan="5">Record not found</td>
                  </tr>
                )}
              </tbody>
            </table>
            {orders && orders.length > 0 && (
              <div className="export-button">
                <Button rightIcon="th" text="EXPORT TO EXCEL" intent={Intent.SUCCESS} onClick={e => this.handleExport(e, "xlsx")} />
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

render(<Recommendation />, document.getElementById("recommendation-app"));
