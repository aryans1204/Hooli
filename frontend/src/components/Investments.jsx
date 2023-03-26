import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { AddPortfolio } from "./InvestmentComponents/AddPortfolio";
import { GetPriceData } from "./InvestmentComponents/GetPriceData";
import PortfolioSelector from "./InvestmentComponents/PortfolioSelector";
import NavBar from "./NavBar";
import AssetTable from "./InvestmentComponents/AssetTable";
import { EditPortfolio } from "./InvestmentComponents/EditPortfolio";
import { RemovePortfolio } from "./InvestmentComponents/RemovePortfolio";
import classes from "./Investments.module.css";

class Investments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: null,
      portfolio: null, //stores all portfolios retrieved from the database
      selectedIndex: 0, //index to access particular portfolio
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
        if (response.status == 401) this.setState({ authenticated: false });
        else this.setState({ authenticated: true });
        return response.json();
      })
      .then((data) => {});
    if (
      sessionStorage.getItem("portfolios") === "null" ||
      sessionStorage.getItem("portfolios") === "undefined" ||
      sessionStorage.getItem("portfolios") === null ||
      sessionStorage.getItem("portfolios") === undefined
    ) {
      this.getPortfolioData();
    } else {
      const portfolios = JSON.parse(sessionStorage.getItem("portfolios"));
      console.log(portfolios);
      this.setState({ portfolio: portfolios });
    }
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
        console.log(data);
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

  //sets the index of the portolio that the user wants to display
  handleSelectedIndexChange = (index) => {
    this.setState({ selectedIndex: index });
  };

  render() {
    return (
      <div>
        <NavBar />
        <h1 className={classes.title}>Investments Page</h1>
        <div>
          {this.state.authenticated == false && (
            <Navigate to="/" replace={true} />
          )}
        </div>

        <div className={classes.selector}>
          {this.state.portfolio && (
            <PortfolioSelector
              data={this.state.portfolio}
              index={this.state.selectedIndex}
              onIndexChange={this.handleSelectedIndexChange}
            ></PortfolioSelector>
          )}
        </div>
        <div>
          {this.state.portfolio && (
            <GetPriceData
              data={this.state.portfolio}
              index={this.state.selectedIndex}
            ></GetPriceData>
          )}
        </div>
        <div className={classes.table}>
          <h3>My Portfolio (click to show trend graph)</h3>
          <div>
            {(() => {
              if (this.state.portfolio) {
                return (
                  <div>
                    <AssetTable
                      data={this.state.portfolio[this.state.selectedIndex]}
                    ></AssetTable>
                  </div>
                );
              } else {
                return <div>No Data Available</div>;
              }
            })()}
          </div>
        </div>
        <div>
          <RemovePortfolio
            data={
              this.state.portfolio
                ? this.state.portfolio[this.state.selectedIndex]
                : {}
            }
          />
        </div>
        <div>
          <AddPortfolio
            edit={() => {
              this.getPortfolioData();
            }}
          />
        </div>
      </div>
    );
  }
}

export default Investments;
