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
import classes from './WeeklyExpenseGraph.module.css';


function WeeklyExpenseGraph () {
    const [hasData, setData] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [graphData, setGraphData] = useState([]);

    // Get current date and date from a week ago
    const curDate = new Date().toISOString().slice(0, 10);
    const lastDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    // Get expenses from the past 
    async function getAllExpenditures() {
        try {
          const response = await fetch('/api/expenditure', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem("token")}`
            }
          });
      
          const data = await response.json();
          if (allData.length != 0) {
            setData(true);
            }
          return data;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to fetch expenditures');
        }
    }

    async function getGraphData () {
        const expenditures = await getAllExpenditures();
        console.log(expenditures);
    }
     
    getGraphData();
     

    // const getGraphData = async () => {
    //         const expenditures = await getAllExpenditures();
    //         console.log(expenditures);

    //         // Food, Housing, Utilities, Bills, Clothes, Lifestyle, Transport, Healthcare, Pets, Others
    //         // Step 1: Get array of unique categories
    //         //console.log("EXPENSE", data);
            

    //         // (2+3) Step 2: Split data into the separate categories

    //         // Step 3: Sum up total and each category {category: amt, } format

    //         // Get last data entry

    //         //setGraphData(graphArr);
    //         setIsLoading(false);

    //         //setGraphData(data);
            
    //         return data;
    // }

    // if (isLoading) {
    //     getGraphData();
    //     return <p>Loading Graph...</p>
    // }

    // Get the lowest and highest rate
    // let lowestRate = Number.MAX_SAFE_INTEGER;
    // let highestRate = Number.MIN_SAFE_INTEGER;
    // for (const { rate } of graphData) {
    //     if (rate < lowestRate) {
    //         lowestRate = rate;
    //     }
    //     if (rate > highestRate) {
    //         highestRate = rate;
    //     }
    // }
    // lowestRate = Math.floor(lowestRate * 1000) / 1000;
    // highestRate = Math.ceil(highestRate * 1000) / 1000;

    return (
        <p>{graphData}</p>
        // <div>
        //     { hasData ? (
        //         <>
        //         <ResponsiveContainer width="100%" height={300}>
        //             <LineChart
        //                 width={1000}
        //                 height={300}
        //                 data={graphData}
        //                 margin={{left: 70, right: 70}}
        //             >
        //                 <CartesianGrid strokeDasharray="3 3" />
        //                 <XAxis dataKey="date" />
        //                 <YAxis domain={[lowestRate, highestRate]}/>
        //                 <Tooltip />
        //         <Legend />
        //         <Line type="monotone" dataKey="rate" stroke="#8884d8" activeDot={{ r: 8 }} />
        //         </LineChart>
        //         </ResponsiveContainer>
        //         </>
        //     ) : (<p>No graph entry yet!</p>) }
        // </div>
   );
 };

 export default WeeklyExpenseGraph;