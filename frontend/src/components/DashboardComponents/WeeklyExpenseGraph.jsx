import React, { useState } from "react";
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
import * as Spinners from "react-spinners";

/**
 * Returns expenses data over the past week in a line graph.
 * @export
 * @function
 * @returns {JSX.Element}
 */
function WeeklyExpenseGraph() {
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expenseData, setExpenseData] = useState([]);

  /**
   * Gets expenses data from the past week and adds entries together.
   * @async
   * @function
   * @returns {arr}
   */
  async function getExpenses() {
    try {
      const response = await fetch(
        "https://hooli-backend-aryan.herokuapp.com/api/expenditure/",
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
        setHasData(true);
      }

      /** 
       * Gets dates for the past week and put it in the graph structure format. 
       */
      let weeklyData = [];
      for (let i = 0; i < 7; i++) {
        var wDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10);
        weeklyData.push({ date: wDate, exp: 0 });
      }

      /** 
       * Iterates through response from server and adds the total amount. 
       */
      allData.forEach((data) => {
        weeklyData.forEach((indiv) => {
          if (data.date.includes(indiv.date)) {
            var dayTotal = indiv.exp;
            indiv.exp = dayTotal + data.amount;
          }
        });
      });
      return weeklyData;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch expenditures");
    }
  }

  /**
   * Fetches data from the server.
   * Sets the graph data and isLoading state accordingly.
   *
   * @function
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async function getGraphData() {
    const weeklyExpenses = await getExpenses();
    setExpenseData(weeklyExpenses);
    setIsLoading(false);
  }

  if (isLoading) {
    getGraphData();
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Spinners.BeatLoader color="#805AD5" />
      </div>
    );
  }

  /**
   * Get the lowest and highest rate.
   */
  let lowestValue = Number.MAX_SAFE_INTEGER;
  let highestValue = Number.MIN_SAFE_INTEGER;
  for (const data of expenseData) {
    var value = data.exp;
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
      {hasData ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={1000}
              height={300}
              data={expenseData}
              margin={{ left: 70, right: 70, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#000" />
              <YAxis domain={[lowestValue, highestValue]} stroke="#000" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="exp"
                stroke="#17153d"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <p>No Weekly Expense entry yet!</p>
      )}
    </div>
  );
}

export default WeeklyExpenseGraph;
