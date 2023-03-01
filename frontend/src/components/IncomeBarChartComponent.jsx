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
        setResult(data);
      });
  }, []);
  // Create an object to store the income data for each month and industry
  const incomeData = {};
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
  console.log("here");
  console.log(incomeData);
  // Convert the income data object to an array of data points for the chart
  /*const chartData = {
    labels: Object.keys(incomeData),
    datasets: [
      {
        label: "Monthly Income by Industry",
        data: Object.values(incomeData).map((income) =>
          Object.values(income).reduce((sum, value) => sum + value, 0)
        ),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };*/
  // Sort the labels by month
  /*const chartData = {
    labels: Object.keys(incomeData).sort((a, b) => {
      const monthA = monthNames.indexOf(a);
      const monthB = monthNames.indexOf(b);
      return monthA - monthB;
    }),
    datasets: [
      {
        label: "Monthly Income by Industry",
        data: Object.keys(incomeData).map((month) =>
          Object.values(incomeData[month]).reduce(
            (sum, value) => sum + value,
            0
          )
        ),
        backgroundColor: [
          colors.manufacturing,
          colors.services,
          colors.construction,
          colors.others,
        ],
      },
    ],
  };*/
  const chartData = {
    labels: monthNames,
    datasets: industry.map((industry) => ({
      label: industry.industry,
      data: result
        .filter(({ industry: ind }) => ind === industry.industry)
        .map(({ monthly_income }) => monthly_income)
        .reverse(),
      backgroundColor: colors[industry.industry],
    })),
  };
  console.log(chartData);
  console.log("hello");
  // Configure the chart options
  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        type: "linear",
        title: {
          display: true,
          text: "Monthly Income ($)",
        },
        ticks: {
          beginAtZero: true,
          precision: 0,
        },
        grid: {
          drawBorder: false,
        },
      },
      x: {
        type: "category",
        title: {
          display: true,
          text: "Month",
        },
        grid: {
          drawBorder: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
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
