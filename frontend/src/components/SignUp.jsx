import { useState } from "react";
import "./SignUp.module.css";
import logo from "../assets/icons/hooli-logo.png";

function SignUp() {
  let token = "";
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
    }),
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      })
    );
    console.log(data);
    console.log(options.body);
    //console.log(process.env.PORT);
    fetch("/api/users", options)
      .then((response) => {
        if (response.status === 201) {
          console.log("Sign up successful!");
          return response.json();
        } else {
          console.log("Error occurred: error" + response.status);
        }
      })
      .then((data) => {
        console.log("DATA STORED");
      });
  };

  return (
    <div className={"SignUp.app"}>
      <div class={SignUp.row}>
        <div class={SignUp.column + " " + SignUp.darkPurple}>
          <img class={SignUp.logo} src={logo} alt="Hooli" />
        </div>
        <div class={SignUp.column}>
          <div class={SignUp.login}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
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
                  placeholder="email"
                  name="email"
                  value={data.email}
                  required
                  onChange={handleChange}
                />
              </label>
              <label>
                <h3>Password</h3>
                <input
                  type="password"
                  placeholder="password"
                  name="password"
                  value={data.password}
                  required
                  onChange={handleChange}
                />
              </label>
              <label>
                <button type="submit">Sign Up</button>
              </label>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
