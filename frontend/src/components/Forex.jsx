import React, { Component, useState, useEffect} from 'react';
import { Navigate } from "react-router-dom";
import NavBar from './NavBar';
import classes from './Forex.module.css';
//import ForexTable from './ForexComponents/ForexTable';
//import SGUSGraph from './ForexComponents/SGUSGraph';
import RecentGraph from './ForexComponents/RecentGraph';
import ForexTable2 from './ForexComponents/ForexTable2';

/**
 * Forex class
 * @class Forex
 * @typedef {Forex}
 * @extends {Component}
 */
class Forex extends Component {
    /**
     * Creates an instance of Income.
     * @constructor
     * @param {*} props
     */
    constructor(props) {
        super(props);
        this.state = { from: "", to: "", authenticated: null, hasData: false, num: 0, isTableUpdated: false};
      }

    /**
     * Retrieves user profile and checks for authentiation when component is mounted
     * @async
     * @returns {*}
     */
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
            if (response.status == 401)
                this.setState({ authenticated: false });
            else
                this.setState({ authenticated: true });
          });
    }

    render() {
        return (
            <>
            {this.state.authenticated == false && (<Navigate to="/" replace={true} />)}
            <NavBar />
            <div className={classes.div}>
                <h1 className={classes.text}>FOREX</h1>
                <div>
                    <ForexTable2 />
                    {/* <ForexTable />
                    <SGUSGraph/> */}
                    {/* <RecentGraph /> */}
                </div>
            </div>
            </>
        );
    }
}

export default Forex;