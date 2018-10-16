import React, { Component } from "react";
import { ButtonGroup, Button, Intent } from "@blueprintjs/core";

import DaysDrop from "./DaysDrop";
import DaysDrag from "./DaysDrag";
import DaysEditor from "./DaysEditor";

class IndexMP extends Component {
  state = {
    days: [
      { index: 0, day: 1 },
      { index: 1, day: 2 },
      { index: 2, day: 3 },
      { index: 3, day: 4 },
      { index: 4, day: 5 },
      { index: 5, day: 6 }
    ],
    copyData: null,
    meals: null,
    mealplans: null,
    items: [],
    categories: [
      "PALEO",
      "GAINER",
      "ALKALINE",
      "KETOGENIC",
      "SHREDDING",
      "BALANCED",
      "PROTEIN",
      "SOUP DETOX",
      "JUICE DETOX",
      "SLIM BOOSTER DETOX"
    ],
    category: "",
    name: "",
    editor: false,
    editorData: null
  };

  async componentDidMount() {
    const { data } = await this.loadMeals();
    this.setState({ meals: data });
  }

  loadMeals = () => {
    return axios.get("/admin/meal-plans/all");
  };

  handleDrop(index, item) {
    const { items } = this.state;
    const { mealplans, days } = this.state;
    let newItem;
    if (item.type === "days") {
      newItem = [...items];
      newItem[index] = item;
    } else {
      // get the current meal plan's components
      const totalDays = days.length; // 5
      for (let i = index; i < totalDays; i++) {
        let mpIndex = i - index;
        items[i] = mealplans.days[mpIndex] ? mealplans.days[mpIndex] : items[i] ? items[i] : null;
      }
      newItem = items;
    }
    this.setState({
      ...this.state,
      items: newItem
    });
  }

  getPlan = (e, id) => {
    axios.get("/admin/meal-plans/" + id).then(res => {
      this.setState({ mealplans: res.data }, () => {
        document.querySelector(".test-drag-wrapper").scrollIntoView({
          behavior: "smooth"
        });
      });
    });
  };

  showComponentEditor = ({ e, type, day, data, source, id, sort }) => {
    this.setState({
      editor: true,
      editorData: { type, day, data, source, id, sort }
    });
  };

  saveComponentEditor = ({ id, index, pos, text, menu, source }) => {
    if (source == "text") {
      const { items } = this.state;
      let newItems = { ...items };
      newItems[pos] = {
        id,
        index,
        pos,
        text,
        menu,
        type: "days"
      };

      this.setState({
        ...this.state,
        items: newItems,
        editor: false
      });
    } else if (source == "database") {
      const mpDays = this.state.mealplans.days;
      const { breakfast, breakfast_snack, lunch, lunch_snack, dinner } = menu;
      let newDays = [...mpDays];
      let index = newDays.findIndex(day => day.id === id);
      newDays[index].menu = {
        b: breakfast,
        bs: breakfast_snack,
        l: lunch,
        ls: lunch_snack,
        d: dinner
      };
      this.setState({
        mealplans: {
          ...this.state.mealplans,
          days: newDays
        }
      });
    }
  };
  copyComponent = data => {
    this.setState({
      ...this.state,
      copyData: data
    });
  };
  pasteComponent = (e, index) => {
    e.preventDefault();
    const { copyData } = this.state;
    let items = { ...this.state.items };
    items[index] = copyData;
    this.setState({
      ...this.state,
      items: items
    });
  };
  clearCompoonent = ({ index }) => {
    let items = [...this.state.items];
    items[index] = null;
    this.setState({
      items
    });
  };
  closeEditor = () => this.setState({ editor: false });
  changeCategory = e => {
    this.setState({ category: e.target.value, name: e.target.value + "_" });
  };
  changeName = e => this.setState({ name: e.target.value });
  handleSubmit = () => {
    const { name, category, items } = this.state;
    if (name != "" && category != "") {
      let totalDays = Object.keys(items).length;
      if (totalDays < 6) {
        window.alert("Please enter all components");
        return false;
      }
      // lets rock and roll
      axios.post("/admin/meal-plans/new", { name, category, items }).then(res => {
        window.location = "/admin/meal-plans" + res.data;
      });
      return true;
    }
    window.alert("Please enter all fields");
    return false;
  };

  render() {
    const { mealplans, items, days, editor, editorData, categories, name, meals, copyData } = this.state;
    return (
      <React.Fragment>
        <DaysEditor {...editorData} active={editor} saveData={this.saveComponentEditor} closeEditor={this.closeEditor} />
        <div className="mp-wrapper">
          <h1>Add New Meal Plan</h1>
          <div className="inner">
            <div className="columns form-inputs is-multiline">
              <div className="column is-6">
                <label className="pt-label">
                  Meal Plan Category
                  <div className="pt-select">
                    <select onChange={this.changeCategory}>
                      <option value="">Select category</option>
                      {categories.map((category, index) => (
                        <option value={category} key={index}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>
              </div>
              <div className="column is-6">
                <label className="pt-label">
                  Meal Plan Name
                  <input className="pt-input pt-fill" type="text" onChange={this.changeName} value={name} />
                </label>
              </div>
              <div className="column is-12">
                <label className="pt-label">Meal Plan Components</label>
                <div className="dropzone-wrapper">
                  {days.map(day => (
                    <DaysDrop
                      key={day.index}
                      day={day.day}
                      items={items}
                      index={day.index}
                      onDrop={item => this.handleDrop(day.index, item)}
                      showEditor={this.showComponentEditor}
                      copyDay={this.copyComponent}
                      clearDay={this.clearCompoonent}
                      copyData={copyData}
                      pasteData={this.pasteComponent}
                    />
                  ))}
                </div>
              </div>
              <div className="column is-12">
                <Button icon="plus" text="SUBMIT" intent={Intent.PRIMARY} large={true} onClick={this.handleSubmit} />
              </div>
            </div>
          </div>
          <br />
          <h1>Manage Meal Plans</h1>
          {!mealplans && (
            <div className="inner">
              <div className="mp-loadout">
                <span className="icon">
                  <i className="fal fa-archive" />
                </span>
                <p>
                  Select any Meal Plan below and
                  <br />
                  click <span className="pt-icon-standard pt-icon-eye-open" /> to load the plan here
                </p>
              </div>
            </div>
          )}
          {mealplans && (
            <div className="test-drag-wrapper">
              <DaysDrag type="mp" key={mealplans.id} id={mealplans.id} text={mealplans.name} sort={1}>
                {mealplans.days.map((plan, index) => (
                  <DaysDrag
                    type="days"
                    key={plan.id}
                    menu={plan.menu}
                    id={plan.id}
                    text=""
                    sort={index}
                    showEditor={this.showComponentEditor}
                    copyDay={this.copyComponent}
                  />
                ))}
              </DaysDrag>
            </div>
          )}
          <br />
          <div className="inner">
            <table className="pt-table table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th colSpan="6">Example menu</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {meals &&
                  meals.map(meal => (
                    <tr key={meal.id}>
                      <td>{meal.name}</td>
                      <td>{meal.category}</td>
                      <td>
                        <b>Day 1</b>
                        <br />
                        B. {meal.day_1.breakfast}
                      </td>
                      <td>
                        <b>Day 2</b>
                        <br />
                        B. {meal.day_2.breakfast}
                      </td>
                      <td>
                        <b>Day 3</b>
                        <br />
                        B. {meal.day_3.breakfast}
                      </td>
                      <td>
                        <b>Day 4</b>
                        <br />
                        B. {meal.day_4.breakfast}
                      </td>
                      <td>
                        <b>Day 5</b>
                        <br />
                        B. {meal.day_5.breakfast}
                      </td>
                      <td>
                        <b>Day 6</b>
                        <br />
                        B. {meal.day_6.breakfast}
                      </td>
                      <td>
                        <ButtonGroup minimal={false} large={false}>
                          <Button icon="eye-open" text="" onClick={e => this.getPlan(e, meal.id)} />
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default IndexMP;
