import React, { useState } from "react";
import classes from "../Forex.module.css";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

/**
 * Returns the rates between the lastest currency in the database over the past week in a line graph
 * @export
 * @function
 * @returns {string}
 */
function RecentGraph() {
  const [hasData, setData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [graphData, setGraphData] = useState([]);
  const [toState, setToState] = useState("");
  const [fromState, setFromState] = useState("");

  // Get current date and date from a week ago
  const curDate = new Date().toISOString().slice(0, 10);
  const lastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  /**
   * Retrieves the most recent entry in the database
   * @async
   * @function
   * @returns {Promise<object>}
   * @throws {Error}
   */
  const getDBData = async () => {
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

      const allData = await response.json();
      if (allData.length != 0) {
        setData(true);
      }

      // Get last data entry
      const sortedData = allData.sort((a, b) => {
        if (a._id < b._id) {
          return -1; // a should come before b
        }
        if (a._id > b._id) {
          return 1; // a should come after b
        }
        return 0; // a and b are equal
      });
      const data = await sortedData.slice(-1); // get most recent entry
      return data;
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * Fetches data from the Fixer API and stores it in sessionStorage.
   * Sets the graph data and isLoading state accordingly.
   *
   * @function
   * @returns {Promise<void>}
   * @throws {Error}
   */
  const getGraphData = async () => {
    const pair = await getDBData();
    const fromVar = pair[0]["currency_from"];
    const toVar = pair[0]["currency_to"];
    setFromState(fromVar);
    setToState(toVar);

    const myHeaders = new Headers();
    myHeaders.append("apikey", import.meta.env.VITE_FIXER_API_KEY);

    const requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    };

    const url =
      "https://api.apilayer.com/fixer/timeseries?start_date=" +
      lastDate +
      "&end_date=" +
      curDate +
      "&base=" +
      fromVar +
      "&symbols=" +
      toVar;
    const graphArr = [];

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result = result.rates;
        for (const date in result) {
          const data = result[date][toVar];
          graphArr.push({ date: date, rate: data });
        }

        sessionStorage.setItem("graph", JSON.stringify(graphArr));
        setGraphData(graphArr);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  };

  if (isLoading) {
    getGraphData();
    return <p>Loading Graph...</p>;
  }

  // Get the lowest and highest rate
  let lowestRate = Number.MAX_SAFE_INTEGER;
  let highestRate = Number.MIN_SAFE_INTEGER;
  for (const { rate } of graphData) {
    if (rate < lowestRate) {
      lowestRate = rate;
    }
    if (rate > highestRate) {
      highestRate = rate;
    }
  }
  lowestRate = Math.floor(lowestRate * 1000) / 1000;
  highestRate = Math.ceil(highestRate * 1000) / 1000;

  return (
    <div>
      {hasData ? (
        <div className={classes.graph}>
          <p className={classes.text}>
            {fromState} to {toState} Graph
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={1000}
              height={300}
              data={graphData}
              margin={{ left: 70, right: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" fill="#E9D8FD"/>
              <XAxis dataKey="date" />
              <YAxis domain={[lowestRate, highestRate]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p>No graph entry yet!</p>
      )}
    </div>
  );
}

export default RecentGraph;
