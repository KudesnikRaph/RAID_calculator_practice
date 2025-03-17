import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const PieCharts = ({ data }) => {
  if (
    isNaN(data.totalPhysicalCapacity) ||
    isNaN(data.effectiveCapacity) ||
    isNaN(data.efficiency) ||
    isNaN(data.faultTolerance)
  ) {
    return <div>Ошибка: Некорректные данные для расчета.</div>;
  }

  const chartData = [
    { name: "Доступный объем", value: parseFloat(data.availableCapacity) },
    { name: "Недоступный объем", value: parseFloat(data.unavailableCapacity) },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      <div style={{ width: "400px", height: "400px" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3>Результаты расчета</h3>
        <p>Общий объем: {data.totalPhysicalCapacity} TB / {data.totalPhysicalCapacityTiB} TiB</p>
        <p>Эффективный объем: {data.effectiveCapacity} TB / {data.effectiveCapacityTiB} TiB</p>
        <p>Эффективность: {data.efficiency.toFixed(2)} %</p>
        <p>Отказоустойчивость: {data.faultTolerance} дисков</p>
        <p>Доступный объем: {data.availableCapacity} TB / {data.availableCapacityTiB} TiB</p>
        <p>Недоступный объем: {data.unavailableCapacity} TB / {data.unavailableCapacityTiB} TiB</p>
      </div>
    </div>
  );
};

export default PieCharts;
