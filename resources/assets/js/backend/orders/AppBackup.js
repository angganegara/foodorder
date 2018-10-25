import React, { Component } from "react";
import { ButtonGroup, Toaster, Position, Button, Intent, Alert, InputGroup, ControlGroup } from "@blueprintjs/core";

import DaysDrop from "./DaysDrop";
import DaysDrag from "./DaysDrag";
import DaysEditor from "./DaysEditor";
import Input from "./Input";

const appToaster = Toaster.create({ position: Position.TOP_RIGHT });

class App extends Component {
  state = {
    form: {
      fname: "",
      lname: "",
      email: "",
      phone: "",
      price: 0,
      discount: 0,
      delivery: 0,
      total: 0,
      payment_type: "cash",
      payment_date: "",
      amount_paid: 0
    },
    days: [
      { index: 0, day: 1 },
      { index: 1, day: 2 },
      { index: 2, day: 3 },
      { index: 3, day: 4 },
      { index: 4, day: 5 },
      { index: 5, day: 6 }
    ],
    availableDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    copyData: null,
    meals: null,
    mealplans: null,
    presets: null,
    preset: null,
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
    editor: false,
    editorData: null,
    isSaving: false,
    presetName: "",
    overwrite: false,
    alertOpen: false,
    loadFrom: "preset"
  };

  async componentDidMount() {
    const meals = await this.loadMeals();
    const presets = await this.loadPresets();
    this.setState({ meals: meals.data, presets: presets.data });
  }

  loadMeals = () => axios.get("/admin/meal-plans/all");
  loadPresets = () => axios.get("/admin/presets/all");

  handleDrop(index, item) {
    const { items } = this.state;
    const { mealplans, preset, loadFrom, days } = this.state;
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

  getPreset = (e, id) => {
    axios.get("/admin/presets/" + id).then(res => {
      this.setState({ preset: res.data }, () => {
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
      let newItems = [...items];
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
    let items = [...this.state.items];
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
  changeField = (e, column) => {
    this.setState({
      ...this.state,
      form: {
        ...this.state.form,
        [column]: e.target.value
      }
    });
  };
  changeTotalDays = e => {
    let newDays = [];
    let days = e.target.value;
    for (let i = 0; i < parseInt(days); i++) {
      newDays.push({
        index: i,
        day: i + 1
      });
    }
    this.setState({
      ...this.state,
      days: newDays
    });
  };
  closeAlert = () => this.setState({ ...this.state, alertOpen: false });
  overwritePreset = () => {
    this.setState({ ...this.state, overwrite: true, alertOpen: false });
    setTimeout(() => this.savePreset(), 150);
  };
  savePreset = async () => {
    this.setState({ ...this.state, isSaving: true });
    const { items, presetName, form, days, overwrite } = this.state;
    const totalDays = days.length;
    const totalItems = items.length;
    if (presetName == "") {
      appToaster.show({
        message: "Please enter preset name",
        intent: Intent.DANGER
      });
      this.setState({ ...this.state, isSaving: false });
      return false;
    }
    if (totalDays != totalItems) {
      appToaster.show({
        message: "Please fill all components",
        intent: Intent.DANGER
      });
      this.setState({ ...this.state, isSaving: false });
      return false;
    }
    axios
      .post("/admin/presets/new", {
        preset_name: presetName,
        data: JSON.stringify(items),
        days: totalDays,
        email: form.email,
        overwrite
      })
      .then(res => {
        if (res.data == "EXIST") {
          this.setState({ ...this.state, isSaving: false, alertOpen: true });
          return false;
        }
        appToaster.show({
          message: "Preset Saved",
          intent: Intent.SUCCESS
        });
        this.setState({ ...this.state, isSaving: false, alertOpen: false, overwrite: false, presets: res.data });
      });
  };
  handlePresetName = e => this.setState({ ...this.state, presetName: e.target.value });
  handleLoadFrom = (e, target) => this.setState({ loadFrom: target, mealplans: null, preset: null });

  render() {
    const {
      availableDays,
      mealplans,
      items,
      days,
      editor,
      editorData,
      alertOpen,
      meals,
      copyData,
      isSaving,
      loadFrom,
      presets,
      preset
    } = this.state;
    const { fname, lname, email, phone, price, discount, delivery, total } = this.state.form;
    const totalDays = days.length;
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
        <div className="mp-wrapper">
          <div className="mp-sidebar">
            <h1>Create New Order</h1>

            <div className="mp-sidebar-forms">
              <div className="columns form-inputs is-multiline">
                <Input label="First name" column="fname" value={fname} classNames="is-6" handleChange={this.changeField} />
                <Input label="Last name" column="lname" value={lname} classNames="is-6" handleChange={this.changeField} />
                <Input label="Email Address" column="email" value={email} classNames="is-6" handleChange={this.changeField} />
                <Input label="Phone number" column="phone" value={phone} classNames="is-6" handleChange={this.changeField} />

                <Input label="Price (Subtotal)" column="price" value={price} classNames="is-6" handleChange={this.changeField} />
                <Input label="Discount" column="discount" value={discount} classNames="is-6" handleChange={this.changeField} />
                <Input label="Delivery Fee" column="delivery" value={delivery} classNames="is-6" handleChange={this.changeField} />
                <Input label="Total Price" column="total" value={total} classNames="is-6" handleChange={this.changeField} />

                <div className="column is-12">
                  <label className="pt-label">
                    Days
                    <div className="pt-select">
                      <select onChange={this.changeTotalDays} defaultValue={totalDays}>
                        {availableDays.map((day, index) => (
                          <option value={day} key={index}>
                            {day} days
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>
                </div>
                <div className="column is-12">
                  <div className="separator">
                    <i className="fa fa-burn" />
                  </div>
                </div>
                <div className="column is-12 center">
                  <ButtonGroup large={true}>
                    <Button onClick={e => this.handleLoadFrom(e, "preset")} intent={loadFrom == "preset" ? Intent.PRIMARY : Intent.NONE}>
                      <i className="far fa-file" /> Preset
                    </Button>
                    <Button
                      onClick={e => this.handleLoadFrom(e, "mealplan")}
                      intent={loadFrom == "mealplan" ? Intent.PRIMARY : Intent.NONE}
                    >
                      <i className="far fa-database" /> Meal Plan
                    </Button>
                  </ButtonGroup>
                </div>
                <div className="column is-12">
                  <div className="load-plan">
                    {loadFrom &&
                      loadFrom == "mealplan" && (
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
                                  <td>
                                    <ButtonGroup minimal={false} large={false}>
                                      <Button icon="eye-open" text="" onClick={e => this.getPlan(e, meal.id)} />
                                    </ButtonGroup>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      )}
                    {loadFrom &&
                      loadFrom == "preset" && (
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
                                <tr key={preset.id}>
                                  <td>{preset.preset_name}</td>
                                  <td>{preset.email}</td>
                                  <td>{preset.days}</td>
                                  <td>
                                    <ButtonGroup minimal={false} large={false}>
                                      <Button icon="eye-open" text="" onClick={e => this.getPreset(e, preset.id)} />
                                    </ButtonGroup>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mp-inner">
            <h1>meal plan components</h1>
            <div className="mp-inner-content">
              <div className="columns form-inputs is-multiline">
                <div className="column is-12">
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
                <div className="column is-6">
                  <label className="custom-label">Save Preset</label>
                  <ControlGroup fill={false}>
                    <InputGroup placeholder="save preset as ..." onChange={this.handlePresetName} />
                    <Button onClick={this.savePreset}>
                      <span>
                        <i className={`fal ${isSaving ? "fa-spinner-third fa-spin" : "fa-check"}`} />
                        &nbsp;
                        {isSaving ? "" : "SAVE"}
                      </span>
                    </Button>
                  </ControlGroup>
                </div>
                <div className="column is-12">
                  <Button icon="plus" text="SUBMIT" intent={Intent.PRIMARY} large={true} onClick={this.handleSubmit} />
                </div>
              </div>
            </div>
            <div className="mp-loadout">
              {loadFrom == "mealplan" &&
                mealplans && (
                  <div className="mp-loadout-scroll-area">
                    <div className="test-drag-wrapper writable">
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
                  </div>
                )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
