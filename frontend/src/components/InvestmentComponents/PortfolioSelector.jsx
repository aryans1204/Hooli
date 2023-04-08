import React, { useState } from "react";
import { useEffect } from "react";
import classes from "./PortfolioSelector.module.css";

/**
 * Component to select a portfolio.
 * @param {*} props 
 * @returns {JSX.Element}
 */
function PortfolioSelector(props) {
  const [selectedPortfolioIndex, setSelectedPortfolioIndex] = useState(
    props.index
  );
  const selectedPortfolio = props.data[props.index];
  useEffect(() => {
    console.log(selectedPortfolio);
  }, [selectedPortfolio]);

  /** 
   * Sets the index passed in as props from the parent component.
   * Index is to be used to select the portfolio to display from the parent component. 
  */
  const handleChange = (e) => {
    const index = parseInt(e.target.value);
    setSelectedPortfolioIndex(index);
    props.onIndexChange(index);
  };

  return (
    <div className={classes.menu}>
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
