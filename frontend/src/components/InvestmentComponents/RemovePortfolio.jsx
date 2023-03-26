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
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      });
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
      <StockSelector data={props.data} onSubmit={handleSubmit} />
      {/*<div>
          {targetFound === true ? (
            <EditEquity
              data={targetData}
              setTargetFound={setTargetFound}
              portfolio={props.data}
              //setState={setState}
            />
          ) : null}
          </div>*/}
    </div>
  );
}
