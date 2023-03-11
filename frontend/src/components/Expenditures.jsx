import React, { Component } from 'react';
import NavBar from './NavBar';
import classes from './Expenditures.module.css';

class Expenditures extends Component {
    render() {
        return (
            <><NavBar />
            <h1 className={classes.text}>Expeditures Page</h1>
            </>
        );
    }
}

export default Expenditures;