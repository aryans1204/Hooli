import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { LinearScale, CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import classes from "./IncomeBarChartComponent.module.css";

function IncomeBarChart() {
  const [result, setResult] = useState([]);

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
    const month = new Date(start_date).toLocaleString("default", {
      month: "long",
    });
    if (!incomeData[month]) {
      incomeData[month] = {};
    }
    if (!incomeData[month][industry]) {
      incomeData[month][industry] = 0;
    }
    incomeData[month][industry] += monthly_income;
  });

  // Convert the income data object to an array of data points for the chart
  const chartData = {
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
  };

  // Configure the chart options
  const chartOptions = {
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
      <h2>Monthly Income by Industry</h2>
      <Bar
        width="769px"
        height="550px"
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}

export const IncomeBarChartComponent = ({ render }) => {
  return IncomeBarChart();
};
