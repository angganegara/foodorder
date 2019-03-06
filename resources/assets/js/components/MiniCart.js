import React, { Component } from "react";
import { store, view } from "react-easy-state";
import { Link } from "react-router-dom";

import { NumericInput } from "@blueprintjs/core";
import { parsePrice } from "../helpers/cart";

const moment = require("moment");

import cartState from "../store";

class MiniCart extends Component {
  state = {
    isLoading: false
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
  parsePackage = id => (id === 1 ? "6-Day Package" : "Single day");
  parseDates = dates => {
    if (dates.dateStart == dates.dateEnd) {
      return moment(dates.dateStart).format("ddd, MMM Do");
    } else {
      return moment(dates.dateStart).format("ddd, MMM Do") + " &ndash; " + moment(dates.dateEnd).format("ddd, MMM Do");
    }
  };

  handleQty = async (vnum, vstring, index) => {
    this.setState({ isLoading: true });
    try {
      let item = cartState.added[index];
      const slimSunday = item.slimSunday ? 300000 : 0;
      item.qty = vnum;
      item.totalPrice = (parseInt(item.foodPrice) + parseInt(item.ecoPrice) + parseInt(item.snacksPrice) + parseInt(slimSunday)) * vnum;
      const { data } = await this.updateCart();
      this.setState({ isLoading: false });
    } catch (err) {
      // ...
    }
  };

  totalPrice = () => {
    const totalCartPrice = this.cartTotalPrice();
    // later - delivery discount
    return parsePrice(parseInt(totalCartPrice));
  };

  cartTotalPrice = () => cartState.added.reduce((accu, total) => accu + parseInt(total.totalPrice), 0);
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
  };

  totalItems = () => {
    return cartState.added.reduce((total, cur) => {
      return total + parseInt(cur.qty);
    }, 0);
  };

  render() {
    const { isLoading } = this.state;
    const cart = cartState.added.filter(cart => cart.complete);
    if (cart.length <= 0) {
      return (
        <div className="mini-cart">
          <a href="javascript:" title="" className="toggler">
            <i className="fa fa-fw fa-shopping-cart" />
          </a>
          <div className="mini-cart--wrapper">
            <div className="mini-cart--content">
              <div className="mini-cart--empty">
                <i className="fal fa-smile" /> Your cart is empty
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (cart.length > 0) {
      return (
        <React.Fragment>
          <div className="mini-cart">
            <a href="javascript:" title="" className="toggler">
              <i className="fa fa-fw fa-shopping-cart" />
              <span className="badge">{this.totalItems()}</span>
            </a>
            <div className="mini-cart--wrapper">
              <div className="mini-cart--content">
                {isLoading && (
                  <div className="mini-cart--loading">
                    <i className="fal fa-spinner-third fa-spin" />
                  </div>
                )}
                {cart.length &&
                  cart.map((item, index) => (
                    <div className="mini-cart--row" key={index}>
                      <div className="mini-cart--body">
                        <div className="mini-cart--title">
                          <Link className="edit-cart" to={`/customize-cart/${item.key}`} title="">
                            {item.title} <i className="fa fa-pencil" />
                          </Link>
                        </div>
                        <div className="mini-cart--package">{this.parsePackage(item.packageId)}</div>
                        <div className="mini-cart--dates" dangerouslySetInnerHTML={{ __html: this.parseDates(item) }} />
                        {item.slimSunday && <div className="mini-cart--sunday">with Slim Sunday</div>}
                      </div>
                      <div className="mini-cart--subtotal">
                        {parsePrice(item.totalPrice)} IDR
                        <br />
                        <NumericInput
                          min={1}
                          fill={false}
                          onValueChange={(vnum, vstring) => this.handleQty(vnum, vstring, index)}
                          value={item.qty}
                        />
                      </div>
                      <a href="javascript:" className="mini-cart--remove" onClick={e => this.handleDelete(e, index)}>
                        <i className="fa fa-fw fa-times" />
                      </a>
                    </div>
                  ))}
                <div className="mini-cart--total">
                  <span>Total</span>
                  <span>{this.totalPrice()} IDR</span>
                </div>
                <div className="mini-cart--footer">
                  <a href="javascript:" title="" className="empty" onClick={this.handleEmptyCart}>
                    Empty Cart <i className="fa fa-fw fa-times" />
                  </a>
                  <Link to="/checkout" className="btn-checkout">
                    Checkout <i className="fa fa-fw fa-angle-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
}

export default view(MiniCart);
