import React, { Component } from "react";
import { view } from "react-easy-state";
import { Prompt } from "react-router";
import { CSSTransition } from "react-transition-group";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { Dialog, Button, Spinner, Toaster, Intent, Position, Checkbox, Radio, NumericInput } from "@blueprintjs/core";
const $ = require("jquery");

// helpers
import { parsePrice, getIndex } from "../helpers/cart";
import { areas } from "../helpers/area";

// store
import cartState from "../store";
import station from "../store/station";

import Snacks from "./Snacks";
import ReviewMeal from "../components/ReviewMeal";
import StationLabel from "../components/StationLabel";

const appToaster = Toaster.create({ position: Position.TOP_RIGHT });

class Customize extends Component {
  state = {
    food: null,
    stateIndex: 0,
    lastTab: false,
    activeTab: 0,
    activeDate: null,
    activeItem: null,
    saveStation: false,
    address: "",
    days: [],
    snacks: [],
    pageLoading: false,
    cartDialog: false,
    cartLoading: false,
    snackOverlay: false,
    progress: 0,

    activeIndex: 0,
    pickup: "",
    area: "",
    ecoPack: true,
    scheduleIndex: 0
  };

  componentDidMount() {
    let { id } = this.props.match.params;

    if (!id) {
      appToaster.show({
        message: "Error loading this page. Redirecting you back to home page.",
        intent: Intent.DANGER
      });
      setTimeout(() => (window.location.href = "/"), 2000);
    }

    if (!this.isExist(id)) {
      appToaster.show({
        message: "Item is not in your cart. Redirecting you back to home page.",
        intent: Intent.DANGER
      });
      setTimeout(() => (window.location.href = "/"), 2000);
    }

    const index = getIndex(id);
    this.setState(
      {
        activeItem: cartState.added[index],
        stateIndex: index,
        activeDate: cartState.added[index].schedules[0].date
      },
      () => {
        this.loadFood(cartState.added[index].id);
        this.loadSnacks();
      }
    );
  }

  componentWillUnmount() {
    const { id } = this.props.match.params;
    const index = getIndex(id);
    if (!cartState.added[index].complete) {
      cartState.added.splice(index, 1);
    }
  }

  getItem = id => cartState.added.filter(item => item.key === id);
  isExist = id => this.getItem(id).length;

  syncCartState = () => {
    const { stateIndex, activeItem } = this.state;
    cartState.added[stateIndex] = activeItem;
  };

  loadFood = id => {
    axios
      .get(`/api/foods/${id}`)
      .then(res => this.setState({ food: res.data }))
      .then(() => this.setState({ progress: this.state.progress + 50 }));
  };

  loadSnacks = () => {
    axios
      .get("/api/items")
      .then(res => this.setState({ snacks: res.data }))
      .then(() => this.setState({ progress: this.state.progress + 50 }));
  };

  updateStation = (e, value) => {
    const { activeItem } = this.state;
    const newStation = activeItem.schedules.map(schedule => {
      return { ...schedule, pickup: value };
    });
    // update all arrays
    this.setState({
      ...this.state,
      pickup: value,
      activeItem: { ...activeItem, schedules: newStation }
    });
  };

  updateAddress = (e, type) => {
    const { activeItem } = this.state;
    // if current active tab is 0 and save station is selected, update all address
    const newStation = activeItem.schedules.map(schedule => {
      return {
        ...schedule,
        [type]: e.target.value,
        pickup: activeItem.schedules[0].pickup
      };
    });
    this.setState(
      {
        ...this.state,
        activeItem: { ...activeItem, schedules: newStation },
        [type]: e.target.value
      },
      () => {
        this.syncCartState();
      }
    );
  };

  isSnackOptionExist = (id, index, type = null) => {
    const { activeItem, activeTab } = this.state;
    const data = activeItem.schedules[index];
    if (data.hasOwnProperty("snackOptions") && data.snackOptions.hasOwnProperty(id)) {
      if (type) {
        if (!data.snackOptions[id][type]) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  removeSnack = (e, snackId, index) => {
    const { activeItem, activeTab } = this.state;
    // copy the whole arrays rather than directly update the array
    if (this.isSnackOptionExist(snackId, index)) {
      delete activeItem.schedules[index].snackOptions[snackId];
    }
    let selectedSnacks = [...activeItem.schedules];
    const snackIndex = selectedSnacks[index].snacks.indexOf(snackId);

    selectedSnacks[index].snacks.splice(snackIndex, 1);

    delete selectedSnacks[index].snacksQty[snackId];
    this.generateSnacksData();
  };

  updateSnackQty = (vnum, vstring, id, index) => {
    const { activeItem, activeTab } = this.state;
    activeItem.schedules[index].snacksQty[id] = parseInt(vnum);
  };

  showSnacks = (e, index) => {
    // set active date & toggle overlay
    this.setState({ snackOverlay: true, scheduleIndex: index });
    $("body").addClass("ml-overlay-open");
  };

  toggleSnackOverlay = () => this.setState({ snackOverlay: false });

  changeTab = (e, index) => {
    const { activeTab, activeItem } = this.state;

    if (
      activeItem.schedules[activeTab].pickup == "address" &&
      (activeItem.schedules[activeTab].address == "" ||
        activeItem.schedules[activeTab] == null ||
        (activeItem.schedules[activeTab].area == "" || activeItem.schedules[activeTab].area == null))
    ) {
      appToaster.show({
        message: "Please enter your delivery address and/or area.",
        intent: Intent.WARNING
      });
      return false;
    }

    this.scrollTop();

    if (index != 99) {
      if (activeTab === 0 && activeItem.schedules[activeTab].pickup === null) {
        appToaster.show({
          message: "Please choose a pick-up station / delivery address.",
          intent: Intent.WARNING
        });
        return false;
      }

      this.setState({
        activeTab: index,
        lastTab: false,
        activeDate: activeItem.schedules[index].date
      });
      this.showPageLoading();
    } else {
      if (this.isAllStationSelected() && this.allAreaSelected()) {
        this.generateSnacksData();
        this.setState({ lastTab: true });
        this.showPageLoading();
      } else {
        appToaster.show({
          message: "To finish, please choose a pick-up station / delivery address for ALL days.",
          intent: Intent.WARNING
        });
        return false;
      }
    }
  };

  scrollTop = () => {
    $("html, body").animate({ scrollTop: 0 }, 500);
  };

  parseStation = (type, index) => {
    switch (type) {
      case "address":
        return this.state.activeItem.schedules[index].address + " (" + this.state.activeItem.schedules[index].area + ")";
        break;
      default:
        return station.stations.filter(s => s.id === type)[0].station;
        break;
    }
  };

  calculateDetails = () => {
    const { activeItem, food, ecoPack, pickup, address, area } = this.state;

    const slimSundayPrice = activeItem.slimSunday ? 350000 : 0;

    let foodPrice = food.prices.filter(f => f.sort === activeItem.packageId)[0].price;

    foodPrice = activeItem.packageId === 2 ? foodPrice * activeItem.schedules.length : foodPrice;

    const snacksPrice = activeItem.schedules
      .filter(s => s.snacksData.length > 0)
      .reduce((accu, s) => (accu += s.snacksData.reduce((total, snack) => (total += parseInt(snack.totalPrice)), 0)), 0);

    let deliveryPrice = 0;

    if (pickup == "address" && address != "" && area != "") {
      deliveryPrice = activeItem.schedules
        .filter(s => s.pickup == "address")
        .reduce((accu, s) => {
          return (accu += areas.filter(area => area.name == s.area)[0].price);
        }, 0);
    }

    // GANTI NANTI
    //const ecoPrice = ecoPack ? 100000 : 0;
    const ecoPrice = 0;

    const totalPrice =
      parseInt(foodPrice) + parseInt(snacksPrice) + parseInt(slimSundayPrice) + parseInt(deliveryPrice) + parseInt(ecoPrice);

    return {
      slimSundayPrice,
      deliveryPrice,
      foodPrice,
      snacksPrice,
      totalPrice,
      ecoPrice
    };
  };

  generateSnacksData = () => {
    const { activeItem, snacks, food } = this.state;
    activeItem.schedules = activeItem.schedules.map((schedule, index) => {
      return {
        ...schedule,
        snacksData:
          schedule.snacks.length &&
          schedule.snacks.map(snack => {
            return {
              id: snack,
              title: snacks[snack].name,
              price: snacks[snack].price,
              qty: schedule.snacksQty[snack],
              totalPrice: parseInt(snacks[snack].price) * parseInt(schedule.snacksQty[snack]),
              categoryId: snacks[snack].category.id,
              category: snacks[snack].category.title,
              description: snacks[snack].description
            };
          })
      };
    });
  };

  handleAddToCart = () => {
    let { id } = this.props.match.params;
    const { activeItem, snacks, food, ecoPack, area, address, pickup } = this.state;
    const index = getIndex(id);

    this.setState({ cartLoading: true });

    const dateStart = activeItem.schedules[0].date;
    const dateEnd = activeItem.schedules[activeItem.schedules.length - 1].date;
    const title = food.name;
    const slug = food.slug;
    this.generateSnacksData();
    const schedules = activeItem.schedules;

    const slimSundayPrice = activeItem.slimSunday ? 350000 : 0;
    let foodPrice = food.prices.filter(f => f.sort === activeItem.packageId)[0].price;
    foodPrice = activeItem.packageId === 2 ? foodPrice * schedules.length : foodPrice;
    const snacksPrice = schedules
      .filter(s => s.snacksData.length > 0)
      .reduce((accu, s) => (accu += s.snacksData.reduce((total, snack) => (total += parseInt(snack.totalPrice)), 0)), 0);

    let deliveryPrice = 0;
    if (pickup == "address" && address != "" && area != "") {
      deliveryPrice = activeItem.schedules
        .filter(s => s.pickup == "address")
        .reduce((accu, s) => {
          return (accu += areas.filter(area => area.name == s.area)[0].price);
        }, 0);
    }

    // CHANGE LATER
    //const ecoPrice = ecoPack ? 100000 : 0;
    const ecoPrice = 0;
    const totalPrice =
      parseInt(foodPrice) + parseInt(snacksPrice) + parseInt(slimSundayPrice) + parseInt(deliveryPrice) + parseInt(ecoPrice);

    let data = {
      ...activeItem,
      complete: true,
      weeks: 1,
      qty: 1,
      title,
      slug,
      dateStart,
      dateEnd,
      schedules,
      foodPrice,
      snacksPrice,
      deliveryPrice,
      ecoPrice,
      totalPrice
    };

    cartState.added[index] = data;
    // actually that's all ... no we're just showing popup
    // switch to server side cart, lets try
    let url = "";
    let postData = null;
    if (cartState.cartKey && cartState.cartKey != "") {
      // update
      url = "/api/cart/update";
      postData = { cartData: JSON.stringify(cartState.added), cartKey: cartState.cartKey };
    } else {
      url = "/api/cart/save";
      postData = { data: JSON.stringify(cartState.added) };
    }
    axios.post(url, postData).then(res => {
      const cartKey = res.data;
      cartState.cartKey = cartKey;
      this.setState({
        activeItem: { ...activeItem, complete: true },
        cartLoading: false,
        cartDialog: true
      });
      this.props.history.push("/checkout");
    });
  };

  toggleCartDialog = () => this.setState({ cartDialog: !this.state.cartDialog });
  toggleEcoPack = () => this.setState({ ecoPack: !this.state.ecoPack });
  changeSection = (e, index) => {
    const { activeIndex, pickup, address, area } = this.state;
    e.preventDefault();

    if (activeIndex == 0 && index == 1) {
      // from 1 to 2
      this.generateSnacksData();
    }

    if (activeIndex == 1 && index == 2) {
      // check if delivery address is entered
      if (pickup === "" || (pickup == "address" && (address == "" || area == ""))) {
        appToaster.show({
          message: "To proceed, please choose a pick-up station / delivery address and select a delivery area.",
          intent: Intent.WARNING
        });
        return false;
      }
    }

    if (activeIndex == 2 && index == 3) {
      // add to cart
      this.handleAddToCart();
    }
    this.setState({ activeIndex: index });
  };

  render() {
    const {
      food,
      saveStation,
      address,
      area,
      activeTab,
      activeDate,
      activeItem,
      lastTab,
      cartDialog,
      cartLoading,
      progress,
      snackOverlay,
      activeIndex,
      pickup,
      ecoPack,
      scheduleIndex
    } = this.state;
    const days = activeItem ? activeItem.schedules : null;
    const sitem = this.state.snacks;
    const selectedSnacks = activeItem ? days[activeTab].snacks : null;

    if (progress < 100) {
      return (
        <section className="top customize">
          <div className="loading">
            <Spinner intent="primary" large={true} />
          </div>
        </section>
      );
    }
    return (
      <React.Fragment>
        <Snacks itemKey={activeItem.key} open={snackOverlay} scheduleIndex={scheduleIndex} toggleWindow={this.toggleSnackOverlay} />
        <Prompt
          when={!activeItem.complete}
          message="This menu is incomplete. Leaving this page will delete this menu from your cart. Are you sure?"
        />
        <section className="top customize">
          {food && sitem && (
            <div className="container">
              <h1>Finalize your Order</h1>
              <p>You are almost done! Please finish the following steps:</p>
              <div className="order-nav">
                <ul>
                  <li className={activeIndex == 0 ? "active" : ""}>
                    <span className="order-nav--step">1</span>
                    <span className="order-nav--title">Pimp Your Menu</span>
                  </li>
                  <li className="bike-icon">
                    <img src="/images/icons/delivery.png" alt="" />
                  </li>
                  <li className={activeIndex == 1 ? "active" : ""}>
                    <span className="order-nav--step">2</span>
                    <span className="order-nav--title">Delivery Info</span>
                  </li>
                  <li className="bike-icon">
                    <img src="/images/icons/delivery.png" alt="" />
                  </li>
                  <li className={activeIndex == 2 ? "active" : ""}>
                    <span className="order-nav--step">3</span>
                    <span className="order-nav--title">Review</span>
                  </li>
                  <li className="bike-icon">
                    <img src="/images/icons/delivery.png" alt="" />
                  </li>
                  <li className={activeIndex == 3 ? "active" : ""}>
                    <span className="order-nav--step">4</span>
                    <span className="order-nav--title">Checkout</span>
                  </li>
                </ul>
              </div>

              <div className="customize--sections">
                <div className={`customize--section ${activeIndex == 0 ? "section-active" : ""}`}>
                  <p>Add some of our guilt-free snacks or healthy drinks to your meal plan</p>
                  <br />
                  {days.length && (
                    <div className="customize--tabs-body">
                      {days.map((day, index) => (
                        <div className="tab" key={index}>
                          <div className="customize--body">
                            <div className="customize--item">
                              <div className="calendar">
                                <div className="calendar--top">{day.dates.m}</div>
                                <div className="calendar--body">{day.dates.d}</div>
                                <div className="calendar--bottom">{day.dates.day}</div>
                              </div>
                              <span>
                                {food.name} / Day {index + 1}
                              </span>
                            </div>
                            {days[index].snacks &&
                              days[index].snacks.length > 0 &&
                              days[index].snacks.map((snack, sindex) => (
                                <div className="customize--item" key={sindex}>
                                  <div className="snacks-icons">
                                    {sitem[snack].gf == 1 && <img src="/images/icons/gf.png" alt="Gluten Free" title="Gluten Free" />}
                                    {sitem[snack].vegan == 1 && <img src="/images/icons/vegan.png" alt="Vegan" title="Vegan" />}
                                    {sitem[snack].raw == 1 && <img src="/images/icons/raw.png" alt="RAW" title="RAW" />}
                                    {sitem[snack].natural == 1 && (
                                      <img src="/images/icons/natural.png" alt="100% Natural" title="100% Natural" />
                                    )}
                                  </div>
                                  <a href="javascript:" title="" className="snacks-delete" onClick={e => this.removeSnack(e, snack, index)}>
                                    <i className="fal fa-times" />
                                  </a>
                                  <figure className="snack-picture">
                                    <div className="snack-picture--qty">
                                      <span>QTY</span>
                                      <NumericInput
                                        min={1}
                                        fill={false}
                                        onValueChange={(vnum, vstring) => this.updateSnackQty(vnum, vstring, snack, index)}
                                        value={days[index].snacksQty[snack]}
                                      />
                                    </div>
                                    <img src={`/images/snacks/${snack}.jpg`} alt="" />
                                  </figure>
                                  <span>{sitem && sitem[snack] && sitem[snack].name}</span>
                                  {sitem[snack].protein && <span className="opt">{days[activeTab].snackOptions[snack].protein}</span>}
                                  {sitem[snack].flavour && <span className="opt">{days[activeTab].snackOptions[snack].flavour}</span>}
                                </div>
                              ))}
                            <a href="javascript:" title="" className="customize--add-snacks" onClick={e => this.showSnacks(e, index)}>
                              <div className="blank">
                                <i className="far fa-2x fa-plus" />
                                <span>Add snacks</span>
                              </div>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <br />
                  <div className="customize--navs">
                    <a href="#" onClick={e => this.changeSection(e, 1)} title="" className="btn-next">
                      Continue <i className="fal fa-angle-right" />
                    </a>
                  </div>
                </div>

                <div className={`customize--section ${activeIndex == 1 ? "section-active" : ""}`}>
                  <p>
                    Your freshly cooked meals and snacks for the day will be delivered daily between 7:30 and 09:00 a.m. (Mon. - Sat.).
                    <br />
                    Please choose a pick-up station (self-collection) or a delivery address of your choice below.
                  </p>
                  <br />
                  <div className="customize--tabs-body">
                    <div className="customize--pickups-wrapper">
                      <div className="customize--station">
                        <h3>Choose Pickup Station</h3>
                        {station.stations.length > 0 &&
                          station
                            .availableStations()
                            .map((s, index) => (
                              <Radio
                                key={index}
                                className="radio"
                                label={<StationLabel station={s} />}
                                checked={pickup == s.id}
                                onChange={e => this.updateStation(e, s.id)}
                                value={s.id}
                              />
                            ))}
                      </div>
                      <div className="customize--or">OR</div>
                      <div className="customize--address">
                        <h3>Choose Delivery Address</h3>
                        <Radio
                          className="radio"
                          label="Your address of choice"
                          checked={pickup === "address"}
                          onChange={e => this.updateStation(e, "address")}
                          value="address"
                        />
                        <div className="address-box">
                          <textarea
                            rows="7"
                            placeholder="Enter your address here"
                            onChange={e => this.updateAddress(e, "address")}
                            value={address}
                            disabled={pickup !== "address"}
                          />
                          <label className="area">Select Area</label>
                          <div className="pt-select">
                            <select onChange={e => this.updateAddress(e, "area")} value={area} disabled={pickup !== "address"}>
                              <option value="">Select area</option>
                              {areas.map((area, aindex) => (
                                <option value={area.name} key={aindex}>
                                  {area.name}
                                  &nbsp;
                                  {area.price > 0 && "(" + parsePrice(area.price) + " IDR / day)"}
                                  {area.price <= 0 && "(Free)"}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="customize--eco">
                        <h3>Packaging</h3>
                        <p>
                          We are providing reusable containers for the meals, as we try to minimise any waste and be as environmentally friendly as we can. You’re responsible for returning the containers to our driver or to Motion cafe to Motion Fitness. If the container is not returned or it is damaged there is a 15.000 IDR replacement charge per container.
                        </p>
                        <label style={{display: 'none'}}>
                          <input type="checkbox" checked={ecoPack} onChange={this.toggleEcoPack} />
                          &nbsp; YES, I’d like to purchase the Eco Pack for 100,000 IDR
                        </label>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="customize--navs">
                    <a href="#" onClick={e => this.changeSection(e, 0)} title="" className="btn-prev">
                      <i className="fal fa-angle-left" /> Return
                    </a>
                    <a href="#" onClick={e => this.changeSection(e, 2)} title="" className="btn-next">
                      Continue <i className="fal fa-angle-right" />
                    </a>
                  </div>
                </div>

                <div className={`customize--section ${activeIndex == 2 ? "section-active" : ""}`}>
                  <p>Please review your order and feel free to edit details if necessary.</p>
                  <br />
                  {(pickup != "" || (pickup == "address" && address != "")) && (
                    <ReviewMeal
                      {...this.props}
                      days={days}
                      food={food}
                      snack={sitem}
                      addToCart={this.handleAddToCart}
                      parseStation={this.parseStation}
                      cartLoading={cartLoading}
                      changeSection={this.changeSection}
                      prices={this.calculateDetails()}
                    />
                  )}
                  <br />
                  <div className="customize--navs">
                    <a href="#" onClick={e => this.changeSection(e, 1)} title="" className="btn-prev">
                      <i className="fal fa-angle-left" /> Return
                    </a>
                    <a href="#" onClick={e => this.changeSection(e, 3)} title="" className="btn-next">
                      Continue <i className="fal fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!food && (
            <div className="loading">
              <Spinner intent="primary" large={true} />
            </div>
          )}
        </section>
      </React.Fragment>
    );
  }
}

export default view(Customize);
