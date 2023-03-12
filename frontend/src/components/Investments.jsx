import React, { Component } from 'react';
import NavBar from './NavBar';
import classes from './Investments.module.css';

class Investments extends Component {
    render() {
        return (
            <><NavBar />
            <h1 className={classes.text}>Investments Page</h1>
            </>
        );
    }
}

export default Investments;