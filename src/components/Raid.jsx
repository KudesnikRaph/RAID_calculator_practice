import { useState, useEffect, useRef } from "react";
import "../index.css";
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";

const Raid = ({ onCalculate }) => {
  const [capacity, setCapacity] = useState(4000);
  const [disks, setDisks] = useState(2);
  const [selectedRaid, setSelectedRaid] = useState("0");
  const [selectedDisk, setSelectedDisk] = useState('NL SAS / SATA 3.5"');

  const capacitySliderRef = useRef(null);
  const disksSliderRef = useRef(null);

  const handleRaidClick = (raid) => {
    setSelectedRaid(raid);
    calculateRAID(raid, selectedDisk, capacity, disks);
  };

  const handleDiskClick = (type) => {
    setSelectedDisk(type);
    const newCapacity = type === "SATA 2.5\"" ? 2400 : (type === "SSD 2.5\"" ? 60000 : 2000);
    setCapacity(newCapacity);
    calculateRAID(selectedRaid, type, newCapacity, disks);
  };

  const handleDiskChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 2 && value <= 20) {
      setDisks(value);
      calculateRAID(selectedRaid, selectedDisk, capacity, value);
    }
  };

  const handleCapacityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 2000 && value <= 32000) {
      setCapacity(value);
      calculateRAID(selectedRaid, selectedDisk, value, disks);
    }
  };

  const calculateRAID = (raid, disk, capacity, disks) => {
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
      totalPhysicalCapacity * (typeof raidInfo[raid].efficiency === "function"
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
        : raid === "50"
        ? 2
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

    if (capacitySlider) {
      noUiSlider.create(capacitySlider, {
        start: capacity,
        connect: [true, false],
        range: {
          min: selectedDisk === "SATA 2.5\"" ? 600 : (selectedDisk === "SSD 2.5\"" ? 0 : 2000),
          max: selectedDisk === "SATA 2.5\"" ? 2400 : (selectedDisk === "SSD 2.5\"" ? 60000 : 32000),
        },
        step: selectedDisk === "SATA 2.5\"" ? 300 : 2000,
        pips: {
          mode: "range",
          density: selectedDisk === "SATA 2.5\"" ? 4 : 3,
        },
      });

      capacitySlider.noUiSlider.on("update", (values) => {
        const newValue = Number(values[0]);
        setCapacity(newValue);
        calculateRAID(selectedRaid, selectedDisk, newValue, disks);
      });
    }

    if (disksSlider) {
      noUiSlider.create(disksSlider, {
        start: disks,
        connect: [true, false],
        range: {
          min: 2,
          max: 20,
        },
        step: 2,
        tooltips: false,
        pips: {
          mode: "range",
          density: 3,
        },
      });

      disksSlider.noUiSlider.on("update", (values) => {
        const newValue = Number(values[0]);
        setDisks(newValue);
        calculateRAID(selectedRaid, selectedDisk, capacity, newValue);
      });
    }

    return () => {
      if (capacitySlider) {
        capacitySlider.noUiSlider.destroy();
      }
      if (disksSlider) {
        disksSlider.noUiSlider.destroy();
      }
    };
  }, [capacity, disks, selectedRaid, selectedDisk]);

  useEffect(() => {
    const capacitySlider = capacitySliderRef.current;
    if (capacitySlider) {
      capacitySlider.noUiSlider.updateOptions({
        range: {
          min: selectedDisk === "SATA 2.5\"" ? 600 : (selectedDisk === "SSD 2.5\"" ? 0 : 2000),
          max: selectedDisk === "SATA 2.5\"" ? 2400 : (selectedDisk === "SSD 2.5\"" ? 60000 : 32000),
        },
        step: selectedDisk === "SATA 2.5\"" ? 300 : 2000,
      });
    }
  }, [selectedDisk]);

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

      <h2>Тип диска</h2>
      <div className="btn-group">
        {['NL SAS / SATA 3.5"', 'SATA 2.5"', 'SSD 2.5"'].map((type) => (
          <button
            key={type}
            className={`disk-button ${selectedDisk === type ? "selected" : ""}`}
            onClick={() => handleDiskClick(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="slider-container">
        <label className="label">Объем памяти (TB):</label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div ref={capacitySliderRef} className="slider" style={{ flex: 1, marginRight: '10px' }}></div>
          <input
            type="number"
            value={capacity}
            onChange={handleCapacityChange}
            min="2000"
            max="32000"
            step="2000"
            className="capacity-input"
          />
        </div>
        <p className="note">1 терабайт (TB) = 1000 гигабайт (GB), 1 гигабайт (GB) = 1000 мегабайт</p>
      </div>

      <div className="slider-container">
        <label className="label">Количество дисков:</label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div ref={disksSliderRef} className="slider" style={{ flex: 1, marginRight: '10px' }}></div>
          <input
            type="number"
            value={disks}
            onChange={handleDiskChange}
            min="2"
            max="20"
            step="2"
            className="disk-input"
          />
        </div>
        <p className="note">Для построения массива требуется не менее 2 дисков.</p>
      </div>
    </div>
  );
};

export default Raid;
