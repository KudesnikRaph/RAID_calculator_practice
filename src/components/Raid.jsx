import { useState } from "react";
import "../index.css";

const RaidCalculator = () => {
    const [capacity, setCapacity] = useState(10);
    const [disks, setDisks] = useState(2);
    const [selectedRaid, setSelectedRaid] = useState(null); // Состояние для выбранного RAID уровня
    const [selectedDisk, setSelectedDisk] = useState(null); // Состояние для выбранного типа диска

    const handleRaidClick = (raid) => {
        setSelectedRaid(raid);
    };

    const handleDiskClick = (type) => {
        setSelectedDisk(type);
    };

    return (
        <div className="raid-container">
            <h1>RAID Калькулятор</h1>
            <h2>RAID</h2>
            <div className="btn-group">
                {['0', '1', '5', '10', '50'].map(raid => (
                    <button
                        key={raid}
                        className={`raid-button ${selectedRaid === raid ? 'selected' : ''}`}
                        onClick={() => handleRaidClick(raid)}
                    >
                        {raid}
                    </button>
                ))}
            </div>
            <h2>Емкость диска</h2>
            <div className="btn-group">
                {['NL SAS / SATA 3.5"', 'SATA 2.5"', 'SSD 2.5"'].map(type => (
                    <button
                        key={type}
                        className={`disk-button ${selectedDisk === type ? 'selected' : ''}`}
                        onClick={() => handleDiskClick(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>
            <div className="slider-container">
                <label>Объем памяти (TB): <span>{capacity}</span></label>
                <input className="green-slider" type="range" min="1" max="100" value={capacity} onChange={e => setCapacity(e.target.value)} />
                <p className="note">1 терабайт (TB) = 1000 гигабайт (GB), 1 гигабайт (GB) = 1000 мегабайт (MB)</p>
            </div>
            <div className="slider-container">
                <label>Количество дисков: <span>{disks}</span></label>
                <input className="green-slider" type="range" min="1" max="24" value={disks} onChange={e => setDisks(e.target.value)} />
                <p className="note">Для построения RAID 0 требуется не менее 2 дисков.</p>
            </div>
        </div>
    );
};

export default RaidCalculator;
