import React, { Component } from "react";

class DaysEditor extends Component {
  state = {
    id: null,
    sort: null,
    b: "",
    bs: "",
    l: "",
    ls: "",
    d: ""
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.source == "text") {
      const { data } = nextProps;
      if (nextProps.type == "edit") {
        const { b, bs, l, ls, d } = data.menu;
        this.setState({ b, bs, l, ls, d });
      } else {
        this.setState({
          b: "",
          bs: "",
          l: "",
          ls: "",
          d: ""
        });
      }
    }
    if (nextProps.source == "database") {
      // database - only edit
      const { b, bs, l, ls, d } = nextProps.data;
      const { id } = nextProps;
      this.setState({ id, b, bs, l, ls, d });
    }
  }

  handleChange = (e, type) => {
    this.setState({
      [type]: e.target.value
    });
  };

  closeEditor = () => {
    this.props.closeEditor();
  };
  handleSubmit = () => {
    const { b, bs, l, ls, d } = this.state;
    const { day, source, sort, id } = this.props;
    if (source == "text") {
      this.props.saveData({
        id: day,
        index: day,
        pos: day - 1,
        text: `B. ${b}<hr />BS. ${bs}<hr />L. ${l}<hr />LS. ${ls}<hr />D. ${d}`,
        menu: { b, bs, l, ls, d },
        type: "days",
        source: "text"
      });
    }

    if (source == "database") {
      // do a call
      axios.post("/admin/meal-plans/" + id + "/component-update", { id, b, bs, l, ls, d }).then(res => {
        const { breakfast, breakfast_snack, lunch, lunch_snack, dinner } = res.data;
        this.props.saveData({
          id: id,
          menu: { breakfast, breakfast_snack, lunch, lunch_snack, dinner },
          source: "database",
          sort: sort
        });
        this.closeEditor();
      });
    }

    this.setState({
      b: "",
      bs: "",
      l: "",
      ls: "",
      d: ""
    });
  };

  render() {
    const { day, active, sort, source } = this.props;
    const { b, bs, l, ls, d } = this.state;
    return (
      <div className={`new-component-popup ${active ? "active" : ""}`}>
        <div className={`new-component ${source == "database" ? "database" : ""}`}>
          <div className={`new-component-title`}>
            <span>{source == "database" ? "day component database" : "day component"}</span>
            <a href="javascript:" title="" onClick={this.closeEditor} className="new-component-close">
              <i className="fal fa-times" />
            </a>
          </div>
          <div className="new-component-body">
            <h5>Day {source == "database" ? sort + 1 : day}</h5>
            <div className="new-component-fields">
              <span>B</span>
              <textarea
                type="text"
                className="pt-input"
                onChange={e => this.handleChange(e, "b")}
                placeholder="Breakfast"
                value={b}
                rows="3"
              />
            </div>
            <div className="new-component-fields">
              <span>S</span>
              <textarea
                type="text"
                className="pt-input"
                onChange={e => this.handleChange(e, "bs")}
                placeholder="Breakfast Snack"
                value={bs}
                rows="3"
              />
            </div>
            <div className="new-component-fields">
              <span>L</span>
              <textarea type="text" className="pt-input" onChange={e => this.handleChange(e, "l")} placeholder="Lunch" value={l} rows="3" />
            </div>
            <div className="new-component-fields">
              <span>S</span>
              <textarea
                type="text"
                className="pt-input"
                onChange={e => this.handleChange(e, "ls")}
                placeholder="Lunch Snack"
                value={ls}
                rows="3"
              />
            </div>
            <div className="new-component-fields">
              <span>D</span>
              <textarea
                type="text"
                className="pt-input"
                onChange={e => this.handleChange(e, "d")}
                placeholder="Dinner"
                value={d}
                rows="3"
              />
            </div>
            <div className="new-component-buttons">
              <button className="btn" onClick={this.handleSubmit}>
                submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DaysEditor;
