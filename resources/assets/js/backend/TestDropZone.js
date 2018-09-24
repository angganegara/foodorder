import React, { Component } from "react";
import { DropTarget } from "react-dnd";
import TestDrag from "./TestDrag";

const dropZoneTarget = {
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

class TestDropZone extends Component {
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

  render() {
    const { isOver, canDrop, connectDropTarget, items, index } = this.props;

    const isActive = canDrop && isOver;
    let borderColor = "#eee";
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
              {isActive ? "Release to drop" : "Drag a box here"}
            </div>
          )}
          {items[index] && (
            <div>
              <p>
                <b>DAY: {index + 1}</b>
                <span dangerouslySetInnerHTML={{ __html: items[index].text }} />
              </p>
            </div>
          )}
        </div>
      )
    );
  }
}

export default DropTarget("dropzone", dropZoneTarget, collect)(TestDropZone);
