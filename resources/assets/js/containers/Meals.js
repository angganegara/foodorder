import React, { Component } from "react";
import { view } from "react-easy-state";
import { Link } from "react-router-dom";
import { Overlay, Toaster, Intent, NumericInput, Position, Popover, Tag, PopoverInteractionKind } from "@blueprintjs/core";
import { DatePicker } from "@blueprintjs/datetime";
import { Doughnut } from "react-chartjs-2";
import moment from "moment";

const $ = require("jquery");

import { checkDayLimit } from "../helpers/dates";
import { scrollTop } from "../helpers/utils";
import { guid, parsePrice } from "../helpers/cart";

// store
import cartState from "../store";

// components
import HowItWorks from "../components/HowItWorks";
import AvailableOptions from "../components/AvailableOptions";

const appToaster = Toaster.create({ position: Position.TOP_RIGHT });
const today = new Date();

const isDisabled = date => {
  return (
    date.getDay() === 0 ||
    checkDayLimit(date)
  );
};

const displayIngredients = ingredients => {
  let exp = ingredients.split("\n");
  return "<span>" + exp.join("</span><span>") + "</span>";
};

const foodCodes = {
  VG: "Vegetarian",
  V: "Vegan",
  DF: "Dairy-free",
  P: "Paleo",
  LC: "Low Carb",
  GF: "Gluten-free"
};

const doughnutOptions = {
  cutoutPercentage: 70,
  legend: {
    display: false
  }
};

class Meals extends Component {
  state = {
    food: null,
    cells: [],
    doughnutData: null
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.loadFood(id);
    scrollTop();
  }

  loadFood = id => {
    axios
      .get(`/api/meals/${id}`)
      .then(res => this.setState({ food: res.data }))
      .then(() => this.loadDoughnutData())
      .catch(err => {
        appToaster.show({
          message: "Cannot load this page. Redirecting you back to home page.",
          intent: Intent.DANGER
        });
        setTimeout(() => this.props.history.push("/"), 3000);
      });
  };

  loadDoughnutData = () => {
    const { food } = this.state;
    const doughnutData = {
      datasets: [
        {
          data: [parseFloat(food.carb), parseFloat(food.prot), parseFloat(food.fat), parseFloat(food.fibr)],
          backgroundColor: ["#bd2447", "#1a5275", "#79611f", "#497e27"]
        }
      ],
      labels: ["Carbs", "Protein", "Fat", "Fibre"]
    };

    this.setState({ doughnutData: doughnutData });
  };

  parseDate = date => moment(date).format("ddd, MMM DD, YYYY");
  showFoodIcons = iconCodes => {
    const codes = iconCodes.split(", ");
    return codes.map(code => {
      return (
        <Popover key={code} interactionKind={PopoverInteractionKind.HOVER} position={Position.TOP}>
          <img src={`/images/icons/${code.toLowerCase()}.png`} alt={foodCodes[code]} title={foodCodes[code]} />
          <div>{foodCodes[code]}</div>
        </Popover>
      );
    });
  };
  returnHome = e => this.props.history.push("/");

  render() {
    const { food, doughnutData } = this.state;
    const modifiers = { isDisabled };

    return (
      <React.Fragment>
        <section className="top fm-details">
          {food && (
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-md-1">
                  <Link to="/" title="" className="fm-details--return">
                    <i className="fa fa-fw fa-long-arrow-alt-left" /> Home
                  </Link>
                </div>
                <div className="col-xs-12 col-md-6">
                  <h1 className="fm-details--title">
                    {food.symbols && <span className="fm-details--icons">{this.showFoodIcons(food.symbols)}</span>}
                    <span>{food.name}</span>
                  </h1>
                  <div className="fm-details--description" dangerouslySetInnerHTML={{ __html: food.description }} />
                  <div className="fm-details--section-title">
                    <h3>Ingredients</h3>
                  </div>
                  <div
                    className="fm-details--section sec-ingredients"
                    dangerouslySetInnerHTML={{ __html: displayIngredients(food.ingredients) }}
                  />
                  <div className="fm-details--section-title">
                    <h3>Macros</h3>
                  </div>
                  <div className="fm-details--section sec-macros">
                    {food && doughnutData && <Doughnut data={doughnutData} options={doughnutOptions} height={100} />}
                    <div className="macros-legend">
                      <div className="legend-carbs">
                        <span>{food.carb}g</span> carbs
                      </div>
                      <div className="legend-protein">
                        <span>{food.prot}g</span> protein
                      </div>
                      <div className="legend-fat">
                        <span>{food.fat}g</span> fat
                      </div>
                      <div className="legend-fibre">
                        <span>{food.fibr}g</span> fibre
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-md-offset-1 col-md-4">
                  <img src={`/images/meals/${food.id}.jpg`} alt="" className="responsive rounded" />
                  <br />
                  {food.available_symbols && <AvailableOptions icons={this.showFoodIcons(food.symbols)} />}
                </div>
              </div>
            </div>
          )}
          {!food && (
            <div className="loading">
              <i className="fal fa-3x fa-spin fa-spinner-third" />
            </div>
          )}
        </section>
      </React.Fragment>
    );
  }
}

export default view(Meals);
