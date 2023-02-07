/*welcome page*/

import { Component, useState } from "react";
import "./App.css";
import logo from "./assets/icons/hooli-logo.png";

class App extends Component {
  render() {
    return (
      <div className="app">
        <div class="purple_column">
          <img class="logo" src={logo} alt="Hooli" />
        </div>
        <div className="yellow_column">
          <div>
            <h1 className="title">Welcome</h1>
          </div>
          <div>
            <p className="about">
              Hooli is an online application that helps you manage your
              finances.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
