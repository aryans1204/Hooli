import React, { Component } from 'react';
import classes from './Dashboard.module.css';
import NavBar from './NavBar';


/**
 * Dashboard class
 * @class Dashboard
 * @typedef {Dashboard}
 * @extends {Component}
 */
class Dashboard extends Component {
    render() {
        return (
            <><NavBar />
            <h1 className={classes.text}>Dashboard Page</h1>
            </>
        );
    }
}

export default Dashboard;