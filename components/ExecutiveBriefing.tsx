
import React from 'react';
import { Opportunity, CalendarEvent } from '../types';
import { AlertTriangle, TrendingUp, CheckSquare, X, CheckCircle } from 'lucide-react';

interface ExecutiveBriefingProps {
  opportunities: Opportunity[];
  events: CalendarEvent[];
  onClose: () => void;
}

const ExecutiveBriefing: React.FC<ExecutiveBriefingProps> = ({ opportunities, events, onClose }) => {
  const highRisk = opportunities.filter(o => o.probability > 50 && o.nextActionDate.includes('Overdue'));
  const totalPipeline = opportunities.reduce((acc, curr) => acc + curr.amount, 0);
  
  const todaysEvents = events.filter(e => e.date === 'Today' || e.date === '2026-01-14');
  const completedEvents = todaysEvents.filter(e => e.status === 'Completed');
  const pendingEvents = todaysEvents.filter(e => e.status !== 'Completed');

  // Calculate Pipeline Velocity based on recent completions
  const velocityScore = Math.min(100, (completedEvents.length * 25)); 

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
        <div className="w-full max-w-4xl bg-bgCard border border-border rounded-2xl overflow-hidden shadow-2xl relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-textSecondary hover:text-white z-10"><X size={24}/></button>
            
            <div className="flex h-full flex-col md:flex-row">
                {/* Left: Key Metrics */}
                <div className="md:w-1/3 bg-bgElevated p-8 border-r border-border">
                    <h2 className="text-2xl font-black font-sans text-white mb-1">MORNING<br/>BRIEFING</h2>
                    <p className="text-xs text-textSecondary mb-8 uppercase tracking-widest">{new Date().toLocaleDateString()}</p>

                    <div className="space-y-6">
                        <div>
                            <p className="text-xs text-textSecondary uppercase">Total Pipeline</p>
                            <p className="text-3xl font-bold text-accentCyan">${(totalPipeline / 1000).toFixed(1)}k</p>
                        </div>
                        <div>
                            <p className="text-xs text-textSecondary uppercase">Attention Required</p>
                            <p className="text-3xl font-bold text-red-500">{highRisk.length}</p>
                        </div>
                        <div>
                            <p className="text-xs text-textSecondary uppercase">Daily Velocity</p>
                            <div className="flex items-center gap-2">
                                <p className="text-3xl font-bold text-white">{velocityScore}%</p>
                                {velocityScore > 50 && <TrendingUp size={20} className="text-accentGreen" />}
                            </div>
                            <div className="w-full bg-black/30 h-1 mt-2 rounded-full overflow-hidden">
                                <div className="h-full bg-accentGreen transition-all duration-1000" style={{ width: `${velocityScore}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Narrative */}
                <div className="flex-1 p-8 overflow-y-auto max-h-[80vh]">
                    <div className="space-y-6">
                        <section>
                            <h3 className="flex items-center gap-2 text-white font-bold mb-3 uppercase text-sm tracking-wider">
                                <CheckSquare size={16} /> Today's Focus ({pendingEvents.length})
                            </h3>
                            <div className="space-y-2">
                                {pendingEvents.map(e => (
                                    <div key={e.id} className="flex items-center gap-3 p-3 bg-bgElevated rounded-lg border border-border">
                                        <div className="bg-accentPurple/20 text-accentPurple p-2 rounded text-xs font-bold">{e.time}</div>
                                        <span className="text-sm text-white">{e.title}</span>
                                        {e.status === 'Revise' && <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded ml-auto">Revise</span>}
                                        {e.status === 'Incomplete' && <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded ml-auto">Incomplete</span>}
                                    </div>
                                ))}
                                {pendingEvents.length === 0 && <p className="text-textSecondary text-sm italic">No pending items remaining.</p>}
                            </div>

                            {completedEvents.length > 0 && (
                                <div className="mt-4 opacity-70">
                                    <h4 className="text-xs font-bold text-accentGreen mb-2 flex items-center gap-1">
                                        <CheckCircle size={12}/> Completed ({completedEvents.length})
                                    </h4>
                                    <div className="space-y-1">
                                        {completedEvents.map(e => (
                                            <div key={e.id} className="flex items-center gap-2 text-sm text-textSecondary decoration-slate-500">
                                                <span className="line-through">{e.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        <section>
                            <h3 className="flex items-center gap-2 text-red-500 font-bold mb-3 uppercase text-sm tracking-wider">
                                <AlertTriangle size={16} /> Critical Risks
                            </h3>
                            {highRisk.length > 0 ? (
                                <div className="space-y-2">
                                    {highRisk.map(o => (
                                        <div key={o.id} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                            <div className="flex justify-between">
                                                <span className="font-bold text-white">{o.companyName}</span>
                                                <span className="text-red-400 font-mono">${o.amount.toLocaleString()}</span>
                                            </div>
                                            <p className="text-sm text-textSecondary mt-1">Action "{o.nextAction}" is overdue.</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-textSecondary italic text-sm">No critical risks detected. Systems nominal.</p>
                            )}
                        </section>

                        <section>
                            <h3 className="flex items-center gap-2 text-accentGreen font-bold mb-3 uppercase text-sm tracking-wider">
                                <TrendingUp size={16} /> Intelligence & Recommendations
                            </h3>
                            <div className="p-4 bg-bgElevated rounded-lg border border-border">
                                <p className="text-sm leading-relaxed text-white">
                                    <span className="text-accentCyan font-bold">Acme Corp</span> is showing high engagement. 
                                    Pipeline automation suggests a 92% chance of closing if contracts are sent by Friday.
                                </p>
                            </div>
                        </section>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border">
                         <button onClick={onClose} className="w-full py-3 bg-white text-bgDark font-bold rounded-lg hover:bg-gray-200 transition-colors">
                             Acknowledge & Sync
                         </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ExecutiveBriefing;
