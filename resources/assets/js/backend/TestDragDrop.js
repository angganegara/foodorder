import React, { Component } from "react";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContextProvider } from "react-dnd";

import TestDropZone from "./TestDropZone";
import TestDrag from "./TestDrag";

class TestDragDrop extends Component {
  state = {
    days: [
      { index: 0, date: "Sep 21, 2018" },
      { index: 1, date: "Sep 22, 2018" },
      { index: 2, date: "Sep 23, 2018" },
      { index: 3, date: "Sep 24, 2018" },
      { index: 4, date: "Sep 25, 2018" }
    ],
    mealplans: [
      {
        id: 1,
        text: `
      B. Cereal sandwich with hummus, avocado slices, two poached eggs, tomato salsa and fresh herbs<hr />
      S. Coconut Water and Mixed Nuts<hr />
      L. Grilled Tuna Steak with lemongrass, quinoa and stir-fried broccoli with tahini dressing. Topped with fresh herbs and pumpkin seeds<hr />
      S. Peanut Cookie<hr />
      D. Grilled chicken stripes with Mediterranean veggie wok, red rice, scrambled egg with black pepper, topped with fresh parsley and lime.`,
        age: 22,
        pos: 0
      },
      {
        id: 2,
        text: `
      B. Multi cereal sandwich with hummus, avocado slices, two poached eggs, tomato salsa and fresh herbs<hr />
      S. Coconut Water and Mixed Nuts<hr />
      L. Grilled Tuna Steak with lemongrass, quinoa and stir-fried broccoli with tahini dressing. Topped with fresh herbs and pumpkin seeds<hr />
      S. Peanut Cookie<hr />
      D. Grilled chicken stripes with Mediterranean veggie wok, red rice, scrambled egg with black pepper, topped with fresh parsley and lime.`,
        age: 18,
        pos: 1
      },
      {
        id: 3,
        text: `
      B. Omega cereal sandwich with hummus, avocado slices, two poached eggs, tomato salsa and fresh herbs<hr />
      S. Coconut Water and Mixed Nuts<hr />
      L. Grilled Tuna Steak with lemongrass, quinoa and stir-fried broccoli with tahini dressing. Topped with fresh herbs and pumpkin seeds<hr />
      S. Peanut Cookie<hr />
      D. Grilled chicken stripes with Mediterranean veggie wok, red rice, scrambled egg with black pepper, topped with fresh parsley and lime.`,
        age: 19,
        pos: 2
      }
    ],
    items: []
  };

  handleDrop(index, item) {
    let items = [...this.state.items];
    const { mealplans, days } = this.state;
    if (item.type === "days") {
      let itemIndex = { ...items[index] };
      itemIndex = item;
      if (!items[index]) {
        items[index] = [];
      }
      items[index] = itemIndex;
    } else {
      // get the current meal plan's components
      const totalDays = days.length; // 5
      for (let i = index; i <= totalDays; i++) {
        let mpIndex = i - index;
        items[i] = mealplans[mpIndex]
          ? mealplans[mpIndex]
          : items[i]
            ? items[i]
            : null;
      }
      console.log(items);
    }
    this.setState({
      items: items
    });
  }

  render() {
    const { mealplans, items, days } = this.state;
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className="test-wrapper">
          <h3>New Meal Plans (5 days)</h3>
          <div className="dropzone-wrapper">
            {days.map(day => (
              <TestDropZone
                key={day.index}
                items={items}
                index={day.index}
                onDrop={item => this.handleDrop(day.index, item)}
              />
            ))}
          </div>
          <h3>Existing Meal Plans</h3>
          <div className="test-drag-wrapper">
            <TestDrag type="mp" key={1} id={1} text="PALEO_1" sort={1}>
              {mealplans.map(plan => (
                <TestDrag
                  type="days"
                  key={plan.id}
                  text={plan.text}
                  id={plan.id}
                  sort={plan.pos}
                />
              ))}
            </TestDrag>
          </div>
        </div>
      </DragDropContextProvider>
    );
  }
}

export default TestDragDrop;
