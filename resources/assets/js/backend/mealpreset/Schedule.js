import React, { Component } from "react";
import { view } from "react-easy-state";
import orderState from "../store/preset";
import moment from "moment";

import { ButtonGroup, Toaster, Position, Button, Intent, Alert, InputGroup, ControlGroup } from "@blueprintjs/core";

import DaysDrop from "./DaysDrop";
import DaysDrag from "./DaysDrag";
import DaysEditor from "./DaysEditor";

const appToaster = Toaster.create({ position: Position.TOP_RIGHT });

class Schedule extends Component {
  state = {
    schedules: []
  };

  async componentDidMount() {
    const meals = await this.loadMeals();
    const presets = await this.loadPresets();
    let schedules = null;
    let order = null;
    orderState.meals = meals.data;
    orderState.presets = presets.data;
    orderState.loadFrom = "preset";
  }

  loadMeals = () => axios.get("/admin/meal-plans/all");
  loadPresets = () => axios.get("/admin/presets/all");

  getPlan = (e, id) => {
    axios.get("/admin/meal-plans/" + id).then(res => {
      orderState.mealplans = res.data;
      orderState.showTable = false;
      orderState.loadFrom = "mealplan";
    });
  };

  getPreset = (e, id) => {
    axios.get("/admin/presets/" + id).then(res => {
      orderState.preset = res.data;
      orderState.showTable = false;
      orderState.loadFrom = "preset";
      orderState.presetName = res.data.preset_name;
      orderState.currentEmail = res.data.email;
    });
  };

  showComponentEditor = ({ e, type, day, data, source, id, sort }) => {
    orderState.editor = true;
    orderState.editorData = { type, day, data, source, id, sort };
  };

  saveComponentEditor = ({ id, index, pos, text, menu, source, delivery }) => {
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
    setTimeout(() => this.savePreset(), 150);
  };
  savePreset = async () => {
    orderState.isSaving = true;
    const { items, presetName, form, days, overwrite, currentEmail } = orderState;
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
    if (totalDays != totalItems) {
      appToaster.show({
        message: "Please fill all components",
        intent: Intent.DANGER
      });
      orderState.isSaving = false;
      return false;
    }
    axios
      .post("/admin/presets/new", {
        preset_name: presetName,
        data: JSON.stringify(items),
        days: totalDays,
        email: currentEmail,
        overwrite
      })
      .then(res => {
        if (res.data == "EXIST") {
          orderState.isSaving = false;
          orderState.alertOpen = true;
          return false;
        }
        appToaster.show({
          message: "Preset Saved",
          intent: Intent.SUCCESS
        });
        orderState.isSaving = false;
        orderState.alertOpen = false;
        orderState.overwrite = false;
        orderState.presets = res.data;
      });
  };
  handlePresetName = e => (orderState.presetName = e.target.value);
  handlePresetEmail = e => (orderState.currentEmail = e.target.value);
  handleLoadFrom = (e, source) => {
    orderState.showTable = true;
    orderState.loadFrom = source;
    orderState.mealplans = null;
    orderState.preset = null;
  };
  handleDrop(index, item) {
    const { mealplans, preset, loadFrom, days, items, schedules } = orderState;
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
    if (ACTION == "EDIT") {
      newItem = newItem.map((item, index) => {
        if (item) {
          let delivery = "";
          if (schedules[index]) {
            delivery = schedules[index].address;
          }
          return { ...item, delivery: delivery };
        } else {
          return null;
        }
      });
    }
    //console.log(newItem);
    orderState.items = newItem;
  }

  deletePreset = (e, id) => {
    if (window.confirm("Are you sure you want to delete this preset?")) {
      axios.post("/admin/presets/" + id + "/delete").then(res => {
        $(".preset-" + id).fadeOut();
      });
    }

    return false;
  };

  render() {
    const { active } = this.props;
    const { schedules } = this.state;
    const {
      days,
      items,
      copyData,
      alertOpen,
      editorData,
      editor,
      loadFrom,
      mealplans,
      isSaving,
      preset,
      meals,
      showTable,
      presets,
      datePeriods,
      dateRaw,
      presetName,
      currentEmail
    } = orderState;
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
          <p>You already have preset with this name. Saving this will overwrite the preset. Do you want to continue?</p>
        </Alert>
        <DaysEditor {...editorData} active={editor} saveData={this.saveComponentEditor} closeEditor={this.closeEditor} />
        <div className={`mp-schedule-wrapper mp-page active`}>
          <div className="mp-loadout">
            <h1>
              <i className="fa fa-clipboard-list" /> Preset / Meal Plan
              <div className="action-buttons">
                <a
                  href="javascript:"
                  title=""
                  className={loadFrom == "preset" ? "active" : ""}
                  onClick={e => this.handleLoadFrom(e, "preset")}
                >
                  Load Preset
                </a>
                <a
                  href="javascript:"
                  title=""
                  className={loadFrom == "mealplan" ? "active" : ""}
                  onClick={e => this.handleLoadFrom(e, "mealplan")}
                >
                  Load Meal Plan
                </a>
              </div>
            </h1>
            {showTable && (
              <div className="table-wrapper">
                {loadFrom && loadFrom == "mealplan" && (
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
                        meals.map(meal => (
                          <tr key={meal.id}>
                            <td>
                              <b>{meal.name}</b>
                            </td>
                            <td>{meal.category}</td>
                            <td className="mp-buttons">
                              <a href="javascript:" onClick={e => this.getPlan(e, meal.id)}>
                                LOAD
                              </a>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
                {loadFrom && loadFrom == "preset" && (
                  <table className="pt-table table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Days</th>
                        <th>&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      {presets &&
                        presets.map(preset => (
                          <tr key={preset.id} className={`preset-${preset.id}`}>
                            <td>{preset.preset_name}</td>
                            <td>{preset.email}</td>
                            <td>{preset.days}</td>
                            <td className="mp-buttons">
                              <a href="javascript:" onClick={e => this.getPreset(e, preset.id)}>
                                LOAD
                              </a>
                              &middot;
                              <a href="javascript:" onClick={e => this.deletePreset(e, preset.id)}>
                                DELETE
                              </a>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            {!showTable && (
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
                {loadFrom == "preset" && preset && (
                  <DaysDrag type="mp" key={`preset-${preset.id}`} id={preset.id} text={preset.preset_name} sort={1}>
                    {preset.data.map((plan, index) => (
                      <DaysDrag
                        type="days"
                        key={`preset-${index}`}
                        menu={plan.menu}
                        id={plan.id}
                        text=""
                        delivery={plan.delivery ? plan.delivery : ""}
                        sort={index}
                        showEditor={this.showComponentEditor}
                        copyDay={this.copyComponent}
                      />
                    ))}
                  </DaysDrag>
                )}
              </div>
            )}
          </div>
          <div className="mp-guest-schedule">
            <h1>
              <i className="fa fa-calendar-alt" /> Schedule
              <div className="action-buttons">
                <ControlGroup fill={false}>
                  <InputGroup placeholder="save preset as ..." onChange={this.handlePresetName} value={presetName} />
                  <InputGroup placeholder="email address" onChange={this.handlePresetEmail} value={currentEmail ? currentEmail : ""} />
                  <Button onClick={this.savePreset}>
                    <span>
                      <i className={`fal ${isSaving ? "fa-spinner-third fa-spin" : "fa-check"}`} />
                      &nbsp;
                      {isSaving ? "" : "SAVE"}
                    </span>
                  </Button>
                </ControlGroup>
              </div>
            </h1>
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
                  date={datePeriods[index]}
                  dateRaw={dateRaw[index]}
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
