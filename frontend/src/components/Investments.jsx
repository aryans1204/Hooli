import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { AddPortfolio } from "./InvestmentComponents/AddPortfolio";
import { GetPriceData } from "./InvestmentComponents/GetPriceData";
import PortfolioSelector from "./InvestmentComponents/PortfolioSelector";
import NavBar from "./NavBar";
import classes from "./Investments.module.css";

class Investments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: null,
      portfolio: null, //stores all portfolios retrieved from the database
      selectedIndex: 1, //index to access particular portfolio
    };
  }

  //checks if the user is authenticated
  async componentDidMount() {
    /*this.fetchAPIData(["AAPL", "MSFT", "TSLA", "AMZN", "NVDA", "AMD"]).then(
      (data) => {
        console.log(data);
      }
    );*/
    await fetch("/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status == 401) this.setState({ authenticated: false });
        else this.setState({ authenticated: true });
        return response.json();
      })
      .then((data) => {});
    if (
      sessionStorage.getItem("portfolios") === "null" ||
      sessionStorage.getItem("portfolios") === "undefined" ||
      sessionStorage.getItem("portfolios") === null
    ) {
      this.getPortfolioData();
    }
    const portfolios = JSON.parse(sessionStorage.getItem("portfolios"));
    console.log(portfolios);
    this.setState({ portfolio: portfolios });
  }

  // gets user portfolio data from database
  getPortfolioData() {
    fetch("/api/investments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log("trying to log response");
        console.log(response);
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
        const tempData = JSON.stringify(data);
        if (
          sessionStorage.getItem("portfolios") === "null" ||
          sessionStorage.getItem("portfolios") === "undefined" ||
          sessionStorage.getItem("portfolios") === null ||
          sessionStorage.getItem("portfolios") === undefined
        ) {
          sessionStorage.setItem("portfolios", tempData);
        }
      });
  }

  /*
  fetchAPIData(tickers) {
    const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    //const symbol = "MSFT";

    const promises = tickers.map((ticker) => {
      return fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${API_KEY}`
      ).then((response) => response.json());
    });
    return Promise.all(promises);
  }
  */

  //sets the index of the portolio that the user wants to display
  handleSelectedIndexChange = (index) => {
    this.setState({ selectedIndex: index });
  };

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
        <div className={classes.selector}>
          {this.state.portfolio && (
            <PortfolioSelector
              data={this.state.portfolio}
              index={this.state.selectedPortfolio}
              onIndexChange={this.handleSelectedIndexChange}
            ></PortfolioSelector>
          )}
        </div>
        <div>
          {this.state.portfolio && (
            <GetPriceData
              data={this.state.portfolio}
              index={this.state.selectedPortfolio}
            ></GetPriceData>
          )}
        </div>
      </div>
    );
  }
}

export default Investments;
