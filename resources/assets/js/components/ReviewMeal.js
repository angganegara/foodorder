import React from 'react';

import { parsePrice } from '../helpers/cart';

const ReviewMeal = ({parseStation, food, snack, days, changeSection, prices, ...props}) => (
  <div className="customize--tabs-body">
    <div className="review">
      <div className="review-wrap">
        {days.map((day, index) => (
          <div key={index} className="review-card">
            <div className="review-card--day">
              <span><i className="fal fa-fw fa-angle-down"></i> {day.label}
                {day.isSaturday && (prices.slimSundayPrice > 0) ? <small>(including Slim Sunday)</small> : ""}
              </span>
              <a href="javascript:" onClick={(e) => changeSection(e, 0)}><i className="fa fa-fw fa-pencil"></i> edit</a>
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
            {prices.ecoPrice > 0 && (
              <tr>
                <td>ECO PACK</td>
                <td>{parsePrice(prices.ecoPrice)} IDR</td>
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
      </div>
    </div>
  </div>
);

export default ReviewMeal;
