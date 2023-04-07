import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { AddPortfolio } from "./InvestmentComponents/AddPortfolio";
import { GetPriceData } from "./InvestmentComponents/GetPriceData";
import PortfolioSelector from "./InvestmentComponents/PortfolioSelector";
import NavBar from "./NavBar";
import AssetTable from "./InvestmentComponents/AssetTable";
import { EditPortfolio } from "./InvestmentComponents/EditPortfolio";
import { RemovePortfolio } from "./InvestmentComponents/RemovePortfolio";
import * as Spinners from "react-spinners";
import classes from "./Investments.module.css";

/**
 * Investments class
 * @class Investments
 * @typedef {Investments}
 * @extends {Component}
 */
class Investments extends Component {
  /**
   * Creates an instance of Investments.
   * Initialises the component's state with authenticated, portfolio, selectedIndex and loading.
   * @constructor
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      authenticated: null,
      portfolio: null, //stores all portfolios retrieved from the database
      selectedIndex: 0, //index to access particular portfolio
      loading: true,
    };
  }

  /**
   * Retrieves user profile and checks for authentiation when component is mounted.
   * Gets portfolio data if sessionStorage for portfolios is null or undefined.
   * Sets state for portfolio if in sessionStorage.
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
      this.setState({ portfolio: portfolios, loading: false });
    }
  }

  /**
   * Fetches user's portfolio data from the database and sets state of component for portfolio and loading.
   */
  getPortfolioData() {
    fetch("https://hooli-backend-aryan.herokuapp.com/api/investments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 500) {
          alert("API query limit reached! Please wait for 1 minute");
          console.log("Some error occurred - " + response.status);
        } else if (response.headers.get("Content-Length") === "0") {
          console.log("No portfolio found");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        this.setState({
          portfolio: data,
          loading: false,
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

  /**
   * Sets the component's state for selectedIndex to the index of the portolio that the user wants to display
   * @param {Number} index 
   */
  handleSelectedIndexChange = (index) => {
    this.setState({ selectedIndex: index });
  };

  render() {
    return (
      <>
        <div>
          {this.state.authenticated == false && (
            <Navigate to="/" replace={true} />
          )}
        </div>
        <div className={classes.nav}>
          <NavBar />
        </div>
        <div className={classes.contents}>
          <h1 className={classes.title}>MY INVESTMENTS</h1>

          <div>
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
          <div>
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
                  return this.state.loading ? (
                    <div
                      style={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <Spinners.BeatLoader color="#805AD5" />
                    </div>
                  ) : (
                    <div>No Portfolio Data Available</div>
                  );
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
              edit={() => {
                this.getPortfolioData();
              }}
            />
          </div>
          <div>
            <EditPortfolio
              data={
                this.state.portfolio
                  ? this.state.portfolio[this.state.selectedIndex]
                  : {}
              }
              edit={() => {
                this.getPortfolioData();
              }}
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
      </>
    );
  }
}

export default Investments;
