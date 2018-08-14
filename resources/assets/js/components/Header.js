import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import MiniCart from './MiniCart';

const host = window.location.hostname;

class Header extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      backToLink: {
        href: 'http://cafe.motionfitnessbali.com',
        html: `<i class="fal fa-fw fa-angle-left"></i> Motion Cafe`
      }
    }
  }

  componentDidMount() {
    /*if (host == 'wanderlust.motionfitnessbali.com') {
      this.setState({
        ...this.state,
        backToLink: {
          href: 'http://www.crossfitwanderlust.com/fit-foods/',
          html: `<i class="fal fa-fw fa-angle-left"></i> back to Wanderlust page`
        }
      })
    }*/

    $('a.mobile-menu').on('click', function() {
      $('.header-links').slideToggle();
    })
  }

  render() {
    const { backToLink } = this.state;

    return (
      <header>
        <div className="header">
          <figure><Link to="/" title=""><img src="/images/logo.png" alt="Motion Fitness Bali" className="logo" /></Link></figure>
          <a href="javascript:" title="" className="mobile-menu"><i className="fal fa-bars"></i></a>
          <div className="header-links">
            <a href={backToLink.href} title="">{backToLink.html}</a>
            <a href="http://cafe.motionfitnessbali.com/detox" title="">Detox</a>
            <a href="http://cafe.motionfitnessbali.com/retreat-catering" title="">Catering</a>
            <a href="http://cafe.motionfitnessbali.com/nutrition-consultation" title="">Nutrition Consultation</a>
          </div>
          {this.props.location.pathname != '/checkout' && <MiniCart />}
        </div>
      </header>
    );
  }
}

export default Header;
