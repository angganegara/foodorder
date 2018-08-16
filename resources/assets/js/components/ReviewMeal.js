import React from 'react';

import { parsePrice } from '../helpers/cart';

const ReviewMeal = ({...props, parseStation, food, snack, days, addToCart, cartLoading, changeTab, activeItem, prices}) => (
  <div className="customize--tabs-body">
    <div className="review">
      <div className="review-wrap">
        {days.map((day, index) => (
          <div key={index} className="review-card">
            <div className="review-card--day">
              <span><i className="fal fa-fw fa-angle-down"></i> {day.label}</span>
              <a href="javascript:" onClick={(e) => changeTab(e, index)}><i className="fa fa-fw fa-pencil"></i> edit</a>
            </div>
            <div className="review-card--body">
              <span className="icon"><i className="fa fa-fw fa-utensils"></i> meal</span>
              <p>{food.name}</p>
            </div>
            {day.snacks.length > 0 && (
              <div className="review-card--body">
                <span className="icon"><i className="fa fa-fw fa-coffee"></i> snacks</span>
                <div className="review-card--body-snacks">
                  {day.snacks.length > 0 && day.snacks.map((s, index) => (
                    <span key={index}>{snack[s].name} ({day.snacksQty[s]}x)</span>
                  ))}
                </div>
              </div>
            )}
            <div className="review-card--pickup">
              <span className="icon"><i className="fa fa-fw fa-truck"></i> Pickup station</span>
              <p>{parseStation(day.pickup, index)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="review-buttons">
        <table className="review-table">
          <thead>
            <tr>
              <th colSpan="2">ORDER SUMMARY</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>MEAL</td>
              <td>{parsePrice(prices.foodPrice)} IDR</td>
            </tr>
            {prices.snacksPrice > 0 && (
              <tr>
                <td>SNACKS</td>
                <td>{parsePrice(prices.snacksPrice)} IDR</td>
              </tr>
            )}
            {prices.slimSundayPrice > 0 && (
              <tr>
                <td>SLIM SUNDAY</td>
                <td>{parsePrice(prices.slimSundayPrice)} IDR</td>
              </tr>
            )}
            {prices.deliveryPrice > 0 && (
              <tr>
                <td>DELIVERY SURCHARGE</td>
                <td>{parsePrice(prices.deliveryPrice)} IDR</td>
              </tr>
            )}
            <tr>
              <td>TOTAL PRICE</td>
              <td>{parsePrice(prices.totalPrice)} IDR</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>
          <a href="javascript:" className={`btn ${cartLoading ? 'btn-disabled' : ''}`} onClick={addToCart}>
            {!cartLoading && <span>Continue <i className="fal fa-fw fa-arrow-right"></i></span>}
            {cartLoading && <span><i className="fal fa-fw fa-spinner-third fa-spin"></i> Processing</span>}
          </a>
        </p>
      </div>
    </div>
  </div>
);

export default ReviewMeal;
