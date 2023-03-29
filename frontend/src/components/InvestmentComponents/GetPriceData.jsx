import { useState, useEffect } from "react";

export function GetPriceData(props) {
  const [data, setData] = useState(props.data[props.index]); //the specific portfolio data that the user wants to see
  const [apiData, setApiData] = useState(null);
  const [tickers, setTickers] = useState([]);

  // Sets the data hook to the current selected portfolio's data
  useEffect(() => {
    setData(props.data[props.index]);
  }, [props.index]);

  // Extract all ticker symbols and stores them into 'ticker'
  useEffect(() => {
    const dataToProcess = props.data[props.index];
    const equities = dataToProcess.equities;
    const options = dataToProcess.options;

    const equityTickers = equities.map(({ equity_ticker }) => equity_ticker);
    const optionTickers = options.map(
      ({ derivative_ticker }) => derivative_ticker
    );

    const tickers = {
      stocks: [...equityTickers, ...optionTickers],
    };

    setTickers(tickers);
  }, [data]);

  // Refreshes tickerData in sessionStorage if necessary
  // tickerData is the data used to display the trend lines
  useEffect(() => {
    const runAsync = async () => {
      // to check if the current tickerData in sessionStorage is the same as the current portolio. If not, then force refresh
      let refresh = false;
      const tickerData = JSON.parse(sessionStorage.getItem("tickerData"));
      if (sessionStorage.getItem("tickerData") !== null) {
        refresh = await checkAPIData(sessionStorage.getItem("tickerData"));
      }
      if (tickerData !== null && tickers.length !== 0 && !refresh) {
        const symbols = tickerData.map(
          (item) => item["Meta Data"]["2. Symbol"]
        );
        symbols.forEach((symbol) => {
          if (!tickers["stocks"].includes(symbol)) {
            refresh = true;
          }
        });
      }

      if (
        (!sessionStorage.getItem("tickerData") && tickers.length !== 0) ||
        refresh === true
      ) {
        fetchAPIData(tickers).then((data) => {
          console.log(data);
          sessionStorage.setItem("tickerData", JSON.stringify(data));
        });
      }
    };
    runAsync();
  }, [tickers]);

  // Get price data for all tickers with Alpha Vantage API
  function fetchAPIData(tickers) {
    const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    const promises = [];
    if (tickers.stocks && tickers.stocks.length > 0) {
      promises.push(
        ...tickers.stocks.map((ticker) => {
          return fetch(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${API_KEY}`
          ).then((response) => response.json());
        })
      );
    }
    return Promise.all(promises);
  }

  // Check if tickerData has all the data required, if not then this means the API query was unsuccessful,
  // most likely due to the query limit
  function checkAPIData(data) {
    return new Promise((resolve) => {
      const parsedData = JSON.parse(data);
      if (tickers.length !== 0) {
        parsedData.forEach((parsedData) => {
          console.log(parsedData);
          if (!parsedData["Meta Data"]) {
            // This part means the API call returned a string telling us the limit is reached
            alert("API query limit reached! Please wait for 1 minute");
            resolve(true);
          }
        });

        // Check if all the tickers from the portfolio has their corresponding price data in sessionStorage
        let foundTicker;
        for (const ticker of tickers.stocks) {
          foundTicker = false;
          for (const obj of Object.values(parsedData)) {
            if (
              obj["Meta Data"] !== undefined &&
              obj["Meta Data"]["2. Symbol"] === ticker
            ) {
              foundTicker = true;
              break;
            }
          }
          if (!foundTicker) {
            resolve(true);
          }
        }
        resolve(false);
      }
    });
  }
}
