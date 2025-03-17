import React, { useState } from "react";
import Raid from "./components/Raid";
import PieCharts from "./components/PieChart";

const App = () => {
  const [raidData, setRaidData] = useState({
    totalPhysicalCapacity: 0,
    effectiveCapacity: 0,
    efficiency: 0,
    faultTolerance: 0,
    availableCapacity: 0,
    unavailableCapacity: 0,
    totalPhysicalCapacityTiB: 0,
    effectiveCapacityTiB: 0,
    availableCapacityTiB: 0,
    unavailableCapacityTiB: 0,
  });

  return (
    <div className="raid-container">
      <h1>RAID Калькулятор</h1>
      <Raid onCalculate={(data) => setRaidData(data)} />
      <PieCharts data={raidData} />
    </div>
  );
};

export default App;