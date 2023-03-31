import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { LinearScale, CategoryScale } from "chart.js";
import Chart from "chart.js/auto";


/**
 * Component for income bar chart.
 * @export
 * @param {*} props
 * @returns {*}
 */
export function IncomeBarChart(props) {
    const [year, setYear] = useState(null);

  
  return (
    <>
        <label htmlFor="Year">Year:</label>
        <select name="years" id="year"
          onChange={(event) => {
             setYear(event.target.value);
             console.log(year);
          }}>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
        </select>

        
    </>
  );
}
