import React, { Component } from "react";
import Schedule from "./Schedule";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="container-fullscreen">
          <Schedule />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
