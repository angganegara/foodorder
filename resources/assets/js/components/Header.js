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
        html: `<i class="fal fa-fw fa-angle-left"></i> back to Motion's Homepage`
      }
    }
  }

  componentDidMount() {
    if (host == 'wanderlust.motionfitnessbali.com') {
      this.setState({
        ...this.state,
        backToLink: {
          href: 'http://www.crossfitwanderlust.com/fit-foods/',
          html: `<i class="fal fa-fw fa-angle-left"></i> back to Wanderlust page`
        }
      })
    }
  }

  render() {
    const { backToLink } = this.state;

    return (
      <header>
        <div className="container header">
          <figure><Link to="/" title=""><img src="/images/logo.png" alt="Motion Fitness Bali" className="logo" /></Link></figure>
          <h1 className="logo-title">MEAL PLANS TO REACH YOUR GOALS</h1>
          <a href={backToLink.href} title="" className="main-site"><span dangerouslySetInnerHTML={{__html: backToLink.html}}></span></a>
          {this.props.location.pathname != '/checkout' && <MiniCart />}
        </div>
      </header>
    );
  }
}

export default Header;
