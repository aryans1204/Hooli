import React, { useState } from "react";
import { useEffect } from "react";
import classes from "./PortfolioSelector.module.css";

function PortfolioSelector(props) {
  const [selectedPortfolioIndex, setSelectedPortfolioIndex] = useState(
    props.index
  );
  const selectedPortfolio = props.data[props.index];
  useEffect(() => {
    console.log(selectedPortfolio);
  }, [selectedPortfolio]);

  //sets the index passed in as props from the parent component
  //index is to be used to select the portfolio to display from the parent component
  const handleChange = (e) => {
    const index = parseInt(e.target.value);
    setSelectedPortfolioIndex(index);
    props.onIndexChange(index);
  };

  return (
    <div>
      Current Portfolio:{" "}
      <select value={selectedPortfolioIndex} onChange={handleChange}>
        {props.data.map((portfolio, index) => (
          <option key={index} value={index}>
            Portfolio {index + 1}
          </option>
        ))}
      </select>
      <br></br>
    </div>
  );
}

export default PortfolioSelector;
