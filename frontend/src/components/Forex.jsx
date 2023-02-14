import React, { Component } from 'react';
import { Navigate } from "react-router-dom";
import NavBar from './NavBar';
import classes from './Forex.module.css';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons'

class Forex extends Component {
    constructor(props) {
        super(props);
        this.state = { base: "", symbols: "", authenticated: null };
    
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.gettingLatestData = this.gettingLatestData.bind(this);
        
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

    gettingLatestData() {
        const url = 'https://data.fixer.io/api/' + 'latest' + '?access_key=' + process.env.REACT_APP_FIXER_API_SECRET;
        console.log(url);
        // fetch(url, {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${sessionStorage.getItem("token")}`
        //     },
        // })
        // .then()
    }


    handleKeyDown(event) {
        if (event.key === 'Enter') {
            let value = event.target.value;
            value = value.trim();
            let arr = value.split("/");
            arr = arr.map(element => {
                return element.trim().toUpperCase();
              });
              console.log(arr);
            let var1 = arr[0];
            let var2 = arr[1];
            console.log(var1);
            this.setState({base: var1}, ()=>{console.log(this.state);});
            this.setState({symbols: var2});

            this.gettingLatestData();
        }
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
                    <Input placeholder='Enter Currency Pair' htmlSize={50} width='auto' variant='filled' onKeyDown={this.handleKeyDown}/>
                    </InputGroup>
                </div>
            </div>
            </>
        );
    }
}

export default Forex;