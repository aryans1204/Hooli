import React, { Component, useState, useEffect} from 'react';
import { Navigate } from "react-router-dom";
import NavBar from './NavBar';
import classes from './Forex.module.css';
import { Input, InputGroup, InputLeftElement, Table, Thead, Tbody, Tfoot, Tr, 
    Th, Td, TableContainer,} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons'

class Forex extends Component {
    constructor(props) {
        super(props);
        this.state = { from: "", to: "", authenticated: null, items: "" };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.postData = this.postData.bind(this);
        this.getAllData = this.getAllData.bind(this);
        this.getPair = this.getPair.bind(this);
        //this.getTable = this.getTable.bind(this);
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
          //this.getAllData();
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') {
            let value = event.target.value;
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
            //TODO: clear text in input
        }
    }

    getPair(fromVar, toVar) {
        var myHeaders = new Headers();
        myHeaders.append("apikey", import.meta.env.VITE_FIXER_API_KEY);

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };

        var url = "https://api.apilayer.com/fixer/latest?base=" + fromVar + "&symbols=" + toVar;
        //console.log(url);

        fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {console.log("OK"); return result;})
        .catch(error => console.log('error', error));
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
            //console.log(data);
            let count = 0;
            var conversions = [];
            data.forEach(element => {
                if (count != 5) {
                    count += 1;
                    let pair = {from: element["currency_from"], to: element["currency_to"]}
                    conversions.push(pair);
                }
            });
            const responses = [];
            responses.push(this.getPair("SGD", "EUR"));
            console.log(responses);
            // responses.forEach((item) =>
            //     {
            //         console.log(item);
            //         // console.log(item["base"]);
            //         // console.log("DDFDFDF");
            //     })

            // console.log(conversions);
            // //this.getTable(conversions);
            // const responses = [];
            // conversions.forEach((item) => {
            //     const from = item.from;
            //     const to = item.to;
            //     responses.push(this.getPair(from, to));
            // });

            // return (
            //     <Tr>
            //         {responses.map(resp => {
            //             let pair = resp.base + '/' + Object.keys(resp.rates);
            //             return ( <>
            //                 <Td>{pair}</Td>
            //                 <Td>{resp.rates[0]}</Td>
            //                 <Td>Something</Td>
            //                 </>
            //             )
            //         })}
            //     </Tr>
            // )




        })
        .catch((err) => {
            console.log(err.message);
        });
    }

    // getTable (allData) {
    //     const responses = [];
    //     allData = JSON.parse(allData);
    //     allData.forEach((item) => {
    //         const from = item.from;
    //         const to = item.to;
    //         responses.push(this.getPair(from, to));
    //       });

    //     return (
    //         <Tr>
    //             {responses.map(resp => {
    //                 let pair = resp.base + '/' + Object.keys(resp.rates);
    //                 return ( <>
    //                     <Td>{pair}</Td>
    //                     <Td>{resp.rates[0]}</Td>
    //                     <Td>Something</Td>
    //                     </>
    //                 )
    //             })}
    //         </Tr>
    //     )
    // }

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
                <div className={classes.currencyDiv}>
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                        <Tr>
                            <Th>Currency Pairs</Th>
                            <Th>Rate</Th>
                            <Th isNumeric>Fluctuation</Th>
                        </Tr>
                        </Thead>
                        <Tbody>



                        <Tr>
                            <Td>inches</Td>
                            <Td>millimetres (mm)</Td>
                            <Td isNumeric>25.4</Td>
                        </Tr>
                        {this.getAllData()}

                        </Tbody>
                    </Table>
                    </TableContainer>
                </div>
            </div>
            </>
        );
    }
}

export default Forex;