import React, { Component } from 'react';
import './Dashboard.module.css';
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
            <><NavBar /><h1 className={Dashboard.text}>Dashboard Page</h1></>
        );
    }
}

export default Dashboard;