import React, { Component } from "react";
import { view } from "react-easy-state";

import { NumericInput } from "@blueprintjs/core";
import { parsePrice } from "../helpers/cart";

const moment = require("moment");

import cartState from "../store";
import station from "../store/station";
import Schedule from "./Schedule";

class CartOverview extends Component {
  state = {
    coupon: {
      code: "",
      value: 0,
      item: ""
    },
    isLoading: true
  };

  async componentDidMount() {
    if (cartState.cartKey) {
      try {
        const { data } = await this.loadCart();
        cartState.added = JSON.parse(data.cart);
        this.setState({ isLoading: false });
      } catch (err) {
        this.props.invalidCart();
      }
    }
  }

  loadCart = () => axios.post("/api/cart/content", { cartKey: cartState.cartKey });
  updateCart = () => axios.post("/api/cart/update", { cartKey: cartState.cartKey, cartData: JSON.stringify(cartState.added) });
  parsePackage = id => (id === 1 ? "6-Day Package" : "Single days");
  parseDates = dates => {
    if (dates.dateStart == dates.dateEnd) {
      return moment(dates.dateStart).format("ddd, MMM Do");
    } else {
      return moment(dates.dateStart).format("ddd, MMM Do") + " &ndash; " + moment(dates.dateEnd).format("ddd, MMM Do");
    }
  };

  handleEmptyCart = () => (cartState.added = []);
  handleDelete = async (e, index) => {
    this.setState({ isLoading: true });
    try {
      cartState.added.splice(index, 1);
      const { data } = await this.updateCart();
      this.setState({ isLoading: false });
    } catch (err) {
      // ...
    }
    this.cancelCoupon();
  };

  handleQty = async (vnum, vstring, index) => {
    this.setState({ isLoading: true });
    try {
      let item = cartState.added[index];
      const slimSunday = item.slimSunday ? 350000 : 0;
      item.qty = vnum;
      item.totalPrice = (parseInt(item.foodPrice) + parseInt(item.ecoPrice) + parseInt(item.snacksPrice) + parseInt(slimSunday)) * vnum;
      const { data } = await this.updateCart();
      this.setState({ isLoading: false });
    } catch (err) {
      // ...
    }
    this.cancelCoupon();
  };

  totalPrice = () => {
    const totalCartPrice = this.cartTotalPrice();
    const discount = this.state.coupon.value;
    // later - delivery discount
    return parsePrice(parseInt(totalCartPrice) - parseInt(discount));
  };

  parseStation = (type, index, address, area) => {
    switch (type) {
      case "address":
        return address + " (" + area + ")";
        break;
      default:
        return station.stations.filter(s => s.id === type)[0].station;
        break;
    }
  };

  toggleSchedule = (e, index) => {
    $(`.schedule-${index}`).slideToggle();
  };
  toggleCoupon = () => {
    $(".coupon--body").slideToggle();
  };
  enterCoupon = e => this.setState({ coupon: { ...this.state.coupon, code: e.target.value } });
  cartTotalPrice = () => cartState.added.reduce((accu, total) => accu + parseInt(total.totalPrice), 0);
  cancelCoupon = () => this.setState({ coupon: { value: 0, code: "", item: "" } }, () => this.props.applyCoupon(this.state.coupon));
  applyCoupon = () => {
    const data = {
      cart: cartState.added,
      coupon: this.state.coupon.code,
      total: parseInt(this.cartTotalPrice())
    };
    axios
      .post("/api/apply-coupon", data)
      .then(res => {
        this.setState({
          coupon: {
            ...this.state.coupon,
            value: res.data.value,
            item: res.data.item
          }
        });
      })
      .then(() => this.props.applyCoupon(this.state.coupon))
      .catch(err => window.alert(err.response.data.message));
  };

  render() {
    const cart = cartState.added.filter(cart => cart.complete);
    const { snacks } = this.props;
    const { coupon, isLoading } = this.state;

    return (
      cart.length > 0 && (
        <div className="cart">
          {isLoading && (
            <div className="cart-overview-loading">
              <i className="fal fa-spinner-third fa-spin" />
            </div>
          )}
          {cart.length &&
            cart.map((item, index) => (
              <React.Fragment key={index}>
                <div className="cart--row">
                  <div className="cart--body">
                    <div className="cart--title">
                      <b>{item.title}</b>
                    </div>
                    <div className="cart--package">{this.parsePackage(item.packageId)}</div>
                    <div
                      className="cart--dates"
                      dangerouslySetInnerHTML={{
                        __html: this.parseDates(item)
                      }}
                    />
                    {item.slimSunday && <div className="cart--sunday">with Slim Sunday</div>}
                    <a href="javascript:" title="" className="cart--schedule" onClick={e => this.toggleSchedule(e, index)}>
                      <span>
                        <i className="fal fa-angle-down" /> VIEW SCHEDULE
                      </span>
                    </a>
                  </div>
                  <div className="cart--subtotal">
                    {parsePrice(item.totalPrice)} IDR
                    <br />
                    <NumericInput
                      min={1}
                      fill={false}
                      onValueChange={(vnum, vstring) => this.handleQty(vnum, vstring, index)}
                      value={item.qty}
                    />
                  </div>
                  <a href="javascript:" className="cart--remove" onClick={e => this.handleDelete(e, index)}>
                    <i className="fa fa-fw fa-times" />
                  </a>
                </div>
                {station.stations.length > 0 && (
                  <Schedule
                    indexKey={index}
                    data={item.schedules}
                    snacks={snacks}
                    slimSunday={item.slimSunday}
                    parseStation={this.parseStation}
                  />
                )}
              </React.Fragment>
            ))}
          <div className="coupon">
            <a href="javascript:" title="" className="coupon--heading" onClick={this.toggleCoupon}>
              <i className="fal fa-plus" /> have coupon code?
            </a>
            <div className="coupon--body">
              {coupon.value <= 0 && coupon.item == "" && (
                <div className="input-group">
                  <input type="text" placeholder="enter coupon code" onChange={this.enterCoupon} />
                  <button onClick={this.applyCoupon}>Apply</button>
                </div>
              )}
              {coupon.value > 0 && (
                <p className="coupon--success">
                  <i className="fal fa-check" /> Successfully applied discount.{" "}
                  <a href="javascript:" title="" onClick={this.cancelCoupon}>
                    Cancel?
                  </a>
                </p>
              )}
            </div>
          </div>
          {coupon.value > 0 && (
            <div className="cart--total">
              <span>Discount</span>
              <span>- {parsePrice(coupon.value)} IDR</span>
            </div>
          )}
          <div className="cart--total">
            <span>Total</span>
            <span>{this.totalPrice()} IDR</span>
          </div>
        </div>
      )
    );
  }
}

export default view(CartOverview);
