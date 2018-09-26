import React, { Component } from "react";
import Input from "../components/Form/Input";

class LongPeriod extends Component {
  state = {
    email: "",
    error: "",
    isLoading: false
  };

  handleChange = e => {
    this.setState({ email: e.target.value });
  };

  handleSubmit = () => {
    this.setState({ error: "", isLoading: true });
    const { email } = this.state;
    const { food } = this.props;
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(email).toLowerCase())) {
      this.setState({
        isLoading: false,
        error: "Please enter a valid email address"
      });
      return false;
    }
    axios
      .post("/api/long-period-order", { email: email, food: food.name })
      .then(res => {
        window.alert("Your message has been sent!");
        this.setState({
          isLoading: false,
          email: ""
        });
        this.props.closePopup();
      });
  };

  render() {
    const { isLoading, error } = this.state;
    return (
      <div className="lp-wrap">
        <div className="lp-box">
          <div className="lp-title">LONG-PERIOD ORDER</div>
          <div className="lp-body">
            <p>
              Do you want to order more than 6 days at once?
              <br />
              No problem, just drop as a line here to get in contact with our
              nutritionists.
            </p>
            <Input
              id="email"
              placeholder="Enter your email address"
              handleChange={this.handleChange}
              required={true}
              error={error}
            />
            <br />
            <button
              type="submit"
              className="btn"
              onClick={this.handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <i className="far fa-spin fa-spinner-third" />
              ) : (
                "SUBMIT"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default LongPeriod;
