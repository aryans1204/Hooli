import React, {useState, useEffect} from 'react';
import { Table, Thead, Tbody, Tr, 
    Th, Td, TableContainer,} from '@chakra-ui/react';
import classes from './Forex.module.css';

// const ForexTable = (num) => {
//     var val = num.num;

//     const [isDataFetched, setIsDataFetched] = useState(false);
//     const [tableData, setTableData] = useState([]);

//     // Get pair from API (rate only)
//     const getPair = async (fromVar, toVar) => {
//         var myHeaders = new Headers();
//         myHeaders.append("apikey", import.meta.env.VITE_FIXER_API_KEY);
      
//         var requestOptions = {
//             method: 'GET',
//             redirect: 'follow',
//             headers: myHeaders
//         };
      
//         var url = "https://api.apilayer.com/fixer/latest?base=" + fromVar + "&symbols=" + toVar;
        
//         const response = await fetch(url, requestOptions);
//         const result = await response.json();
//         //console.log(result); console.log("pair results here");
//         let key = String(Object.keys(result.rates));
//         let rateData = result.rates[key].toFixed(2);
//         var data = {from: fromVar, to: toVar, rate: rateData, change: null};
//         //console.log(data); console.log("pair arr here");
//         return data;

//         // fetch(url, requestOptions)
//         // .then(response => response.json())
//         // .then(result => {
//         //     let key = String(Object.keys(result.rates));
//         //     let rateData = result.rates[key].toFixed(2);
//         //     let data = {from: fromVar, to: toVar, rate: rateData, change: null};
//         //     indivResp.push(data);
//         // })
//         // .catch(error => reject(error)); // reject the promise with the error
//     }

//     // fetch fluctations
//     const getFluc = async (fromVar, toVar) => {
//         var myHeaders = new Headers();
//         myHeaders.append("apikey", import.meta.env.VITE_FIXER_API_KEY);
    
//         var requestOptions = {
//             method: 'GET',
//             redirect: 'follow',
//             headers: myHeaders
//         };
    
//         // get dates
//         const curDate = new Date().toISOString().slice(0, 10);
//         const lastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    
//         var url = "https://api.apilayer.com/fixer/fluctuation?start_date=" + lastDate + "&end_date=" + curDate + "&base=" + fromVar + "&symbols=" + toVar;
        
//         const response = await fetch(url, requestOptions);
//         var result = await response.json();
//         result = result.rates;
//         //console.log(result); console.log("RESULT HERE");
//         let key = String(Object.keys(result));
//         let changeVal = result[key].change_pct; // take change_pct value
//         //console.log(changeVal); console.log("get fluc change val here");
//         return changeVal;
//         //data.change = changeVal;


//         // fetch(url, requestOptions)
//         // .then(response => response.text())
//         // .then(result => {
//         //     result = JSON.parse(result).rates;
//         //     let key = String(Object.keys(result));
//         //     let changeVal = result[key].change_pct; // take change_pct value
//         //     indivResp[0].change = changeVal;
//         //     console.log("FLUC DATA");
//         //     console
//         // })
//         // .catch(error => console.log('error', error));
//     }

//     // Get recent 5 searches
//     const getAllData = async () => {
//         try {
//             const response = await fetch('/api/currencies', {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${sessionStorage.getItem("token")}`
//             }
//             });
      
//             const data = await response.json();
//             var conversions = [];
//             for (let i = 0; i < val; i++) {
//                 let pair = {from: data[i].currency_from, to: data[i].currency_to};
//                 conversions.push(pair);
//             }

//             var responses = [];
//             for (const { from, to } of conversions) {
//                 var indivResp = [];
//                 var pairRes = await getPair(from, to);
//                 var flucRes = await getFluc(from, to);
//                 pairRes.change = flucRes;
//                 indivResp.push(pairRes);
//                 responses.push(indivResp);
//             }
//             sessionStorage.setItem("tableData", responses);

      
//             // const responses = await Promise.all(conversions.map(async ({ from, to }) => {
//             //     const pair = await getPair(from, to);
//             //     const fluc = await getFlucs(from, to);
//             //     return { ...pair, changvar responses = [];

//     //         for (const { from, to } of conversions) {
//     //             var indivResp = [];
//     //             getPair(from, to, indivResp);
//     //             getFlucs(from, to, indivResp);
//     //             console.log(indivResp);
//     //             console.log("indivResp");
//     //             responses.push(indivResp);
//     //         }
//     //         console.log(responses);e: fluc.change };
//             // }));
      

//           // Set the fields state
//           //setFields(responses);
//         } catch (error) {
//           console.log(error.message);
//         }
//       }

//     // const getAllData = async() => {
//     //     fetch('/api/currencies', {
//     //         method: 'GET',
//     //         headers: {
//     //             'Content-Type': 'application/json',
//     //             Authorization: `Bearer ${sessionStorage.getItem("token")}`
//     //         }
//     //     })
//     //     .then((response) => response.json())
//     //     .then((data) => {
//     //         var conversions = [];
//     //         for (let i = 0; i < val; i++) {
//     //             let pair = {from: data[i].currency_from, to: data[i].currency_to};
//     //             conversions.push(pair);
//     //         }
//     //         

//     //         // const promises = conversions.map(pair => {
//     //         //     return new Promise((resolve, reject) => {
//     //         //       const indivResp = [];
//     //         //       getPair(pair.from, pair.to, indivResp).then(() => {
//     //         //         getFlucs(pair.from, pair.to).then(changeVal => {
//     //         //           indivResp[0].change = changeVal;
//     //         //           resolve(indivResp[0]);
//     //         //         }).catch(error => reject(error));
//     //         //       }).catch(error => reject(error));
//     //         //     });
//     //         //   });

//     //         // var promises = conversions.map(({ from, to }) => {
//     //         //     return getPair(from, to).then(data => {
//     //         //       return getFlucs(from, to).then(changeVal => {
//     //         //         data.change = changeVal;
//     //         //         return data;
//     //         //       });
//     //         //     });
//     //         //   });

//     //         // for (const { from, to } of conversions) {
//     //         //     var indivResp = [];
//     //         //     getPair(from, to, indivResp);
//     //         //     getFlucs(from, to, indivResp);
//     //         //     responses.push(indivResp);
//     //         // }
          
//     //         // Promise.all(promises).then(data => {
//     //         //     console.log(data);
//     //         // }).catch(error => console.log('error', error));
//     //     })
//     //     .catch((err) => {
//     //         console.log(err.message);
//     //     });
//     // }

//     getAllData();

//     return (
//         <>
//         <div className={classes.currencyDiv}>
//             <TableContainer>
//                 <Table variant='simple'>
//                     <Thead>
//                         <Tr>
//                             <Th>Currency Pairs</Th>
//                             <Th>Rate</Th>
//                             <Th>Fluctuation</Th>
//                         </Tr>
//                     </Thead>
//                     <Tbody>
//                     {fields.map((field, index) => (
//                         <Tr key={index}>
//                             <Td>{field.from}/{field.to}</Td>
//                             <Td>{field.rate}</Td>
//                             <Td>{field.change}</Td>
//                         </Tr>
//                     ))}

//                     </Tbody>
//                 </Table>
//             </TableContainer>
//         </div>
//         </>
//   );
// };

// export default ForexTable;

const ForexTable = (num) => {
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [tableData, setTableData] = useState([]);
  
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
    );
  };
  
  export default ForexTable;