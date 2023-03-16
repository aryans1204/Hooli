import { useState, useEffect } from "react";

export function GetPriceData(props) {
  const [data, setData] = useState(props.data[props.index]); //the specific portfolio data that the user wants to see
  const [apiData, setApiData] = useState(null);
  const [tickers, setTickers] = useState([]);

  useEffect(() => {
    setData(props.data[props.index]);
  }, [props]);

  useEffect(() => {
    const tickers = props.data.reduce(
      (acc, { commodities, equities, options }) => {
        //const commodityTickers = commodities.map(
        //  ({ commodity_type }) => commodity_type
        //);
        const equityTickers = equities.map(
          ({ equity_ticker }) => equity_ticker
        );
        const optionTickers = options.map(
          ({ derivative_ticker }) => derivative_ticker
        );
        return [
          ...acc,
          //...commodityTickers,
          ...equityTickers,
          ...optionTickers,
        ];
      },
      []
    );
    setTickers(tickers);
    console.log(tickers);
  }, [data]);

  useEffect(() => {
    if (!sessionStorage.getItem("tickerData")) {
      fetchAPIData(tickers).then((data) => {
        console.log(data);
        sessionStorage.setItem("tickerData", JSON.stringify(data));
      });
    }
  }, [tickers]);

  //
  //not yet accounting for commodities, since they will require a different api call
  //
  //also have to account for user changing the selected portfolio in the parent component (probably have to change the useEffect hook)
  //
  function fetchAPIData(tickers) {
    const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    const promises = tickers.map((ticker) => {
      return fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${API_KEY}`
      ).then((response) => response.json());
    });
    return Promise.all(promises);
  }
}
