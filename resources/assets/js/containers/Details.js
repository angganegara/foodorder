import React, { Component } from 'react';
import { store, view } from 'react-easy-state';
import { Link } from 'react-router-dom';
import {
  Alert,
  Overlay,
  Spinner,
  Toaster,
  Intent,
  Position,
  Checkbox,
  Radio,
  Switch,
  Popover,
  PopoverInteractionKind
} from '@blueprintjs/core';
import { DatePicker } from '@blueprintjs/datetime';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

const $ = require('jquery');

// helpers
import { checkDayLimit } from '../helpers/dates';
import { scrollTop } from '../helpers/utils';
import { guid, parsePrice } from '../helpers/cart';

// store
import cartState from '../store';
import snackState from '../store/snacks';

// components
import HowItWorks from '../components/HowItWorks';
import SlimSundayPopover from '../components/SlimSundayPopover';
import ExampleMenu from '../components/ExampleMenu';
import RecommendedSnacks from '../components/RecommendedSnacks';

const appToaster = Toaster.create({ position: Position.TOP_RIGHT });
let today = new Date();

const isDisabled = date => {
  if (
    (date.getDay() === 0) ||
    checkDayLimit(date)
  ) {
    return true;
  }
  return false;
}

class Details extends Component
{
  state = {
    mounted: false,
    food: null,
    overlay: false,
    alertOpen: false,
    skipAlert: false,
    form: {
      packageId: 1,
      slimSunday: false,
      startDate: null
    }
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.loadFood(id);
    scrollTop();
    $(document).on('click', '.DayPicker-NavButton--next, .DayPicker-NavButton--prev', this.resetSelectedDate);
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
    $(document).off('click', '.DayPicker-NavButton--next, .DayPicker-NavButton--prev', this.resetSelectedDate);
  }

  loadFood = id => {
    axios
      .get(`/api/foods/${id}`)
      .then(res => this.setState({ food: res.data, mounted: true }))
      .catch(err => {
        appToaster.show({ message: 'Cannot load this page. Redirecting you back to home page.', intent: Intent.DANGER });
        setTimeout(() => this.props.history.push('/'), 3000);
      })
  }

  updatePackage = (e, id) => {
    if(this.state.form.startDate) {
      this.resetSelectedDate();
    }
    this.setState({ ...this.state, form: {...this.state.form, packageId: id, startDate: null} });
  }

  // needs to refactor later
  getItem = id => cartState.added.filter(item => item.key === id);
  isExist = id => this.getItem(id).length > 0;

  addtoCart = () => {
    let { id } = this.props.match.params;
    const { skipAlert } = this.state;
    const { packageId, slimSunday, startDate } = this.state.form;

    if (!startDate) {
      appToaster.show({ message: 'Please select the delivery starting date', intent: Intent.DANGER })
      return false;
    }

    const isMon = startDate.getDay() == 1 ? 1 : 0;
    let duration = packageId == 1 ? 5 : 0;
    duration = (!isMon && duration == 5) ? 6 : duration;

    let item = this.getItem(id);
    let ls = window.sessionStorage;

    if (this.isExist(id) && !skipAlert) {
      this.setState({ alertOpen: true });
      return false;
    }

    const range = moment.rangeFromInterval('days', duration, startDate);
    const key = guid();
    let daysData = [];
    for (let days of range.by('days')) {
      // skip sunday if any
      if (days.format('d') != '0') {
        daysData.push({
          label: days.format('ddd, MMM DD'),
          date: days.format('YYYY-MM-DD'),
          pickup: null,
          address: null,
          snacks: []
        });
      }
    }

    let data = {
      key,
      id,
      packageId,
      slimSunday,
      schedules: daysData,
      complete: false
    }

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
  }

  resetSelectedDate = () => {
    this.setState({ ...this.state, form: {...this.state.form, startDate: null} });
    setTimeout(() => {
      $('[range="true"]').removeClass('dates-range dates-range-finish dates-range-start dates-range-sunday').attr('range', false);
      $('.DayPicker-Day.DayPicker-Day--selected').removeClass('DayPicker--Day-selected')
    }, 50);
  }

  handleDayClick = day => {
    this.setState({ ...this.state, form: {...this.state.form, startDate: day} });
    const { packageId } = this.state.form;
    setTimeout(() => {
      $('[range="true"]').removeClass('dates-range dates-range-finish dates-range-start dates-range-sunday').attr('range', false);
      const isMon = day.getDay() == 1 ? 1 : 0;
      let duration = packageId == 1 ? 5 : 0;
      duration = (!isMon && duration == 5) ? 6 : duration;

      const startDate = moment(day);
      const endDate = moment(day).add(duration, 'd');
      let dateRange = moment().range(startDate, endDate);
      let diff = dateRange.diff('days');
      let dateArr = Array.from(dateRange.by('days'));

      if (dateArr.length > 1) {
        dateArr.map((date, i) => {
          let d = moment(date);
          let Day = d.format('D');
          let day = d.format('d');
          let ariaFormat = d.format('ddd MMM DD YYYY');
          let el = $('.DayPicker-Day[aria-label="'+ ariaFormat +'"]')

          if (i == 0) {
            el.addClass('dates-range dates-range-start').attr('range', 'true');
          }
          if (day == '0') {
            el.addClass('dates-range-sunday').attr('range', 'true');
          }
          if (day != '0') {
            el.addClass('dates-range').attr('range', 'true');
          }
          if (i == diff) {
            el.addClass('dates-range dates-range-finish').attr('range', 'true');
          }
        })
      } else {
        dateArr.map((date, i) => {
          let d = moment(date);
          let Day = d.format('D');
          let day = d.format('d');
          let ariaFormat = d.format('ddd MMM DD YYYY');
          let el = $('.DayPicker-Day[aria-label="'+ ariaFormat +'"]');
          el.addClass('dates-single').attr('range', 'true');
        });
      }
    }, 50);
  }

  toggleOverlay = () => this.setState({ overlay: !this.state.overlay })
  toggleSlimSunday = () => this.setState({ ...this.state, form: {...this.state.form, slimSunday: ! this.state.form.slimSunday } })
  cancelCart = () => this.setState({ alertOpen: false })
  skipAlert = () => {
    this.setState({ alertOpen: false, skipAlert: true }, () => {
      this.addtoCart();
    });
  }

  render() {
    const { food, form, alertOpen } = this.state;
    const modifiers = { isDisabled };

    return (
      <React.Fragment>
        <section className="top details">
          <Overlay isOpen={this.state.overlay} onClose={this.toggleOverlay}>
            <section className="home hiw">
              <HowItWorks autoOpen={true} closeButton={true} toggleOverlay={this.toggleOverlay}/>
            </section>
          </Overlay>
          {food && (
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-md-2">
                  <Link to="/" title="" className="details--return"><i className="fa fa-fw fa-long-arrow-alt-left"></i> Home</Link>
                </div>
                <div className="col-xs-12 col-md-6">
                  <h1>{food.name}</h1>
                  <div className="details--short-description" dangerouslySetInnerHTML={{__html: food.short_description}}></div>
                  <div className="details--description" dangerouslySetInnerHTML={{__html: food.description}}></div>
                  {food.example_menu && <ExampleMenu menu={food.example_menu} />}
                  {food.recommended_snack && snackState.items && <RecommendedSnacks snacks={JSON.parse(food.recommended_snack)} />}
                </div>
                <div className="col-xs-12 col-md-4">
                  <div className="details--price-box">
                    {food.prices.length && food.prices.map((price, index) => (
                      <div className="details--price" key={index}>
                        <span><Radio label={price.name} checked={form.packageId === price.sort} onChange={(e) => this.updatePackage(e, price.sort)} value={price.id} /></span>
                        <span>{parsePrice(price.price)} IDR</span>
                      </div>
                    ))}
                    <div className="details--price">
                      <span>
                        <Popover interactionKind={PopoverInteractionKind.HOVER} position={Position.TOP}>
                          <Switch checked={form.slimSunday} onChange={this.toggleSlimSunday} label="Add Slim Sunday?" />
                          <SlimSundayPopover />
                        </Popover>
                      </span>
                      <span><b>300,000 IDR</b></span>
                    </div>
                    <div className="details--calendar">
                      <p><strong>Delivery Starting Date</strong></p>
                      <DatePicker
                        onChange={this.handleDayClick}
                        modifiers={modifiers}
                        minDate={today}
                        value={this.state.form.startDate}
                      />
                    </div>
                  </div>
                  <a href="javascript:" title="" onClick={this.addtoCart} className="details--add-to-cart"><i className="fal fa-cart-plus"></i> Add to cart</a>
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
                    <a href="javascript:" title="" className="btn-normal" onClick={this.toggleOverlay}><i className="fal fa-fw fa-question-circle"></i> How it works</a>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!food && <div className="loading"><Spinner intent="primary" large={true} /></div>}
        </section>
        <section className="details">
          <div className="details--pictures">
            {food && food.pictures && Object.values(food.pictures).map((picture, index) => (
              <div key={index}><img src={`/images/foods/${picture}`} alt="" /></div>
            ))}
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default view(Details);
