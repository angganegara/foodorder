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

  handleSubmit = (e, { sendEmail }) => {
    const { form, items, dateRaw, category, duration, cartID } = orderState;
    const order = ORDER;
    const user = USER;
    const data = {
      orderID: order.id,
      cartID: cartID,
      fname: form.fname,
      lname: form.lname,
      email: form.email,
      phone: form.phone,
      gender: form.gender,
      slimsunday: form.slimSunday,
      comments: form.comments,
      subtotal: form.price,
      delivery_price: form.delivery,
      eco_price: form.ecoPrice,
      coupon_value: form.discount,
      total: form.total,
      items: items,
      duration: duration,
      dates: dateRaw,
      category: category,
      sendEmail: sendEmail,
      user: user
    };

    this.setState({ isLoading: true });
    const successAction = ACTION == "NEW" ? "saved" : "updated";
    const url = ACTION == "NEW" ? "/admin/orders/new" : "/admin/orders/" + ORDER.id + "/edit";
    const successMessage = sendEmail
      ? "Order successfully " + successAction + " and email is sent to customer. Redirecting to order page"
      : "Order successfully " + successAction + ". Redirecting to order page";

    axios.post(url, { data }).then(res => {
      appToaster.show({
        message: successMessage,
        intent: Intent.SUCCESS
      });
      this.setState({ isLoading: false });
      window.sessionStorage.removeItem(sessionKey);
      setTimeout(() => {
        window.location.href = `/admin/orders/${res.data.order_number}/${res.data.id}`;
      }, 30000);
    });
  };
  confirmSendingEmail = () => {
    if (window.confirm("This will send email to customer. Continue?")) {
      this.handleSubmit(null, { sendEmail: true });
    } else {
      return false;
    }
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
              <h1 className="edit">
                <i className="fa fa-address-card" /> customer details
                <a href="javascript:" onClick={e => this.props.goto(e, 1)} title="" className="heading-edit">
                  <i className="far fa-pencil" /> Edit
                </a>
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
              <h1 className="edit">
                <i className="fa fa-money-bill" /> Payment Details
                <a href="javascript:" onClick={e => this.props.goto(e, 1)} title="" className="heading-edit">
                  <i className="far fa-pencil" /> Edit
                </a>
              </h1>
              <div className="columns is-multiline form-preview">
                <div className="column is-4 label">Subtotal</div>
                <div className="column is-8 value">IDR {price(form.price)}</div>
                <div className="column is-4 label">Discount</div>
                <div className="column is-8 value">{form.discount > 0 ? "IDR " + price(form.discount) : "-"}</div>
                <div className="column is-4 label">Eco Pack</div>
                <div className="column is-8 value">{form.ecoPrice > 0 ? "IDR " + price(form.ecoPrice) : "-"}</div>
                <div className="column is-4 label">Delivery Fee</div>
                <div className="column is-8 value">{form.delivery > 0 ? "IDR " + price(form.delivery) : "-"}</div>
                <div className="column is-4 label no-border">Total Price</div>
                <div className="column is-8 value no-border">IDR {price(form.total)}</div>
              </div>
            </div>
            <div className="preview-body full">
              <h1 className="edit">
                <i className="fa fa-calendar-alt" /> Customer Schedule
                <a href="javascript:" onClick={e => this.props.goto(e, 2)} title="" className="heading-edit">
                  <i className="far fa-pencil" /> Edit
                </a>
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
            <a href="javascript:" title="" onClick={e => this.handleSubmit(e, { sendEmail: false })} className="next preview-nav">
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
            {ACTION == "NEW" && (
              <a href="javascript:" title="" onClick={this.confirmSendingEmail} className="next preview-nav preview-email">
                {!isLoading && (
                  <span>
                    <i className="fa fa-fw fa-envelope" /> SAVE &amp; SEND EMAIL
                  </span>
                )}
                {isLoading && (
                  <span>
                    <i className="fal fa-spinner-third fa-spin" />
                  </span>
                )}
              </a>
            )}
          </div>
        </React.Fragment>
      )
    );
  }
}

export default view(Preview);
