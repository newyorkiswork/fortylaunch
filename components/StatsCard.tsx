
import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  trend?: string;
  themeMode: 'dark' | 'light';
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, trend, themeMode }) => {
  const isLight = themeMode === 'light';
  
  return (
    <div className={`p-5 rounded-2xl border transition-colors hover:border-accentCyan ${
        isLight 
            ? 'bg-white border-gray-200 shadow-sm' 
            : 'bg-bgCard border-border'
    }`}>
      <p className={`text-xs uppercase tracking-wider mb-2 ${isLight ? 'text-slate-500' : 'text-textSecondary'}`}>{label}</p>
      <div className="flex items-end justify-between">
        <h3 className={`font-sans text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{value}</h3>
        {trend && <span className="text-xs text-accentGreen mb-1">{trend}</span>}
      </div>
    </div>
  );
};

export default StatsCard;
