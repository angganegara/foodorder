import React, { Component } from 'react';
import { store, view } from 'react-easy-state';
import { CSSTransition } from 'react-transition-group';
import {
  Spinner
} from '@blueprintjs/core';

const $ = require('jquery');

import {
  parsePrice,
  getIndex,
  getScheduleIndex
} from '../helpers/cart';

import cartState from '../store';
import snacks from '../store/snacks';

import SnackDescription from '../components/SnackDescription';

class Snacks extends Component
{
  state = {
    items: null,
    activeIndex: 0,
    selected: []
  }

  componentDidMount() {
    axios
      .get('/api/items/categorize')
      .then(res => this.setState({ items: res.data }))
  }

  closeWindow = () => {
    this.props.toggleWindow();
    $('body').removeClass('pt-overlay-open');
  }

  handleClick = (e, id) => {
    const index = getIndex(this.props.itemKey);
    const scheduleIndex = getScheduleIndex(index, this.props.date);
    cartState.added[index].schedules[scheduleIndex].snacks.push(id);
  }

  removeSnack = (e, id) => {
    const index = getIndex(this.props.itemKey);
    const scheduleIndex = getScheduleIndex(index, this.props.date);
    let selectedSnacks = [...cartState.added[index].schedules[scheduleIndex].snacks];
    const snackIndex = selectedSnacks.indexOf(id);
    selectedSnacks.splice(snackIndex, 1);
    cartState.added[index].schedules[scheduleIndex].snacks = selectedSnacks;
  }

  snackIsAdded = id => {
    const index = getIndex(this.props.itemKey);
    const scheduleIndex = getScheduleIndex(index, this.props.date);

    if (cartState.added[index].schedules[scheduleIndex]) {
      return cartState.added[index].schedules[scheduleIndex].snacks.filter(snackId => snackId === id).length;
    }
    return 0;
  }

  toggleCard = (e, id) => $(`.snack-description.snack-${id}`).toggleClass('active')
  gotoHeading = (e, id, index) => {
    const target = $(`#snack-${id}`).offset().top - 75;
    const currentScrollPos = $('.snacks-inner').scrollTop();
    const nextPos = target + currentScrollPos;
    $('.snacks-inner').animate({scrollTop: nextPos}, 500);
    this.setState({ activeIndex: index })
  }

  render() {
    const { open, date } = this.props;
    const { items, activeIndex } = this.state;

    return (
      <div className={`${open ? 'active' : ''} snacks-overlay`}>
        <a href="javascript:" title="" className="snacks-close-button" onClick={this.closeWindow}><i className="fal fa-times"></i></a>
        <div className="snacks-menu">
          <ul>
            {items && items.map((category, index) => (
              <li key={index}><a href="javascript:" className={index === activeIndex ? 'active' : ''} title="" onClick={(e) => this.gotoHeading(e, category.id, index)}>{category.title}</a></li>
            ))}
          </ul>
        </div>
        <div className="snacks-inner">
          {items && items.map((category, index) => (
            <div className="snacks-category" key={index}>
              <h2 id={`snack-${category.id}`}>{category.title}</h2>
              <div className="snacks-cards">
                {category.items.map((item, index) => (
                  <div className="snacks-card" key={index}>
                    <div className="snacks-icons">
                      {(item.gf == 1) && (<img src="/images/icons/gf.png" alt="Gluten Free" title="Gluten Free" />)}
                      {(item.vegan == 1) && (<img src="/images/icons/vegan.png" alt="Vegan" title="Vegan" />)}
                      {(item.raw == 1) && (<img src="/images/icons/raw.png" alt="RAW" title="RAW" />)}
                      {(item.natural == 1) && (<img src="/images/icons/natural.png" alt="100% Natural" title="100% Natural" />)}
                    </div>
                    <SnackDescription
                      className={`snack-${item.id}`}
                      title={item.name}
                      description={item.description}
                      toggleCard={(e) => this.toggleCard(e, item.id)}
                    />
                    <figure><a href="javascript:" title="" onClick={(e) => this.toggleCard(e, item.id)}><img src={`/images/snacks/${item.id}.jpg`} alt="" /></a></figure>
                    <div className="snacks-card--details">
                      <CSSTransition
                        in={this.snackIsAdded(item.id) <= 0}
                        timeout={200}
                        classNames="fade-"
                        unmountOnExit
                      >
                        {state => (<a href="javascript:" title="" className="quick-add" onClick={(e) => this.handleClick(e, item.id)}><i className="fal fa-plus"></i></a>)}
                      </CSSTransition>
                      <CSSTransition
                        in={this.snackIsAdded(item.id) > 0}
                        timeout={200}
                        classNames="fade-"
                        unmountOnExit
                      >
                        {state => (<a href="javascript:" title="" className="quick-add delete" onClick={(e) => this.removeSnack(e, item.id)}><i className="fal fa-times"></i></a>)}
                      </CSSTransition>
                      <div className="snacks-card--price">IDR {parsePrice(item.price)}</div>
                      <div className="snacks-card--name"><a href="javascript:" title="" onClick={(e) => this.toggleCard(e, item.id)}>{item.name} <i className="far fa-exclamation-circle"></i></a></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!items && <div className="loading loading-fullh"><Spinner intent="primary" large={true} /></div>}
        </div>
        <div className="snacks-close" onClick={this.closeWindow}></div>
      </div>
    );
  }
}

export default view(Snacks);
