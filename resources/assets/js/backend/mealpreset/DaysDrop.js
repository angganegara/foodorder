import React, { Component } from "react";
import { view } from "react-easy-state";
import { DropTarget } from "react-dnd";
import { ButtonGroup, Button } from "@blueprintjs/core";
import PopoverCustom from "./PopoverCustom";
import orderState from "../store/order";

const daysDropTarget = {
  canDrop(props, monitor) {
    const m = monitor.getItem();
    const { items, index } = props;
    const item = items[index];

    return true;
  },

  drop(props, monitor, component) {
    const item = monitor.getItem();
    props.onDrop(item);
    //return { name: props.name, moved: true };
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    item: monitor.getItem(),
    dropResult: monitor.getDropResult(),
    canDrop: monitor.canDrop()
  };
}

class DaysDrop extends Component {
  handleClick = () => {
    const { items, index, day } = this.props;
    const data = !items[index] ? null : items[index];
    const type = data ? "edit" : "new";
    const source = "text";

    this.props.showEditor({ day, type, data, source });
  };

  handleClear = () => {
    const { index } = this.props;
    this.props.clearDay({ index });
  };

  copyComponent = (e, target) => {
    const { items, index } = this.props;
    const data = items[index];

    this.props.copyDay(data);
  };

  updateDelivery = (e, index) => {
    orderState.items[index].delivery = e.target.value;
  };

  render() {
    const { isOver, canDrop, connectDropTarget, items, index, copyData, date } = this.props;
    const isActive = canDrop && isOver;
    let borderColor = "#ddd";
    if (isActive) {
      borderColor = "green";
    } else if (canDrop) {
      borderColor = "#ccc";
    }

    return (
      connectDropTarget &&
      connectDropTarget(
        <div className="dropzone-box" style={{ borderColor }}>
          {!items[index] && (
            <div className="dropzone-info">
              <a href="javascript:" onClick={this.handleClick} title="">
                <span>
                  <i className="fal fa-plus-circle" />
                </span>
                {isActive && <span>Release to drop</span>}
                {!isActive && (
                  <span>
                    Add new component
                    <br />
                    or drag existing component
                  </span>
                )}
              </a>
              {copyData && (
                <div className="dropzone-paste">
                  <PopoverCustom>
                    <Button onClick={e => this.props.pasteData(e, index)} text="P" />
                    <div>Paste component</div>
                  </PopoverCustom>
                </div>
              )}
            </div>
          )}
          {items[index] && (
            <React.Fragment>
              <div>
                <div className="dropzone-title">
                  <span>DAY {index + 1}</span>
                  <span>
                    <i className="far fa-calendar-alt" /> {date}
                  </span>
                </div>
                <span>B. {items[index].menu.b}</span>
                <hr />
                <span>S. {items[index].menu.bs}</span>
                <hr />
                <span>L. {items[index].menu.l}</span>
                <hr />
                <span>S. {items[index].menu.ls}</span>
                <hr />
                <span>D. {items[index].menu.d}</span>
              </div>
              <div className="day-delivery">
                <b>DELIVERY ADDRESS</b>
                <textarea
                  className="delivery-textarea"
                  rows="3"
                  onChange={e => this.updateDelivery(e, index)}
                  value={items[index].delivery}
                />
              </div>
              <div className="dropzone-toolbars">
                <ButtonGroup minimal={false} large={false}>
                  <PopoverCustom>
                    <Button icon="edit" onClick={this.handleClick} text="" />
                    <div>Edit Component</div>
                  </PopoverCustom>
                  <PopoverCustom>
                    <Button icon="cross" onClick={this.handleClear} text="" />
                    <div>Clear Content</div>
                  </PopoverCustom>
                </ButtonGroup>

                <ButtonGroup minimal={false} large={false}>
                  <PopoverCustom>
                    <Button onClick={this.copyComponent} text="C" />
                    <div>Copy component</div>
                  </PopoverCustom>
                  {copyData && (
                    <PopoverCustom>
                      <Button onClick={e => this.props.pasteData(e, index)} text="P" />
                      <div>Paste component</div>
                    </PopoverCustom>
                  )}
                </ButtonGroup>
              </div>
            </React.Fragment>
          )}
        </div>
      )
    );
  }
}

export default DropTarget("dropzone", daysDropTarget, collect)(view(DaysDrop));
