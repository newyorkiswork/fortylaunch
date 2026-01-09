
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import StatsCard from './components/StatsCard';
import DealCard from './components/DealCard';
import NeuralCore from './components/NeuralCore';
import BiometricAuth from './components/BiometricAuth';
import SignaturePad from './components/SignaturePad';
import LiveVoiceSession from './components/LiveVoiceSession';
import CaptureModal from './components/CaptureModal';
import ClientHub from './components/ClientHub';
import CommandBar from './components/CommandBar';
import ExecutiveBriefing from './components/ExecutiveBriefing';
import ClientOnboarding from './components/ClientOnboarding';
import { INITIAL_OPPORTUNITIES, MOCK_CONTRACTS, MOCK_CALENDAR, MOCK_AGENTS } from './constants';
import { Opportunity, Contract, UserState, AIAction, CalendarEvent, Agent, CommunicationSource } from './types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowRight, FileText, Download, Shield, BrainCircuit, Clock, MoreHorizontal, CheckCircle, Mail, Users, Calendar, Lightbulb, Activity, Globe, Zap, Plus, PenTool, X, Repeat, ChevronLeft, ChevronRight, CheckSquare, AlertCircle, RefreshCw } from 'lucide-react';

const ContractsList = ({ contracts, themeMode }: { contracts: Contract[], themeMode: 'light' | 'dark' }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center mb-6">
                 <h2 className={`text-2xl font-bold ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>Documents & Contracts</h2>
                 <button className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${themeMode === 'light' ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-white'}`}>
                     <Plus size={16}/> New Draft
                 </button>
            </header>
            
            <div className="grid gap-4">
                {contracts.map(c => (
                    <div key={c.id} className={`p-6 rounded-xl border flex flex-col md:flex-row justify-between items-center gap-4 transition-all hover:shadow-lg ${themeMode === 'light' ? 'bg-white border-gray-200 hover:border-accentCyan/50' : 'bg-bgCard border-white/10 hover:border-accentCyan/50'}`}>
                        <div className="flex gap-4 items-center w-full md:w-auto">
                            <div className={`p-4 rounded-xl ${c.status === 'Signed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className={`font-bold text-lg ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>{c.title}</h3>
                                <p className={`text-sm ${themeMode === 'light' ? 'text-slate-500' : 'text-textSecondary'}`}>Value: ${c.value.toLocaleString()} • Created {c.dateCreated}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                             {c.signatures.length > 0 && (
                                 <div className="flex -space-x-2">
                                     {c.signatures.map((s, i) => (
                                         <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${themeMode === 'light' ? 'bg-slate-200 border-white text-slate-700' : 'bg-gray-700 border-bgCard text-white'}`} title={s.signerName}>
                                             {s.signerName[0]}
                                         </div>
                                     ))}
                                 </div>
                             )}
                             <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 ${
                                    c.status === 'Signed' 
                                    ? 'bg-green-500/10 text-green-500' 
                                    : 'bg-yellow-500/10 text-yellow-500'
                                }`}>
                                    {c.status === 'Signed' && <CheckCircle size={12} />}
                                    {c.status}
                                </span>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const CalendarView = ({ events, onAddEvent, onEventAction, themeMode }: { events: CalendarEvent[], onAddEvent: (e: any) => void, onEventAction: (id: string, action: string) => void, themeMode: 'light' | 'dark' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); 
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        attendees: '',
        type: 'Meeting',
        recurrence: 'None'
    });

    const isLight = themeMode === 'light';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[month];
    const firstDayIndex = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const sentinelToday = new Date(2026, 0, 14);
    const isCurrentMonth = sentinelToday.getMonth() === month && sentinelToday.getFullYear() === year;
    const currentDay = isCurrentMonth ? sentinelToday.getDate() : -1;

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(year, month + offset, 1));
    };

    const jumpToToday = () => {
        setCurrentDate(new Date(2026, 0, 14));
    };

    const handleDayClick = (day: number) => {
        setFormData(prev => ({ 
            ...prev, 
            date: `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
            time: '09:00'
        }));
        setIsOpen(true);
    };

    const handleEventClick = (e: React.MouseEvent, evt: CalendarEvent) => {
        e.stopPropagation();
        setSelectedEvent(evt);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddEvent({
            ...formData,
            attendees: formData.attendees.split(',').map(e => e.trim()).filter(Boolean),
            status: 'Pending'
        });
        setIsOpen(false);
        setFormData({ title: '', date: '', time: '', attendees: '', type: 'Meeting', recurrence: 'None' });
    };

    const renderCalendarGrid = () => {
        const slots = [];
        for (let i = 0; i < firstDayIndex; i++) {
            slots.push(<div key={`empty-${i}`} className={`min-h-[120px] p-2 border-b border-r ${isLight ? 'border-gray-100 bg-gray-50/50' : 'border-white/5 bg-black/20'}`}></div>);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.date === dateStr);
            const isToday = d === currentDay;
            if (isToday) {
                const todayEvents = events.filter(e => e.date === 'Today');
                dayEvents.push(...todayEvents);
            }

            slots.push(
                <div 
                    key={d} 
                    onClick={() => handleDayClick(d)}
                    className={`min-h-[120px] p-2 border-b border-r relative group cursor-pointer transition-colors ${
                        isLight 
                        ? 'border-gray-100 hover:bg-slate-50' 
                        : 'border-white/5 hover:bg-white/5'
                    } ${isToday ? (isLight ? 'bg-blue-50/50' : 'bg-accentCyan/5') : ''}`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                            isToday 
                            ? (isLight ? 'bg-slate-900 text-white' : 'bg-accentCyan text-bgDark') 
                            : (isLight ? 'text-slate-500' : 'text-textSecondary')
                        }`}>
                            {d}
                        </span>
                        {dayEvents.length > 0 && (
                            <span className="text-[10px] font-bold text-accentPurple">{dayEvents.length} Events</span>
                        )}
                        <button className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/20 transition-opacity ${isLight ? 'text-slate-400' : 'text-textSecondary'}`}>
                            <Plus size={14} />
                        </button>
                    </div>

                    <div className="space-y-1">
                        {dayEvents.map((evt, i) => (
                            <div 
                                key={i} 
                                onClick={(e) => handleEventClick(e, evt)}
                                className={`text-[10px] p-1.5 rounded border truncate cursor-pointer hover:scale-105 transition-transform ${
                                    evt.status === 'Completed' 
                                    ? (isLight ? 'bg-green-100 text-green-700 border-green-200 line-through opacity-70' : 'bg-green-500/10 text-green-500 border-green-500/30 line-through opacity-70')
                                    : evt.status === 'Revise'
                                    ? (isLight ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30')
                                    : evt.status === 'Incomplete'
                                    ? (isLight ? 'bg-red-100 text-red-700 border-red-200' : 'bg-red-500/20 text-red-500 border-red-500/30')
                                    : (isLight ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-blue-500/20 text-blue-300 border-blue-500/30')
                                }`}
                            >
                                {evt.time} {evt.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        
        const totalSlots = slots.length;
        const remaining = 7 - (totalSlots % 7);
        if (remaining < 7) {
             for (let i = 0; i < remaining; i++) {
                slots.push(<div key={`end-empty-${i}`} className={`min-h-[120px] p-2 border-b border-r ${isLight ? 'border-gray-100 bg-gray-50/50' : 'border-white/5 bg-black/20'}`}></div>);
             }
        }

        return slots;
    };

    return (
        <div className="space-y-6 animate-fade-in h-full flex flex-col">
             {/* Header */}
             <div className="flex justify-between items-center bg-transparent">
                 <div className="flex items-center gap-4">
                     <h2 className={`text-3xl font-bold font-sans ${isLight ? 'text-slate-900' : 'text-white'}`}>{monthName} {year}</h2>
                     <div className="flex gap-1">
                         <button onClick={() => changeMonth(-1)} className={`p-2 rounded-lg border ${isLight ? 'border-gray-200 text-slate-400 hover:text-slate-900' : 'border-white/10 text-gray-500 hover:text-white hover:bg-white/5'}`}><ChevronLeft size={18} /></button>
                         <button onClick={() => changeMonth(1)} className={`p-2 rounded-lg border ${isLight ? 'border-gray-200 text-slate-400 hover:text-slate-900' : 'border-white/10 text-gray-500 hover:text-white hover:bg-white/5'}`}><ChevronRight size={18} /></button>
                     </div>
                 </div>
                 <div className="flex gap-3">
                    <button onClick={jumpToToday} className={`px-4 py-2 rounded-lg border font-bold text-sm ${isLight ? 'border-gray-200 text-slate-600 bg-white' : 'border-white/10 text-textSecondary bg-white/5'}`}>Today</button>
                    <button onClick={() => { setFormData({...formData, date: '2026-01-14', time: '09:00'}); setIsOpen(true); }} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${isLight ? 'bg-slate-900 text-white' : 'bg-white text-black'}`}><Plus size={16} /> Add Event</button>
                 </div>
             </div>

             <div className={`flex-1 border rounded-2xl overflow-hidden shadow-sm flex flex-col ${isLight ? 'bg-white border-gray-200' : 'bg-bgCard border-white/10'}`}>
                 <div className={`grid grid-cols-7 border-b ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'}`}>
                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                         <div key={day} className={`p-3 text-center text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-textSecondary'}`}>{day}</div>
                     ))}
                 </div>
                 <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                     {renderCalendarGrid()}
                 </div>
             </div>

             {/* Event Action Modal */}
             {selectedEvent && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                     <div className={`w-full max-w-sm p-6 rounded-2xl border shadow-2xl relative ${isLight ? 'bg-white border-gray-200' : 'bg-bgCard border-white/10'}`}>
                         <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-textSecondary hover:text-white"><X size={20}/></button>
                         
                         <h3 className={`text-lg font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{selectedEvent.title}</h3>
                         <p className="text-sm text-textSecondary mb-6">{selectedEvent.date} at {selectedEvent.time}</p>

                         <div className="space-y-3">
                             <button onClick={() => { onEventAction(selectedEvent.id, 'Completed'); setSelectedEvent(null); }} className="w-full p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500/20 flex items-center gap-3 font-bold transition-colors">
                                 <CheckSquare size={20} /> Mark Completed
                             </button>
                             <button onClick={() => { onEventAction(selectedEvent.id, 'Revise'); setSelectedEvent(null); }} className="w-full p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20 flex items-center gap-3 font-bold transition-colors">
                                 <RefreshCw size={20} /> Needs Revision
                             </button>
                             <button onClick={() => { onEventAction(selectedEvent.id, 'Incomplete'); setSelectedEvent(null); }} className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 flex items-center gap-3 font-bold transition-colors">
                                 <AlertCircle size={20} /> Mark Incomplete
                             </button>
                         </div>
                     </div>
                 </div>
             )}

             {/* Add Event Modal */}
             {isOpen && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                     <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${isLight ? 'bg-white border-gray-200' : 'bg-bgCard border-white/10'}`}>
                         <div className="flex justify-between items-center mb-6">
                             <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>New Event</h3>
                             <button onClick={() => setIsOpen(false)} className="text-textSecondary hover:text-white"><X size={20}/></button>
                         </div>
                         <form onSubmit={handleSubmit} className="space-y-4">
                             <div>
                                 <label className="block text-xs font-bold uppercase text-textSecondary mb-1">Event Title</label>
                                 <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={`w-full p-3 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-gray-200 text-slate-900 focus:border-slate-900' : 'bg-black/20 border-white/10 text-white focus:border-accentCyan'}`} placeholder="e.g. Q4 Strategy Review" autoFocus />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                 <div>
                                     <label className="block text-xs font-bold uppercase text-textSecondary mb-1">Date</label>
                                     <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={`w-full p-3 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-gray-200 text-slate-900' : 'bg-black/20 border-white/10 text-white'}`} />
                                 </div>
                                 <div>
                                     <label className="block text-xs font-bold uppercase text-textSecondary mb-1">Time</label>
                                     <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className={`w-full p-3 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-gray-200 text-slate-900' : 'bg-black/20 border-white/10 text-white'}`} />
                                 </div>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold uppercase text-textSecondary mb-1">Attendees</label>
                                 <input value={formData.attendees} onChange={e => setFormData({...formData, attendees: e.target.value})} className={`w-full p-3 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-gray-200 text-slate-900' : 'bg-black/20 border-white/10 text-white'}`} placeholder="alice@corp.com" />
                             </div>
                             <button type="submit" className={`w-full py-3 rounded-xl font-bold mt-4 ${isLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-accentCyan text-bgDark hover:bg-cyan-400'}`}>Schedule Event</button>
                         </form>
                     </div>
                 </div>
             )}
        </div>
    )
}

const AppContent = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
      const cached = localStorage.getItem('fortylaunch_opps_v2');
      return cached ? JSON.parse(cached) : INITIAL_OPPORTUNITIES;
  });
  
  const [contracts, setContracts] = useState<Contract[]>(() => {
      const cached = localStorage.getItem('fortylaunch_contracts');
      return cached ? JSON.parse(cached) : MOCK_CONTRACTS;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(MOCK_CALENDAR);
  
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [isClientOnboardingOpen, setIsClientOnboardingOpen] = useState(false);
  const [showBriefing, setShowBriefing] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  const [userState, setUserState] = useState<UserState>(() => {
      const savedSig = localStorage.getItem('fortylaunch_signature');
      return { 
        credits: 4250, 
        role: 'Admin', 
        name: 'Alex',
        isOnline: navigator.onLine,
        language: 'en',
        themeColor: 'standard',
        savedSignature: savedSig ? JSON.parse(savedSig) : undefined
      };
  });
  
  const [showBiometrics, setShowBiometrics] = useState(false);
  const [pendingAuthAction, setPendingAuthAction] = useState<{ type: string, payload: any } | null>(null);
  const [signingContractId, setSigningContractId] = useState<string | null>(null);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'info' | 'agent'} | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
    const handleOnline = () => setUserState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setUserState(prev => ({ ...prev, isOnline: false }));
    
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsCommandBarOpen(prev => !prev);
        }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
     localStorage.setItem('fortylaunch_opps_v2', JSON.stringify(opportunities));
     localStorage.setItem('fortylaunch_contracts', JSON.stringify(contracts));
  }, [opportunities, contracts]);

  useEffect(() => {
      if (toast) {
          const timer = setTimeout(() => setToast(null), 3500);
          return () => clearTimeout(timer);
      }
  }, [toast]);

  const toggleTheme = () => {
      setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const getAuthActionLabel = () => {
      if (pendingAuthAction?.type === 'SIGN_CONTRACT') {
          const contract = contracts.find(c => c.id === pendingAuthAction.payload);
          return contract ? `Sign ${contract.title}` : 'Execute Signature';
      }
      return 'Authenticate Access';
  };

  const handleAddClient = (newClient: Opportunity) => {
      setOpportunities(prev => [newClient, ...prev]);
      setIsClientOnboardingOpen(false);
      setToast({ msg: `Client ${newClient.companyName} Onboarded`, type: 'success' });
      navigate(`/client/${newClient.id}`);
  };

  const handleEventAction = (id: string, action: string) => {
      // 1. Update Calendar Status
      setCalendarEvents(prev => prev.map(e => e.id === id ? { ...e, status: action as any } : e));
      
      const event = calendarEvents.find(e => e.id === id);
      if (!event) return;

      // 2. Trigger Agents if Completed
      if (action === 'Completed') {
          const relatedOpp = opportunities.find(o => event.title.includes(o.companyName));
          
          if (relatedOpp) {
              setOpportunities(prev => prev.map(o => {
                  if (o.id === relatedOpp.id) {
                      let newProb = o.probability + 10;
                      if (newProb > 100) newProb = 100;
                      
                      return {
                          ...o,
                          probability: newProb,
                          lastUpdated: 'Just now',
                          nextAction: 'Pending Review',
                          interactions: [
                              {
                                  interaction_id: `sys-${Date.now()}`,
                                  type: 'email',
                                  client: o.companyName,
                                  date: new Date().toISOString(),
                                  ai_summary: `Task "${event.title}" marked completed via Calendar. Pipeline probability updated.`,
                                  sentiment: 'Positive'
                              },
                              ...o.interactions
                          ]
                      };
                  }
                  return o;
              }));
              setToast({ msg: `Pipeline Updated: ${relatedOpp.companyName}`, type: 'agent' });
          } else {
              setToast({ msg: 'Task Completed. No linked deal found.', type: 'success' });
          }
      } else if (action === 'Revise' || action === 'Incomplete') {
          const relatedOpp = opportunities.find(o => event.title.includes(o.companyName));
          if (relatedOpp) {
             setOpportunities(prev => prev.map(o => {
                 if (o.id === relatedOpp.id) {
                     return {
                         ...o,
                         sentiment: 'Neutral', // Downgrade sentiment
                         interactions: [
                             {
                                 interaction_id: `sys-${Date.now()}`,
                                 type: 'email',
                                 client: o.companyName,
                                 date: new Date().toISOString(),
                                 ai_summary: `Task "${event.title}" marked ${action}. Attention required.`,
                                 sentiment: 'Negative'
                             },
                             ...o.interactions
                         ]
                     };
                 }
                 return o;
             }));
          }
          setToast({ msg: `Flagged: ${action}`, type: 'info' });
      }
  };

  const handleCaptureSave = (data: { opportunityId: string, source: CommunicationSource, content: string, language: string, isTranslated: boolean }) => {
      setOpportunities(prev => prev.map(opp => {
          if (opp.id === data.opportunityId) {
              return {
                  ...opp,
                  lastUpdated: 'Just now',
                  interactions: [
                      {
                          interaction_id: `int-${Date.now()}`,
                          type: data.source.toLowerCase().includes('mail') ? 'email' : 'voice_note',
                          client: opp.companyName,
                          date: new Date().toISOString(),
                          ai_summary: data.content,
                          transcript: data.content,
                          sentiment: 'Neutral'
                      },
                      ...opp.interactions
                  ]
              }
          }
          return opp;
      }));
      setToast({ msg: `Captured ${data.source} Log for Client`, type: 'success' });
      navigate(`/client/${data.opportunityId}`);
  };

  const handleUpdateOpportunity = (updated: Opportunity) => {
      setOpportunities(prev => prev.map(o => o.id === updated.id ? updated : o));
      setToast({ msg: `Updated ${updated.companyName} settings`, type: 'success' });
  };

  const handleAIAction = (action: AIAction) => {
    if (action.type === 'NAVIGATE_MESSAGE') navigate('/messages');
    else if (action.type === 'NAVIGATE_CONTRACT') navigate('/contracts');
    else if (action.type === 'SIGN_CONTRACT') {
        const targetId = action.payload?.id || contracts[0].id; // Fallback to first if not specified
        initiateSigning(targetId);
        navigate('/contracts');
    }
  };

  const initiateSigning = (contractId: string) => {
      setPendingAuthAction({ type: 'SIGN_CONTRACT', payload: contractId });
      setShowBiometrics(true);
  };

  const handleAuthSuccess = () => {
      setShowBiometrics(false);
      if (pendingAuthAction?.type === 'SIGN_CONTRACT') {
          setSigningContractId(pendingAuthAction.payload);
      }
      setPendingAuthAction(null);
  };

  const handleSignatureComplete = (dataUrl: string, saveToProfile: boolean) => {
      if (!signingContractId) return;

      setContracts(prev => prev.map(c => {
          if (c.id === signingContractId) {
              return {
                  ...c,
                  status: 'Signed',
                  signatures: [
                      ...c.signatures,
                      {
                          signerName: userState.name,
                          date: new Date().toISOString().split('T')[0],
                          signatureImage: dataUrl
                      }
                  ]
              };
          }
          return c;
      }));

      if (saveToProfile) {
          const sigData = { dataUrl, dateStored: new Date().toISOString() };
          localStorage.setItem('fortylaunch_signature', JSON.stringify(sigData));
          setUserState(prev => ({ ...prev, savedSignature: sigData }));
      }

      setSigningContractId(null);
      setToast({ msg: 'Contract Successfully Signed', type: 'success' });
  };

  const handleAddEvent = (eventData: any) => {
      const newEvent: CalendarEvent = {
          id: `evt-${Date.now()}`,
          ...eventData
      };
      setCalendarEvents(prev => [...prev, newEvent]);
      setToast({ msg: 'Event Scheduled', type: 'success' });
  };

  const Dashboard = () => {
    const totalPipeline = opportunities.reduce((acc, curr) => acc + curr.amount, 0);
    const chartData = opportunities.map(o => ({
        name: o.logoShort,
        value: o.amount
    }));

    return (
        <div className="animate-fade-in space-y-8">
        <header className="mb-8 flex justify-between items-end">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="text-accentCyan" size={24} />
                    <h2 className={`font-sans text-3xl font-bold ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    Sentinel Core: Online
                    </h2>
                </div>
                <div className="flex items-center gap-4 text-textSecondary text-sm">
                    <button onClick={() => setShowBriefing(true)} className={`flex items-center gap-2 transition-colors ${themeMode === 'light' ? 'hover:text-slate-900' : 'hover:text-white'}`}>
                        <Zap size={14} className={themeMode === 'light' ? 'text-slate-900' : 'text-white'} /> Daily Briefing
                    </button>
                    <span className="text-gray-500">|</span>
                    <span className="hidden md:inline font-mono">ALL SYSTEMS NOMINAL</span>
                </div>
            </div>
            <div className="hidden md:block text-right">
                <button 
                    onClick={() => setIsClientOnboardingOpen(true)} 
                    className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${themeMode === 'light' ? 'bg-slate-900 text-white hover:bg-slate-700' : 'bg-white text-black hover:bg-gray-200'}`}
                >
                    <Plus size={16} /> Add Client
                </button>
            </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard label="Total Pipeline" value={`$${(totalPipeline / 1000).toFixed(0)}K`} themeMode={themeMode} />
            <StatsCard label="Active Projects" value={opportunities.length} themeMode={themeMode} />
            <StatsCard label="Interactions (24h)" value={12} themeMode={themeMode} />
            <StatsCard label="Pending Actions" value={7} trend="Action Required" themeMode={themeMode} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className={`font-sans text-xl font-bold ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>Active Projects</h3>
            </div>
            
            {opportunities.map(opp => (
                <DealCard key={opp.id} opportunity={opp} isAttention={opp.nextActionDate === 'Today'} themeMode={themeMode} />
            ))}
            </div>

            <div className="lg:col-span-1">
            <div className={`border rounded-2xl p-6 h-full min-h-[400px] ${themeMode === 'light' ? 'bg-white border-gray-200' : 'bg-[#1E293B] border-white/5'}`}>
                <h3 className={`font-sans text-lg font-bold mb-6 ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>Pipeline Distribution</h3>
                <div className="h-64 w-full min-w-0">
                    {isMounted && (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#64748B" tick={{fontSize: 12, fontFamily: 'Space Mono'}} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: themeMode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: themeMode === 'light' ? '#fff' : '#111827', borderColor: themeMode === 'light' ? '#e2e8f0' : '#374151', color: themeMode === 'light' ? '#0f172a' : '#fff' }} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={themeMode === 'light' ? '#38BDF8' : '#FFFFFF'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    )}
                </div>
                <div className={`mt-6 p-4 rounded-xl border ${themeMode === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-black/20 border-white/5'}`}>
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Shield size={12}/> Security Insight</p>
                    <p className={`text-sm ${themeMode === 'light' ? 'text-slate-600' : 'text-gray-300'}`}>
                        <span className={`font-bold ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>MITRE</span> security clearance process flagged for delay. 
                        Recommend manual follow-up via secure channel.
                    </p>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
  };

  return (
      <Layout 
        onOpenAI={() => setIsAIOpen(true)}
        onOpenLive={() => setIsLiveOpen(true)}
        onOpenCapture={() => setIsCaptureOpen(true)}
        onAddClient={() => setIsClientOnboardingOpen(true)}
        themeMode={themeMode}
        toggleTheme={toggleTheme}
        userState={userState}
      >
        {toast && (
            <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-xl font-bold shadow-2xl animate-in slide-in-from-top-4 flex items-center gap-3 border ${themeMode === 'light' ? 'bg-slate-900 text-white' : 'bg-white text-black'}`}>
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-sm">{toast.msg}</span>
            </div>
        )}

        <CommandBar 
            isOpen={isCommandBarOpen} 
            onClose={() => setIsCommandBarOpen(false)}
            opportunities={opportunities}
            contracts={contracts}
            toggleTheme={toggleTheme}
            onOpenAI={() => setIsAIOpen(true)}
            onOpenCapture={() => setIsCaptureOpen(true)}
        />

        {showBriefing && <ExecutiveBriefing opportunities={opportunities} events={calendarEvents} onClose={() => setShowBriefing(false)} />}
        
        {isClientOnboardingOpen && <ClientOnboarding onClose={() => setIsClientOnboardingOpen(false)} onComplete={handleAddClient} />}

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pipeline" element={<Dashboard />} /> 
          <Route path="/contracts" element={<ContractsList contracts={contracts} themeMode={themeMode} />} />
          <Route path="/messages" element={<div className={themeMode === 'light' ? 'text-slate-900' : 'text-white'}>Interactions Module</div>} />
          <Route path="/calendar" element={<CalendarView events={calendarEvents} onAddEvent={handleAddEvent} onEventAction={handleEventAction} themeMode={themeMode} />} />
          <Route path="/client/:id" element={<ClientHub opportunities={opportunities} onUpdateOpportunity={handleUpdateOpportunity} themeMode={themeMode} />} />
          <Route path="/settings" element={<div className="text-center mt-20 text-gray-500">System Configuration Locked</div>} />
        </Routes>
        
        <NeuralCore 
          isOpen={isAIOpen} 
          onClose={() => setIsAIOpen(false)}
          dataContext={{ opportunities, contracts }}
          onAction={handleAIAction}
        />

        <LiveVoiceSession
            isOpen={isLiveOpen}
            onClose={() => setIsLiveOpen(false)}
            userName={userState.name}
            onAction={handleAIAction}
        />

        <CaptureModal 
            isOpen={isCaptureOpen}
            onClose={() => setIsCaptureOpen(false)}
            opportunities={opportunities}
            onSave={handleCaptureSave}
        />

        <BiometricAuth 
            isOpen={showBiometrics}
            actionName={getAuthActionLabel()}
            onSuccess={handleAuthSuccess}
            onCancel={() => { setShowBiometrics(false); setPendingAuthAction(null); }}
        />

        {/* Signature Pad Modal */}
        {signingContractId && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                <div className="w-full max-w-lg relative">
                     <button 
                        onClick={() => setSigningContractId(null)}
                        className="absolute -top-10 right-0 text-white/70 hover:text-white flex items-center gap-2"
                     >
                        Close <X size={18} />
                     </button>
                     <SignaturePad 
                        userName={userState.name}
                        savedSignature={userState.savedSignature}
                        onSign={handleSignatureComplete}
                        onCancel={() => setSigningContractId(null)}
                     />
                </div>
            </div>
        )}
      </Layout>
  );
}

function App() {
  return (
    <Router>
        <AppContent />
    </Router>
  );
}

export default App;
