import React, { Component } from "react";
import { view } from "react-easy-state";
import orderState from "../store/order";
import moment from "moment";

import { Toaster, Position, Intent, Alert } from "@blueprintjs/core";

import DaysDrop from "./DaysDrop";
import DaysDrag from "./DaysDrag";
import DaysEditor from "./DaysEditor";

const appToaster = Toaster.create({ position: Position.TOP_RIGHT });

class Schedule extends Component {
  state = {
    categories: null
  };
  async componentDidMount() {
    this.loadCategories();
    const meals = await this.loadMeals();
    orderState.meals = meals.data;
    orderState.isSaving = false;
    orderState.showTable = true;
    orderState.mealplans = null;
    orderState.alertOpen = false;
    orderState.loadFrom = "mealplan";
  }

  loadMeals = () => axios.get("/admin/meal-plans/all");
  loadCategories = () => axios.get("/api/foods").then(res => this.setState({ categories: res.data }));

  getPlan = (e, id) => {
    axios.get("/admin/meal-plans/" + id).then(res => {
      orderState.mealplans = res.data;
      orderState.showTable = false;
      orderState.loadFrom = "mealplan";
    });
  };

  showComponentEditor = ({ e, type, day, data, source, id, sort }) => {
    orderState.editor = true;
    orderState.editorData = { type, day, data, source, id, sort };
  };

  saveComponentEditor = ({ id, index, pos, text, menu, source, delivery, sort }) => {
    if (source == "text") {
      const { items } = orderState;
      let newItems = [...items];
      newItems[pos] = {
        delivery,
        id,
        index,
        pos,
        text,
        menu,
        type: "days"
      };

      orderState.items = newItems;
      orderState.editor = false;
    }

    if (source == "database") {
      const { breakfast, breakfast_snack, lunch, lunch_snack, dinner } = menu;
      orderState.mealplans.days[sort].menu = {
        b: breakfast,
        bs: breakfast_snack,
        l: lunch,
        ls: lunch_snack,
        d: dinner
      };
    }
  };
  copyComponent = data => (orderState.copyData = data);
  pasteComponent = (e, index) => {
    const { copyData } = orderState;
    let items = [...orderState.items];
    items[index] = copyData;
    orderState.items = items;
  };
  clearCompoonent = ({ index }) => {
    let items = [...orderState.items];
    items[index] = null;
    orderState.items = items;
  };
  closeEditor = () => (orderState.editor = false);
  closeAlert = () => (orderState.alertOpen = false);
  overwritePreset = () => {
    orderState.overwrite = true;
    orderState.alertOpen = false;
    setTimeout(() => this.handleSubmit(), 150);
  };
  showTable = () => {
    orderState.showTable = true;
    orderState.mealplans = null;
  };
  handleDrop(index, item) {
    const { mealplans, preset, loadFrom, days, items } = orderState;
    let newItem;
    if (item.type === "days") {
      newItem = [...items];
      newItem[index] = item;
    } else {
      // get the current meal plan's components
      const totalDays = days.length; // 5
      for (let i = index; i < totalDays; i++) {
        let mpIndex = i - index;
        if (loadFrom == "mealplan") {
          items[i] = mealplans.days[mpIndex] ? mealplans.days[mpIndex] : items[i] ? items[i] : null;
        } else {
          items[i] = preset.data[mpIndex] ? preset.data[mpIndex] : items[i] ? items[i] : null;
        }
      }
      newItem = items;
    }
    orderState.items = newItem;
  }
  changeTotalDays = e => {
    let newDays = [];
    let days = e.target.value;
    for (let i = 0; i < parseInt(days); i++) {
      newDays.push({
        index: i,
        day: i + 1
      });
    }
    orderState.days = newDays;
  };
  changeCategory = e => {
    const { categories } = this.state;
    let id = e.target.value;
    if (id == "") {
      orderState.category = null;
    } else {
      let category = null;
      if (id == 10 || id == 11 || id == 12) {
        let parent = categories.filter(category => category.id == 8)[0];
        category = parent.children.filter(child => child.id == id)[0];
      } else {
        category = categories.filter(category => category.id == id)[0];
      }
      orderState.category = {
        id: category.id,
        name: category.name
      };
    }
  };
  handleSubmit = () => {
    orderState.isSaving = true;
    const { items, presetName, days, overwrite, category } = orderState;
    const totalDays = days.length;
    const totalItems = items.length;
    if (presetName == "") {
      appToaster.show({
        message: "Please enter preset name",
        intent: Intent.DANGER
      });
      orderState.isSaving = false;
      return false;
    }
    if (!category) {
      appToaster.show({
        message: "Please select a category",
        intent: Intent.DANGER
      });
      orderState.isSaving = false;
      return false;
    }
    if (totalDays != totalItems) {
      appToaster.show({
        message: "Please fill all components",
        intent: Intent.DANGER
      });
      orderState.isSaving = false;
      return false;
    }
    axios
      .post("/admin/meal-plans/new", {
        name: presetName,
        data: JSON.stringify(items),
        days: totalDays,
        category,
        overwrite
      })
      .then(res => {
        if (res.data == "EXIST") {
          orderState.isSaving = false;
          orderState.alertOpen = true;
          return false;
        }
        appToaster.show({
          message: "New Meal Plan Saved",
          intent: Intent.SUCCESS
        });
        orderState.isSaving = false;
        orderState.alertOpen = false;
        orderState.overwrite = false;
        orderState.meals = res.data;
        orderState.items = [];
        orderState.presetName = "";
        orderState.showTable = true;
        orderState.category = null;
        orderState.mealplans = null;
      });
  };
  handleName = e => (orderState.presetName = e.target.value);

  deletePlan = (e, id) => {
    if (window.confirm("Are you sure you want to delete this meal plan?")) {
      axios.post("/admin/meal-plans/" + id + "/delete").then(res => {
        $(".mp-" + id).fadeOut();
      });
    }

    return false;
  };

  handleMealName = (e, index) => {
    let meals = [...orderState.meals];
    meals[index].name = e.target.value;
    orderState.meals = meals;
  };

  handleSaveMealName = (e, index, id) => {
    axios
      .post("/admin/meal-plans/" + id + "/update", {
        id,
        name: orderState.meals[index].name
      })
      .then(res => {
        appToaster.show({
          message: "Meal Plan Updated",
          intent: Intent.SUCCESS
        });
      });
  };

  render() {
    const {
      days,
      items,
      presetName,
      copyData,
      editorData,
      editor,
      loadFrom,
      mealplans,
      isSaving,
      category,
      showTable,
      meals,
      alertOpen
    } = orderState;
    const { categories } = this.state;

    return (
      <React.Fragment>
        <Alert
          confirmButtonText="Yes"
          canOutsideClickCancel={true}
          cancelButtonText="Cancel"
          canEscapeKeyCancel={true}
          onCancel={this.closeAlert}
          isOpen={alertOpen}
          onConfirm={this.overwritePreset}
          icon="warning-sign"
        >
          <p>You already have Meal Plan with this name. Saving this will overwrite the meal plan. Do you want to continue?</p>
        </Alert>
        <DaysEditor {...editorData} active={editor} saveData={this.saveComponentEditor} closeEditor={this.closeEditor} />
        <div className={`mp-schedule-wrapper mp-page active mp-manage`}>
          <div className="mp-loadout">
            <h1>
              <i className="fa fa-clipboard-list" /> Meal Plan Database
              <div className="action-buttons">
                {!showTable && (
                  <a href="javascript:" onClick={this.showTable}>
                    <i className="far fa-undo" /> Show Table
                  </a>
                )}
              </div>
            </h1>
            {showTable && (
              <div className="table-wrapper">
                <table className="pt-table table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meals &&
                      meals.map((meal, mealIndex) => (
                        <tr key={meal.id} className={`mp-${meal.id}`}>
                          <td>
                            <div className="pt-control-group">
                              <input type="text" value={meal.name} className="pt-input" onChange={e => this.handleMealName(e, mealIndex)} />
                              <button className="pt-button" onClick={e => this.handleSaveMealName(e, mealIndex, meal.id)}>
                                SAVE
                              </button>
                            </div>
                          </td>
                          <td>{meal.category}</td>
                          <td className="mp-buttons">
                            <a href="javascript:" onClick={e => this.getPlan(e, meal.id)}>
                              LOAD
                            </a>
                            &middot;
                            <a href="javascript:" onClick={e => this.deletePlan(e, meal.id)}>
                              DELETE
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="dragzone-wrapper writable">
              {loadFrom == "mealplan" && mealplans && (
                <DaysDrag type="mp" key={`mealplan-${mealplans.id}`} id={mealplans.id} text={mealplans.name} sort={1}>
                  {mealplans.days.map((plan, index) => (
                    <DaysDrag
                      type="days"
                      key={`mealplan-${index}`}
                      menu={plan.menu}
                      id={plan.id}
                      text=""
                      delivery=""
                      sort={index}
                      showEditor={this.showComponentEditor}
                      copyDay={this.copyComponent}
                    />
                  ))}
                </DaysDrag>
              )}
            </div>
          </div>
          <div className="mp-guest-schedule">
            <h1>
              <i className="fa fa-calendar-alt" /> Meal Plan Editor
              <div className="action-buttons reverse">
                <a href="javascript:" onClick={this.handleSubmit}>
                  {isSaving && (
                    <span>
                      <i className="fa fa-fw fa-spinner-third fa-spin" />
                    </span>
                  )}
                  {!isSaving && (
                    <span>
                      <i className="fa fa-fw fa-save" /> Save
                    </span>
                  )}
                </a>
              </div>
            </h1>
            <div className="mp-form">
              <input placeholder="meal plan name" className="pt-input" onChange={this.handleName} value={presetName} />
              <div className="pt-select">
                <select onChange={this.changeCategory} value={category ? category.id : ""}>
                  <option value="">Select Meal Plan Category</option>
                  {categories &&
                    categories.map((c, index) => (
                      <React.Fragment key={c.id}>
                        {c.id != 8 && <option value={c.id}>{c.name}</option>}
                        {c.id == 8 &&
                          c.children.map(subcat => (
                            <option value={subcat.id} key={subcat.id}>
                              Detox - {subcat.name}
                            </option>
                          ))}
                      </React.Fragment>
                    ))}
                </select>
              </div>
            </div>
            <div className="dropzone-wrapper">
              {days.map((day, index) => (
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
        </div>
      </React.Fragment>
    );
  }
}

export default view(Schedule);
