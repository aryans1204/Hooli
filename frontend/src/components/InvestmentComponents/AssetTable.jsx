import { useState } from "react";
import classes from "./AssetTable.module.css";

function AssetTable(props) {
  const [activeTab, setActiveTab] = useState("equities");
  const [activeTicker, setActiveTicker] = useState(null);

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
              <td>{equity.equity_current_price}</td>
              <td>
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

  const renderCommodities = () => {
    const { commodities } = props.data;
    if (!commodities || commodities.length === 0) {
      return <div>No commodities data available.</div>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Commodity Type</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {commodities.map((commodity, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(commodity.commodity_type)}
            >
              <td
                className={
                  commodity.commodity_type === activeTicker
                    ? classes.activeTicker
                    : classes.ticker
                }
              >
                {commodity.commodity_type.replace("_", " ")}
              </td>
              <td>{commodity.commodity_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const handleRowClick = (ticker) => {
    // handle row click here
    console.log(`Clicked on row for ${ticker}`);
    setActiveTicker(ticker);
  };

  return (
    <div>
      <div>
        <button onClick={() => handleTabClick("equities")}>Equities</button>
        <button onClick={() => handleTabClick("options")}>Options</button>
        <button onClick={() => handleTabClick("commodities")}>
          Commodities
        </button>
      </div>
      {activeTab === "equities" && renderEquities()}
      {activeTab === "options" && renderOptions()}
      {activeTab === "commodities" && renderCommodities()}
    </div>
  );
}

export default AssetTable;
