const axios = (window.axios = require("axios"));
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

import React, { Component } from "react";
import { render } from "react-dom";
import moment from "moment";

import { Button, Icon, Intent, Spinner, Toaster, Position, Input } from "@blueprintjs/core";
import { DateInput, IDateFormatProps } from "@blueprintjs/datetime";

const couponId = window.location.pathname.replace(/.*\//g, "");
const appToaster = Toaster.create({ position: Position.TOP_RIGHT });

const jsDateFormatter = {
  formatDate: date => moment(date).format("YYYY-MM-DD HH:mm:ss"),
  parseDate: str => moment(str).format("YYYY-MM-DD HH:mm:ss"),
  placeholder: "YYYY-MM-DD",
  className: "cal-full"
};

const jsSimpleDateFormatter = {
  formatDate: date => moment(date).format("YYYY-MM-DD"),
  parseDate: str => moment(str).format("YYYY-MM-DD"),
  placeholder: "YYYY-MM-DD",
  className: "cal-full"
};

class Coupon extends Component {
  state = {
    coupon: null,
    loading: true,
    diets: null,
    snacks: null
  };

  async componentDidMount() {
    if (couponId != "new") {
      try {
        const coupon = await this.getCoupon(couponId);
        const diet = await this.getDiets();
        const snacks = await this.getSnacks();
        this.setState({
          loading: false,
          coupon: {
            ...coupon.data,
            promo_start: new Date(Date.parse(coupon.data.promo_start)),
            promo_end: new Date(Date.parse(coupon.data.promo_end)),
            order_start: new Date(Date.parse(coupon.data.order_start)),
            order_end: new Date(Date.parse(coupon.data.order_end)),
            menu: JSON.parse(coupon.data.menu),
            snacks: JSON.parse(coupon.data.snacks),
            package_type: JSON.parse(coupon.data.package_type)
          },
          diets: diet.data,
          snacks: snacks.data
        });
      } catch (error) {
        console.log(error.response);
      }
    } else {
      const diet = await this.getDiets();
      const snacks = await this.getSnacks();
      const newCoupon = {
        amount: 0,
        code: "",
        discount_type: "amount",
        item: "",
        limit_usage: 0,
        min_order: 1,
        max_order: 0,
        menu: [0],
        snacks: [],
        package_type: ["all"],
        promo_start: new Date(),
        promo_end: new Date(),
        order_start: new Date(),
        order_end: new Date()
      };
      this.setState({ coupon: newCoupon, loading: false, diets: diet.data, snacks: snacks.data });
    }
  }

  getCoupon = id => axios.get("/admin/coupons/" + couponId);
  getDiets = () => axios.get("/api/foods");
  getSnacks = () => axios.get("/api/items/categorize");

  changeDiscountType = e => this.setState({ coupon: { ...this.state.coupon, discount_type: e.target.value } });
  changeDate = (date, type) => this.setState({ coupon: { ...this.state.coupon, [type]: date } });
  handleChange = (e, type) => {
    this.setState({
      coupon: {
        ...this.state.coupon,
        [type]: e.target.value
      }
    });
  };

  hasMenu = id => {
    const { coupon } = this.state;
    return coupon.menu && coupon.menu.filter(dietId => dietId == id).length;
  };

  hasSnack = id => {
    const { coupon } = this.state;
    return coupon.snacks && coupon.snacks.filter(snackId => snackId == id).length;
  };

  forAllMenu = () => {
    const { coupon } = this.state;
    return coupon.menu && coupon.menu[0] == 0;
  };

  toggleMenu = (e, id) => {
    const { coupon } = this.state;
    let newCoupon = coupon.menu;
    if (this.hasMenu(id)) {
      const idx = coupon.menu.indexOf(id);
      if (idx != -1) newCoupon.splice(idx, 1);
    } else {
      newCoupon = [...coupon.menu, id];
    }

    // remove element 0
    const zero = coupon.menu.indexOf(0);
    if (zero != -1) newCoupon.splice(zero, 1);

    this.setState({ coupon: { ...this.state.coupon, menu: newCoupon } });
  };

  toggleAllMenu = e => {
    const { coupon } = this.state;
    const zero = coupon.menu.indexOf(0);
    let newCoupon = zero == -1 ? [0] : [];
    this.setState({ coupon: { ...this.state.coupon, menu: newCoupon } });
  };

  updateSnack = (e, id) => {
    const { coupon } = this.state;
    let newCoupon = coupon.snacks;
    if (this.hasSnack(id)) {
      const idx = coupon.snacks.indexOf(id);
      if (idx != -1) newCoupon.splice(idx, 1);
    } else {
      newCoupon = [...coupon.snacks, id];
    }

    // remove element 0
    const zero = coupon.snacks.indexOf(0);
    if (zero != -1) newCoupon.splice(zero, 1);

    this.setState({ coupon: { ...this.state.coupon, snacks: newCoupon } });
  };

  hasPackage = id => {
    const { coupon } = this.state;
    return coupon.package_type.filter(packageId => packageId == id).length;
  };

  forAllPackage = () => {
    const { coupon } = this.state;
    return coupon.package_type && coupon.package_type[0] == "all";
  };

  togglePackage = (e, id) => {
    const { coupon } = this.state;
    let newPackage = coupon.package_type;
    if (this.hasPackage(id)) {
      const idx = newPackage.indexOf(id);
      if (idx != -1) newPackage.splice(idx, 1);
    } else {
      newPackage = [...coupon.package_type, id];
    }

    // remove element 0
    const zero = newPackage.indexOf("all");
    if (zero != -1) newPackage.splice(zero, 1);

    this.setState({ coupon: { ...this.state.coupon, package_type: newPackage } });
  };

  toggleAllPackage = e => {
    const { coupon } = this.state;
    const zero = coupon.package_type.indexOf("all");
    let newPackage = zero == -1 ? ["all"] : [];
    this.setState({ coupon: { ...this.state.coupon, package_type: newPackage } });
  };

  handleSubmit = e => {
    const { coupon } = this.state;

    if (coupon.code == "") {
      appToaster.show({ message: "Please enter coupon code", intent: Intent.DANGER });
      return false;
    }

    const data = Object.assign({}, coupon);
    data.promo_start = moment(data.promo_start).format("YYYY-MM-DD HH:mm:ss");
    data.promo_end = moment(data.promo_end).format("YYYY-MM-DD HH:mm:ss");
    data.order_start = moment(data.order_start).format("YYYY-MM-DD ");
    data.order_end = moment(data.order_end).format("YYYY-MM-DD");

    this.setState({ loading: true });

    axios
      .post("/admin/coupons/" + couponId, data)
      .then(res => {
        if (couponId == "new") {
          window.location.href = "/admin/coupons/" + res.data;
        } else {
          appToaster.show({ message: "Coupon Updated", intent: Intent.SUCCESS });
          this.setState({ loading: false });
        }
      })
      .catch(err => {
        appToaster.show({ message: "Save Error", intent: Intent.DANGER });
        this.setState({ loading: false });
      });
  };

  render() {
    const { coupon, loading, diets, snacks } = this.state;
    return (
      <div className="inner">
        <div className={`loading ${loading ? "loading-active" : ""}`}>
          <Spinner />
        </div>
        {coupon && (
          <div className="columns form-inputs is-multiline">
            <div className="column is-6">
              <label className="pt-label">
                Coupon Code
                <input className="pt-input pt-fill" type="text" value={coupon.code} onChange={e => this.handleChange(e, "code")} />
              </label>
            </div>
            <div className="column is-6">
              <label className="pt-label">
                Discount type
                <div className="pt-select">
                  <select onChange={this.changeDiscountType} value={coupon.discount_type}>
                    <option value="item">Item</option>
                    <option value="percent">Percentage</option>
                    <option value="amount">Amount</option>
                  </select>
                </div>
              </label>
            </div>

            <div className="column is-6">
              <label className="custom-label">Delivery starting date</label>
              <DateInput
                onChange={e => this.changeDate(e, "promo_start")}
                minDate={new Date(2017, 12)}
                maxDate={new Date(2024, 12)}
                value={coupon.promo_start}
                timePrecision={1}
                {...jsDateFormatter}
              />
            </div>
            <div className="column is-6">
              <label className="custom-label">Delivery end date</label>
              <DateInput
                onChange={e => this.changeDate(e, "promo_end")}
                minDate={new Date(2017, 12)}
                maxDate={new Date(2024, 12)}
                value={coupon.promo_end}
                timePrecision={1}
                {...jsDateFormatter}
              />
            </div>

            <div className="column is-6">
              <label className="custom-label">Order starting date</label>
              <DateInput
                onChange={e => this.changeDate(e, "order_start")}
                minDate={new Date(2017, 12)}
                maxDate={new Date(2024, 12)}
                value={coupon.order_start}
                {...jsSimpleDateFormatter}
              />
            </div>
            <div className="column is-6">
              <label className="custom-label">Order end date</label>
              <DateInput
                onChange={e => this.changeDate(e, "order_end")}
                minDate={new Date(2017, 12)}
                maxDate={new Date(2024, 12)}
                value={coupon.order_end}
                {...jsSimpleDateFormatter}
              />
            </div>

            <div className="column is-6">
              <label className="pt-label">
                Minimum item order
                <input
                  className="pt-input pt-fill"
                  type="text"
                  value={coupon.min_order}
                  onChange={e => this.handleChange(e, "min_order")}
                />
              </label>
              <span className="help">Enter 0 for no limit</span>
            </div>
            <div className="column is-6">
              <label className="pt-label">
                Maximum item order
                <input
                  className="pt-input pt-fill"
                  type="text"
                  value={coupon.max_order}
                  onChange={e => this.handleChange(e, "max_order")}
                />
              </label>
              <span className="help">Enter 0 for no limit</span>
            </div>

            <div className="column is-6">
              <label className="pt-label">
                Coupon usage limit
                <input
                  className="pt-input pt-fill"
                  type="text"
                  value={coupon.limit_usage}
                  onChange={e => this.handleChange(e, "limit_usage")}
                />
              </label>
              <span className="help">Enter 0 for no limit</span>
            </div>
            <div className="column is-6">
              <label className="pt-label">
                Discount value
                <input className="pt-input pt-fill" type="text" value={coupon.amount} onChange={e => this.handleChange(e, "amount")} />
              </label>
              <span className="help">if Discount type is amount / percentage</span>
            </div>

            <div className="column is-full">
              <label className="pt-label">
                Free item
                <textarea className="pt-input pt-fill" rows="3" onChange={e => this.handleChange(e, "item")} value={coupon.item} />
              </label>
              <span className="help">if Discount type is Item</span>
            </div>

            <div className="column is-full">
              <label className="custom-label">Discounted menu</label>
              <div className="diet-selector">
                <a href="javascript:" title="" className={this.forAllMenu() ? "active" : ""} onClick={this.toggleAllMenu}>
                  All Menu
                </a>
                {diets &&
                  diets.map((diet, index) => (
                    <React.Fragment key={index}>
                      {diet.children.length <= 0 && (
                        <a
                          className={this.hasMenu(diet.id) ? "active" : ""}
                          href="javascript:"
                          title=""
                          onClick={e => this.toggleMenu(e, diet.id)}
                        >
                          {diet.name}
                        </a>
                      )}
                      {diet.children.length > 0 &&
                        diet.children.map((d, i) => (
                          <a
                            key={i}
                            className={this.hasMenu(d.id) ? "active" : ""}
                            href="javascript:"
                            title=""
                            onClick={e => this.toggleMenu(e, d.id)}
                          >
                            {d.name}
                          </a>
                        ))}
                    </React.Fragment>
                  ))}
              </div>
            </div>

            <div className="column is-full">
              <label className="custom-label">Discounted package</label>
              <div className="diet-selector">
                <a href="javascript:" title="" className={this.forAllPackage() ? "active" : ""} onClick={this.toggleAllPackage}>
                  All Packages
                </a>
                <a className={this.hasPackage(1) ? "active" : ""} href="javascript:" title="" onClick={e => this.togglePackage(e, 1)}>
                  6-day package
                </a>
                <a className={this.hasPackage(2) ? "active" : ""} href="javascript:" title="" onClick={e => this.togglePackage(e, 2)}>
                  Single days
                </a>
              </div>
            </div>

            <div className="column is-full">
              <label className="custom-label">Discounted Snacks</label>
              <div className="snack-selector">
                {snacks &&
                  snacks.map(category => (
                    <div key={category.id}>
                      <div className="snack-title">{category.title}</div>
                      <div className="snack-list-wrap">
                        {category.items.map(snack => (
                          <label className="snack-list" key={snack.id}>
                            <input type="checkbox" onChange={e => this.updateSnack(e, snack.id)} checked={this.hasSnack(snack.id)} />{" "}
                            {snack.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
        <div className="save-button">
          <Button icon="tick" text="SUBMIT" intent={Intent.PRIMARY} onClick={this.handleSubmit} />
        </div>
      </div>
    );
  }
}

render(<Coupon />, document.getElementById("coupon-app"));
