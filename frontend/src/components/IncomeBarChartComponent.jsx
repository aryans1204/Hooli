import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { LinearScale, CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import classes from "./IncomeBarChartComponent.module.css";
import Income from "./Income";

function IncomeBarChart() {
  const [result, setResult] = useState([]);
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
  const industry = [
    { industry: "manufacturing" },
    { industry: "services" },
    { industry: "construction" },
    { industry: "others" },
  ];

  const colors = {
    manufacturing: "purple",
    services: "brown",
    construction: "red",
    others: "yellow",
  };

  useEffect(() => {
    // Fetch the data and set it to the state
    fetch("/api/income", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 500) {
          console.log("Some error occurred - " + response.status);
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setResult(
          data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        );
      });
  }, []);
  // Create an object to store the income data for each month and industry
  function industryObj() {
    return { manufacturing: 0, services: 0, construction: 0, others: 0 };
  }
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

  // Configure the chart options
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
        height="400px"
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}

export const IncomeBarChartComponent = ({ render }) => {
  return IncomeBarChart();
};
