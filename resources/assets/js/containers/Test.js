import React, { Component } from "react";
import { guid, parsePrice } from "../helpers/cart";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

let randomId = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
let randomDuration = [2, 3, 4, 5];
let randomPackageId = [1, 2];
let randomStartDate = [
  "2018-11-10",
  "2018-11-11",
  "2018-11-12",
  "2018-11-13",
  "2018-11-14",
  "2018-11-15",
  "2018-11-16",
  "2018-11-17",
  "2018-11-18"
];
let randomPickup = [1, 2, "address"];

class Test extends Component {
  state = {
    added: [],
    cartKey: null,
    finish: false
  };

  getItem = id => this.state.added.filter(item => item.key === id);

  addtoCart = () => {
    const { added } = this.state;

    let id = randomId[Math.floor(Math.random() * randomId.length)];
    let packageId = randomPackageId[Math.floor(Math.random() * randomPackageId.length)];
    let duration = packageId == 1 ? 6 : randomDuration[Math.floor(Math.random() * randomDuration.length)];
    let startDate = randomStartDate[Math.floor(Math.random() * randomStartDate.length)];
    let pickup = randomPickup[Math.floor(Math.random() * randomPickup.length)];
    let address = pickup !== 1 || pickup !== 2 ? "Jalan Jalan" : null;
    let area = address ? "Bukit" : null;

    if (!startDate) {
      appToaster.show({
        message: "Please select the delivery starting date",
        intent: Intent.DANGER
      });
      return false;
    }

    let item = this.getItem(id);

    const range = moment.rangeFromInterval("days", duration, startDate);
    const key = guid();
    let daysData = [];
    for (let days of range.by("days")) {
      // skip sunday if any
      if (days.format("d") != "0") {
        daysData.push({
          label: days.format("ddd, MMM DD"),
          date: days.format("YYYY-MM-DD"),
          isSaturday: days.format("d") == "6",
          pickup,
          address,
          area,
          snacks: [],
          snacksQty: {}
        });
      }
    }

    let data = {
      key,
      id,
      packageId,
      duration: daysData.length,
      slimSunday: false,
      schedules: daysData,
      complete: true
    };

    if (!item.length) {
      this.setState({ added: [...added, data] });
    } else {
      // sudah ada
      const index = added.findIndex(item => item.key === id);
      let newAdded = [...added];
      newAdded[index] = data;
      this.setState({ added: newAdded });
    }
  };

  getIndex = id => this.state.added.findIndex(item => item.key === id);
  loadFood = id => axios.get(`/api/foods/${id}`);

  finalizeCart = async () => {
    const { added, cartKey } = this.state;
    const activeItem = added[0];
    const id = activeItem.id;

    const dateStart = activeItem.schedules[0].date;
    const dateEnd = activeItem.schedules[activeItem.schedules.length - 1].date;

    const response = await this.loadFood(id);
    const food = response.data;
    const title = food.name;
    const slug = food.slug;

    const schedules = activeItem.schedules;
    const slimSundayPrice = activeItem.slimSunday ? 300000 : 0;

    let foodPrice = food.prices.filter(f => f.sort === activeItem.packageId)[0].price;
    foodPrice = activeItem.packageId === 2 ? foodPrice * schedules.length : foodPrice;

    const snacksPrice = 0;
    const deliveryPrice = 0;

    const totalPrice = parseInt(foodPrice) + parseInt(snacksPrice) + parseInt(slimSundayPrice) + parseInt(deliveryPrice);

    let newData = {
      ...activeItem,
      complete: true,
      weeks: 1,
      qty: 1,
      title,
      slug,
      dateStart,
      dateEnd,
      schedules,
      foodPrice,
      snacksPrice,
      deliveryPrice,
      totalPrice
    };
    let newState = [newData];
    console.log(newState);

    // actually that's all ... no we're just showing popup
    // switch to server side cart, lets try
    let url = "";
    let postData = null;
    url = "/api/cart/save";
    postData = { data: JSON.stringify(newState) };
    axios.post(url, postData).then(res => {
      const cartKey = res.data;
      this.setState({
        added: newState,
        cartKey
      });
    });
  };

  getTotalDeliveryPrice = () => this.state.added.reduce((accu, total) => accu + total.deliveryPrice, 0);
  handleCheckout = () => {
    const payment = "cash";
    const { added, cartKey } = this.state;
    if (!cartKey) {
      console.log(added[0].id, "cartkey is null!");
      return false;
    }
    const subTotal = added.reduce((accu, total) => accu + total.totalPrice, 0);
    const deliveryPrice = this.getTotalDeliveryPrice();
    const form = {
      fname: "Angga",
      lname: "Negara",
      email: "angga@me.com",
      phone: "123123123",
      comments: "Whatever",
      terms: true,
      coupon: "PROTEIN NOVEMBER",
      couponValue: 150000,
      couponItem: "",
      deliveryprice: 0,
      discount: 0
    };

    const data = {
      cart: added,
      cartKey: cartKey,
      form,
      methods: payment,
      subTotal,
      deliveryPrice
    };

    // for now we assume payment is cash
    axios
      .post("/api/create-order", data)
      .then(res => {
        let ordernumber = res.data;
        this.continueCheckout(ordernumber);
      })
      .catch(err => {
        if (err.response.data == "EMPTY-SCHEDULES") {
          console.log("empty schedules");
        } else {
          console.log("other error : ", err.response.data);
        }
      });
  };

  continueCheckout = ordernumber => {
    const methods = "cash";
    axios
      .post("/checkout/start", { ordernumber, methods })
      .then(res => {
        const { code, message } = res.data;

        switch (code) {
          case 100:
            if (message == "SUCCESS") {
              this.setState({ finish: true });
              this.clearCart();
            }
            break;
        }
      })
      .catch(err => {
        window.alert(
          "Something went wrong and the admin has been notified.\nPlease try again in few minutes or choose another payment methods."
        );
        console.log(err.response.data);
      });
  };

  clearCart = () => {
    const { cartKey } = this.state;
    axios.post("api/cart/empty", { cartKey }).then(res => {
      this.setState({
        added: [],
        cartKey: null
      });
    });
  };

  generateRandomOrder = async e => {
    e.preventDefault();
    let max = 10;
    let start = 1;
    setInterval(() => {
      if (start < max) {
        this.generateCart();
        start += 1;
        document.getElementById("start").innerText = start;
      }
    }, 2000);
  };

  generateCart = e => {
    this.addtoCart();
    setTimeout(() => {
      this.finalizeCart();
      setTimeout(() => {
        this.handleCheckout();
      }, 500);
    }, 250);
  };

  render() {
    const { finish } = this.state;
    return (
      <React.Fragment>
        <section className="top home intro">
          <div className="container">
            <h1>Meal Plans</h1>
          </div>
          <div className="bg" />
        </section>
        <section className="home foods">
          <div className="container">
            <h2>Generate Orders</h2>
            <a href="javascript:;" title="" className="btn" onClick={this.generateRandomOrder}>
              Generate Order
            </a>
            <br />
            <br />
            {finish && <span>FINISH!</span>}
            <br />
            <span id="start">1</span> / 10
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Test;
