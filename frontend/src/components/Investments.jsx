import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { AddPortfolio } from "./InvestmentComponents/AddPortfolio";
import NavBar from "./NavBar";

class Investments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: null,
      portfolio: null,
    };
  }

  //checks if the user is authenticated
  async componentDidMount() {
    await fetch("/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log(response.status);
        if (response.status == 401) this.setState({ authenticated: false });
        else this.setState({ authenticated: true });
        return response.json();
      })
      .then((data) => {});
    this.getIncomeData();
  }

  //
  //there seems to be some error with the input data and getIncomeData is not working properly
  //

  // gets user portfolio data from database
  getIncomeData() {
    fetch("/api/investments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 500) {
          console.log("Some error occurred - " + response.status);
          console.log(response);
        } else if (response.headers.get("Content-Length") === "0") {
          console.log("No portfolio found");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        this.setState({
          portfolio: data,
        });
        console.log(data);
      });
  }
  render() {
    return (
      <div>
        <NavBar />
        <h1>Investments Page</h1>
        <div>
          {this.state.authenticated == false && (
            <Navigate to="/" replace={true} />
          )}
        </div>
        <div>
          <AddPortfolio />
        </div>
      </div>
    );
  }
}

export default Investments;
