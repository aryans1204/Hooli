import React, {useState, useEffect} from 'react';
import { Input, InputGroup, InputLeftElement, Button,
    Table, Thead, Tbody, Tr, 
    Th, Td, TableContainer,} from '@chakra-ui/react';
    import { SearchIcon } from '@chakra-ui/icons';
import classes from './Forex.module.css';

const ForexTable = (num) => {
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [isTableUpdated, setIsTableUpdated] = useState(false);

    const hasData = true;


    // String formatting to set state
    function handleButton(event) {
        const inputElement = document.getElementById('myInput');
        var value = inputElement.value;
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
            setFrom(fromVar);
            setTo(toVar);
            setIsTableUpdated(true);
            postData();
        }
    }

    // Post search to database
    function postData() {
        fetch('/api/currencies', {
            method: 'POST',
            body: JSON.stringify({
                currency_from: state.from,
                currency_to: state.to
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
  
    useEffect(() => {
      const fetchTableData = async () => {
        try {
          const response = await fetch('/api/currencies', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
          });
  
          const data = await response.json();
          const conversions = [];
          for (let i = 0; i < num.num; i++) {
            const pair = { from: data[i].currency_from, to: data[i].currency_to };
            conversions.push(pair);
          }
  
          const responses = [];
          for (const { from, to } of conversions) {
            const pairRes = await getPair(from, to);
            const flucRes = await getFluc(from, to);
            pairRes.change = flucRes;
            const indivResp = [pairRes];
            responses.push(indivResp);
          }
          sessionStorage.setItem('tableData', JSON.stringify(responses));
          setTableData(responses);
          setIsDataFetched(true);
        } catch (error) {
          console.log(error.message);
        }
      };
  
      fetchTableData();
    }, []);
  
    // Get pair from API (rate only)
    const getPair = async (fromVar, toVar) => {
        var myHeaders = new Headers();
        myHeaders.append("apikey", import.meta.env.VITE_FIXER_API_KEY);
      
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };
      
        var url = "https://api.apilayer.com/fixer/latest?base=" + fromVar + "&symbols=" + toVar;
        
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        //console.log(result); console.log("pair results here");
        let key = String(Object.keys(result.rates));
        let rateData = result.rates[key].toFixed(2);
        var data = {from: fromVar, to: toVar, rate: rateData, change: null};
        //console.log(data); console.log("pair arr here");
        return data;
    }
  
    // fetch fluctations
    const getFluc = async (fromVar, toVar) => {
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
        
        const response = await fetch(url, requestOptions);
        var result = await response.json();
        result = result.rates;
        let key = String(Object.keys(result));
        let changeVal = result[key].change_pct; // take change_pct value
        return changeVal;
    }
  
    if (!isDataFetched) {
      return <p>Loading Table...</p>;
    }
  
    return (
        <div className={classes.div}>
            <h1 className={classes.text}>FOREX</h1>
            <div className={classes.search}>
                <InputGroup>
                <InputLeftElement
                    pointerEvents='none'
                    children={<SearchIcon color='gray.600' />}
                />
                <Input placeholder='Enter Currency Pair' htmlSize={50} width='auto' variant='filled' id="myInput"/>
                <Button colorScheme='purple' onClick={handleButton} className={classes.button}>Search</Button>
                </InputGroup>
            </div>
            <div>
                {(hasData) ? (
                    <div className={classes.currencyDiv}>
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
                            {tableData.map((data, index) => (
                            <Tr key={index}>
                                <Td>{data[0].from}/{data[0].to}</Td>
                                <Td>{data[0].rate}</Td>
                                <Td>{data[0].change}</Td>
                            </Tr>
                            ))}
                        </Tbody>
                        </Table>
                    </TableContainer>
                    </div>
                ) : (<p>No entries yet!</p>)}
            </div>
      </div>
    );
  };
  
  export default ForexTable;