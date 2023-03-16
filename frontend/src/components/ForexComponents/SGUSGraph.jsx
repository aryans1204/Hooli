import React, { useState, useEffect } from 'react';
import classes from '../Forex.module.css';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

/**
 * Returns the rates between SGD and USD currency over the past week in a line graph
 * @export
 * @function
 * @returns {string}
 */
function SGUSGraph () {
    const [isLoading, setIsLoading] = useState(true);
    const [graphData, setGraphData] = useState([]);

    /**
     * useEffect hook sets an interval to check for 'graph' every second.
     * If 'graph' data is present, the graph data state is set and isLoading is set to false.
     * The interval is also cleared.
     * @function
     * @name useEffect
     * @param {array} dependencies
     * @returns {function}
     */
    useEffect(() => {
        const intervalId = setInterval(() => {
            const data = sessionStorage.getItem('graph');
            if (data) {
                setGraphData(JSON.parse(data));
                setIsLoading(false);
                clearInterval(intervalId);
            }
        }, 1000); // Check every second if the item is set

        return () => clearInterval(intervalId);
    }, []); // Empty dependency array to run only once on mount

    // Get current date and date from a week ago
    const curDate = new Date().toISOString().slice(0, 10);
    const lastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    /**
     * Fetches data from the Fixer API and stores it in sessionStorage.
     * If data exists in sessionStorage, it sets the graph data and isLoading state accordingly.
     * Sets graph data and isLoading state when data is fetched from the API.
     *
     * @function
     * @returns {void}
     */
    const getGraphData = () => {
        const myHeaders = new Headers();
        myHeaders.append("apikey", import.meta.env.VITE_FIXER_API_KEY);

        const requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };

        const url = "https://api.apilayer.com/fixer/timeseries?start_date=" + lastDate + "&end_date=" + curDate + "&base=SGD&symbols=USD";
        const SGUSArr = [];

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            result = result.rates;
            Object.keys(result).forEach(function(key) {
                let rate = JSON.stringify(result[key][String(Object.keys(result[key]))]); // getting value from API JSON
                rate = JSON.parse(rate); // make rate a number
                SGUSArr.push({date: key, rate: rate})
            })
            sessionStorage.setItem("graph", JSON.stringify(SGUSArr)); 
            setGraphData(SGUSArr);
            setIsLoading(false);
        })
        .catch(error => console.log('error', error));
    }

    if (isLoading) {
        getGraphData();
        return <p>Loading Graph...</p>
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
        <>
            <p className={classes.sgdusd}>SG to USD Graph</p>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    width={1000}
                    height={300}
                    data={graphData}
                    margin={{left: 70, right: 70}}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[lowestRate, highestRate]}/>
                    <Tooltip />
           <Legend />
           <Line type="monotone" dataKey="rate" stroke="#8884d8" activeDot={{ r: 8 }} />
         </LineChart>
         </ResponsiveContainer>
         </>
   );
 };

 export default SGUSGraph;