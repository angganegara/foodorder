import React, { Component } from "react";
import { Link } from "react-router-dom";
import { view } from "react-easy-state";
import { Dialog, Button, Spinner, Toaster, Intent, Position } from "@blueprintjs/core";
const $ = require("jquery");

import cartState from "../store";
import Useragent from "useragent.js";

import CartOverview from "../components/CartOverview";
import Input from "../components/Form/Input";
import Textarea from "../components/Form/Textarea";
import PaymentButton from "../components/Form/PaymentButton";
import TermsAndConditions from "../components/TermsAndConditions";

const label = {
  fname: "First name",
  lname: "Surname",
  email: "Email address",
  phone: "Phone number",
  gender: "Gender",
  howdidyoulearn: "This"
};

const appToaster = Toaster.create({ position: Position.TOP_RIGHT });

class Checkout extends Component {
  state = {
    progress: 0,
    checkoutLoading: false,
    termsDialog: false,
    finish: false,
    payment: "cash",
    dokuResult: false,
    fromDoku: false,
    popupMessage: "Finalizing your order, please don't close your browser",
    snacks: [],
    foods: [],
    form: {
      fname: "",
      lname: "",
      email: "",
      phone: "",
      comments: "",
      terms: false,
      coupon: "",
      couponValue: 0,
      couponItem: "",
      deliveryprice: 0,
      discount: 0,
      gender: "",
      howdidyoulearn: "",
      staff_name: "",
      staff_other: ""
    },
    errors: {
      fname: null,
      lname: null,
      email: null,
      phone: null,
      terms: null,
      gender: null,
      howdidyoulearn: null,
      staffName: null,
      staffOther: null
    },
    activeIndex: 3
  };

  componentDidMount() {
    if (cartState.added.length <= 0) {
      appToaster.show({
        message: "Your cart is empty. Redirecting you to home page.",
        intent: Intent.DANGER
      });
      setTimeout(() => (window.location.href = "/"), 2000);
    }

    // 1. load foods and snacks so we get the correct price from server
    axios
      .get("/api/foods")
      .then(res => this.setState({ foods: res.data, progress: this.state.progress + 50 }))
      .then(this.loadSnacks());

    // hol up - is this thank you page?
    if (this.props.location.pathname == "/checkout/thank-you") {
      this.setState({ finish: true, checkoutLoading: false });
      this.clearCart();
    }

    if (this.props.location.pathname == "/doku/finish") {
      this.setState({ finish: true, checkoutLoading: false, dokuResult: window.dokuResult, fromDoku: window.fromDoku });
      this.clearCart();
    }
  }

  loadSnacks = () => {
    axios.get("/api/items").then(res => this.setState({ snacks: res.data, progress: this.state.progress + 50 }));
  };

  isValidEmail = email => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  invalidCart = () => {
    appToaster.show({
      message: "There is problem with your cart, please try again.",
      intent: Intent.DANGER
    });
    cartState.added = [];
    setTimeout(() => (window.location.href = "/"), 2000);
  };

  handleChange = (e, target) => {
    if (e.target.value === "") {
      $(`#${target}`).addClass("error");
      this.setState({
        errors: {
          ...this.state.errors,
          [target]: `${label[target]} is required`
        }
      });
    } else {
      if (target == "email" && !this.isValidEmail(e.target.value)) {
        $(`#${target}`).addClass("error");
        this.setState({
          errors: {
            ...this.state.errors,
            [target]: `Please enter a valid email address`
          }
        });
      } else {
        $(`#${target}`).removeClass("error");
        this.setState({ errors: { ...this.state.errors, [target]: null } });
      }
    }
    this.setState({ form: { ...this.state.form, [target]: e.target.value } });
  };

  handlePayment = (e, payment) => this.setState({ payment });
  toggleTerms = () =>
    this.setState({
      errors: { ...this.state.errors, terms: null },
      form: { ...this.state.form, terms: !this.state.form.terms }
    });
  toggleTermsDialog = () => this.setState({ termsDialog: !this.state.termsDialog });
  agreeTerms = () =>
    this.setState({
      termsDialog: false,
      form: { ...this.state.form, terms: true }
    });
  applyCoupon = ({ code, value, item }) =>
    this.setState({
      form: {
        ...this.state.form,
        coupon: code,
        couponValue: value,
        couponItem: item
      }
    });
  getTotalDeliveryPrice = () => cartState.added.reduce((accu, total) => accu + total.deliveryPrice, 0);

  handleHowDidYouLearn = e =>
    this.setState({ errors: { ...this.state.errors, howdidyoulearn: null }, form: { ...this.state.form, howdidyoulearn: e.target.value } });
  handleStaffSelect = e =>
    this.setState({ errors: { ...this.state.errors, staffName: null }, form: { ...this.state.form, staff_name: e.target.value } });
  handleStaffOther = e =>
    this.setState({ errors: { ...this.state.errors, staffOther: null }, form: { ...this.state.form, staff_other: e.target.value } });
  handleCheckout = () => {
    const { form, payment } = this.state;
    const required = ["fname", "lname", "email", "phone", "gender", "howdidyoulearn"];
    let errors = null;
    let gotoTop = false;
    $(".form-input").removeClass("error");
    required.map(key => {
      if (form[key] == "") {
        errors = { ...errors, [key]: `${label[key]} is required` };
        $(`#${key}`).addClass("error");
        gotoTop = true;
      }
    });
    if (gotoTop) {
      this.scrollTop();
    }
    if (!form.terms) {
      errors = {
        ...errors,
        terms: "You must agree to the Terms and Conditions"
      };
    }
    if (form.howdidyoulearn == "Recommended by a Motion trainer/employee" && form.staff_name == "") {
      errors = {
        ...errors,
        staffName: "Please select the name"
      };
    }
    if (form.howdidyoulearn == "Recommended by a Motion trainer/employee" && form.staff_name == "Other" && form.staff_other == "") {
      errors = {
        ...errors,
        staffOther: "Please enter the name"
      };
    }
    if (errors) {
      this.setState({ errors });
      return false;
    }

    const subTotal = cartState.added.reduce((accu, total) => accu + total.totalPrice, 0);

    const ua = Useragent.analyze(navigator.userAgent);
    const userAgent = `
      User Agent: ${ua.ua}
      Browser: ${ua.browser.full} (${ua.browser.name} VERSION ${ua.browser.version})
      OS: ${ua.os.full} (${ua.os.name} VERSION ${ua.os.version})
      Device: ${ua.device.full}`;
    const deliveryPrice = this.getTotalDeliveryPrice();
    const data = {
      cart: cartState.added,
      cartKey: cartState.cartKey,
      form,
      methods: payment,
      subTotal,
      deliveryPrice,
      userAgent
    };

    // for now we assume payment is cash
    if (window.confirm("You are about to send a binding food order. Do you want to submit?")) {
      this.setState({ checkoutLoading: true });
      axios
        .post("/api/create-order", data)
        .then(res => {
          let ordernumber = res.data;

          this.continueCheckout(ordernumber);
        })
        .catch(err => {
          if (err.response.data == "EMPTY-SCHEDULES") {
            appToaster.show({
              message: "Your cart is empty. Please add your item again.",
              intent: Intent.DANGER
            });
            cartState.added = [];
            this.setState({ checkoutLoading: false });
            setTimeout(() => (window.location.href = "/"), 2000);
          } else {
            this.setState({ checkoutLoading: false });
          }
        });
    }

    return false;
  };

  continueCheckout = ordernumber => {
    const methods = this.state.payment;
    axios
      .post("/checkout/start", { ordernumber, methods })
      .then(res => {
        const { code, message, redirect, token } = res.data;

        switch (code) {
          case 100:
            if (message == "SUCCESS") {
              this.setState({
                finish: true,
                checkoutLoading: false
              });
              this.clearCart();
            }
            break;
          case 101:
            const { response } = res.data;
            if (message == "StartPaypal" && redirect && (response.ACK == "Success" || response.ACK == "SuccessWithWarning")) {
              this.setState({
                popupMessage: "Redirecting you to PayPal website. This may take a minute, please don't close your browser."
              });
              window.location = redirect;
            } else {
              window.alert("There is a problem contacting PayPal. Please select different payment methods.");
              this.setState({
                checkoutLoading: false
              });
            }
            break;
          case 102:
            if (message == 'SUCCESS') {
              window.location.href = '/doku/start';
            }
            break;
        }
      })
      .catch(err => {
        /*
        window.alert(
          "Something went wrong and the admin has been notified.\nPlease try again in few minutes or choose another payment methods."
        );
        axios.post("/api/error-log", {
          data: { ordernumber, methods, err: err.response.data },
          errorMessage: "Error during submitting order, after the order has been created"
        });
        */
        this.setState({ finish: true, checkoutLoading: false });
      });
  };

  clearCart = () => {
    axios.post("api/cart/empty", { cartKey: cartState.cartKey }).then(res => {
      cartState.added = [];
      cartState.cartKey = null;
    });
  };
  scrollTop = () => {
    $("html, body").animate({ scrollTop: 0 }, 500);
  };

  render() {
    const { progress, checkoutLoading, payment, finish, form, snacks, errors, termsDialog, popupMessage, activeIndex, dokuResult, fromDoku } = this.state;

    return (
      <React.Fragment>
        <Dialog icon="Document" isOpen={termsDialog} onClose={this.toggleTermsDialog} title="Terms and Conditions">
          <TermsAndConditions />
          <div className="pt-dialog-footer">
            <div className="pt-dialog-footer-actions">
              <Button intent={Intent.PRIMARY} onClick={this.agreeTerms} text="I agree" />
            </div>
          </div>
        </Dialog>
        {checkoutLoading && (
          <div className="checkout-loading">
            <Spinner intent="primary" large={true} />
            <br />
            <p>{popupMessage}</p>
          </div>
        )}
        <section className="top checkout">
          {progress < 100 && (
            <div className="loading">
              <Spinner intent="primary" large={true} />
              <br />
              <p>Loading ...</p>
            </div>
          )}
          {progress >= 100 && finish && (
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-md-12">
                  {fromDoku && !dokuResult && (
                    <React.Fragment>
                      <h1>Sorry</h1>
                      <div className="checkout--subtitle">
                        <p>Your payment has been rejected. Please check your Credit Card or use different payment methods.</p>
                        <p>
                          <Link to="/" title="">
                            <i className="fa fa-fw fa-long-arrow-alt-left" /> Back to home
                          </Link>
                        </p>
                        <br />
                        <Link to="/" title="">
                          <img
                            src="/images/thankyou.jpg?v=1"
                            alt=""
                            style={{
                              width: "25%",
                              display: "block",
                              margin: "0 auto"
                            }}
                          />
                        </Link>
                      </div>
                    </React.Fragment>
                  )}
                  {(!fromDoku || (fromDoku && dokuResult)) && (
                    <React.Fragment>
                      <h1>Thank you</h1>
                      <div className="checkout--subtitle">
                        <p>Your food order has been submitted successfully.</p>
                        <p>Your Motion Cafe Team</p>
                        <br />
                        <p>
                          <Link to="/" title="">
                            <i className="fa fa-fw fa-long-arrow-alt-left" /> Back to home
                          </Link>
                        </p>
                        <br />
                        <Link to="/" title="">
                          <img
                            src="/images/thankyou.jpg?v=1"
                            alt=""
                            style={{
                              width: "25%",
                              display: "block",
                              margin: "0 auto"
                            }}
                          />
                        </Link>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
          )}
          {progress >= 100 && !finish && (
            <div className="container">
              <h1>Finalize your Order</h1>
              <p>You are almost done! Please finish the following steps:</p>
              <div className="order-nav">
                <ul>
                  <li className={activeIndex == 0 ? "active" : ""}>
                    <span className="order-nav--step">1</span>
                    <span className="order-nav--title">Pimp Your Menu</span>
                  </li>
                  <li className="bike-icon">
                    <img src="/images/icons/delivery.png" alt="" />
                  </li>
                  <li className={activeIndex == 1 ? "active" : ""}>
                    <span className="order-nav--step">2</span>
                    <span className="order-nav--title">Delivery Info</span>
                  </li>
                  <li className="bike-icon">
                    <img src="/images/icons/delivery.png" alt="" />
                  </li>
                  <li className={activeIndex == 2 ? "active" : ""}>
                    <span className="order-nav--step">3</span>
                    <span className="order-nav--title">Review</span>
                  </li>
                  <li className="bike-icon">
                    <img src="/images/icons/delivery.png" alt="" />
                  </li>
                  <li className={activeIndex == 3 ? "active" : ""}>
                    <span className="order-nav--step">4</span>
                    <span className="order-nav--title">Checkout</span>
                  </li>
                </ul>
              </div>

              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-7 form-left">
                  <div className="form-section">
                    <div className="form-inner">
                      <h2>Personal Data</h2>
                      <div className="form-section--info">
                        <p>
                          Enter your details here. Fields marked with <span className="req">*</span> are required.
                        </p>
                      </div>
                      <div className="row form-row">
                        <div className="col-xs-12 col-md-6">
                          <Input
                            id="fname"
                            label="First Name"
                            placeholder="First name"
                            handleChange={e => this.handleChange(e, "fname")}
                            required={true}
                            error={errors.fname}
                          />
                        </div>
                        <div className="col-xs-12 col-md-6">
                          <Input
                            id="lname"
                            label="Surname"
                            placeholder="Surname"
                            handleChange={e => this.handleChange(e, "lname")}
                            required={true}
                            error={errors.lname}
                          />
                        </div>
                      </div>
                      <div className="row form-row">
                        <div className="col-xs-12 col-md-6">
                          <Input
                            id="email"
                            label="Email Address"
                            placeholder="Email address"
                            handleChange={e => this.handleChange(e, "email")}
                            required={true}
                            error={errors.email}
                          />
                        </div>
                        <div className="col-xs-12 col-md-6">
                          <Input
                            id="phone"
                            label="Phone Number"
                            placeholder="Phone number"
                            handleChange={e => this.handleChange(e, "phone")}
                            required={true}
                            error={errors.phone}
                          />
                        </div>
                      </div>

                      <div className="row form-row">
                        <div className="col-xs-12">
                          <div className="form-group">
                            <label>
                              Gender <span className="req">*</span>
                            </label>
                            <div className="gender-fields">
                              <label>
                                <input type="radio" name="gender" value="female" onClick={e => this.handleChange(e, "gender")} /> Female
                              </label>
                              <label>
                                <input type="radio" name="gender" value="male" onClick={e => this.handleChange(e, "gender")} /> Male
                              </label>
                            </div>
                            {errors.gender && <span className="input-error">{errors.gender}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="row form-row">
                        <div className="col-xs-12">
                          <div className="form-group">
                            <label>
                              How did you learn about Motion Meal Plans? <span className="req">*</span>
                            </label>
                            <div className="pt-select" id="howdidyoulearn">
                              <select onChange={this.handleHowDidYouLearn}>
                                <option value="">Please Select</option>
                                <option value="Motion Website">Motion Website</option>
                                <option value="Social Media">Social Media</option>
                                <option value="Motion Cafe">Motion Cafe</option>
                                <option value="Motion Gym">Motion Gym</option>
                                <option value="Flyer/Poster">Flyer/Poster</option>
                                <option value="Recommended by a friend">Recommended by a friend</option>
                                <option value="Recommended by a Motion trainer/employee">Recommended by a Motion trainer/employee</option>
                              </select>
                            </div>
                            {errors.howdidyoulearn && (
                              <React.Fragment>
                                <br />
                                <span className="input-error">{errors.howdidyoulearn}</span>
                              </React.Fragment>
                            )}
                          </div>
                        </div>
                      </div>

                      {form.howdidyoulearn == "Recommended by a Motion trainer/employee" && (
                        <div className="row form-row">
                          <div className="col-xs-12">
                            <div className="form-group">
                              <label>Please select the name of Motion trainer/employee</label>
                              <div className="trainer-fields">
                                <div className="pt-select">
                                  <select onChange={this.handleStaffSelect}>
                                    <option value="">Please Select</option>
                                    <option value="Aldhy">Aldhy</option>
                                    <option value="Fay">Fay</option>
                                    <option value="Iris">Iris</option>
                                    <option value="Mada">Mada</option>
                                    <option value="Nadi">Nadi</option>
                                    <option value="Petrus">Petrus</option>
                                    <option value="Summer">Summer</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                                {errors.staffName && <span className="input-error">{errors.staffName}</span>}

                                {form.staff_name == "Other" && (
                                  <React.Fragment>
                                    <input
                                      type="text"
                                      className="form-input"
                                      placeholder="Please enter a name"
                                      onChange={this.handleStaffOther}
                                    />
                                    {errors.staffOther && <span className="input-error">{errors.staffOther}</span>}
                                  </React.Fragment>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-section">
                    <div className="form-inner">
                      <h2>Comments</h2>
                      <div className="form-section--info">
                        <p>
                          Any special requests we should be aware of? Please let us know if you prefer your meal plan
                          vegan/vegetarian/gluten-free/dairy-free. Any food you don’t like?
                        </p>
                      </div>
                      <div className="row form-row">
                        <div className="col-xs-12">
                          <Textarea
                            label=""
                            placeholder="Feel free to write some comments here"
                            handleChange={e => this.handleChange(e, "comments")}
                            required={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <div className="form-inner">
                      <h2>Payment Option</h2>
                      <div className="form-section--info">
                        
                      </div>
                      <PaymentButton
                        active={payment == "cash"}
                        icon="fa fa-motorcycle"
                        handleChange={e => this.handlePayment(e, "cash")}
                        label="Cash to driver"
                      />
                      <PaymentButton
                        active={payment == "banktransfer"}
                        icon="fa fa-credit-card"
                        handleChange={e => this.handlePayment(e, "banktransfer")}
                        label="Bank Transfer"
                      />
                      <span><PaymentButton
                        active={payment == "paypal"}
                        icon="fab fa-paypal"
                        handleChange={e => this.handlePayment(e, "paypal")}
                        label="PayPal"
                      /></span>
                      <span><PaymentButton
                        active={payment == "creditcard"}
                        icon="fa fa-credit-card"
                        handleChange={e => this.handlePayment(e, "creditcard")}
                        label="Credit Card"
                      /></span>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-5">
                  <div className="form-section">
                    <div className="form-inner no-padding">
                      <h2>Order Overview</h2>
                      <CartOverview snacks={snacks} applyCoupon={this.applyCoupon} invalidCart={this.invalidCart} />
                    </div>
                  </div>

                  <div className="form-footer">
                    <div className="form-terms">
                      <label>
                        <input type="checkbox" checked={form.terms} onChange={this.toggleTerms} />
                        &nbsp; I agree to the{" "}
                        <a href="javascript:" onClick={this.toggleTermsDialog}>
                          <b>Terms and Conditions</b>
                        </a>
                        <br />
                        {errors.terms && <span className="input-error">{errors.terms}</span>}
                      </label>
                    </div>
                    <div className="form-submit">
                      <button type="submit" className="btn" onClick={this.handleCheckout}>
                        SEND ORDER <i className="fal fa-angle-right" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </React.Fragment>
    );
  }
}

export default view(Checkout);
