import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "RAID 0", value: 30 },
  { name: "RAID 1", value: 20 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const PieCharts = () => {
  return (
    <PieChart width={400} height={400}>
      <Pie data={data} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default PieCharts;
