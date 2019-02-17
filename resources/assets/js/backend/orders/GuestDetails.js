import React, { Component } from "react";
import { view } from "react-easy-state";
import { DateInput } from "@blueprintjs/datetime";
import Moment from "moment";
import { extendMoment } from "moment-range";

import orderState from "../store/order";
import Input from "./Input";
import Textarea from "./Textarea";

const moment = extendMoment(Moment);

class GuestDetails extends Component {
  state = {
    startingDate: new Date(),
    categories: null,
    gender: null
  };

  componentDidMount() {
    this.loadCategories();

    if (ACTION == "EDIT") {
      // always overwrite the
      const order = ORDER;
      const carts = order.ordercart;
      orderState.form.fname = order.fname;
      orderState.form.lname = order.lname;
      orderState.form.email = order.email;
      orderState.form.phone = order.phone;
      orderState.form.price = parseInt(carts[0].subtotal) + parseInt(carts[0].snacks_price);
      orderState.form.ecoPrice = parseInt(carts[0].eco_price);
      orderState.form.gender = order.gender;
      orderState.form.comments = order.comments ? order.comments : "";
      orderState.form.delivery = parseInt(carts[0].delivery_price);
      orderState.form.discount = order.coupon_value;
      orderState.form.total = order.total;
      orderState.carts = carts;
      orderState.category = { id: carts[0].meal_id, name: carts[0].meals };
      orderState.cartID = carts[0].id;
      orderState.startingDate = Date.parse(new Date(carts[0].start_date));
      orderState.duration = carts[0].duration;

      if (order.backend_order == "1") {
        this.loadMenuToSchedule();
      }

      this.setState({ startingDate: new Date(carts[0].start_date) }, () => {
        this.changeTotalDays(null, orderState.duration);
      });
    } else {
      if (this.props.active) {
        this.calculateDatePeriod();
      }
    }
  }

  loadMenuToSchedule = () => {
    const { carts, cartID } = orderState;
    const cart = carts.filter(c => c.id == cartID)[0];
    const schedules = cart.schedule;
    let items = [];
    schedules.map((sch, index) => {
      let menu = sch.meals.split("<hr />");
      let menus = {
        b: menu[0].replace("B: ", ""),
        bs: menu[1].replace("S: ", ""),
        l: menu[2].replace("L: ", ""),
        ls: menu[3].replace("S: ", ""),
        d: menu[4].replace("D: ", "")
      };
      let data = {
        delivery: sch.station,
        scheduleID: sch.id,
        id: null,
        index: index + 1,
        menu: menus,
        pos: index,
        text: sch.meals,
        type: "days"
      };
      items.push(data);
    });

    orderState.items = items;
  };

  loadCategories = () => {
    axios.get("/api/foods?show_hidden=1").then(res => this.setState({ categories: res.data }));
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

    orderState.duration = orderState.days.length;
    orderState.startingDate = Date.parse(startingDate);
    orderState.endDate = Date.parse(cloneDate);
    orderState.datePeriods = dates;
    orderState.dateRaw = datesRaw;
  }

  changeTotalDays = (e, day = null) => {
    let newDays = [];
    let days = day ? day : e.target.value;
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
    let category = null;
    if (id == 10 || id == 11 || id == 12) {
      let parent = categories.filter(category => category.id == 8)[0];
      category = parent.children.filter(child => child.id == id)[0];
    } else {
      category = categories.filter(category => category.id == id)[0];
    }
    orderState.category = {
      id: category.id,
      name: category.name
    };
  };
  changeCartID = e => (orderState.cartID = e.target.value == "" ? orderState.cartID : e.target.value);
  changeGender = e => (orderState.form.gender = e.target.value);

  render() {
    const { form, days, availableDays, endDate, category, carts, cartID } = orderState;
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
              <div className="column is-12">
                <label className="pt-label">
                  Gender
                  <div className="pt-select">
                    <select onChange={this.changeGender} value={form.gender ? form.gender : ""}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </label>
              </div>
              <Textarea label="Comments" column="comments" value={form.comments} classNames="is-12" />
            </div>
            <hr className="form-separator" />
            <div className="columns form-inputs is-multiline">
              <Input label="Price (Meal inc. snacks)" column="price" value={form.price} classNames="is-6" />
              <Input label="Discount" column="discount" value={form.discount} classNames="is-6" />
              <Input label="Delivery Fee" column="delivery" value={form.delivery} classNames="is-6" />
              <Input label="Eco Pack" column="ecoPrice" value={form.ecoPrice} classNames="is-6" />
              <Input label="Total Price" column="total" value={form.total} classNames="is-12" />
            </div>
            <hr className="form-separator" />
            <div className="columns form-inputs is-multiline">
              {ACTION == "EDIT" && (
                <div className="column is-12">
                  <label className="pt-label">
                    Select Meal Plan to edit
                    <div className="pt-select">
                      <select onChange={this.changeCartID} value={cartID}>
                        <option value="">Select Meal you want to edit</option>
                        {carts &&
                          carts.map((cart, index) => (
                            <option value={cart.id} key={cart.id}>
                              {cart.meals}
                            </option>
                          ))}
                      </select>
                    </div>
                  </label>
                </div>
              )}
              {ACTION == "NEW" && (
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
              )}
              <div className="column is-6">
                <label className="pt-label">
                  Days
                  <div className="pt-select">
                    <select onChange={this.changeTotalDays} value={totalDays}>
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
