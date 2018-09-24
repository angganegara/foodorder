import React, { Component } from "react";
import { DragSource, DropTarget } from "react-dnd";

// drag spec
const testSource = {
  beginDrag(props) {
    return {
      id: props.id,
      text: props.text,
      index: props.id,
      pos: props.sort,
      type: props.type
    };
  },

  endDrag(props, monitor) {
    const dropResult = monitor.getDropResult();
    const item = monitor.getItem();

    if (dropResult) {
      //alert(`You dropped ${item.text} into ${dropResult.name}!`);
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

class TestDrag extends Component {
  render() {
    const {
      isDragging,
      connectDragPreview,
      connectDragSource,
      text,
      type,
      children,
      id
    } = this.props;
    return connectDragPreview(
      <div
        className={type === "days" ? "test-drag" : "test-drag-parent"}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {connectDragSource(
          <div className="drag-handle">
            <i className="far fa-bars" />
          </div>
        )}
        {type === "days" && (
          <div>
            <p>
              <b>DAY {id}</b>
              <span dangerouslySetInnerHTML={{ __html: text }} />
            </p>
            <div className="test-footer">
              <button className="test-btn">
                <i className="fa fa-pencil" />
              </button>
            </div>
          </div>
        )}
        {type === "mp" && <h5>{text}</h5>}
        {children}
      </div>
    );
  }
}

export default DragSource("dropzone", testSource, collect)(TestDrag);
