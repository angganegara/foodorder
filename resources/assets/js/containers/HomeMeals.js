import React, { Component } from "react";
import { view, store } from "react-easy-state";
import { Spinner } from "@blueprintjs/core";

import FoodCard from "../components/FoodCard";

class HomeMeals extends Component {
  state = {
    meals: null,
    error: false
  };

  componentDidMount() {
    this.loadMeals();
  }

  scrollTop() {
    $("html, body").animate({ scrollTop: 0 }, 500);
  }

  loadMeals = () => {
    axios
      .get("/api/meals")
      .then(res => this.setState({ meals: res.data }))
      .catch(err => this.setState({ error: "Cannot load category" }));
  };

  render() {
    const { meals } = this.state;

    return (
      <section className="home fm-foods">
        <div className="container">
          <h2>Choose Fit Meals</h2>
          <div className="row">
            {meals && meals.map((meal, index) => <FoodCard {...this.props} food={meal} key={index} type="meals" />)}
            {!meals && (
              <div className="col-xs-12 loading">
                <Spinner intent="primary" />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default view(HomeMeals);
