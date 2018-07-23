import React, { Component } from 'react';
import { store, view } from 'react-easy-state';
import { Link } from 'react-router-dom';

import { NumericInput } from '@blueprintjs/core';
import { parsePrice } from '../helpers/cart';

const moment = require('moment');

import cartState from '../store';

class MiniCart extends Component
{
  parsePackage = (id) => id === 1 ? '6-Day Package' : '4-Day Package';
  parseDates = (dates) => moment(dates.dateStart).format('ddd, MMM Do') + ' &ndash; ' + moment(dates.dateEnd).format('ddd, MMM Do');

  handleQty = (vnum, vstring, index) => {
    let item = cartState.added[index];
    const slimSunday = item.slimSunday ? 300000 : 0;
    item.qty = vnum;
    item.totalPrice = (parseInt(item.foodPrice) + parseInt(item.snacksPrice) + slimSunday) * vnum;
  }

  totalPrice = () => {
    const totalCartPrice = this.cartTotalPrice();
    // later - delivery discount
    return parsePrice(parseInt(totalCartPrice));
  }

  cartTotalPrice = () => cartState.added.reduce((accu, total) => accu + parseInt(total.totalPrice), 0)
  handleEmptyCart = () => cartState.added = [];
  handleDelete = (e, index) => cartState.added.splice(index, 1);

  render() {
    const cart = cartState.added.filter(cart => cart.complete);
    if (cart.length <= 0) {
      return (
        <div className="mini-cart">
          <a href="javascript:" title="" className="toggler"><i className="fa fa-fw fa-shopping-cart"></i> your cart</a>
          <div className="mini-cart--wrapper">
            <div className="mini-cart--content">
              <div className="mini-cart--empty"><i className="fal fa-smile"></i> Your cart is empty</div>
            </div>
          </div>
        </div>
      );
    }

    if (cart.length > 0) {
      return (
        <React.Fragment>
          <div className="mini-cart">
            <a href="javascript:" title="" className="toggler"><i className="fa fa-fw fa-shopping-cart"></i> your cart</a>
            <div className="mini-cart--wrapper">
              <div className="mini-cart--content">
                {cart.length && cart.map((item, index) => (
                  <div className="mini-cart--row" key={index}>
                    <div className="mini-cart--body">
                      <div className="mini-cart--title"><Link className="edit-cart" to={`/customize-cart/${item.key}`} title="">{item.title} <i className="fa fa-pencil"></i></Link></div>
                      <div className="mini-cart--package">{this.parsePackage(item.packageId)}</div>
                      <div className="mini-cart--dates" dangerouslySetInnerHTML={{__html: this.parseDates(item)}}></div>
                      {item.slimSunday && <div className="mini-cart--sunday">with Slim Sunday</div>}
                    </div>
                    <div className="mini-cart--subtotal">
                      {parsePrice(item.totalPrice)} IDR
                      <br />
                      <NumericInput
                        min={1}
                        fill={false}
                        onValueChange={(vnum, vstring) => this.handleQty(vnum, vstring, index)} value={item.qty}
                      />
                    </div>
                    <a href="javascript:" className="mini-cart--remove" onClick={(e) => this.handleDelete(e, index)}><i className="fa fa-fw fa-times" /></a>
                  </div>
                ))}
                <div className="mini-cart--total">
                  <span>Total</span>
                  <span>{this.totalPrice()} IDR</span>
                </div>
                <div className="mini-cart--footer">
                  <a href="javascript:" title="" className="empty" onClick={this.handleEmptyCart}>Empty Cart <i className="fa fa-fw fa-times"></i></a>
                  <Link to="/checkout" className="btn-checkout">Checkout <i className="fa fa-fw fa-angle-right"></i></Link>
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
