/*welcome page*/

import { useState } from "react";
import "./App.css";
import logo from "./assets/icons/hooli-logo.png";

function App() {
  return (
    <div className="App">
      <div className="screen">
        <img class="logo" src={logo} alt="Hooli" />
        <div className="title">
          <h1>Welcome to Hooli</h1>
        </div>
        <div className="about_header">
          <h2>
            <u>About Us</u>
          </h2>
        </div>
        <div className="about_details">
          <p>
            Hooli is an online application that helps you manage your finances.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
