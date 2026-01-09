
import React from 'react';
import { Opportunity } from '../types';
import { AlertCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DealCardProps {
  opportunity: Opportunity;
  isAttention?: boolean;
  themeMode: 'dark' | 'light';
}

const DealCard: React.FC<DealCardProps> = ({ opportunity, isAttention, themeMode }) => {
  const navigate = useNavigate();
  const isLight = themeMode === 'light';

  return (
    <div 
        onClick={() => navigate(`/client/${opportunity.id}`)}
        className={`p-5 rounded-2xl border mb-4 cursor-pointer transition-all duration-300 group hover:translate-y-[-2px] hover:border-accentCyan/50 ${
            isAttention 
                ? (isLight ? 'border-l-4 border-l-accentCyan bg-white shadow-md' : 'border-l-4 border-l-accentCyan border-t-border border-r-border border-b-border bg-bgCard')
                : (isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-bgCard border-border')
        }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-4 items-center">
            {opportunity.logoShort && (
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm group-hover:scale-110 transition-transform ${isLight ? 'bg-slate-900 text-white' : 'bg-white text-bgDark'}`}>
                    {opportunity.logoShort}
                </div>
            )}
            <div>
              <h3 className={`font-sans text-lg font-bold transition-colors ${isLight ? 'text-slate-900 group-hover:text-accentCyan' : 'text-white group-hover:text-accentCyan'}`}>
                  {opportunity.companyName}
              </h3>
              <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-textSecondary'}`}>
                {opportunity.contacts[0].name} • <span className={`text-xs uppercase px-2 py-0.5 rounded ${isLight ? 'bg-slate-100 text-slate-500' : 'bg-bgElevated text-textSecondary'}`}>{opportunity.contacts[0].role}</span>
              </p>
            </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-accentGreen">${opportunity.amount.toLocaleString()}</p>
          <p className={`text-xs ${isLight ? 'text-slate-400' : 'text-textSecondary'}`}>{opportunity.stage}</p>
        </div>
      </div>

      <div className={`flex items-center gap-2 text-sm mt-4 p-3 rounded-xl transition-colors ${isLight ? 'bg-slate-50 group-hover:bg-slate-100' : 'bg-bgElevated group-hover:bg-bgDark'}`}>
        {isAttention ? <AlertCircle size={16} className="text-accentCyan" /> : <Calendar size={16} className={isLight ? "text-slate-400" : "text-textSecondary"} />}
        <span className={isAttention ? (isLight ? "text-slate-900 font-medium" : "text-white font-medium") : (isLight ? "text-slate-500" : "text-textSecondary")}>
          {opportunity.nextAction}
        </span>
      </div>

      {opportunity.probability && (
         <div className="mt-3 flex items-center gap-2">
            <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-bgDark'}`}>
                <div 
                    className={`h-full rounded-full ${opportunity.probability > 70 ? 'bg-accentGreen' : opportunity.probability > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                    style={{ width: `${opportunity.probability}%`}}
                ></div>
            </div>
            <span className={`text-xs ${isLight ? 'text-slate-400' : 'text-textSecondary'}`}>{opportunity.probability}%</span>
         </div>
      )}
    </div>
  );
};

export default DealCard;
