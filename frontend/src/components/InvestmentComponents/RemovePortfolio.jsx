import { useState, useEffect } from "react";
import StockSelector from "./StockSelector";

//function that renders the 'Edit' button
export function RemovePortfolio(props) {
  const [targetFound, setTargetFound] = useState(false);
  const [targetData, setTargetData] = useState(null);

  // props.data._id will be the id used to locate the portfolio containing the data we want to remove
  const removeEquity = (item) => {
    console.log(item);
    fetch("/api/investments/equities/" + props.data._id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        equity_ticker: item.equity_ticker,
      }),
    })
      .then((response) => {
        if (response.status === 500) {
          console.log("Some error occurred - " + response.status);
        } else {
          console.log("Removed");
          updatePortfolios();
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      });
  };

  const removeOption = (item) => {
    console.log(item);
    fetch("/api/investments/options/" + props.data._id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        derivative_ticker: item.derivative_ticker,
      }),
    })
      .then((response) => {
        if (response.status === 500) {
          console.log("Some error occurred - " + response.status);
        } else {
          console.log("Removed");
          updatePortfolios();
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      });
  };

  const deletePortfolio = () => {
    fetch("/api/investments/" + props.data._id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 500 || response.status === 404) {
          console.log("Some error occurred - " + response.status);
        } else {
          console.log("Removed");
          updatePortfolios();
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      });
  };

  // function to refresh the portfolios in sessionStorage after a change has been made
  const updatePortfolios = () => {
    sessionStorage.removeItem("portfolios");
    props.edit();
  };

  const handleSubmit = (item) => {
    console.log(props.data);
    if (item.derivative_ticker) {
      removeOption(item);
      setTargetFound(true);
      setTargetData(item);
    } else if (item.equity_ticker) {
      removeEquity(item);
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
