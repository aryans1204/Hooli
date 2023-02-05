import { useState } from "react";
import "./SignUp.module.css";
import logo from "../assets/icons/hooli-logo.png";

function SignUp() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data);
    //console.log(process.env.PORT);
    fetch("http://localhost:" + 3001 + "/api/users", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
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
