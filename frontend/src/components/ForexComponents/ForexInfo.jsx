import React, { useState, useEffect } from "react";
import {
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import classes from "../Forex.module.css";
import RecentGraph from "./RecentGraph";

/**
 * Returns the currency pair values in a table format
 * @export
 * @function
 * @returns {string}
 */
function ForexInfo() {
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [num, setNum] = useState(0);
  const [hasData, setHasData] = useState(false);
  const [dataChange, setDataChange] = useState(false);
  const [allSymbols, setAllSymbols] = useState([]);

  /**
   * Retrieves all available currency symbols from Fixer API and sets them in allSymbols state
   * @async
   * @function
   * @throws {Error}
   * @returns {Promise<void>}
   */
  async function getAvailableCurrencies() {
    var myHeaders = new Headers();
    myHeaders.append("apikey", import.meta.env.VITE_FIXER_API_KEY);

    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    };

    var url = "https://api.apilayer.com/fixer/symbols";

    const response = await fetch(url, requestOptions);
    const result = await response.json();
    let symResult = result.symbols;
    const allCurSymbols = Object.keys(symResult);
    setAllSymbols(allCurSymbols);
  }

  /**
   * Checks that there are entries in the database and sets a number <= 5
   * @function
   * @returns {}
   */
  function checkData() {
    fetch("https://hooli-backend-aryan.herokuapp.com/api/currencies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Checks there's entries
        if (data.length != 0) {
          setHasData(true);
          if (data.length >= 5) {
            setNum(5);
          } else {
            setNum(data.length);
          }
        } else {
          setNum(0);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  /**
   * Does input formatting to post data to database
   * @async
   * @function
   * @returns {object} arr
   */
  async function handleButton() {
    const inputElement = document.getElementById("myInput");
    var value = inputElement.value;
    if (value.length == 0) {
      alert("Empty input");
    } else {
      value = value.trim();
      let arr = value.split("/");
      arr = arr.map((element) => {
        return element.trim();
      });
      let fromVar = arr[0].toUpperCase();
      let toVar = arr[1].toUpperCase();
      // check if entered data is a valid currency code
      if (allSymbols.includes(fromVar) && allSymbols.includes(toVar)) {
        await postData(fromVar, toVar);
      } else {
        alert("Data is not a valid currency code.");
      }
    }
    document.getElementById("myInput").value = "";
  }

  /**
   * Get pair response from Fixer API
   * @async
   * @param {string} fromVar - base currency symbol for exchange rate
   * @param {string} toVar  - target currency symbol for exchange rate
   * @returns {Promise<object>} - A Promise that resolves with the object of the pair data
   * @throws {Error}
   */
  const getPair = async (fromVar, toVar) => {
    var myHeaders = new Headers();
    myHeaders.append("apikey", import.meta.env.VITE_FIXER_API_KEY);

    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    };

    var url =
      "https://api.apilayer.com/fixer/latest?base=" +
      fromVar +
      "&symbols=" +
      toVar;

    const response = await fetch(url, requestOptions);
    const result = await response.json();
    let key = String(Object.keys(result.rates));
    let rateData = result.rates[key].toFixed(2);
    var data = { from: fromVar, to: toVar, rate: rateData, change: null };
    return data;
  };

  /**
   * Fetches fluctuation data from the API and returns the percent change value for a given currency pair within the past 7 days
   *
   * @async
   * @function getFluc
   * @param {string} fromVar - The base currency to convert from (e.g., "USD")
   * @param {string} toVar - The target currency to convert to (e.g., "EUR")
   * @throws {Error} When the network response is not successful
   * @returns {Promise<number>} A Promise that resolves with the percent change value for the given currency pair within the past 7 days
   */
  const getFluc = async (fromVar, toVar) => {
    var myHeaders = new Headers();
    myHeaders.append("apikey", import.meta.env.VITE_FIXER_API_KEY);

    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    };

    // Get dates
    const curDate = new Date().toISOString().slice(0, 10);
    const lastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    var url =
      "https://api.apilayer.com/fixer/fluctuation?start_date=" +
      lastDate +
      "&end_date=" +
      curDate +
      "&base=" +
      fromVar +
      "&symbols=" +
      toVar;

    const response = await fetch(url, requestOptions);
    var result = await response.json();
    result = result.rates;
    let key = String(Object.keys(result));
    let changeVal = result[key].change_pct; // take change_pct value
    return changeVal;
  };

  /**
   * Fetches the initial data from the server and API.
   * It checks if data is already stored in session storage and fetches the data if it is not.
   * It stores the fetched data in session storage and sets tableData and isDataFetched states
   * @async
   * @function setupData
   * @throws {Error} if there is an error during the fetch call
   * @returns {Promise<void>}
   */
  const setupData = async () => {
    checkData();

    if (sessionStorage.getItem("tableData") == null) {
      // Getting initial data
      try {
        const response = await fetch(
          "https://hooli-backend-aryan.herokuapp.com/api/currencies",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        // Parse response data to get the 5 most recent entries
        const allData = await response.json();
        const sortedData = allData.sort((a, b) => {
          if (a._id < b._id) {
            return -1; // a should come before b
          }
          if (a._id > b._id) {
            return 1; // a should come after b
          }
          return 0; // a and b are equal
        });
        const flippedData = await sortedData.slice(-5); // get the 5 most recent entries
        const data = flippedData.reverse();

        // Getting currency pairs from sortedData
        const conversions = [];
        for (let i = 0; i < data.length; i++) {
          const pair = { from: data[i].currency_from, to: data[i].currency_to };
          conversions.push(pair);
        }

        // Getting responses for each currency pair (rate and fluctation)
        const responses = [];
        for (const { from, to } of conversions) {
          const pairRes = await getPair(from, to);
          const flucRes = await getFluc(from, to);
          pairRes.change = flucRes;
          const indivResp = [pairRes];
          responses.push(indivResp);
        }

        sessionStorage.setItem("tableData", JSON.stringify(responses));
        setTableData(responses);
        setIsDataFetched(true);
      } catch (error) {
        console.log(error.message);
      }
    }
    // No need to get initial data
    var storageData = sessionStorage.getItem("tableData");
    setTableData(JSON.parse(storageData));
    setIsDataFetched(true);
  };

  /**
   * Fetches data for the new currency entry
   * Adds new data to stored data in session storage and updates table on webpage
   * @async
   * @param {string} from - currency code for base
   * @param {string} to - currency code for symbol
   * @throws {Error}
   */
  const fetchNewEntry = async (from, to) => {
    const pairRes = await getPair(from, to);
    const flucRes = await getFluc(from, to);
    pairRes.change = flucRes;
    const latestResp = [pairRes];

    var data = sessionStorage.getItem("tableData");
    data = JSON.parse(data);

    // if num < 5, push like normal
    if (num < 5) {
      var newData = data.reverse();
      newData.push(latestResp);
      data = newData.reverse();
    } else {
      // num >= 5
      var newData = data.reverse();
      newData = data.slice(1);
      newData.push(latestResp);
      data = newData.reverse();
    }

    sessionStorage.setItem("tableData", JSON.stringify(data));

    setTableData(data);
    setIsDataFetched(true);
  };

  /**
   * Posts searched data to database
   * @async
   * @function
   * @param {string} fromVar - base currency symbol for exchange rate
   * @param {string} toVar  - target currency symbol for exchange rate
   * @returns {Promise}
   * @throws {Error}
   */
  async function postData(fromVar, toVar) {
    setDataChange(false);
    fetch("https://hooli-backend-aryan.herokuapp.com/api/currencies", {
      method: "POST",
      body: JSON.stringify({
        currency_from: fromVar,
        currency_to: toVar,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        // Data posted successfully
        setNum(num + 1);
        setIsDataFetched(false);
        setDataChange(true);
        setHasData(true);
        fetchNewEntry(fromVar, toVar);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  /**
   * Calls {@link setupData} and {@link getAvailableCurrencies} and sets up the component to render the table.
   * @function
   * @effect Calls {@link setupData} and {@link getAvailableCurrencies}
   * @returns {void}
   */
  useEffect(() => {
    getAvailableCurrencies();
    setupData();
  }, []);

  /**
   * Renders <RecentGraph/> after every change of dataChange
   * @function
   * @param {function} callback - function to be executed after every change in dataChange
   * @param {array} dependencies
   * @returns {void}
   */
  useEffect(() => {
    <RecentGraph />;
  }, [dataChange]);

  if (!isDataFetched) {
    // renders just the search bar
    return (
      <>
        <div className={classes.div}>
          <div className={classes.search}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.600" />}
              />
              <Input
                placeholder="Enter Currency Pair (e.g. USD/SGD)"
                htmlSize={50}
                width="auto"
                variant="filled"
                id="myInput"
              />
              <Button colorScheme="purple" className={classes.button}>
                Search
              </Button>
            </InputGroup>
          </div>
          <p>Loading Table...</p>
        </div>
      </>
    );
  }

  return (
    <div className={classes.div}>
      <div className={classes.search}>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.600" />}
          />
          <Input
            placeholder="Enter Currency Pair (e.g. USD/SGD)"
            htmlSize={50}
            width="auto"
            variant="filled"
            id="myInput"
          />
          <Button
            colorScheme="purple"
            onClick={handleButton}
            className={classes.button}
          >
            Search
          </Button>
        </InputGroup>
      </div>
      <div>
        {/* Conditionally renders based on whether there is data in the database */}
        {hasData ? (
          <div className={classes.currencyDiv}>
            <TableContainer>
              <Table variant="simple">
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
                      <Td>
                        {data[0].from}/{data[0].to}
                      </Td>
                      <Td>{data[0].rate}</Td>
                      <Td>
                        {data[0].change < 0 ? (
                          <div style={{ color: "#C90202" }}>
                            {data[0].change}
                          </div>
                        ) : (
                          <div style={{ color: "#00FF00" }}>
                            {data[0].change}
                          </div>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            <RecentGraph />
          </div>
        ) : (
          <p>No entries yet!</p>
        )}
      </div>
    </div>
  );
}

export default ForexInfo;
