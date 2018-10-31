import React, { Component } from "react";
import Input from "../components/Form/Input";
import Textarea from "../components/Form/Textarea";

class LongPeriod extends Component {
  state = {
    email: "",
    error: "",
    isLoading: false,
    days: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 29, 30],
    day: 7
  };

  handleChange = e => {
    this.setState({ email: e.target.value });
  };

  changeDay = e => this.setState({ day: e.target.value });

  handleSubmit = () => {
    this.setState({ error: "", isLoading: true });
    const { email, day } = this.state;
    const { food } = this.props;
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(email).toLowerCase())) {
      this.setState({
        isLoading: false,
        error: "Please enter a valid email address"
      });
      return false;
    }
    axios.post("/api/long-period-order", { email: email, food: food.name, day }).then(res => {
      window.alert("Your message has been sent!");
      this.setState({
        isLoading: false,
        email: ""
      });
      this.props.closePopup();
    });
  };

  render() {
    const { isLoading, error, days, day } = this.state;
    return (
      <div className="lp-wrap">
        <div className="lp-box">
          <div className="lp-title">
            LONG-PERIOD ORDER
            <a href="javascript:" onClick={this.props.closePopup}>
              <i className="far fa-times" />
            </a>
          </div>
          <div className="lp-body">
            <p>
              Do you want to order more than 6 days at once?
              <br />
              No problem, just drop as a line here to get in contact with our nutritionists.
            </p>
            <Input id="email" placeholder="Enter your email address" handleChange={this.handleChange} required={true} error={error} />
            <br />
            <label className="pt-label">
              How many days you want to order?
              <div className="pt-select pt-fill">
                <select value={day} onChange={this.changeDay}>
                  {days.map(d => (
                    <option value={d} key={d}>
                      {d} {d <= 1 ? "day" : "days"}
                    </option>
                  ))}
                </select>
              </div>
            </label>
            <br />
            <button type="submit" className="btn" onClick={this.handleSubmit} disabled={isLoading}>
              {isLoading ? <i className="far fa-spin fa-spinner-third" /> : "SUBMIT"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default LongPeriod;
