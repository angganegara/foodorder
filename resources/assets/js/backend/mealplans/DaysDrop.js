import React, { Component } from "react";
import { DropTarget } from "react-dnd";
import { ButtonGroup, Button } from "@blueprintjs/core";
import PopoverCustom from "./PopoverCustom";

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
  componentWillReceiveProps(nextProps) {
    if (this.props.dropResult) {
      if (this.props.dropResult.moved) {
        //...
      }
    }
    if (!this.props.isOver && nextProps.isOver) {
      // You can use this as enter handler
    }

    if (this.props.isOver && !nextProps.isOver) {
      // You can use this as leave handler
    }

    if (this.props.isOverCurrent && !nextProps.isOverCurrent) {
      // You can be more specific and track enter/leave
      // shallowly, not including nested targets
    }
  }

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
    const { items, index, day } = this.props;
    const data = items[index];
    const newIndex = target === "prev" ? index - 1 : index + 1;

    this.props.copyDay({ day, newIndex, data });
  };

  render() {
    const { isOver, canDrop, connectDropTarget, items, index } = this.props;
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
            <a href="javascript:" onClick={this.handleClick} className="dropzone-info">
              <span>
                <i className="fal fa-plus-circle" />
              </span>
              {isActive && <span>Release to drop</span>}
              {!isActive && <span>Add new component or drag existing component</span>}
            </a>
          )}
          {items[index] && (
            <React.Fragment>
              <div>
                <b>DAY {index + 1}</b>
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
                  {index > 0 && (
                    <PopoverCustom>
                      <Button icon="chevron-left" onClick={e => this.copyComponent(e, "prev")} text="" />
                      <div>Copy to previous day</div>
                    </PopoverCustom>
                  )}
                  {index < 5 && (
                    <PopoverCustom>
                      <Button icon="chevron-right" onClick={e => this.copyComponent(e, "next")} text="" />
                      <div>Copy to next day</div>
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

export default DropTarget("dropzone", daysDropTarget, collect)(DaysDrop);
