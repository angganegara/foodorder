import React, { Component } from "react";
import { store, view } from "react-easy-state";
import { CSSTransition } from "react-transition-group";
import { Toaster, Popover, PopoverInteractionKind, Position, Intent, Spinner, Button } from "@blueprintjs/core";

const $ = require("jquery");

import { parsePrice, getIndex, getScheduleIndex } from "../helpers/cart";

import cartState from "../store";
import snacks from "../store/snacks";

import SnackDescription from "../components/SnackDescription";
import SnackOption from "../components/SnackOption";

const appToaster = Toaster.create({ position: Position.TOP_RIGHT });

class Snacks extends Component {
  state = {
    items: null,
    selected: [],
    index: null,
    scheduleIndex: null,
    activeIndex: 0
  };

  componentDidMount() {
    const index = getIndex(this.props.itemKey);
    axios.get("/api/items/categorize").then(res => {
      this.setState({
        items: res.data,
        index: index,
        scheduleIndex: this.props.scheduleIndex
      });
    });
  }

  componentDidUpdate(props) {
    if (this.props.scheduleIndex != props.scheduleIndex) {
      const index = getIndex(this.props.itemKey);
      this.setState({
        index: index,
        scheduleIndex: this.props.scheduleIndex
      });
    }
  }

  closeWindow = () => {
    this.props.toggleWindow();
    $("body").removeClass("ml-overlay-open");
  };

  handleClick = (e, id) => {
    const { index, scheduleIndex, items } = this.state;
    const category = items.filter(category => category.items.filter(item => item.id == id)[0])[0];
    const item = category.items.filter(item => item.id == id)[0];
    let snacks = cartState.added[index].schedules[scheduleIndex];

    if (item.protein && !this.isSnackOptionExist(id, "protein")) {
      // must select one of the options
      appToaster.show({ message: "Please select your preferred protein", intent: Intent.WARNING });
      return false;
    }

    if (item.flavour && !this.isSnackOptionExist(id, "flavour")) {
      // must select one of the options
      appToaster.show({ message: "Please select your preferred flavour", intent: Intent.WARNING });
      return false;
    }

    snacks.snacks.push(id);
    snacks.snacksQty[id] = 1;
  };

  updateSnackOption = (e, id, type) => {
    const { index, scheduleIndex } = this.state;
    let data = cartState.added[index].schedules[scheduleIndex];

    if (!data.hasOwnProperty("snackOptions")) {
      cartState.added[index].schedules[scheduleIndex].snackOptions = {};
    }

    cartState.added[index].schedules[scheduleIndex] = {
      ...cartState.added[index].schedules[scheduleIndex],
      snackOptions: {
        ...cartState.added[index].schedules[scheduleIndex].snackOptions,
        [id]: {
          ...cartState.added[index].schedules[scheduleIndex].snackOptions[id],
          [type]: e.target.value
        }
      }
    };
  };

  isSnackOptionExist = (id, type = null) => {
    const { index, scheduleIndex } = this.state;
    const data = cartState.added[index].schedules[scheduleIndex];
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

  removeSnack = (e, id) => {
    const { index, scheduleIndex } = this.state;

    if (this.isSnackOptionExist(id)) {
      delete cartState.added[index].schedules[scheduleIndex].snackOptions[id];
    }

    let selectedSnacks = [...cartState.added[index].schedules[scheduleIndex].snacks];
    const snackIndex = selectedSnacks.indexOf(id);
    selectedSnacks.splice(snackIndex, 1);
    cartState.added[index].schedules[scheduleIndex].snacks = selectedSnacks;
  };

  snackIsAdded = id => {
    const { index, scheduleIndex } = this.state;

    if (cartState.added[index].schedules[scheduleIndex]) {
      return cartState.added[index].schedules[scheduleIndex].snacks.filter(snackId => snackId === id).length;
    }
    return 0;
  };

  toggleCard = (e, id) => $(`.snack-description.snack-${id}`).toggleClass("active");
  gotoHeading = (e, id, index) => {
    const target = $(`#snack-${id}`).offset().top - 75;
    const currentScrollPos = $(".snacks-inner").scrollTop();
    const nextPos = target + currentScrollPos;
    $(".snacks-inner").animate({ scrollTop: nextPos }, 500);
    this.setState({ activeIndex: index });
  };

  render() {
    const { open, date } = this.props;
    const { items, activeIndex, index, scheduleIndex } = this.state;

    return (
      <div className={`${open ? "active" : ""} snacks-overlay`}>
        <a href="javascript:" title="" className="snacks-close-button" onClick={this.closeWindow}>
          <i className="fal fa-times" />
        </a>
        <div className="snacks-menu">
          <ul>
            {items &&
              items.map((category, i) => (
                <li key={i}>
                  <a
                    href="javascript:"
                    className={i === activeIndex ? "active" : ""}
                    title=""
                    onClick={e => this.gotoHeading(e, category.id, i)}
                  >
                    {category.title}
                  </a>
                </li>
              ))}
          </ul>
        </div>
        <div className="snacks-inner">
          {items &&
            items.map((category, i) => (
              <div className="snacks-category" key={i}>
                <h2 id={`snack-${category.id}`}>{category.title}</h2>
                <div className="snacks-cards">
                  {category.items.map((item, i) => (
                    <div className="snacks-card" key={i}>
                      <div className="snacks-icons">
                        {item.gf == 1 && <img src="/images/icons/gf.png" alt="Gluten Free" title="Gluten Free" />}
                        {item.vegan == 1 && <img src="/images/icons/vegan.png" alt="Vegan" title="Vegan" />}
                        {item.raw == 1 && <img src="/images/icons/raw.png" alt="RAW" title="RAW" />}
                        {item.natural == 1 && <img src="/images/icons/natural.png" alt="100% Natural" title="100% Natural" />}
                      </div>
                      <SnackDescription
                        className={`snack-${item.id}`}
                        title={item.name}
                        description={item.description}
                        toggleCard={e => this.toggleCard(e, item.id)}
                      />
                      <figure>
                        <a href="javascript:" title="" onClick={e => this.toggleCard(e, item.id)}>
                          <img src={`/images/snacks/${item.id}.jpg`} alt="" />
                        </a>
                      </figure>
                      <div className="snacks-card--details">
                        {(item.protein || item.flavour) && (
                          <CSSTransition in={this.snackIsAdded(item.id) <= 0} timeout={200} classNames="fade-" unmountOnExit>
                            {state => (
                              <Popover
                                interactionKind={PopoverInteractionKind.CLICK}
                                position={Position.TOP}
                                content={
                                  <SnackOption
                                    id={item.id}
                                    item={item}
                                    handleClick={this.handleClick}
                                    updateSnackOption={this.updateSnackOption}
                                    index={index}
                                    scheduleIndex={scheduleIndex}
                                  />
                                }
                                className="quick-add"
                              >
                                <a href="javascript:" title="">
                                  <i className="fal fa-plus" />
                                </a>
                              </Popover>
                            )}
                          </CSSTransition>
                        )}
                        {!item.protein && !item.flavour && (
                          <CSSTransition in={this.snackIsAdded(item.id) <= 0} timeout={200} classNames="fade-" unmountOnExit>
                            {state => (
                              <a href="javascript:" title="" className="quick-add" onClick={e => this.handleClick(e, item.id)}>
                                <i className="fal fa-plus" />
                              </a>
                            )}
                          </CSSTransition>
                        )}
                        <CSSTransition in={this.snackIsAdded(item.id) > 0} timeout={200} classNames="fade-" unmountOnExit>
                          {state => (
                            <a href="javascript:" title="" className="quick-add delete" onClick={e => this.removeSnack(e, item.id)}>
                              <i className="fal fa-times" />
                            </a>
                          )}
                        </CSSTransition>
                        <div className="snacks-card--price">IDR {parsePrice(item.price)}</div>
                        <div className="snacks-card--name">
                          <a href="javascript:" title="" onClick={e => this.toggleCard(e, item.id)}>
                            {item.name} <i className="far fa-exclamation-circle" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          {!items && (
            <div className="loading loading-fullh">
              <Spinner intent="primary" large={true} />
            </div>
          )}
        </div>
        <div className="snacks-close" onClick={this.closeWindow} />
      </div>
    );
  }
}

export default view(Snacks);
