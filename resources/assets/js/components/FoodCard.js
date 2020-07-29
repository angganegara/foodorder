import React from 'react';
import { Link } from 'react-router-dom';
import { parsePrice } from "../helpers/cart.js";

const d = new Date();
const cacheName = d.getDate() + d.getMonth() + d.getFullYear();

const FoodCard = ({ food, index, type, scrollTop }) => {
  if (food) {
    if (type == 'meals') {
      return (
        <div className="col-xs-12 col-md-3 blue-line">
          <div className="food-card">
            <Link to={`/meals/${food.id}`} className="figure">
              <img src={`/images/meals/thumb_${food.id}.jpg?${cacheName}`} alt={food.name} />
            </Link>
            <div className="food-card--title">
              <Link to={`/meals/${food.id}`}>{food.name}</Link> <span>{food.short_desc}</span>
            </div>
            <div className="food-card--info">
              {food.cal && <span>CAL: {food.cal}</span>}
              {food.prot && <span>P: {food.prot}</span>}
              {food.fat && <span>F: {food.fat}</span>}
              {food.fibr && <span>FIBER: {food.fibr}</span>}
              {food.carb && <span>C: {food.carb}</span>}
            </div>
            <div className="food-card--footer">
              <div className="food-card--price">IDR {parsePrice(food.price)}</div>
              <a href="javascript:" title="" onClick={e => quickAdd(e, food.id)} className="food-card--add" style={{ display: 'none' }}>
                SELECT
              </a>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="col-xs-12 col-md-3 blue-line">
          <div className="food-card">
            <Link to={`/${food.slug}/${food.id}`} className="figure">
              <div className="food-card--title">{food.name}</div>
              <img src={`/images/foods/thumb_${food.id}.jpg`} alt={food.name} />
            </Link>
            <div className="food-card--desc" dangerouslySetInnerHTML={{__html: food.short_description}}></div>
          </div>
        </div>
      );
    }
  } else {
    return (
      <div className="col-xs-12 col-md-3 blue-line">
        <div className="food-card">
          <Link to="/custom-specialized" className="figure no-overlay" onClick={scrollTop}>
            <div className="food-card--title">Custom / Specialized</div>
            <img src="/images/specialized.jpg" alt="Custom / Specialized" />
          </Link>
          <div className="food-card--desc">
            <p>Individually created diet to meet your special needs with the help of our professional nutritionists</p>
          </div>
        </div>
      </div>
    );
  }
};

export default FoodCard;
