import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const Footer = () => (
  <footer>
    <div className="container">
      <div className="row">
        <div className="col-xs-12 col-md-6 footer-left">
          <h5>contact motion meal plans</h5>
          <p>
            Phone/WA: <strong>+62 821 4425 2606</strong> (Mon. - Fri. 09:00 - 17:00, Sat 9:00 - 14:00)<br />
            Email: <a href="mailto:foodorder@motionfitnessbali.com" title="">foodorder@motionfitnessbali.com</a><br />
          </p>
          <p>
            <Link smooth to="/terms-and-conditions#privacy">Privacy Policy</Link> &middot; <Link smooth to="/terms-and-conditions#top">Terms and Conditions</Link>
          </p>
        </div>
        <div className="col-xs-12 col-md-6 footer-right">
          <a href="http://www.motionfitnessbali.com" title=""><img src="/images/m-trans.png" alt="Motion Meals" className="logo" /></a>
          <p className="social">
            <a href="https://www.facebook.com/motioncafebali" title=""><i className="fab fa-2x fa-facebook"></i></a>
            <a href="http://instagram.com/motioncafe" title=""><i className="fab fa-2x fa-instagram"></i></a>
            <a href="http://www.tripadvisor.com/Restaurant_Review-g311298-d6903656-Reviews-Avocado_Cafe-Canggu_Bali.html" title=""><i className="fab fa-2x fa-tripadvisor"></i></a>
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
