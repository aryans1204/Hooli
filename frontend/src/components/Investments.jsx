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

class Investments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: null,
      portfolio: null, //stores all portfolios retrieved from the database
      selectedIndex: 0, //index to access particular portfolio
      loading: true,
    };
  }

  //checks if the user is authenticated
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
      console.log(portfolios);
      this.setState({ portfolio: portfolios, loading: false });
    }
  }

  // gets user portfolio data from database
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

  //sets the index of the portolio that the user wants to display
  handleSelectedIndexChange = (index) => {
    this.setState({ selectedIndex: index });
  };

  render() {
    return (
      <>
        <div className={classes.nav}>
          <NavBar />
        </div>
        <div className={classes.contents}>
          <h1 className={classes.title}>My Investments</h1>
          <div>
            {this.state.authenticated == false && (
              <Navigate to="/" replace={true} />
            )}
          </div>

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
                    <div>no portfolio data available</div>
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
