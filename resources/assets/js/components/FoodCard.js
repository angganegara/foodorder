import React from 'react';
import { Link } from 'react-router-dom';

const FoodCard = ({ food, index, scrollTop }) => {
  if (food) {
    return (
      <div className="col-xs-12 col-md-4 blue-line">
        <div className="food-card">
          <Link to={`/${food.slug}/${food.id}`} className="figure">
            <div className="food-card--title">{food.name}</div>
            <img src={`/images/foods/thumb_${food.id}.jpg`} alt={food.name} />
          </Link>
          <div className="food-card--desc" dangerouslySetInnerHTML={{__html: food.short_description}}></div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="col-xs-12 col-md-4 blue-line">
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
