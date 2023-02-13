import React, { Component } from 'react';
import NavBar from './NavBar';
import classes from './Forex.module.css';

class Forex extends Component {
    render() {
        return (
            <><NavBar />
            <h1 className={classes.text}>Forex Page</h1>
            </>
        );
    }
}

export default Forex;