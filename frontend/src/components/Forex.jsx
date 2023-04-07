import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import NavBar from "./NavBar";
import classes from "./Forex.module.css";
import ForexInfo from "./ForexComponents/ForexInfo";

/**
 * Forex class
 * @class Forex
 * @typedef {Forex}
 * @extends {Component}
 */
class Forex extends Component {
  /**
   * Creates an instance of Forex.
   * @constructor
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      from: "",
      to: "",
      authenticated: null,
      hasData: false,
      num: 0,
      isTableUpdated: false,
    };
  }

  /**
   * Retrieves user profile and checks for authentiation when component is mounted
   * @async
   * @returns {*}
   */
  async componentDidMount() {
    await fetch("https://hooli-backend-aryan.herokuapp.com/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }).then((response) => {
      if (response.status == 401) this.setState({ authenticated: false });
      else this.setState({ authenticated: true });
    });
  }

  render() {
    return (
      <>
        {this.state.authenticated == false && (
          <Navigate to="/" replace={true} />
        )}
        <NavBar />
        <div className={classes.div}>
          <h1 className={classes.text}>MY FOREX</h1>
          <div>
            <ForexInfo />
          </div>
        </div>
      </>
    );
  }
}

export default Forex;
