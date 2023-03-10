import React, { Component, useState, useEffect} from 'react';
import { Navigate } from "react-router-dom";
import NavBar from './NavBar';
import classes from './Forex.module.css';
import { Input, InputGroup, InputLeftElement, Button, ButtonGroup} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import ForexTable from './ForexTable';

class Forex extends Component {
    constructor(props) {
        super(props);
        this.state = { from: "", to: "", authenticated: null, hasData: false, num: 0};

        this.handleButton = this.handleButton.bind(this);
        this.postData = this.postData.bind(this);
        this.getAllData = this.getAllData.bind(this);
        this.getPair = this.getPair.bind(this);
        this.getFlucs = this.getFlucs.bind(this);
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
        this.getAllData();
    }


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
            this.setState({from: fromVar});
            this.setState({to: toVar}, ()=>{this.getPair(fromVar, toVar); this.postData();});
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
            .then((data) => {console.log(data);})
            .catch((err) => {
                console.log(err.message);
             });
    }

    // Get pair from API (rate only)
    getPair(fromVar, toVar, arr, name) {
        var myHeaders = new Headers();
        myHeaders.append("apikey", import.meta.env.VITE_FIXER_API_KEY);

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };

        var url = "https://api.apilayer.com/fixer/latest?base=" + fromVar + "&symbols=" + toVar;

        fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {console.log("PAIR OK");
            // console.log(result);
            result = JSON.parse(result); arr.push(result);
            let key = String(Object.keys(result.rates));
            let rateData = result.rates[key].toFixed(2);
            let data = {from: fromVar, to: toVar, rate: rateData};
            //console.log(data);
            sessionStorage.setItem(name, JSON.stringify(data));
            // console.log(arr)
        })
        .catch(error => console.log('error', error));
    }

    // Get recent 5 searches
    getAllData () {
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
                // Gets recent 5 pairs and puts into conversions array
                var conversions = []
                // DB has <= 5 
                if (data.length <= 5) {
                    let count = 0;
                    data.forEach(element => {
                        let pair ={from: element["currency_from"], to: element["currency_to"]};
                        conversions.push(pair);
                        count += 1;
                    })
                    this.setState({num: count});
                } else {
                    // DB has > 5
                    this.setState({num: 5});
                    let count = 0;
                    data.forEach(element => {
                            if (count != 5) {
                                count += 1;
                                let pair = {from: element["currency_from"], to: element["currency_to"]}
                                conversions.push(pair);
                            }}
                    )
                }
                //console.log(conversions);
                //console.log("WE ARE HERE");

                // for each conversion, getPair and put into rate value in responses array
                var responses = [];
                let count = 0;

                // get dates
                const curDate = new Date().toISOString().slice(0, 10);
                const lastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

                conversions.forEach((item) => {
                    const from = item.from;
                    const to = item.to;
                    count += 1;
                    let name = "dataKey" + count;
                    this.getPair(from, to, responses, name);
                    this.getFlucs(from, to, curDate, lastDate);
                });
                // console.log(responses);
                // console.log("RESPONSES IS ON TOP");
                //console.log(this.state.data);
                
            }
        })
        .catch((err) => {
            console.log(err.message);
        });
    }

    // fetch fluctations
    getFlucs(fromVar, toVar, curDate, lastDate) {
        var myHeaders = new Headers();
        myHeaders.append("apikey", import.meta.env.VITE_FIXER_API_KEY);

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };

        var url = "https://api.apilayer.com/fixer/fluctuation?start_date=" + lastDate + "&end_date=" + curDate + "&base=" + fromVar + "&symbols=" + toVar;

        fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
            
            console.log(result);
        })
        .catch(error => console.log('error', error));
    }

    render() {
        return (
            <>
            {this.state.authenticated == false && (<Navigate to="/" replace={true} />)}
            <NavBar />
            <div className={classes.div}>
                <h1 className={classes.text}>FOREX</h1>
                <div className={classes.search}>
                    <InputGroup>
                    <InputLeftElement
                        pointerEvents='none'
                        children={<SearchIcon color='gray.600' />}
                    />
                    <Input placeholder='Enter Currency Pair' htmlSize={50} width='auto' variant='filled' ref={node => (this.inputNode = node)}/>
                    <Button colorScheme='purple' onClick={this.handleButton}>Search</Button>
                    </InputGroup>
                </div>
                <div>
                    {(this.state.hasData) ? (<ForexTable num={this.state.num}/>) : (<p>No entries yet!</p>)}
                </div>
            </div>
            </>
        );
    }
}

export default Forex;