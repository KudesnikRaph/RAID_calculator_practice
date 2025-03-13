import { useState } from "react";
import "../index.css";

const RaidCalculator = () => {
    const [capacity, setCapacity] = useState(2000);
    const [disks, setDisks] = useState(2);
    const [selectedRaid, setSelectedRaid] = useState('0');
    const [selectedDisk, setSelectedDisk] = useState('NL SAS / SATA 3.5"');

    const handleRaidClick = (raid) => setSelectedRaid(raid);
    const handleDiskClick = (type) => setSelectedDisk(type);

    return (
        <div className="raid-container">
            <h1>RAID Калькулятор</h1>
            <h2>Уровень RAID</h2>
            <div className="btn-group">
                {['0', '1', '5', '10', '50'].map(raid => (
                    <button
                        key={raid}
                        className={`raid-button ${selectedRaid === raid ? 'selected' : ''}`}
                        onClick={() => handleRaidClick(raid)}>
                        {raid}
                    </button>
                ))}
            </div>

            <h2>Тип диска</h2>
            <div className="btn-group">
                {['NL SAS / SATA 3.5"', 'SATA 2.5"', 'SSD 2.5"'].map(type => (
                    <button
                        key={type}
                        className={`disk-button ${selectedDisk === type ? 'selected' : ''}`}
                        onClick={() => handleDiskClick(type)}>
                        {type}
                    </button>
                ))}
            </div>
            

            <div className="slider-container">
                
                <label>Объем памяти (TB): 
                <input
                    type="number"
                    min="2000"
                    max="20000"
                    step="2000"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                />
                Gb
                </label>
                <input
                    className="green-slider"
                    type="range"
                    min="2000" max="32000" step="2000"
               
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    list="capacity-ticks"
                />
                <datalist id="capacity-ticks">
                    {Array.from({ length: (32000 - 2000) / 2000 + 1 }, (_, i) => (
                        <option key={i} value={2000 + i * 2000}>{2000 + i * 2000}</option>
                    ))}
                </datalist>
                <p className="note">1 терабайт (TB) = 1000 гигабайт (GB), 1 гигабайт (GB) = 1000 мегабайт</p>
            </div>
            

            <div className="slider-container">
                <label>Количество дисков: 
                <input
                    type="number"
                    min="2000"
                    max="20000"
                    step="2000"
                    value={disks}
                    onChange={(e) => setDisks(Number(e.target.value))}
                />
                Шт.
                </label>
                <input
                    type="range"
                    min="2"
                    max="20"
                    step="2"
                    value={disks}
                    onChange={(e) => setDisks(Number(e.target.value))}
                    list="disk-ticks"
                />
                <datalist id="disk-ticks">
                    {Array.from({ length: (20 - 2) / 2 + 1 }, (_, i) => (
                        <option key={i} value={2 + i * 2}>{2 + i * 2}</option>
                    ))}
                </datalist>
                <p className="note">Для построения массива требуется не менее 2 дисков.</p>
            </div>
        </div>
    );
};

export default RaidCalculator;
