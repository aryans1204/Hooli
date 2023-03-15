import React, { Component } from 'react';
import NavBar from './NavBar';
import classes from './Expenditures.module.css';
import { Navigate } from "react-router-dom";
import { AddExpenditureComponent } from "./ExpendituresComponents/AddExpenditureComponent";
import { EditExpenditureComponent } from "./ExpendituresComponents/EditExpenditureComponent";
import { RemoveExpenditureComponent } from "./ExpendituresComponents/RemoveExpenditureComponent";
//import { ExpendituresPieChartComponent } from "./ExpendituresComponents/ExpendituresPieChartComponent";

class Expenditures extends Component {

    constructor(props) {
        super(props);
        this.state = {
          authenticated: null,
          expendituresData: null,
        };
    }

    async componentDidMount() {
      this.getExpendituresData();
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
    }

    getExpendituresData() {
      fetch("/api/expenditure", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          if (response.status === 500) {
            console.log("Some error occurred - " + response.status);
          } else {
            return response.json();
          }
        })
        .then((data) => {
          this.setState({
            expendituresData: data,
          });
        });
    }
      
    render() {
      return (
        <div className={classes.contents}>
          <div>
            {this.state.authenticated == false && (<Navigate to="/" replace={true} />)}
          </div>
          <div>
            <NavBar />
          </div>
          <div className={classes.title}>My Expenditures</div>
          {/* <Box
            bg="rgba(148, 114, 208, 1)"
            w="50%"
            h="50%"
            color="white"
            p="1%"
            mt="1%"
            ml="5%"
            borderRadius="50"
            overflow="hidden"
          >
            {this.state.expendituresData !== null ? (
              <ExpendituresPieChartComponent data={this.state.expendituresData} />
            ) : null}
          </Box> */}
          <AddExpenditureComponent
            setState={() => {
              this.getExpendituresData();
            }}
          />
          <EditExpenditureComponent
            setState={() => {
              this.getExpendituresData();
            }}
          />
          <RemoveExpenditureComponent
            setState={() => {
              this.getExpendituresData();
            }}
          />
        </div>
      );
    }
}

export default Expenditures;