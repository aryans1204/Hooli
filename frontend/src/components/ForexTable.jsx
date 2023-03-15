import React, {useState} from 'react';
import { Table, Thead, Tbody, Tr, 
    Th, Td, TableContainer,} from '@chakra-ui/react';
import classes from './Forex.module.css';

const ForexTable = (num) => {
    var val = num.num;
    // Get pair from API (rate only)
    const getPair = (fromVar, toVar) => {
        var myHeaders = new Headers();
        myHeaders.append("apikey", import.meta.env.VITE_FIXER_API_KEY);

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };

        var url = "https://api.apilayer.com/fixer/latest?base=" + fromVar + "&symbols=" + toVar;

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {//console.log("PAIR OK");
            let key = String(Object.keys(result.rates));
            let rateData = result.rates[key].toFixed(2);
            let data = {from: fromVar, to: toVar, rate: rateData, change: null};
            return data;
            //indivResp.push(data);
            //console.log(data);
            //sessionStorage.setItem(name, JSON.stringify(data));
        })
        .catch(error => console.log('error', error));
    }

    // fetch fluctations
    const getFlucs = (fromVar, toVar, indivResp) => {
        var myHeaders = new Headers();
        myHeaders.append("apikey", import.meta.env.VITE_FIXER_API_KEY);

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };

        // get dates
        const curDate = new Date().toISOString().slice(0, 10);
        const lastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

        var url = "https://api.apilayer.com/fixer/fluctuation?start_date=" + lastDate + "&end_date=" + curDate + "&base=" + fromVar + "&symbols=" + toVar;

        fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
            result = JSON.parse(result).rates;
            let key = String(Object.keys(result));
            let changeVal = result[key].change_pct; // take absolute value of change
            indivResp[0].change = changeVal;
            return indivResp
            // console.log("VALUE IS HEREE");
            // //let sessData = JSON.parse(sessionStorage.getItem(name));
            // // //sessionStorage.removeItem(name);
            // // //sessData.push({change: changeVal});
            // sessData.change = changeVal;
            // console.log(sessData);
            // console.log("HERE IS THE ARRAY");
            
            // sessionStorage.setItem(name, JSON.stringify(sessData));
            // console.log(sessionStorage.getItem(name));
            // console.log("SESSION STORAGE HERE");
        })
        .catch(error => console.log('error', error));
    }

    // Get recent 5 searches
    const getAllData = () => {
        fetch('/api/currencies', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            var conversions = [];
            for (let i = 0; i < val; i++) {
                let pair = {from: data[i].currency_from, to: data[i].currency_to};
                conversions.push(pair);
            }
            var responses = [];

            var promises = conversions.map(({ from, to }) => {
                return getPair(from, to).then(data => {
                  return getFlucs(from, to).then(changeVal => {
                    data.change = changeVal;
                    return data;
                  });
                });
              });
          
              Promise.all(promises).then(responses => {
                console.log(responses);
              }).catch(error => console.log('error', error));
        })
        .catch((err) => {
            console.log(err.message);
        });
    }

    getAllData();

    // const getAllData = () => {
    //     fetch('/api/currencies', {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${sessionStorage.getItem("token")}`
    //         }
    //     })
    //     .then((response) => response.json())
    //     .then((data) => {
            

    //         if (data.length != 0) {
    //             this.setState({hasData: true});
    //             // Gets recent 5 pairs and puts into conversions array
    //             var conversions = []
    //             // DB has <= 5 
    //             if (data.length <= 5) {
    //                 let count = 0;
    //                 data.forEach(element => {
    //                     let pair ={from: element["currency_from"], to: element["currency_to"]};
    //                     conversions.push(pair);
    //                     count += 1;
    //                 })
    //                 this.setState({num: count});
    //             } else {
    //                 // DB has > 5
    //                 this.setState({num: 5});
    //                 let count = 0;
    //                 data.forEach(element => {
    //                         if (count != 5) {
    //                             count += 1;
    //                             let pair = {from: element["currency_from"], to: element["currency_to"]}
    //                             conversions.push(pair);
    //                         }}
    //                 )
    //             }
    //             // console.log(conversions);
    //             // console.log("WE ARE HERE");

    //             // for each conversion, getPair and put into rate value in responses array
    //             var responses = [];
    //             let count = 0;

    //             // get dates
    //             const curDate = new Date().toISOString().slice(0, 10);
    //             const lastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    //             conversions.forEach((item) => {
    //                 const from = item.from;
    //                 const to = item.to;
    //                 count += 1;
    //                 let name = "dataKey" + count;
    //                 this.getPair(from, to, responses, name);
    //                 this.getFlucs(from, to, curDate, lastDate, name);
    //             });
    //             this.setState({setStorage: true});
    //             // console.log(responses);
    //             // console.log("RESPONSES IS ON TOP");
    //             //console.log(this.state.data);
    //         }
    //     })
    //     .catch((err) => {
    //         console.log(err.message);
    //     });
    // }

    // let count = num.num;
    // let fields = [];
    // while (count > 0) {
    //     let val = "dataKey" + count;
    //     fields.push(JSON.parse(sessionStorage.getItem(val)));
    //     count -= 1;
    // }
    //console.log(fields);
    //console.log("fields of table");

    return (
        <>
        {/* <div className={classes.currencyDiv}>
            <TableContainer>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Currency Pairs</Th>
                            <Th>Rate</Th>
                            <Th>Fluctuation</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {fields.map((field, index) => (
                        <Tr key={index}>
                            <Td>{field.from}/{field.to}</Td>
                            <Td>{field.rate}</Td>
                            <Td>{field.change}</Td>
                        </Tr>
                    ))}

                    </Tbody>
                </Table>
            </TableContainer>
        </div> */}
        </>
  );
};

export default ForexTable;