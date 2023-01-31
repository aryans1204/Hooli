import { useState } from "react";
import "./Login.css";
import logo from "../assets/icons/hooli-logo.png"

function App() {
  return (
    <div className="App">
      <div class="row">
        <div class="column dark-purple">
          <img class="logo" src={logo} alt="Hooli" />
        </div>
        <div class="column">
          <div class="login">
            <h2>Sign In</h2>
            <form>
              <label>
                <h3>Email</h3>
                <input type="text" name="name" />
              </label>
              <label>
                <h3>Password</h3>
                <input type="password" name="name" />
              </label>
              <label>
                <input type="submit" value="Log In" />
              </label>
              <p>
                Don't have an account? <a href="#">Create An Account</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
