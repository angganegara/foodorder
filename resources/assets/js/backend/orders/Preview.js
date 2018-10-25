import React, { Component } from "react";
import { view } from "react-easy-state";
import { Toaster, Position, Intent } from "@blueprintjs/core";

import orderState, { sessionKey } from "../store/order";
import numeral from "numeral";
import moment from "moment";

const price = price => numeral(price).format("0,0");
const appToaster = Toaster.create({ position: Position.TOP_RIGHT });

class Preview extends Component {
  state = {
    isLoading: false
  };

  formatDate = date => moment(date).format("DD MMM YYYY");

  handleSubmit = () => {
    const { form, items, dateRaw, category } = orderState;
    const data = {
      fname: form.fname,
      lname: form.lname,
      email: form.email,
      phone: form.phone,
      subtotal: form.price,
      delivery_price: form.delivery,
      coupon_value: form.discount,
      total: form.total,
      items: items,
      dates: dateRaw,
      category: category
    };
    this.setState({ isLoading: true });

    axios.post("/admin/orders/new", { data }).then(res => {
      appToaster.show({
        message: "Order successfully saved. Redirecting to order page",
        intent: Intent.SUCCESS
      });
      this.setState({ isLoading: false });
      console.log(res.data);
      window.sessionStorage.removeItem(sessionKey);
      setTimeout(() => {
        window.location.href = `/admin/orders/${res.data.order_number}/${res.data.id}`;
      }, 3000);
    });
  };

  render() {
    const { form, endDate, items, datePeriods, startingDate, category, preview } = orderState;
    const { active } = this.props;
    const { isLoading } = this.state;
    return (
      preview && (
        <React.Fragment>
          <div className={`mp-preview-wrapper mp-page ${active ? "active" : ""}`}>
            <div className="preview-body half">
              <h1>
                <i className="fa fa-address-card" /> customer details
              </h1>
              <div className="columns is-multiline form-preview">
                <div className="column is-4 label">First Name</div>
                <div className="column is-8 value">{form.fname}</div>
                <div className="column is-4 label">Last Name</div>
                <div className="column is-8 value">{form.lname}</div>
                <div className="column is-4 label">Phone</div>
                <div className="column is-8 value">{form.phone}</div>
                <div className="column is-4 label">Email</div>
                <div className="column is-8 value">{form.email}</div>
                <div className="column is-4 label no-border">Meal Category</div>
                <div className="column is-8 value no-border">{category.name}</div>
              </div>
            </div>
            <div className="preview-body half">
              <h1>
                <i className="fa fa-money-bill" /> Payment Details
              </h1>
              <div className="columns is-multiline form-preview">
                <div className="column is-4 label">Subtotal</div>
                <div className="column is-8 value">IDR {price(form.price)}</div>
                <div className="column is-4 label">Discount</div>
                <div className="column is-8 value">{form.discount > 0 ? "IDR " + price(form.discount) : "-"}</div>
                <div className="column is-4 label">Delivery Fee</div>
                <div className="column is-8 value">{form.delivery > 0 ? "IDR " + price(form.delivery) : "-"}</div>
                <div className="column is-4 label no-border">Total Price</div>
                <div className="column is-8 value no-border">IDR {price(form.total)}</div>
              </div>
            </div>
            <div className="preview-body full">
              <h1>
                <i className="fa fa-calendar-alt" /> Customer Schedule
              </h1>
              <div className="page-date-periods">
                <div className="date-pill">{this.formatDate(startingDate)}</div>
                <i className="far fa-arrow-right" />
                <div className="date-pill">{this.formatDate(endDate)}</div>
              </div>
              <br />
              <div className="preview-schedule">
                {items &&
                  items.map((item, index) => (
                    <React.Fragment key={index}>
                      {item && (
                        <div className="schedule-card">
                          <div className="schedule-title">
                            <span>DAY {index + 1}</span>
                            <span>{datePeriods[index]}</span>
                          </div>
                          <div className="schedule-menu">
                            <span>B. {item.menu.b}</span>
                            <hr />
                            <span>S. {item.menu.bs}</span>
                            <hr />
                            <span>L. {item.menu.l}</span>
                            <hr />
                            <span>S. {item.menu.ls}</span>
                            <hr />
                            <span>D. {item.menu.d}</span>
                          </div>
                          <div className="schedule-delivery">
                            <span>DELIVERY ADDRESS</span>
                            <div>{item.delivery}</div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
              </div>
            </div>
            <a href="javascript:" title="" onClick={this.handleSubmit} className="next preview-nav">
              {!isLoading && (
                <span>
                  <i className="fa fa-fw fa-save" /> SAVE
                </span>
              )}
              {isLoading && (
                <span>
                  <i className="fal fa-spinner-third fa-spin" />
                </span>
              )}
            </a>
          </div>
        </React.Fragment>
      )
    );
  }
}

export default view(Preview);
