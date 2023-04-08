import { useState } from "react";
import StockSelector from "./StockSelector";

/**
 * Renders the 'Edit' button.
 * @param {*} props 
 * @returns {JSX.Element}
 */
export function RemovePortfolio(props) {
  const [targetFound, setTargetFound] = useState(false);
  const [targetData, setTargetData] = useState(null);

  // props.data._id will be the id used to locate the portfolio containing the data we want to remove

  /**
   * Removes an equity from a portfolio using delete/api/investments/equities.
   */
  const removeEquity = (item) => {
    fetch(
      "https://hooli-backend-aryan.herokuapp.com/api/investments/equities/" +
        props.data._id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          equity_ticker: item.equity_ticker,
        }),
      }
    )
      .then((response) => {
        if (response.status === 500) {
          console.log("Some error occurred - " + response.status);
        } else {
          updatePortfolios();
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      });
  };

  /**
   * Removes an option from a portfolio using delete/api/investments/options.
   */
  const removeOption = (item) => {
    fetch(
      "https://hooli-backend-aryan.herokuapp.com/api/investments/options/" +
        props.data._id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          derivative_ticker: item.derivative_ticker,
        }),
      }
    )
      .then((response) => {
        if (response.status === 500) {
          console.log("Some error occurred - " + response.status);
        } else {
          updatePortfolios();
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      });
  };

  /**
   * Deletes a portfolio using delete/api/investments.
   */
  const deletePortfolio = () => {
    fetch(
      "https://hooli-backend-aryan.herokuapp.com/api/investments/" +
        props.data._id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => {
        if (response.status === 500 || response.status === 404) {
          console.log("Some error occurred - " + response.status);
        } else {
          updatePortfolios();
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      });
  };

  /** 
   * Refreshes the portfolios in sessionStorage after a change has been made. 
  */
  const updatePortfolios = () => {
    sessionStorage.removeItem("portfolios");
    props.edit();
    window.location.reload();
  };

  function deleteTicker(targetData) {
    /** 
     * Retrieves tickerData from sessionStorage.
     */
    const tickerData = JSON.parse(sessionStorage.getItem("tickerData"));

    /** 
     * Retrieves target ticker to remove.
     */
    let ticker;
    if (targetData.derivative_ticker) {
      ticker = targetData.derivative_ticker;
    } else {
      ticker = targetData.equity_ticker;
    }

    /** 
     * Filters out the object with the specified ticker symbol.
     */
    const filteredData = tickerData.filter(
      (obj) => obj["Meta Data"]["2. Symbol"] !== ticker
    );

    /** 
     * Stores the new tickerData back into sessionStorage.
     */
    sessionStorage.setItem("tickerData", JSON.stringify(filteredData));
  }

  /**
   * Handles the submission of an item and checks if it is a derivative or equity ticker, removing it and setting target data if found.
   */
  const handleSubmit = (item) => {
    if (item.derivative_ticker) {
      removeOption(item);
      deleteTicker(item.derivative_ticker);
      setTargetFound(true);
      setTargetData(item);
    } else if (item.equity_ticker) {
      removeEquity(item);
      deleteTicker(item.equity_ticker);
      setTargetFound(true);
      setTargetData(item);
    } else {
      console.log("Something wrong here");
    }
  };
  return (
    <div>
      <StockSelector
        data={props.data}
        onSubmit={handleSubmit}
        deletePortfolio={deletePortfolio}
      />
    </div>
  );
}
