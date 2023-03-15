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

        this.handleButton = this.handleButton.bind(this);
        this.postData = this.postData.bind(this);
        this.checkData = this.checkData.bind(this);
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
        this.checkData();
        //this.getAllData();
    }

    // String formatting to set state
    handleButton(event) {
        let value = this.inputNode.value;
        if (value.length == 0) {
            alert("Empty input");
        }
        else {
            value = value.trim();
            let arr = value.split("/");
            arr = arr.map(element => {
                return element.trim();
            });
            console.log(arr);
            let fromVar = arr[0];
            let toVar = arr[1];
            this.setState({from: fromVar, to: toVar, isTableUpdated: true}, ()=>{this.postData();});
        }
    }

    // Post search to database
    postData() {
        fetch('/api/currencies', {
            method: 'POST',
            body: JSON.stringify({
                currency_from: this.state.from,
                currency_to: this.state.to
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        })
            .then((response) => response.json())
            .then(() => {console.log("Data posted successfully");})
            .catch((err) => {
                console.log(err.message);
             });
    }

    // CHeck if DB has data
    checkData () {
        fetch('/api/currencies', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            // Checks there's entries
            if (data.length != 0) {
                this.setState({hasData: true});
                if (data.length >= 5) {this.setState({num: 5});}
                else {this.setState({num: data.length});}
            }
            else {this.setState({num: 0})}
        })
        .catch((err) => {
            console.log(err.message);
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
                    {/* {(this.state.hasData) ? (<ForexTable num={this.state.num}/>) : (<p>No entries yet!</p>)} */}
                    <ForexTable num={this.state.num}/>
                    <SGUSGraph/>
                </div>
            </div>
            </>
        );
    }
}

export default Forex;