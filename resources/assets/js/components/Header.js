import React, { Component } from "react";
import { Link } from "react-router-dom";

import MiniCart from "./MiniCart";

const host = window.location.hostname;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backToLink: {
        href: "http://cafe.motionfitnessbali.com",
        html: "Home"
      }
    };
  }

  componentDidMount() {
    if (host == "wanderlust.motionfitnessbali.com") {
      this.setState({
        ...this.state,
        backToLink: {
          href: "http://www.crossfitwanderlust.com/fit-foods/",
          html: `Wanderlust`
        }
      });
    }

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
            <a href="https://instagram.com/avocadocafebali" title="" target="_blank">
              <i className="fab fa-instagram" />
            </a>
            <a href="https://www.facebook.com/motionfitnessbali" title="" target="_blank">
              <i className="fab fa-youtube" />
            </a>
            <a href="https://www.facebook.com/motionfitnessbali" title="" target="_blank">
              <img src="/images/motion-cafe-small.png" alt="" />
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
            <a href={backToLink.href} title="">
              <span dangerouslySetInnerHTML={{ __html: backToLink.html }} />
            </a>
            <a href="http://cafe.motionfitnessbali.com/detox" title="">
              Detox
            </a>
            <a href="http://cafe.motionfitnessbali.com/retreat-catering" title="">
              Catering
            </a>
            <a href="http://cafe.motionfitnessbali.com/nutrition-consultation" title="">
              Nutrition Consultation
            </a>
          </div>
          {this.props.location.pathname != "/checkout" && <MiniCart />}
        </div>
      </header>
    );
  }
}

export default Header;
