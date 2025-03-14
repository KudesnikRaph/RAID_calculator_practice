import { useState, useEffect, useRef } from "react";
import "../index.css";
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";

const Raid = () => {
    const [capacity, setCapacity] = useState(2000);
    const [disks, setDisks] = useState(2);
    const [selectedRaid, setSelectedRaid] = useState('0');
    const [selectedDisk, setSelectedDisk] = useState('NL SAS / SATA 3.5"');
    
    const capacitySliderRef = useRef(null);
    const disksSliderRef = useRef(null);

    const handleRaidClick = (raid) => setSelectedRaid(raid);
    const handleDiskClick = (type) => setSelectedDisk(type);

    useEffect(() => {
        const capacitySlider = capacitySliderRef.current;
        const disksSlider = disksSliderRef.current;

        if (capacitySlider) {
            noUiSlider.create(capacitySlider, {
                start: capacity,
                connect: [true, false],
                range: {
                    min: 2000,
                    max: 32000
                },
                step: 2000,
                tooltips: false,
                pips: {
                    mode: 'range',
                    density: 3
                },
            });

            capacitySlider.noUiSlider.on("update", (values) => {
                setCapacity(Number(values[0]));
            });
        }

        if (disksSlider) {
            noUiSlider.create(disksSlider, {
                start: disks,
                connect: [true, false],
                range: {
                    min: 2,
                    max: 20
                },
                step: 2,
                tooltips: false,
                pips: {
                    mode: 'range',
                    density: 3
                },
            });

            disksSlider.noUiSlider.on("update", (values) => {
                setDisks(Number(values[0]));
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
    }, [capacity, disks]);

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
                <label className="lable">Объем памяти (TB): {capacity} Gb</label>
                <div ref={capacitySliderRef} className="slider"></div>
                <p className="note">1 терабайт (TB) = 1000 гигабайт (GB), 1 гигабайт (GB) = 1000 мегабайт</p>
            </div>
            
            <div className="slider-container">
                <label className="lable">Количество дисков: {disks} Шт.</label>
                <div ref={disksSliderRef} className="slider"></div>
                
                <p className="note">Для построения массива требуется не менее 2 дисков.</p>
            </div>
        </div>
    );
};

export default Raid;
