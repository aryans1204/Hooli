import { useState } from "react";
import "./SignUp.css";
import logo from "../assets/icons/hooli-logo.png";

function signUp() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  return (
    <div className="App">
      <div class="row">
        <div class="column dark-purple">
          <img class="logo" src={logo} alt="Hooli" />
        </div>
        <div class="column">
          <div class="login">
            <h2>Sign Up</h2>
            <form>
              <label>
                <h3>Name</h3>
                <input
                  type="text"
                  placeholder="name"
                  name="name"
                  value={data.name}
                  required
                  onChange={handleChange}
                />
              </label>
              <label>
                <h3>Email</h3>
                <input
                  type="text"
                  placeholder="name"
                  name="name"
                  value={data.name}
                  required
                  onChange={handleChange}
                />
              </label>
              <label>
                <h3>Password</h3>
                <input type="password" name="name" />
              </label>
              <label>
                <input type="submit" value="Log In" />
              </label>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default signUp;
