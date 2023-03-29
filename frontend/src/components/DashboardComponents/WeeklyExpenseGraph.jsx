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
import classes from './WeeklyExpensesGraph.module.css';


function WeeklyExpenseGraph () {
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expenseData, setExpenseData] = useState([]);

    // Get expense from the past 
    async function getExpenses() {
      try {
        const response = await fetch('/api/expenditure/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
          }
        });

        const allData = await response.json();

        if (allData.length != 0) {
          setHasData(true);
        }

        // Get dates for the past week and put it in the graph structure format
        let weeklyData = [];
        for (let i = 0; i < 7; i++) {
          var wDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
          weeklyData.push({date: wDate, exp: 0});
        }

        allData.forEach(data => {
          weeklyData.forEach(indiv => {
            if ((data.date).includes(indiv[date])) {
              var dayTotal = 
            }
          });
        });

        let weekData = allData.filter(data => ((data.start_date).includes(year)) == true)

          yearData.forEach(data => {
            var monthIndex = Number(data.start_date.slice(5, 7)) - 1;
            var month = monthlyData[monthIndex];
            var monthTotal = month.income;
            month.income = monthTotal + data.monthly_income;
          });
          return monthlyData;
        } catch (error) {
          console.error(error);
          throw new Error('Failed to fetch expenditures');
        }
    }

    async function getGraphData () {
        const yearIncome = await getYearIncome();
        setIncomeData(yearIncome);
        setIsLoading(false);
    }
     
    if (isLoading) {
      getGraphData();
      return <p>Loading Monthly Income Graph...</p>
    }

    // Get the lowest and highest rate
    let lowestValue = Number.MAX_SAFE_INTEGER;
    let highestValue = Number.MIN_SAFE_INTEGER;
    for (const data of incomeData) {
      var value = data.income;
      if (value < lowestValue) {
        lowestValue = value;
      }
      if (value > highestValue) {
        highestValue = value;
      }
    }
    lowestValue = Math.floor(lowestValue * 100) / 100;
    highestValue = Math.ceil(highestValue * 100) / 100 + 15;

    return (
      <div>
      { hasData ? (
          <>
          <ResponsiveContainer width="100%" height={300}>
              <LineChart
                  width={1000}
                  height={300}
                  data={incomeData}
                  margin={{left: 70, right: 70, bottom: 10}}
              >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[lowestValue, highestValue]}/>
                  <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
          </ResponsiveContainer>
          </>
      ) : (<p>No income entry yet!</p>) }
  </div>
   );
 };

 export default WeeklyExpenseGraph;