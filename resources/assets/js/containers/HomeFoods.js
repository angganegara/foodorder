import React, { Component } from "react";
import { view, store } from "react-easy-state";
import { Spinner } from "@blueprintjs/core";

import FoodCard from "../components/FoodCard";

class HomeFoods extends Component {
  state = {
    foods: null,
    error: false
  };

  componentDidMount() {
    this.loadFoods();
  }

  scrollTop() {
    $("html, body").animate({ scrollTop: 0 }, 500);
  }

  loadFoods = () => {
    axios
      .get("/api/foods")
      .then(res => this.setState({ foods: res.data }))
      .catch(err => this.setState({ error: "Cannot load category" }));
  };

  render() {
    const { foods } = this.state;

    return (
      <section className="home foods">
        <div className="container">
          <h2>Select Meal Plan</h2>
          <div className="row">
            {foods && foods.map((food, index) => <FoodCard {...this.props} food={food} key={index} />)}
            {foods && <FoodCard food={null} scrollTop={this.scrollTop} />}
            {!foods && (
              <div className="col-xs-12 loading">
                <Spinner intent="primary" />
              </div>
            )}
          </div>
        </div>
        <div className="bowl" />
        <div className="cup" />
      </section>
    );
  }
}

export default view(HomeFoods);
