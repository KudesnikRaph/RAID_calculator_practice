import React from "react";
import Raid from './components/Raid'
import { PieChart } from "recharts";
import PieCharts from "./components/PieChart";

function App() {
  return (
    <div className="raid-container">
      <Raid />
      <PieCharts />
    </div>
  );
}

export default App;
