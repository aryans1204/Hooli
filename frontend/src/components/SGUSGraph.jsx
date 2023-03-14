import React from 'react';
import classes from './Forex.module.css';
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

const SGUSGraph = (data) => {
    //var values = JSON.parse(sessionStorage.getItem('graph'));
    var values = data;
    
    let lowestRate = Number.MAX_SAFE_INTEGER;
    let highestRate = Number.MIN_SAFE_INTEGER;

    for (const { rate } of values) {
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
          data={values}
          margin={{left: 70, right: 70}}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0.735, 0.745]}/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="rate" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
        </ResponsiveContainer>
        </>
  );
};

export default SGUSGraph;