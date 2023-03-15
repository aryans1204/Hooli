import classes from "./ExpendituresPieChartComponent.module.css";
import { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { Doughnut } from 'react-chartjs-2';

/**
 * Component for income bar chart.
 * @export
 * @param {*} props
 * @returns {*}
 */
export function ExpendituresPieChartComponent(props) {
    const [result, setResult] = useState(null);
    useEffect(() => {
      setResult(props.data);
    }, [props.data]);
    
    if (result !== null) {
        result.forEach()
    }

    /**
     * Chart Data
     */
    const chartData = {
        labels: [
            "Food",
            "Housing",
            "Utilities",
            "Bills",
            "Clothes",
            "Lifestyle",
            "Transport",
            "Healthcare",
            "Pets",
            "Others"
        ],
        datasets: [
            {
                data: [],
                backgroundColor: [
                    "blue", 
                    "brown", 
                    "yellow", 
                    "red", 
                    "orange", 
                    "green", 
                    "purple", 
                    "pink", 
                    "aqua",
                    "black"
                ]
            }]
    };

    /**
     * Chart Options
     */
    const chartOptions = {};

    return (
        <div>
          <Doughnut
          options={chartOptions}
          data={chartData}
          />
        </div>
      );
}