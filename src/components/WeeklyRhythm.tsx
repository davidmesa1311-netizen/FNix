import React from 'react';
import './WeeklyRhythm.css';

interface WeeklyRhythmProps {
  data: { day: string; count: number }[];
}

const WeeklyRhythm: React.FC<WeeklyRhythmProps> = ({ data }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  // Rellenar días faltantes si es necesario para tener siempre 7 barras
  const filledData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const found = data.find(item => item.day === dateStr);
    return {
      dayLabel: days[d.getDay()],
      count: found ? found.count : 0
    };
  });

  return (
    <div className="weekly-rhythm">
      <div className="rhythm-bars">
        {filledData.map((item, i) => (
          <div key={i} className="rhythm-bar-container">
            <div 
              className="rhythm-bar-fill" 
              style={{ height: `${(item.count / (maxCount + 2)) * 100}%` }}
            >
              {item.count > 0 && <span className="bar-value">{item.count}</span>}
            </div>
            <span className="rhythm-day-label">{item.dayLabel}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyRhythm;
