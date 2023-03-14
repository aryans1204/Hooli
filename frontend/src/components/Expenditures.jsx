import React, { Component } from 'react';
import NavBar from './NavBar';
import classes from './Expenditures.module.css';
import { Navigate } from "react-router-dom";
import { AddExpenditureComponent } from "./ExpendituresComponents/AddExpenditureComponent";
import { EditExpenditureComponent } from "./ExpendituresComponents/EditExpenditureComponent";
import { RemoveExpenditureComponent } from "./ExpendituresComponents/RemoveExpenditureComponent";
import { ExpendituresPieChartComponent } from "./ExpendituresComponents/ExpendituresPieChartComponent";

class Expenditures extends Component {

    constructor(props) {
        super(props);
        this.state = {
          authenticated: null,
          expendituresData: null,
        };
      }
      
    render() {
        return (
            <><NavBar />
            <h1 className={classes.text}>Expenditures Page</h1>
            </>
        );
    }
}

export default Expenditures;