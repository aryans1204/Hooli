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
 * Returns monthly income data for the year in a line graph
 * @export
 * @function
 * @returns {string}
 */
function MonthlyIncome() {
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [incomeData, setIncomeData] = useState([]);

  /**
   * Gets income data from the year and adds entries together by the month
   * @async
   * @function
   * @returns {arr}
   */
  async function getYearIncome() {
    try {
      const response = await fetch(
        "https://hooli-backend-aryan.herokuapp.com/api/income/",
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

      // Get all income for the year
      const year = new Date().getFullYear();

      let yearData = allData.filter(
        (data) => data.start_date.includes(year) == true
      );

      var monthlyData = [
        { month: "Jan", income: 0 },
        { month: "Feb", income: 0 },
        { month: "Mar", income: 0 },
        { month: "Apr", income: 0 },
        { month: "May", income: 0 },
        { month: "Jun", income: 0 },
        { month: "Jul", income: 0 },
        { month: "Aug", income: 0 },
        { month: "Sep", income: 0 },
        { month: "Oct", income: 0 },
        { month: "Nov", income: 0 },
        { month: "Dec", income: 0 },
      ];

      yearData.forEach((data) => {
        var monthIndex = Number(data.start_date.slice(5, 7)) - 1;
        var month = monthlyData[monthIndex];
        var monthTotal = month.income;
        month.income = monthTotal + data.monthly_income;
      });
      return monthlyData;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch expenditures");
    }
  }

  /**
   * Fetches data from the server
   * Sets the graph data and isLoading state accordingly.
   *
   * @function
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async function getGraphData() {
    const yearIncome = await getYearIncome();
    setIncomeData(yearIncome);
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
      {hasData ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={1000}
              height={300}
              data={incomeData}
              margin={{ left: 70, right: 70, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#000" />
              <YAxis domain={[lowestValue, highestValue]} stroke="#000" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#17153d"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <p>No income entry yet!</p>
      )}
    </div>
  );
}

export default MonthlyIncome;
