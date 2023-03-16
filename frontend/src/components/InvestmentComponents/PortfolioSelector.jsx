import React, { useState } from "react";
import classes from "./PortfolioSelector.module.css";

function PortfolioSelector(props) {
  const [selectedPortfolioIndex, setSelectedPortfolioIndex] = useState(0);
  const selectedPortfolio = props.data[selectedPortfolioIndex];
  console.log(selectedPortfolio);
  return (
    <div>
      <select
        value={selectedPortfolioIndex}
        onChange={(e) => setSelectedPortfolioIndex(parseInt(e.target.value))}
      >
        {props.data.map((portfolio, index) => (
          <option key={index} value={index}>
            {index + 1}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PortfolioSelector;
