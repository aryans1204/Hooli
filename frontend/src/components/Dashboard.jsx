import React, { Component } from 'react';
import classes from './Dashboard.module.css';
import NavBar from './NavBar';
import { ExpendituresPieChartComponent } from "./ExpendituresComponents/ExpendituresPieChartComponent";
import WeeklyExpenseGraph from './DashboardComponents/WeeklyExpenseGraph';
import MonthlyIncome from './DashboardComponents/MonthlyIncome';

class Dashboard extends Component {
    /**
     * Creates an instance of Income.
     * @constructor
     * @param {*} props
     */
    constructor(props) {
        super(props);
        this.state = {authenticated: null, expendituresData: null};
    }

    /**
     * Retrieves user profile and checks for authentiation when component is mounted
     * Gets weekly expense data
     * @async
     * @returns {*}
     */
    async componentDidMount() {
        this.getExpenseData();
        await fetch("/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            console.log(response.status);
            if (response.status == 401)
                this.setState({ authenticated: false });
            else
                this.setState({ authenticated: true });
          });
    }

    /**
     * Gets expenditure data from server for the expense breakdown
     * @return {void}
     * @throws {Error}
     */
    getExpenseData() {
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
            <><NavBar />
            {this.state.authenticated == false && (<Navigate to="/" replace={true} />)}

            <div className={classes.div}>
                <h1 className={classes.text}>Dashboard Page</h1>
                <div className={classes.container}>
                    <div className={classes.weekly}>
                        <h2>Weekly Expense</h2>
                        <WeeklyExpenseGraph />
                    </div>
                    <div className={classes.breakdown}>
                        <h2>Expense Breakdown</h2>
                        {/* <ExpendituresPieChartComponent data={this.state.expendituresData} className={classes.expenseBreakdownPie} />  */}
                    </div>
                    <div className={classes.income}>
                        <h2>Monthly Income Trend</h2>
                        <MonthlyIncome />
                    </div>
                    <div className={classes.investments}>
                        <h2>Investments</h2>
                    </div>
                </div>
            </div>
            </>
        );
    }
}

export default Dashboard;