import React, { Component } from "react";
import { view } from "react-easy-state";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { Alert, Overlay, Spinner, Toaster, Intent, Position, Radio, Switch, Popover, Tag, PopoverInteractionKind } from "@blueprintjs/core";
import { DatePicker } from "@blueprintjs/datetime";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

const $ = require("jquery");

// helpers
import { checkDayLimit } from "../helpers/dates";
import { scrollTop } from "../helpers/utils";
import { guid, parsePrice } from "../helpers/cart";

// store
import cartState from "../store";
import snackState from "../store/snacks";

// components
import HowItWorks from "../components/HowItWorks";
import SlimSundayPopover from "../components/SlimSundayPopover";
import ExampleMenu from "../components/ExampleMenu";
import RecommendedSnacks from "../components/RecommendedSnacks";
import LongPeriod from "./LongPeriod";
import AvailableOptions from "../components/AvailableOptions";

const appToaster = Toaster.create({ position: Position.TOP_RIGHT });
let today = new Date();

const isDisabled = date => date.getDay() === 0 || checkDayLimit(date);

const foodCodes = {
  VG: "Vegetarian",
  V: "Vegan",
  DF: "Dairy-free",
  GF: "Gluten-free"
};

class Details extends Component {
  state = {
    mounted: false,
    food: null,
    overlay: false,
    alertOpen: false,
    LPOpen: false,
    skipAlert: false,
    daysAmount: 0,
    duration: 0,
    cells: [],
    form: {
      packageId: 1,
      slimSunday: false,
      startDate: null,
      endDate: null
    }
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.loadFood(id);
    scrollTop();
    $(document).on("click", ".DayPicker-NavButton--next, .DayPicker-NavButton--prev", this.resetSelectedDate);
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
    $(document).off("click", ".DayPicker-NavButton--next, .DayPicker-NavButton--prev", this.resetSelectedDate);
  }

  redrawDateRange = () => {
    const { cells } = this.state;
    if (cells.length > 0) {
      setTimeout(() => {
        $('[range="true"]')
          .removeClass("dates-range dates-range-finish dates-range-start dates-range-sunday")
          .attr("range", false);
        $(".DayPicker-Day.DayPicker-Day--selected").removeClass("DayPicker-Day--selected");
      }, 50);
      setTimeout(() => {
        cells.map(cell => {
          let el = $('.DayPicker-Day[aria-label="' + cell.key + '"]');
          console.log("trying to add $('.DayPicker-Day[aria-label=\"" + cell.key + "\"]') with class " + cell.cssClass);
          el.addClass(cell.cssClass).attr("range", "true");
        });
      }, 100);
    }
    // otherwise, silent
  };

  loadFood = id => {
    axios
      .get(`/api/foods/${id}`)
      .then(res => this.setState({ food: res.data, mounted: true }))
      .catch(err => {
        appToaster.show({
          message: "Cannot load this page. Redirecting you back to home page.",
          intent: Intent.DANGER
        });
        setTimeout(() => this.props.history.push("/"), 3000);
      });
  };

  updatePackage = (e, id) => {
    if (this.state.form.startDate) {
      this.resetSelectedDate();
    }
    let slimSunday = this.state.form.slimSunday;
    if (id == 2 && this.state.form.slimSunday) {
      slimSunday = !slimSunday;
    }
    this.setState({
      ...this.state,
      form: {
        ...this.state.form,
        packageId: id,
        startDate: null,
        slimSunday: slimSunday
      }
    });
  };

  // needs to refactor later
  getItem = id => cartState.added.filter(item => item.key === id);
  isExist = id => this.getItem(id).length > 0;

  addtoCart = () => {
    let { id } = this.props.match.params;
    const { skipAlert, duration } = this.state;
    const { packageId, slimSunday, startDate } = this.state.form;

    if (!startDate) {
      appToaster.show({
        message: "Please select the delivery starting date",
        intent: Intent.DANGER
      });
      return false;
    }

    let item = this.getItem(id);
    let ls = window.sessionStorage;

    if (this.isExist(id) && !skipAlert) {
      this.setState({ alertOpen: true });
      return false;
    }

    const range = moment.rangeFromInterval("days", duration, startDate);
    const key = guid();
    let daysData = [];
    for (let days of range.by("days")) {
      // skip sunday if any
      if (days.format("d") != "0") {
        daysData.push({
          label: days.format("ddd, MMM DD"),
          date: days.format("YYYY-MM-DD"),
          isSaturday: days.format("d") == "6",
          pickup: null,
          address: null,
          area: "",
          snacks: [],
          snacksQty: {}
        });
      }
    }

    let data = {
      key,
      id,
      packageId,
      duration: daysData.length,
      slimSunday,
      schedules: daysData,
      complete: false
    };

    if (!item.length) {
      cartState.added = [...cartState.added, data];
    } else {
      // sudah ada
      const index = cartState.added.findIndex(item => item.key === id);
      let added = [...cartState.added];
      added[index] = data;
      cartState.added = added;
    }

    // then go to customize-cart
    this.props.history.push(`/customize-cart/${key}`);
  };

  resetSelectedDate = () => {
    this.setState({
      ...this.state,
      form: { ...this.state.form, startDate: null }
    });
    setTimeout(() => {
      $('[range="true"]')
        .removeClass("dates-range dates-range-finish dates-range-start dates-range-sunday")
        .attr("range", false);
      $(".DayPicker-Day.DayPicker-Day--selected").removeClass("DayPicker--Day-selected");
    }, 50);
  };

  handleDaysAmount = e => {
    this.resetSelectedDate();
    const day = e.target.value <= 0 ? 1 : e.target.value;
    this.setState({ daysAmount: parseInt(day) });
  };

  handleDayClick = day => {
    const { packageId, slimSunday } = this.state.form;
    const { daysAmount } = this.state;

    let startDate = new Date(day);
    let cloneDate = new Date(startDate.getTime());
    let currentDay = day.getDay();
    let duration;
    if (packageId == 1) {
      duration = currentDay == 1 ? 5 : 6;
    } else {
      duration = daysAmount - 1;
      if (
        (currentDay === 1 && daysAmount > 6) ||
        (currentDay === 2 && daysAmount > 5) ||
        (currentDay === 3 && daysAmount > 4) ||
        (currentDay === 4 && daysAmount > 3) ||
        (currentDay === 5 && daysAmount > 2) ||
        (currentDay === 6 && daysAmount > 1)
      ) {
        duration = duration + 1;
      }
    }
    cloneDate.setHours(24 * duration);

    this.setState({
      ...this.state,
      duration: duration,
      form: { ...this.state.form, startDate: day, endDate: cloneDate }
    });

    setTimeout(() => {
      $('[range="true"]')
        .removeClass("dates-range dates-range-finish dates-range-start dates-range-sunday")
        .attr("range", false);
      const isMon = day.getDay() == 1 ? 1 : 0;
      //let duration = packageId == 1 ? 5 : daysAmount - 1;
      //duration = !isMon && duration == 5 ? 6 : duration;

      const startDate = moment(day);
      const endDate = moment(day).add(duration, "d");
      let dateRange = moment().range(startDate, endDate);
      let diff = dateRange.diff("days");
      let dateArr = Array.from(dateRange.by("days"));
      let cssClass;
      let saturday = false;

      if (dateArr.length > 1) {
        dateArr.map((date, i) => {
          let d = moment(date);
          let day = d.format("d");
          let ariaFormat = d.format("ddd MMM DD YYYY");
          let el = $('.DayPicker-Day[aria-label="' + ariaFormat + '"]');
          if (day == "6") {
            saturday = true;
          }

          if (i == 0) {
            cssClass = "dates-range dates-range-start";
          } else {
            if (day == "0") {
              cssClass = "dates-range-sunday";
            }
            if (day != "0") {
              cssClass = "dates-range";
            }
            if (i == diff) {
              cssClass = "dates-range dates-range-finish";
            }
          }

          el.addClass(cssClass).attr("range", "true");
        });
      }

      if (slimSunday && !saturday) {
        this.toggleSlimSunday();
      }
    }, 50);
  };

  parseDate = date => moment(date).format("ddd, MMM DD, YYYY");
  toggleOverlay = () => this.setState({ overlay: !this.state.overlay });
  toggleLPOpen = () => this.setState({ LPOpen: !this.state.LPOpen });
  toggleSlimSunday = () => {
    const hasSaturday = this.hasSaturday();
    let slimSunday;
    if (!hasSaturday) {
      slimSunday = false;
      appToaster.show({
        message: "Please include Saturday in order to add Slim Sunday",
        intent: Intent.DANGER
      });
    } else {
      slimSunday = !this.state.form.slimSunday;
    }
    this.setState({
      ...this.state,
      form: { ...this.state.form, slimSunday: slimSunday }
    });
  };
  cancelCart = () => this.setState({ alertOpen: false });
  skipAlert = () => {
    this.setState({ alertOpen: false, skipAlert: true }, () => {
      this.addtoCart();
    });
  };
  hasSaturday = () => {
    let { startDate, endDate } = this.state.form;
    if (!startDate) {
      return true;
    }
    endDate = moment(endDate).add(1, "d");
    let dateRange = moment().range(startDate, endDate);
    let dateArr = Array.from(dateRange.by("days"));
    if (dateArr.length > 1) {
      let saturday = false;
      dateArr.map((date, i) => {
        let d = moment(date);
        let day = d.format("d");
        if (day == "6") {
          saturday = true;
        }
      });
      return saturday;
    }

    return false;
  };
  showSlimSundayWarning = () => {
    appToaster.show({
      message: "Please include Saturday in order to add Slim Sunday",
      intent: Intent.DANGER
    });
  };
  showFoodIcons = iconCodes => {
    const codes = iconCodes.split(", ");
    return codes.map(code => {
      return (
        <Popover key={code} interactionKind={PopoverInteractionKind.HOVER} position={Position.TOP}>
          <img src={`/images/icons/${code}.png`} alt={foodCodes[code]} title={foodCodes[code]} />
          <div>{foodCodes[code]}</div>
        </Popover>
      );
    });
  };

  render() {
    const { food, form, alertOpen, daysAmount, LPOpen } = this.state;
    const modifiers = { isDisabled };

    return (
      <React.Fragment>
        <section className="top details">
          <Overlay isOpen={LPOpen} onClose={this.toggleLPOpen}>
            <LongPeriod food={food} closePopup={this.toggleLPOpen} />
          </Overlay>
          <Overlay isOpen={this.state.overlay} onClose={this.toggleOverlay}>
            <section className="home hiw">
              <HowItWorks autoOpen={true} closeButton={true} toggleOverlay={this.toggleOverlay} />
            </section>
          </Overlay>
          {food && (
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-md-2">
                  <Link to="/" title="" className="details--return">
                    <i className="fa fa-fw fa-long-arrow-alt-left" /> Home
                  </Link>
                </div>
                <div className="col-xs-12 col-md-6">
                  <h1 className="details--title">
                    <span>{food.name}</span>
                    {food.standard_symbols && <span className="details--icons">{this.showFoodIcons(food.standard_symbols)}</span>}
                  </h1>
                  <div className="details--short-description" dangerouslySetInnerHTML={{ __html: food.short_description }} />
                  <div className="details--description" dangerouslySetInnerHTML={{ __html: food.description }} />
                  {food.example_menu && <ExampleMenu menu={food.example_menu} />}
                  {food.recommended_snack && snackState.items && <RecommendedSnacks snacks={JSON.parse(food.recommended_snack)} />}
                </div>
                <div className="col-xs-12 col-md-4">
                  <div className="details--price-box">
                    {food.prices.length &&
                      food.prices.map((price, index) => (
                        <React.Fragment key={index}>
                          <div className="details--price">
                            <span>
                              <Radio
                                label={price.name}
                                checked={form.packageId === price.sort}
                                onChange={e => this.updatePackage(e, price.sort)}
                                value={price.id}
                              />
                            </span>
                            <span>{parsePrice(price.price)} IDR</span>
                          </div>
                          {price.sort === 2 && (
                            <CSSTransition in={price.sort === 2 && form.packageId === 2} timeout={200} classNames="fade-" unmountOnExit>
                              {state => (
                                <div className="details--select-amount">
                                  <select value={daysAmount} onChange={this.handleDaysAmount}>
                                    <option value={0}>select amount of days</option>
                                    <option value={1}>1 day</option>
                                    <option value={2}>2 days</option>
                                    <option value={3}>3 days</option>
                                    <option value={4}>4 days</option>
                                    <option value={5}>5 days</option>
                                  </select>
                                </div>
                              )}
                            </CSSTransition>
                          )}
                        </React.Fragment>
                      ))}
                    <div className="details--price">
                      <span>
                        <Popover interactionKind={PopoverInteractionKind.HOVER} position={Position.TOP}>
                          <Switch checked={form.slimSunday} onChange={this.toggleSlimSunday} label="Add Slim Sunday?" />
                          <SlimSundayPopover />
                        </Popover>
                      </span>
                      <span>
                        <b>300,000 IDR</b>
                      </span>
                    </div>
                    <div className="details--calendar">
                      <CSSTransition in={form.packageId === 2 && daysAmount <= 0} timeout={200} classNames="fade-flat" unmountOnExit>
                        <div className="calendar-warning">Please select amount of days first.</div>
                      </CSSTransition>
                      <p>
                        <strong>Delivery Starting Date</strong>
                      </p>
                      <DatePicker
                        month={new Date(2018, 12)}
                        fromMonth={new Date(2018, 12)}
                        toMonth={new Date(2019, 12)}
                        onChange={this.handleDayClick}
                        modifiers={modifiers}
                        minDate={today}
                        maxDate={new Date(2020, 12)}
                        value={this.state.form.startDate}
                      />
                      {form.startDate && (
                        <div className="delivery-dates-range">
                          <Tag intent={Intent.PRIMARY}>{this.parseDate(form.startDate)}</Tag>
                          &nbsp;
                          <i className="far fa-arrow-right" />
                          &nbsp;
                          <Tag intent={Intent.PRIMARY}>{this.parseDate(form.endDate)}</Tag>
                        </div>
                      )}
                    </div>
                  </div>
                  <a href="javascript:" title="" onClick={this.addtoCart} className="details--add-to-cart">
                    Continue <i className="fal fa-fw fa-arrow-right" />
                  </a>
                  <Alert
                    cancelButtonText="No, thanks"
                    onCancel={this.cancelCart}
                    confirmButtonText="Add to cart"
                    onConfirm={this.skipAlert}
                    icon="Issue"
                    intent={Intent.PRIMARY}
                    isOpen={alertOpen}
                  >
                    <p>You already have this item in your cart. Do you want to add it anyway?</p>
                  </Alert>
                  <div className="info">
                    <a href="javascript:" title="" className="btn-normal" onClick={this.toggleOverlay}>
                      <i className="fal fa-fw fa-question-circle" /> How it works
                    </a>
                    <a href="javascript:" title="" className="btn-normal main-color" onClick={this.toggleLPOpen}>
                      <i className="fal fa-fw fa-question-circle" /> Long-period Order
                    </a>
                  </div>
                  {food.available_symbols && <AvailableOptions icons={this.showFoodIcons(food.available_symbols)} />}
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
        <section className="details">
          <div className="details--pictures">
            {food &&
              food.pictures &&
              Object.values(food.pictures).map((picture, index) => (
                <div key={index}>
                  <img src={`/images/foods/${picture}`} alt="" />
                </div>
              ))}
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default view(Details);
