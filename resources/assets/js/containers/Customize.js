import React, { Component } from 'react';
import { view } from 'react-easy-state';
import { Prompt } from 'react-router';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import {
  Dialog,
  Overlay,
  Button,
  Spinner,
  Toaster,
  Intent,
  Position,
  Checkbox,
  Radio,
  Popover,
  PopoverInteractionKind
} from '@blueprintjs/core';
const $ = require('jquery');

// helpers
import {
  parsePrice,
  getIndex,
  getScheduleIndex
} from '../helpers/cart';

// store
import cartState from '../store';
import snacks from '../store/snacks';
import station from '../store/station';

import Snacks from './Snacks';
import ReviewMeal from '../components/ReviewMeal';

const appToaster = Toaster.create({ position: Position.TOP_RIGHT });
const moment = extendMoment(Moment);

class Customize extends Component
{
  state = {
    food: null,
    stateIndex: 0,
    lastTab: false,
    activeTab: 0,
    activeDate: null,
    activeItem: null,
    saveStation: false,
    address: '',
    days: [],
    snacks: [],
    pageLoading: false,
    cartDialog: false,
    cartLoading: false,
    snackOverlay: false,
    progress: 0
  }

  componentDidMount() {
    let { id } = this.props.match.params;

    if (!id) {
      appToaster.show({ message: 'Error loading this page. Redirecting you back to home page.', intent: Intent.DANGER });
      setTimeout(() => this.props.history.push('/'), 2000);
    }

    if (!this.isExist(id)) {
      appToaster.show({ message: 'Item is not in your cart. Redirecting you back to home page.', intent: Intent.DANGER });
      setTimeout(() => this.props.history.push('/'), 2000);
    }

    const index = getIndex(id);
    this.setState({ activeItem: cartState.added[index], stateIndex: index, activeDate: cartState.added[index].schedules[0].date }, () => {
      this.loadFood(cartState.added[index].id);
      this.loadSnacks();
    });
  }

  componentWillUnmount() {
    const { id } = this.props.match.params;
    const index = getIndex(id);
    if (!cartState.added[index].complete) {
      cartState.added.splice(index, 1);
    }
  }

  getItem = id => cartState.added.filter(item => item.key === id)
  isExist = id => this.getItem(id).length

  syncCartState = () => {
    const { stateIndex, activeItem } = this.state;
    cartState.added[stateIndex] = activeItem;
  }

  loadFood = id => {
    axios
      .get(`/api/foods/${id}`)
      .then(res => this.setState({ food: res.data }))
      .then(() => this.setState({ progress: this.state.progress + 50 }))
  }

  loadSnacks = () => {
    axios
      .get('/api/items')
      .then(res => this.setState({ snacks: res.data }))
      .then(() => this.setState({ progress: this.state.progress + 50 }))
  }

  updateStation = (e, day, value) => {
    const { activeItem, activeTab, stateIndex, saveStation } = this.state;
    if (saveStation && activeTab === 0) {
      const newStation = activeItem.schedules.map(schedule => {
        return {...schedule, pickup: value }
      });
      // update all arrays
      this.setState({ ...this.state, activeItem: { ...activeItem, schedules: newStation } })
    } else {
      let newSchedule = [...activeItem.schedules];
      newSchedule[activeTab] = {...activeItem.schedules[activeTab], pickup: value};
      this.setState({ ...this.state, activeItem: { ...activeItem, schedules: newSchedule } });
    }
  }

  updateAddress = (e, day) => {
    const { activeItem, activeTab, saveAddress } = this.state;
    activeItem.schedules[activeTab] = {...activeItem.schedules[activeTab], address: e.target.value};
    this.setState({
      ...this.state,
      activeItem: { ...activeItem },
      address: e.target.value
    }, () => {
      this.syncCartState();
    });
  }

  saveStation = (e) => {
    const { activeItem, activeTab } = this.state;
    const saveStation = ! this.state.saveStation;
    if (saveStation) {
      const newStation = activeItem.schedules.map(schedule => {
        return {...schedule, address: activeItem.schedules[0].address, pickup: activeItem.schedules[0].pickup }
      });
      // update all arrays
      this.setState({
        saveStation,
        activeItem: {...activeItem, schedules: newStation}
      }, () => this.syncCartState())
    } else {
      this.setState({ saveStation })
    }
  }

  removeSnack = (e, snackId) => {
    const { activeItem, activeTab } = this.state;
    // copy the whole arrays rather than directly update the array
    let selectedSnacks = [...activeItem.schedules];
    const snackIndex = selectedSnacks[activeTab].snacks.indexOf(snackId);
    selectedSnacks[activeTab].snacks.splice(snackIndex, 1);
  }

  showSnacks = () => {
    const { activeItem } = this.state;
    // set active date & toggle overlay
    this.setState({ snackOverlay: true });
    $('body').addClass('pt-overlay-open');
  }

  toggleSnackOverlay = () => this.setState({ snackOverlay: false })

  showPageLoading = () => {
    this.setState({ pageLoading: true }, () => {
      setTimeout(() => this.setState({ pageLoading: false }), 200);
    });
  }

  changeTab = (e, index) => {
    const { activeTab, activeItem, lastTab } = this.state;
    if (lastTab) {
      this.setState({ activeTab: index, lastTab: false, activeDate: activeItem.schedules[index].date });
      this.showPageLoading();
    }
    if (index < activeTab) {
      this.setState({ activeTab: index, activeDate: activeItem.schedules[index].date });
      this.showPageLoading();
    }
  }

  scrollTop = () => { $('html, body').animate({scrollTop: 0}, 500); }
  nextTab = (e) => {
    const { activeTab, activeItem } = this.state;
    const nextIndex = parseInt(activeTab) + 1;
    if (activeItem.schedules[activeTab].pickup === null) {
      appToaster.show({ message: 'Please select your pickup station.', intent: Intent.WARNING });
      return false;
    }
    if (activeItem.schedules[nextIndex]) {
      // is the address selected?
      this.setState({ activeTab: nextIndex, activeDate: activeItem.schedules[nextIndex].date });
      this.showPageLoading();
      this.scrollTop();
    } else {
      // we're at the last tab
      this.setState({ lastTab: true });
      this.showPageLoading();
    }
  }

  prevTab = () => {
    const { activeTab, activeItem, lastTab } = this.state;
    const prevIndex = lastTab ? activeTab : (parseInt(activeTab) - 1);
    if (activeTab > 0) {
      this.setState({ activeTab: prevIndex, lastTab: false, activeDate: activeItem.schedules[prevIndex].date });
      this.showPageLoading();
      this.scrollTop();
    }
  }

  parseStation = (type, index) => {
    switch (type) {
      case 'address':
        return this.state.activeItem.schedules[index].address;
        break;
      default:
        return station.stations.filter(s => s.id === type)[0].station;
        break;
    }
  }

  handleAddToCart = () => {
    let { id } = this.props.match.params;
    const { activeItem, snacks, food } = this.state;
    const index = getIndex(id);

    this.setState({ cartLoading: true });

    const dateStart = activeItem.schedules[0].date;
    const dateEnd = activeItem.schedules[activeItem.schedules.length-1].date;
    const title = food.name;
    const slug = food.slug;
    const schedules = activeItem.schedules.map((schedule, index) => {
      return {
        ...schedule,
        snacksData: schedule.snacks.length && schedule.snacks.map(snack => {
          return {
            id: snack,
            title: snacks[snack].name,
            price: snacks[snack].price,
            categoryId: snacks[snack].category.id,
            category: snacks[snack].category.title,
            description: snacks[snack].description
          }
        })
      }
    });

    const slimSundayPrice = activeItem.slimSunday ? 300000 : 0;
    const foodPrice = food.prices.filter(f => f.sort === activeItem.packageId)[0].price;
    const snacksPrice = schedules
      .filter(s => s.snacksData.length > 0)
      .reduce((accu, s) => accu += s.snacksData.reduce((total, snack) => total += snack.price, 0), 0);

    const totalPrice = foodPrice + snacksPrice + slimSundayPrice;

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
      totalPrice
    }

    cartState.added[index] = data;
    // actually that's all ... no we're just showing popup
    this.setState({ activeItem: { ...activeItem, complete: true }, cartLoading: false, cartDialog: true })
  }

  toggleCartDialog = () => this.setState({ cartDialog: ! this.state.cartDialog })
  returnToHomepage = () => this.props.history.push('/')
  goToCheckout = () => this.props.history.push('/checkout')

  render() {
    const { food, saveStation, address, activeTab, activeDate, activeItem, lastTab, cartDialog, cartLoading, progress, snackOverlay } = this.state;
    const days = activeItem ? activeItem.schedules : null;
    const sitem = this.state.snacks;
    const selectedSnacks = activeItem ? days[activeTab].snacks : null;

    if (progress < 100) {
      return (
        <section className="top customize">
          <div className="loading"><Spinner intent="primary" large={true} /></div>
        </section>
      );
    }
    return (
      <React.Fragment>
        <Snacks
          itemKey={activeItem.key}
          open={snackOverlay}
          date={activeDate}
          toggleWindow={this.toggleSnackOverlay}
        />
        <Prompt
          when={!activeItem.complete}
          message="This menu is incomplete. Leaving this page will delete this menu from your cart. Are you sure?"
        />
        <section className="top customize">
          {food && (
            <Dialog
              icon="Tick"
              isOpen={cartDialog}
              onClose={this.toggleCartDialog}
              title="Cart updated"
              canEscapeKeyClose={false}
              canOutsideClickClose={false}
            >
              <div className="pt-dialog-body">
                <p>You have successfully add <strong>{food.name}</strong> to your cart.</p>
                <p>Do you want to go to checkout page?</p>
              </div>
              <div className="pt-dialog-footer">
                <div className="pt-dialog-footer-actions">
                  <Button
                    onClick={this.returnToHomepage}
                    text="No, return to homepage"
                  />
                  <Button
                    intent={Intent.PRIMARY}
                    onClick={this.goToCheckout}
                    text="Yes, go to Checkout page"
                  />
                </div>
              </div>
            </Dialog>
          )}
          {food && sitem && (
            <div className="container">
              <h1>Customize your Order</h1>
              <p>Select your pick-up station, snacks & drinks for each day</p>
              <br />
              {days.length && (
                <React.Fragment>
                  <ul className="customize--tabs-wrapper">
                    {days.map((day, index) => (
                      <li className={(index === activeTab) && !lastTab ? 'tab-active' : ''} key={index}>
                        <a href="javascript:" title="" onClick={(e) => this.changeTab(e, index)}>
                          <div className="tab-title">Day {index+1}</div>
                          <div className="tab-date">{day.label}</div>
                        </a>
                      </li>
                    ))}
                    <li className={lastTab ? 'tab-active' : ''}>
                      <a href="javascript:" title="">
                        <div className="tab-title">Finish</div>
                        <div className="tab-date">Review</div>
                      </a>
                    </li>
                  </ul>
                  {lastTab && (
                    <ReviewMeal
                      {...this.props}
                      days={days}
                      food={food}
                      snack={sitem}
                      addToCart={this.handleAddToCart}
                      parseStation={this.parseStation}
                      cartLoading={cartLoading}
                    />
                  )}
                  <div className={lastTab ? 'customize--tabs-body last-tab' : 'customize--tabs-body'}>
                    <CSSTransition
                      in={this.state.pageLoading}
                      timeout={200}
                      classNames="hiw-"
                      unmountOnExit
                    >
                      {state => <div className="page-loading"><div className="loading"><Spinner intent="primary" large={true} /></div></div>}
                    </CSSTransition>
                    {days.map((day, index) => (
                      <div className={`tab ${index === activeTab ? 'tab-active' : ''} ${this.state.pageLoading ? 'tab-transition' : ''}`} key={index}>
                        <div className="customize--body">
                          <div className="customize--item">
                            <figure><img src={`/images/foods/thumb_${food.id}.jpg`} alt={food.name} /></figure>
                            <span>{food.name}</span>
                          </div>
                          {selectedSnacks && selectedSnacks.length > 0 && selectedSnacks.map((snack, index) => (
                            <div className="customize--item" key={index}>
                              <a href="javascript:" title="" className="snacks-delete" onClick={(e) => this.removeSnack(e, snack)}><i className="fal fa-times"></i></a>
                              <figure><img src={`/images/snacks/${snack}.jpg`} alt="" /></figure>
                              <span>{sitem && sitem[snack] && (sitem[snack].name)}</span>
                            </div>
                          ))}
                          <a href="javascript:" title="" className="customize--add-snacks" onClick={this.showSnacks}>
                            <div className="blank"><i className="fa fa-2x fa-plus"></i></div>
                            <span>Add snacks</span>
                          </a>
                        </div>
                        <div className="customize--pickup-body">
                          <div className="customize--pickup-body-left">
                            <h2>pickup station</h2>
                            {station.stations.length > 0 && station.availableStations().map((s, index) => (
                              <Radio key={index} className="radio" label={s.station} checked={day.pickup === s.id} onChange={(e) => this.updateStation(e, day, s.id)} value={s.id} />
                            ))}
                            <Radio className="radio" label="Your address of choice" checked={day.pickup === 'address'} onChange={(e) => this.updateStation(e, day, 'address')} value="address" />
                            {day.pickup === 'address' && (
                              <textarea rows="7" placeholder="Enter your address here" onChange={(e) => this.updateAddress(e, day)} value={day.address ? day.address : address}></textarea>
                            )}
                            {index === 0 && day.pickup && <Checkbox checked={saveStation} label="Save selection for the next day?" onClick={(e) => this.saveStation(e)} />}
                          </div>
                          <div className="customize--next">
                            {activeTab > 0 && <a href="javascript:" className="btn" onClick={this.prevTab}><i className="fal fa-angle-left"></i> PREVIOUS DAY</a>}
                            &nbsp;
                            <a href="javascript:" className="btn" onClick={this.nextTab}>NEXT DAY<i className="fa fa-fw fa-angle-right"></i></a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              )}
            </div>
          )}
          {!food && <div className="loading"><Spinner intent="primary" large={true} /></div>}
        </section>
      </React.Fragment>
    );
  }
}

export default view(Customize);
