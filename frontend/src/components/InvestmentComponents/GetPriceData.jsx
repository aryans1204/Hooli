import { useState, useEffect } from "react";

export function GetPriceData(props) {
  const [data, setData] = useState(props.data[props.index]); //the specific portfolio data that the user wants to see
  const [apiData, setApiData] = useState(null);
  const [tickers, setTickers] = useState([]);

  useEffect(() => {
    setData(props.data[props.index]);
  }, [props.index]);

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

  useEffect(() => {
    console.log("I'm running");
    console.log(tickers);
    fetchAPIData(tickers).then((data) => {
      console.log(data);
      sessionStorage.setItem("tickerData", JSON.stringify(data));
    });
  }, [tickers]);

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
}
