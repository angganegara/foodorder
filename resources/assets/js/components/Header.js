import React, { Component } from "react";
import { Link } from "react-router-dom";

import MiniCart from "./MiniCart";

const host = window.location.hostname;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backToLink: {
        href: "http://www.motionfitnessbali.com",
        html: "Home"
      }
    };
  }

  componentDidMount() {
    $("a.mobile-menu").on("click", function() {
      $(".header-links").slideToggle();
    });
  }

  render() {
    const { backToLink } = this.state;

    return (
      <header>
        <div className="header-mini">
          <div className="header container header-socials">
            <a href="https://www.facebook.com/motionfitnessbali" title="" target="_blank">
              <i className="fab fa-facebook-f" />
            </a>
            <a href="https://instagram.com/motioncafe" title="" target="_blank">
              <i className="fab fa-instagram" />
            </a>
          </div>
        </div>
        <div className="header container">
          <figure>
            <Link to="/" title="">
              <img src="/images/logo.png" alt="Motion Fitness Bali" className="logo" />
            </Link>
          </figure>
          <a href="javascript:" title="" className="mobile-menu">
            <i className="fal fa-bars" />
          </a>
          <div className="header-links">
            <div className="menu-parent">
              <a href="https://www.motionfitnessbali.com/wp-content/uploads/2020/04/Kitchen-2-8.pdf" title="">
                Menu's <i className="fal fa-angle-down ml-1"></i>
              </a>
              <div className="menu-child-wrap">
                <div className="menu-child-inner">
                  <ul className="child-links">
                    <li><a href="https://www.motionfitnessbali.com/wp-content/uploads/2020/05/Kitchen-2-11.pdf" title="">Fitness Food & Store</a></li>
                    <li><a href="https://www.motionfitnessbali.com/wp-content/uploads/2020/03/Motion-Cafe-Menu-2020-10.pdf" title="">Cafe</a></li>
                    <li><a href="https://www.motionfitnessbali.com/wp-content/uploads/2020/05/MEAL-PLAN-INFO.pdf" title="">Meal Plan & Detox</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <a href="https://www.motionfitnessbali.com/food/#cafe" title="">
              Motion Cafe
            </a>
            <a href="https://www.motionfitnessbali.com/food/#mealplans" title="">
              Meal Plans
            </a>
            <a href="https://www.motionfitnessbali.com/store/" title="">
              Store
            </a>
            <a href="https://www.motionfitnessbali.com/train-with-melanie-raw-lifestyle/" title="">
              Train with Mel
            </a>
            <div className="menu-parent">
              <a href="https://www.motionfitnessbali.com/food/" title="">
                What we do <i className="fal fa-angle-down ml-1"></i>
              </a>
              <div className="menu-child-wrap">
                <div className="menu-child-inner">
                  <ul className="child-links">
                    <li><a href="https://www.motionfitnessbali.com/catering/" title="">Catering</a></li>
                    <li><a href="https://www.motionfitnessbali.com/food/#detox" title="">Detox</a></li>
                    <li><a href="https://www.motionfitnessbali.com/fitness/" title="">Challenges</a></li>
                    <li><a href="https://www.motionfitnessbali.com/food/#nutrition_consultant" title="">Nutrition Consultation</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <a href="https://www.motionfitnessbali.com/blog/" title="">
              Blog
            </a>
          </div>
          {this.props.location.pathname != "/checkout" && <MiniCart />}
        </div>
      </header>
    );
  }
}

export default Header;
