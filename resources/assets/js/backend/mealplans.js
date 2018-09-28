const axios = (window.axios = require("axios"));
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

import React from "react";
import { render } from "react-dom";
import IndexMP from "./mealplans/IndexMP";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContextProvider } from "react-dnd";

render(
  <DragDropContextProvider backend={HTML5Backend}>
    <IndexMP />
  </DragDropContextProvider>,
  document.getElementById("mp-app")
);
