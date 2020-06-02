import React, { Component } from "react";
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

class Reports extends Component {
  state = {
    partners: JSON.parse(partners),
    partner: null,
    dates: null,
    loading: false,
    orders: null
  };

  changePartner = e => this.setState({ partner: parseInt(e.target.value) });
  changeDate = range => this.setState({ dates: range });
  selectedPartner = () => this.state.partners.filter(p => p.id == this.state.partner)[0];

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
    const { dates, partner } = this.state;
    return axios.post("/admin/partners/report", { partner, dates });
  };

  calculateTotal = orders => {
    return orders.reduce((accu, order) => accu + order.total, 0);
  };

  calculateProfit = total => {
    total = parseInt(total);
    return total * (parseInt(this.selectedPartner().profit) / 100);
  };

  calculateTotalProfit = orders => {
    return orders.reduce((accu, total) => {
      let profit = this.calculateProfit(total.total);
      return accu + profit;
    }, 0);
  };

  handleExport = (e, format) => {
    const { dates, partner } = this.state;
    axios
      .post("/admin/partners/export", { partner, dates, format })
      .then(res => (window.location.href = res.data))
      .catch(err => console.log(err.response.data));
  };

  render() {
    const { partners, loading, orders, dates } = this.state;
    const startDate = dates && moment(dates[0]).format("DD MMMM YY");
    const finishDate = dates && moment(dates[1]).format("DD MMMM YY");

    return (
      <div className="inner">
        <div className="columns is-multiline is-centered no-padding">
          <div className="column">
            <label className="pt-label">
              Select Partner
              <div className="pt-select">
                <select onChange={this.changePartner}>
                  <option defaultValue>Select partner</option>
                  {partners.map((partner, index) => (
                    <option key={index} value={partner.id}>
                      {partner.name}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </div>
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
                  <th>Phone</th>
                  <th>Payment methods</th>
                  <th>Total</th>
                  <th>%</th>
                  <th>Profit</th>
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
                      <a href={`mailto:${order.email}`} target="_blank">
                        <b>{order.name}</b>
                      </a>
                    </td>
                    <td>{order.phone}</td>
                    <td>{order.payment_formatted}</td>
                    <td>{parsePrice(order.total)} IDR</td>
                    <td>{this.selectedPartner().profit}%</td>
                    <td>{parsePrice(this.calculateProfit(order.total))} IDR</td>
                  </tr>
                ))}
                {orders && orders.length > 0 && (
                  <tr className="row-total">
                    <td colSpan="5">Total</td>
                    <td>
                      <b>{parsePrice(this.calculateTotal(orders))} IDR</b>
                    </td>
                    <td />
                    <td>
                      <b>{parsePrice(this.calculateTotalProfit(orders))} IDR</b>
                    </td>
                  </tr>
                )}
                {orders.length <= 0 && (
                  <tr>
                    <td colSpan="8">Record not found</td>
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

export default Reports;
