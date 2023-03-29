import { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import classes from "./AssetTable.module.css";

function AssetTable(props) {
  const [activeTab, setActiveTab] = useState("equities");
  const [activeTicker, setActiveTicker] = useState(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    // Create empty chart instance when component mounts
    const ctx = document.getElementById("myChart").getContext("2d");
    const emptyChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        scales: {
          x: {
            grid: {
              display: true,
            },
          },
          y: {
            grid: {
              display: true,
            },
            ticks: {
              callback: function (label, index, labels) {
                if (index % 5 === 0) {
                  return label;
                } else {
                  return "";
                }
              },
            },
          },
        },
      },
    });
    setChart(emptyChart);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderEquities = () => {
    const { equities } = props.data;
    if (!equities || equities.length === 0) {
      return <div>No equities data available.</div>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Buy Price</th>
            <th>Current Price</th>
            <th>P&amp;L</th>
          </tr>
        </thead>
        <tbody>
          {equities.map((equity, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(equity.equity_ticker)}
            >
              <td
                className={
                  equity.equity_ticker === activeTicker
                    ? classes.activeTicker
                    : classes.ticker
                }
              >
                {equity.equity_ticker}
              </td>
              <td>{equity.equity_buy_price}</td>
              <td
                style={{
                  backgroundColor:
                    equity.equity_current_price < equity.equity_buy_price
                      ? "#ff8585"
                      : equity.equity_current_price > equity.equity_buy_price
                      ? "#4fff84"
                      : "inherit",
                }}
              >
                {equity.equity_current_price}
              </td>
              <td
                style={{
                  backgroundColor: equity.equity_pnl.includes("-")
                    ? "#ff8585"
                    : equity.equity_pnl !== "0%"
                    ? "#4fff84"
                    : "inherit",
                }}
              >
                {parseFloat(equity.equity_pnl.replace("%", "")).toFixed(1) +
                  "%"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderOptions = () => {
    const { options } = props.data;
    if (!options || options.length === 0) {
      return <div>No options data available.</div>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Option Type</th>
            <th>Current Price</th>
            <th>Strike Price</th>
            <th>Expiration Date</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(option.derivative_ticker)}
            >
              <td
                className={
                  option.derivative_ticker === activeTicker
                    ? classes.activeTicker
                    : classes.ticker
                }
              >
                {option.derivative_ticker || "NA"}
              </td>
              <td>{option.option_type || "NA"}</td>
              <td>{option.derivative_current_price || "NA"}</td>
              <td>{option.strike_price || "NA"}</td>
              <td>{option.expiration_date.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const handleRowClick = (ticker) => {
    // handle row click here
    const tickerData = JSON.parse(sessionStorage.getItem("tickerData"));
    const selectedStock = tickerData.find(
      (stock) => stock["Meta Data"]["2. Symbol"] === ticker
    );
    const dailyData = selectedStock["Time Series (Daily)"];

    const adjustedClosePrices = [];

    for (let date in dailyData) {
      adjustedClosePrices.push(parseFloat(dailyData[date]["4. close"]));
    }

    // Destroy previous chart if it exists
    if (chart) {
      chart.destroy();
    }

    // Create new chart
    const ctx = document.getElementById("myChart").getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.canvas.width = "200px";
    ctx.canvas.height = "30%";
    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Object.keys(dailyData),
        datasets: [
          {
            label: "Adjusted Close",
            data: adjustedClosePrices,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            reverse: true,
          },
        },
      },
    });

    // Save chart instance to state
    setChart(newChart);
    console.log(`Clicked on row for ${ticker}`);
    setActiveTicker(ticker);
  };

  return (
    <div>
      <canvas id="myChart" style={{ height: "25vh", width: "90vw" }}></canvas>
      <div>
        <button onClick={() => handleTabClick("equities")}>Equities</button>
        <button onClick={() => handleTabClick("options")}>Options</button>
      </div>
      {activeTab === "equities" && renderEquities()}
      {activeTab === "options" && renderOptions()}
    </div>
  );
}

export default AssetTable;
