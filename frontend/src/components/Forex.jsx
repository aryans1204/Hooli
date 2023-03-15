import React, { Component, useState, useEffect} from 'react';
import { Navigate } from "react-router-dom";
import NavBar from './NavBar';
import classes from './Forex.module.css';
import { Input, InputGroup, InputLeftElement, Button, ButtonGroup} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import ForexTable from './ForexTable';
import SGUSGraph from './SGUSGraph';

class Forex extends Component {
    constructor(props) {
        super(props);
        this.state = { from: "", to: "", authenticated: null, hasData: false, num: 0, isTableUpdated: false};
      }

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
                    <ForexTable />
                    <SGUSGraph/>
                </div>
            </div>
            </>
        );
    }
}

export default Forex;