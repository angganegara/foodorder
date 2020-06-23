const axios = (window.axios = require("axios"));
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

import React from "react";
import { render } from "react-dom";
import App from "./mealplans/App";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContextProvider } from "react-dnd";

render(
  <DragDropContextProvider backend={HTML5Backend}>
    <App />
  </DragDropContextProvider>,
  document.getElementById("mp-app")
);
