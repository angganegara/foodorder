import React, { Component } from "react";
import { view } from "react-easy-state";
import { DateInput } from "@blueprintjs/datetime";
import Moment from "moment";
import { extendMoment } from "moment-range";

import orderState from "../store/order";
import Input from "./Input";

const moment = extendMoment(Moment);

class GuestDetails extends Component {
  state = {
    startingDate: new Date(),
    categories: null
  };

  componentDidMount() {
    if (this.props.active) {
      this.calculateDatePeriod();
    }
    this.loadCategories();
  }

  loadCategories = () => {
    axios.get("/api/foods").then(res => this.setState({ categories: res.data }));
  };

  calculateDatePeriod() {
    const { startingDate } = this.state;

    let startDate = startingDate;
    let cloneDate = new Date(startDate.getTime());
    let daysAmount = orderState.days.length;
    let duration = daysAmount - 1;
    let sundays = 0;
    let dates = [];
    let datesRaw = [];

    const range = moment.rangeFromInterval("days", duration, startDate);
    for (let days of range.by("days")) {
      // skip sunday if any
      if (days.format("d") == "0") {
        sundays += 1;
      }
    }
    cloneDate.setHours(24 * duration + sundays * 24);
    if (moment(cloneDate).format("d") == "0") {
      cloneDate.setHours(24);
    }

    const periods = moment.range(startingDate, cloneDate);
    const periods2 = periods.snapTo("day");
    for (let pdays of periods2.by("days")) {
      if (pdays.format("d") != "0") {
        dates.push(pdays.format("ddd, DD MMM"));
        datesRaw.push(pdays.format("YYYY-MM-DD"));
      }
    }

    orderState.duration = duration;
    orderState.startingDate = Date.parse(startingDate);
    orderState.endDate = Date.parse(cloneDate);
    orderState.datePeriods = dates;
    orderState.dateRaw = datesRaw;
  }

  changeTotalDays = e => {
    let newDays = [];
    let days = e.target.value;
    for (let i = 0; i < parseInt(days); i++) {
      newDays.push({
        index: i,
        day: i + 1
      });
    }
    orderState.days = newDays;
    this.calculateDatePeriod();
  };

  handleDateChange = date => {
    const { startingDate } = this.state;
    if (date == "" || !date) {
      date = startingDate;
    }
    this.setState({ startingDate: date }, () => this.calculateDatePeriod());
  };
  formatDate = date => moment(date).format("DD MMM YYYY");
  changeCategory = e => {
    const { categories } = this.state;
    let id = e.target.value;
    let category = categories.filter(category => category.id == id)[0];
    orderState.category = {
      id: category.id,
      name: category.name
    };
  };

  render() {
    const { form, days, availableDays, endDate, category } = orderState;
    const { startingDate, categories } = this.state;
    const { active } = this.props;
    const totalDays = days.length;
    return (
      <React.Fragment>
        <div className={`mp-guest-details mp-page ${active ? "active" : ""}`}>
          <div className="guest-details-body">
            <h1>
              <i className="fa fa-address-card" /> customer details
            </h1>
            <div className="columns form-inputs is-multiline">
              <Input label="First name" column="fname" value={form.fname} classNames="is-6" />
              <Input label="Last name" column="lname" value={form.lname} classNames="is-6" />
              <Input label="Email Address" column="email" value={form.email} classNames="is-6" />
              <Input label="Phone number" column="phone" value={form.phone} classNames="is-6" />
            </div>
            <hr className="form-separator" />
            <div className="columns form-inputs is-multiline">
              <Input label="Price (Subtotal)" column="price" value={form.price} classNames="is-6" />
              <Input label="Discount" column="discount" value={form.discount} classNames="is-6" />
              <Input label="Delivery Fee" column="delivery" value={form.delivery} classNames="is-6" />
              <Input label="Total Price" column="total" value={form.total} classNames="is-6" />
            </div>
            <hr className="form-separator" />
            <div className="columns form-inputs is-multiline">
              <div className="column is-12">
                <label className="pt-label">
                  Meal Plan Category
                  <div className="pt-select">
                    <select onChange={this.changeCategory} value={category ? category.id : ""}>
                      <option value="">Select Meal Plan Category</option>
                      {categories &&
                        categories.map((c, index) => (
                          <React.Fragment key={c.id}>
                            {c.id != 8 && <option value={c.id}>{c.name}</option>}
                            {c.id == 8 &&
                              c.children.map(subcat => (
                                <option value={subcat.id} key={subcat.id}>
                                  {subcat.name}
                                </option>
                              ))}
                          </React.Fragment>
                        ))}
                    </select>
                  </div>
                </label>
              </div>
              <div className="column is-6">
                <label className="pt-label">
                  Days
                  <div className="pt-select">
                    <select onChange={this.changeTotalDays} defaultValue={totalDays}>
                      {availableDays.map((day, index) => (
                        <option value={day} key={index}>
                          {day} days
                        </option>
                      ))}
                    </select>
                  </div>
                </label>
              </div>
              <div className="column is-6">
                <label className="pt-label pt-label-with-date">Select Starting Date</label>
                <DateInput
                  className="date-input-full"
                  formatDate={date => moment(date).format("DD MMMM YYYY")}
                  onChange={this.handleDateChange}
                  parseDate={str => new Date(str)}
                  placeholder={"DD MM YYYY"}
                  value={startingDate}
                />
              </div>
              <div className="column is-12">
                <div className="page-date-periods">
                  <div className="date-pill">{this.formatDate(startingDate)}</div>
                  <i className="far fa-arrow-right" />
                  <div className="date-pill">{this.formatDate(endDate)}</div>
                </div>
              </div>
            </div>
            <div className="page-nav center">
              <a href="javascript:" title="" className="nav-icon" onClick={e => this.props.goto(e, 2)}>
                <i className="fal fa-arrow-right" />
              </a>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default view(GuestDetails);
