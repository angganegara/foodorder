import React from 'react';

const ReviewMeal = ({...props, parseStation, food, snack, days, addToCart, cartLoading}) => (
  <div className="customize--tabs-body">
    <h2>Review</h2>
    <div className="review">
      <div className="review-wrap">
        {days.map((day, index) => (
          <div key={index} className="review-card">
            <div className="review-card--day"><i className="fal fa-fw fa-angle-down"></i> {day.label}</div>
            <div className="review-card--body">
              <span className="icon"><i className="fa fa-fw fa-utensils"></i> meal</span>
              <p>{food.name}</p>
            </div>
            {day.snacks.length > 0 && (
              <div className="review-card--body">
                <span className="icon"><i className="fa fa-fw fa-coffee"></i> snacks</span>
                <div className="review-card--body-snacks">
                  {day.snacks.length > 0 && day.snacks.map((s, index) => (
                    <span key={index}>{snack[s].name}</span>
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
        <p>
          <a href="javascript:" className={`btn ${cartLoading ? 'btn-disabled' : ''}`} onClick={addToCart}>
            {!cartLoading && <span><i className="fal fa-fw fa-plus"></i> Add to Cart</span>}
            {cartLoading && <span><i className="fal fa-fw fa-spinner-third fa-spin"></i> Processing</span>}
          </a>
        </p>
      </div>
    </div>
  </div>
);

export default ReviewMeal;
