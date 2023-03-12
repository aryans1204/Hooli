import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { LinearScale, CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import classes from "./IncomeBarChartComponent.module.css";
import Income from "../Income";


/**
 * Component for income bar chart.
 * @export
 * @param {*} props
 * @returns {*}
 */
export function IncomeBarChartComponent(props) {
  const [result, setResult] = useState(null);
  useEffect(() => {
    setResult(props.data);
  }, [props.data]);

  
  /**
   * Month Names
   */
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  
  /**
   * Industry types
   */
  const industry = [
    { industry: "manufacturing" },
    { industry: "services" },
    { industry: "construction" },
    { industry: "others" },
  ];

  
  /**
   * Colors for industry types
   */
  const colors = {
    manufacturing: "purple",
    services: "brown",
    construction: "red",
    others: "yellow",
  };

  /**
   * Creates an object to store the income data for each month and industry.
   * @returns {{ manufacturing: number; services: number; construction: number; others: number; }}
   */
  function industryObj() {
    return { manufacturing: 0, services: 0, construction: 0, others: 0 };
  }

  
  /**
   * Income data for the months
   */
  const incomeData = {
    January: { industryObj },
    February: { industryObj },
    March: { industryObj },
    April: { industryObj },
    May: { industryObj },
    June: { industryObj },
    July: { industryObj },
    August: { industryObj },
    September: { industryObj },
    October: { industryObj },
    November: { industryObj },
    December: { industryObj },
  };
  for (const month in monthNames) {
    for (const industryName in industry) {
      incomeData[monthNames[month]][industry[industryName]] = 0;
    }
  }
  if (result !== null) {
    result.forEach(({ industry, monthly_income, start_date }) => {
      const month = new Date(start_date).getMonth();
      const monthName = monthNames[month];
      if (!incomeData[monthName]) {
        incomeData[monthName] = {};
      }
      if (!incomeData[monthName][industry]) {
        incomeData[monthName][industry] = 0;
      }
      incomeData[monthName][industry] += monthly_income;
    });
  }

  const chartData = {
    labels: monthNames.sort(
      (a, b) => monthNames.indexOf(a) - monthNames.indexOf(b)
    ),
    datasets: industry.map((industry) => ({
      label: industry.industry,
      data: monthNames.map(
        (monthName) => incomeData[monthName][industry.industry]
      ),
      backgroundColor: colors[industry.industry],
      stack: "income",
    })),
  };

  
  /**
   * Chart options
   */
  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Monthly Income ($)",
          color: "black",
        },
        ticks: {
          color: "black",
          beginAtZero: true,
          precision: 0,
        },
        grid: {
          drawBorder: false,
        },
      },
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Month",
          color: "black",
        },
        grid: {
          drawBorder: false,
        },
        ticks: { color: "black" },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          color: "black",
        },
      },
    },
  };

  Chart.register(LinearScale, CategoryScale);

  
  return (
    <div>
      <Bar
        width="100%"
        height="500px"
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}
