import React from "react";
import { useState, useEffect } from "react";
import { PieChart, Pie, Legend, Sector, Cell, ResponsiveContainer } from 'recharts';

export function ExpendituresPieChartComponent(props) {

    const [result, setResult] = useState(null);
    useEffect(() => {
    setResult(props.data);
    }, [props.data]);

    var pieData = [
        {name: "Food", value: 0},
        {name: "Housing", value: 0},
        {name: "Utilities", value: 0},
        {name: "Bills", value: 0},
        {name: "Clothes", value: 0},
        {name: "Lifestyle", value: 0},
        {name: "Transport", value: 0},
        {name: "Healthcare", value: 0},
        {name: "Pets", value: 0},
        {name: "Others", value: 0},
    ];

    if (result !== null) {
        result.forEach(({category, amount}) => {
            for(let i=0; i< pieData.length; i++) {
                if (pieData[i].name.toLowerCase() === category.toLowerCase()) {
                    pieData[i].value += amount;
                    break;
                }
            }
        });
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
 
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
 
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };
 
    return (
        <>
            <div>
                <div class="row d-flex justify-content-center text-center">
                    <hr />
                    <div className="col-md-8">
                        <ResponsiveContainer width={400} height={400} className="text-center">
                            <PieChart width={400} height={400}>
                                <Legend layout="vertical" verticalAlign="top" align="top" />
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    );

//    const CustomTooltip = ({ active, payload, label }) => {
//       if (active) {
//          return (
//          <div
//             className="custom-tooltip"
//             style={{
//                backgroundColor: "#ffff",
//                padding: "5px",
//                border: "1px solid #cccc"
//             }}
//          >
//             <label>{`${payload[0].name} : ${payload[0].value}%`}</label>
//          </div>
//       );
//    }
// }

//    return (
//     <div>
//     <PieChart width={730} height={300}>
//     <Pie
//        data={pieData}
//        color="#000000"
//        dataKey="value"
//        nameKey="name"
//        cx="50%"
//        cy="50%"
//        outerRadius={120}
//        fill="#8884d8"
//     >
//        {pieData.map((entry, index) => (
//           <Cell
//              key={`cell-${index}`}
//              fill={COLORS[index % COLORS.length]}
//           />
//        ))}
//     </Pie>
//     <Tooltip content={<CustomTooltip />} />
//     <Legend />
//     </PieChart>
//     </div>
//     );
}