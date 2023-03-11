import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { AddPortfolio } from "./InvestmentComponents/AddPortfolio";

class Investments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: null,
      AddPortfolio: false,
    };
    this.handleClickAdd = this.handleClickAdd.bind(this);
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
  }

  //setting AddPortfolio to true to render the add portfolio overlay
  handleClickAdd() {
    this.setState({ AddPortfolio: true });
  }

  render() {
    return (
      <div>
        <h1>Investments Page</h1>
        <div>
          {this.state.authenticated == false && (
            <Navigate to="/" replace={true} />
          )}
        </div>
        <div>
          <button onClick={this.handleClickAdd}>Show Other Component</button>
          {AddPortfolio && <AddPortfolio />}
        </div>
      </div>
    );
  }
}

export default Investments;
