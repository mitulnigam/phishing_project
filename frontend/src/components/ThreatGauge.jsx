import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ThreatGauge = ({ score }) => {
  const data = [
    { name: 'Risk', value: score * 100 },
    { name: 'Safe', value: (1 - score) * 100 },
  ];

  const COLORS = [
    score > 0.7 ? '#ff003c' : score > 0.3 ? '#ff00e5' : '#00ff9d',
    'rgba(255, 255, 255, 0.05)'
  ];

  return (
    <div className="w-full h-48 relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={180}
            endAngle={0}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
        <span className="text-4xl font-bold font-mono tracking-tighter">
          {Math.round(score * 100)}
          <span className="text-sm opacity-30">%</span>
        </span>
        <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Phishing Risk</span>
      </div>
    </div>
  );
};

export default ThreatGauge;
