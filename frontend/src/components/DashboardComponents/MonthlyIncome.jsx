import React, { useState, useEffect } from 'react';
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
import classes from './MonthlyIncome.module.css';


function MonthlyIncome () {

    // Get income from the past 
    async function getYearIncome() {
        try {
          const response = await fetch('/api/income/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem("token")}`
            }
          });

          const allData = await response.json();

          // Get all income for the year
          const year = new Date().getFullYear();

          var yearData = allData.filter(data => ((data.start_date).includes(year)) == true)
          return yearData;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to fetch expenditures');
        }
    }

    async function getGraphData () {
        const yearIncome = await getYearIncome();
        console.log("heresssss", yearIncome);
    }
     
    getGraphData();

    return (
        <p>Monthly</p>
   );
 };

 export default MonthlyIncome;