import { useState, useEffect, useRef } from "react";
import "../index.css";
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";

const Raid = ({ onCalculate }) => {
  const [capacity, setCapacity] = useState(72);
  const [disks, setDisks] = useState(2);
  const [selectedRaid, setSelectedRaid] = useState("0");

  const capacitySliderRef = useRef(null);
  const disksSliderRef = useRef(null);

  const handleRaidClick = (raid) => {
    setSelectedRaid(raid);
    calculateRAID(raid, capacity, disks);
  };

  const handleDiskChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 2 && value <= 20) {
      setDisks(value);
      calculateRAID(selectedRaid, capacity, value);
    }
  };

  const handleCapacityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 72 && value <= 100000) {
      setCapacity(value);
      calculateRAID(selectedRaid, value, disks);
    }
  };

  const calculateRAID = (raid, capacity, disks) => {
    const raidInfo = {
      "0": { minDisks: 2, efficiency: 1.0 },
      "1": { minDisks: 2, efficiency: 0.5 },
      "5": { minDisks: 3, efficiency: (n) => (n - 1) / n },
      "6": { minDisks: 4, efficiency: (n) => (n - 2) / n },
      "10": { minDisks: 4, efficiency: 0.5 },
      "50": { minDisks: 6, efficiency: (n) => (n - 2) / n },
    };

    if (isNaN(capacity) || isNaN(disks) || disks < raidInfo[raid].minDisks) {
      return;
    }

    const totalPhysicalCapacity = capacity * disks;
    const effectiveCapacity =
      totalPhysicalCapacity *
      (typeof raidInfo[raid].efficiency === "function"
        ? raidInfo[raid].efficiency(disks)
        : raidInfo[raid].efficiency);
    const efficiency = (effectiveCapacity / totalPhysicalCapacity) * 100;
    const faultTolerance =
      raid === "1"
        ? 1
        : raid === "5"
        ? 1
        : raid === "6"
        ? 2
        : raid === "10"
        ? Math.floor(disks / 2)
        : 0;

    const availableCapacity = effectiveCapacity;
    const unavailableCapacity = totalPhysicalCapacity - effectiveCapacity;

    onCalculate({
      totalPhysicalCapacity: (totalPhysicalCapacity / 1000).toFixed(2),
      effectiveCapacity: (effectiveCapacity / 1000).toFixed(2),
      efficiency,
      faultTolerance,
      availableCapacity: (availableCapacity / 1000).toFixed(2),
      unavailableCapacity: (unavailableCapacity / 1000).toFixed(2),
      totalPhysicalCapacityTiB: (totalPhysicalCapacity / 1024).toFixed(2),
      effectiveCapacityTiB: (effectiveCapacity / 1024).toFixed(2),
      availableCapacityTiB: (availableCapacity / 1024).toFixed(2),
      unavailableCapacityTiB: (unavailableCapacity / 1024).toFixed(2),
    });
  };

  useEffect(() => {
    const capacitySlider = capacitySliderRef.current;
    const disksSlider = disksSliderRef.current;

    const allowedValues = [72, 100];
    for (let val = 2000; val <= 100000; val += 2000) {
      allowedValues.push(val);
    }
    const totalSteps = allowedValues.length - 1;
    const rangeObject = {
      min: allowedValues[0],
      max: allowedValues[allowedValues.length - 1],
    };
    allowedValues.slice(1, -1).forEach((value, index) => {
      const percentage = ((index + 1) / totalSteps) * 100;
      rangeObject[`${percentage.toFixed(2)}%`] = value;
    });

    if (capacitySlider) {
      if (capacitySlider.noUiSlider) {
        capacitySlider.noUiSlider.destroy();
      }
      noUiSlider.create(capacitySlider, {
        start: capacity,
        connect: [true, false],
        snap: true,
        range: rangeObject,
        tooltips: false,
        pips: {
          values: allowedValues,
          density: 3,
        },
      });

      capacitySlider.noUiSlider.on("update", (values) => {
        const newValue = Number(values[0]);
        setCapacity(newValue);
        calculateRAID(selectedRaid, newValue, disks);
      });
    }

    if (disksSlider) {
      if (disksSlider.noUiSlider) {
        disksSlider.noUiSlider.destroy();
      }
      noUiSlider.create(disksSlider, {
        start: disks,
        connect: [true, false],
        range: {
          min: 2,
          max: 20,
        },
        step: 1,
        tooltips: false,
        pips: {
          mode: "range",
          density: 3,
        },
      });

      disksSlider.noUiSlider.on("update", (values) => {
        const newValue = Number(values[0]);
        setDisks(newValue);
        calculateRAID(selectedRaid, capacity, newValue);
      });
    }

    return () => {
      if (capacitySlider && capacitySlider.noUiSlider) {
        capacitySlider.noUiSlider.destroy();
      }
      if (disksSlider && disksSlider.noUiSlider) {
        disksSlider.noUiSlider.destroy();
      }
    };
  }, [selectedRaid]);

  return (
    <div className="raid-container">
      <h2>Уровень RAID</h2>
      <div className="btn-group">
        {["0", "1", "5", "6", "10", "50"].map((raid) => (
          <button
            key={raid}
            className={`raid-button ${selectedRaid === raid ? "selected" : ""}`}
            onClick={() => handleRaidClick(raid)}
          >
            {raid}
          </button>
        ))}
      </div>

      <div className="slider-container">
        <label className="label">Объем памяти (GB):</label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            ref={capacitySliderRef}
            className="slider"
            style={{ flex: 1, marginRight: "10px" }}
          ></div>
          <input
            type="number"
            value={capacity}
            onChange={handleCapacityChange}
            min="72"
            max="100000"
            step="100"
            className="capacity-input"
            style={{ width: "100px" }}
          />
        </div>
        <p className="note">1 терабайт (TB) = 1000 гигабайт (GB)</p>
      </div>

      <div className="slider-container">
        <label className="label">Количество дисков:</label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            ref={disksSliderRef}
            className="slider"
            style={{ flex: 1, marginRight: "10px" }}
          ></div>
          <input
            type="number"
            value={disks}
            onChange={handleDiskChange}
            min="2"
            max="20"
            step="1"
            className="disk-input"
            style={{ width: "100px" }}
          />
        </div>
        <p className="note">Для построения массива требуется не менее 2 дисков.</p>
      </div>
    </div>
  );
};

export default Raid;
