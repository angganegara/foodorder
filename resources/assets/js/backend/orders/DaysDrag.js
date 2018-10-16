import React, { Component } from "react";
import { DragSource } from "react-dnd";
import { ButtonGroup, Button } from "@blueprintjs/core";
import PopoverCustom from "./PopoverCustom";

let windowHeight = window.innerHeight;
let windowArea = Math.round(windowHeight / 2);
let ticking = false;
let dragInterval;

// drag spec
const daysSource = {
  beginDrag(props, monitor) {
    let currentOffset = {};
    dragInterval = setInterval(() => {
      const { y } = monitor.getClientOffset();
      let pos = 0;
      if (y < windowArea) {
        if (windowArea - y < 50) {
          pos = window.scrollY;
        } else if (windowArea - y >= 50 && windowArea - y < 200) {
          pos = window.scrollY - 3;
        } else if (windowArea - y > 200) {
          pos = window.scrollY - 10;
        }
      } else if (y > windowArea) {
        if (y - windowArea < 50) {
          pos = window.scrollY;
        } else if (y - windowArea >= 50 && y - windowArea < 200) {
          pos = window.scrollY + 3;
        } else if (y - windowArea > 200) {
          pos = window.scrollY + 10;
        }
      }
      if (pos > 0) {
        if (!ticking) {
          window.requestAnimationFrame(function() {
            window.scroll(0, pos);
            ticking = false;
          });
          ticking = true;
        }
      }
    }, 10);
    return {
      id: props.id,
      text: props.text,
      index: props.id,
      pos: props.sort,
      menu: props.menu,
      type: props.type
    };
  },

  endDrag(props, monitor) {
    const dropResult = monitor.getDropResult();
    const item = monitor.getItem();
    //console.log(monitor.getClientOffset());
    clearInterval(dragInterval);

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

class DaysDrag extends Component {
  handleClick = ({ e, id, menu }) => {
    const { sort } = this.props;
    const data = menu;
    const type = "edit";
    const source = "database";

    this.props.showEditor({ id, type, data, source, sort });
  };

  copyComponent = (e, target) => {
    const { text, type, id, menu, sort } = this.props;
    const data = {
      id,
      index: sort,
      menu,
      text,
      type
    };

    this.props.copyDay(data);
  };

  render() {
    const { isDragging, connectDragPreview, connectDragSource, text, type, sort, children, menu, id } = this.props;
    return connectDragPreview(
      <div className={type === "days" ? "test-drag" : "test-drag-parent"} style={{ opacity: isDragging ? 0.5 : 1 }}>
        {connectDragSource(
          <div className="drag-handle">
            <i className="far fa-bars" />
          </div>
        )}
        {type === "days" && (
          <React.Fragment>
            <div>
              <b>DAY {sort + 1}</b>
              {!menu && { text }}
              {menu && (
                <React.Fragment>
                  <span>B. {menu.b}</span>
                  <hr />
                  <span>S. {menu.bs}</span>
                  <hr />
                  <span>L. {menu.l}</span>
                  <hr />
                  <span>S. {menu.ls}</span>
                  <hr />
                  <span>D. {menu.d}</span>
                </React.Fragment>
              )}
            </div>
            <div className="dropzone-toolbars">
              <ButtonGroup minimal={false} large={false}>
                <PopoverCustom>
                  <Button onClick={this.copyComponent} text="C" />
                  <div>Copy component</div>
                </PopoverCustom>
              </ButtonGroup>
            </div>
          </React.Fragment>
        )}
        {type === "mp" && <h5>{text}</h5>}
        {children}
      </div>
    );
  }
}

export default DragSource("dropzone", daysSource, collect)(DaysDrag);
