
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Video, Users, Mail, MessageSquare, Mic, FileText, Download, Upload, Clock, Search, Filter, PlayCircle, Image, DollarSign, Calendar } from 'lucide-react';
import { Opportunity, Interaction, ClientFile } from '../types';

interface ClientHubProps {
  opportunities: Opportunity[];
  onUpdateOpportunity: (updated: Opportunity) => void;
  themeMode: 'dark' | 'light';
}

const ClientHub: React.FC<ClientHubProps> = ({ opportunities, onUpdateOpportunity, themeMode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const opportunity = opportunities.find(o => o.id === id);
  const isLight = themeMode === 'light';
  
  const [activeTab, setActiveTab] = useState<'interactions' | 'documents' | 'brief'>('interactions');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!opportunity) {
    return <div className="p-8">Client not found.</div>;
  }

  const interactions = opportunity.interactions || [];
  const filteredInteractions = interactions.filter(i => {
      if (filterType !== 'all' && i.type !== filterType) return false;
      if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return i.ai_summary?.toLowerCase().includes(query) || 
                 i.type.includes(query) || 
                 i.date.includes(query);
      }
      return true;
  });

  const getInteractionIcon = (type: string) => {
      switch(type) {
          case 'phone_call': return <Phone size={16} />;
          case 'video_meeting': return <Video size={16} />;
          case 'in_person_meeting': return <Users size={16} />;
          case 'email': return <Mail size={16} />;
          case 'slack_message': return <MessageSquare size={16} />;
          case 'voice_note': return <Mic size={16} />;
          default: return <Clock size={16} />;
      }
  };

  const getInteractionColor = (type: string) => {
      if (isLight) {
          switch(type) {
            case 'phone_call': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'video_meeting': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'email': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
            case 'in_person_meeting': return 'bg-green-50 text-green-600 border-green-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
          }
      }
      switch(type) {
          case 'phone_call': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
          case 'video_meeting': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
          case 'email': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
          case 'in_person_meeting': return 'bg-green-500/10 text-green-400 border-green-500/20';
          default: return 'bg-gray-800 text-gray-400 border-gray-700';
      }
  };

  const cardBg = isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-[#1E293B] border-white/5';
  const textTitle = isLight ? 'text-slate-900' : 'text-white';
  const textSub = isLight ? 'text-slate-500' : 'text-gray-500';

  const renderProjectMetrics = () => (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-4 rounded-xl border ${cardBg}`}>
              <p className={`text-xs uppercase tracking-widest mb-1 ${textSub}`}>Total Budget</p>
              <p className={`text-2xl font-bold ${textTitle}`}>${opportunity.projectDetails?.budgetTotal.toLocaleString()}</p>
              <div className={`w-full h-1 mt-2 rounded-full overflow-hidden ${isLight ? 'bg-gray-200' : 'bg-gray-800'}`}>
                   <div className={`h-full ${isLight ? 'bg-slate-900' : 'bg-white'}`} style={{ width: `${(opportunity.projectDetails!.budgetSpent / opportunity.projectDetails!.budgetTotal) * 100}%`}}></div>
              </div>
              <p className={`text-[10px] mt-1 ${textSub}`}>${opportunity.projectDetails?.budgetSpent.toLocaleString()} spent</p>
          </div>
          <div className={`p-4 rounded-xl border ${cardBg}`}>
              <p className={`text-xs uppercase tracking-widest mb-1 ${textSub}`}>Timeline</p>
              <p className={`text-lg font-bold ${textTitle}`}>{opportunity.projectDetails?.statusDescription}</p>
              <p className={`text-xs mt-1 ${textSub}`}>{opportunity.projectDetails?.timelineEnd} Deadline</p>
          </div>
          <div className={`p-4 rounded-xl border ${cardBg}`}>
              <p className={`text-xs uppercase tracking-widest mb-1 ${textSub}`}>Next Action</p>
              <p className="text-lg font-bold text-blue-400">{opportunity.nextAction}</p>
              <p className="text-xs text-red-400 mt-1">Due: {opportunity.nextActionDate}</p>
          </div>
          <div className={`p-4 rounded-xl border ${cardBg}`}>
              <p className={`text-xs uppercase tracking-widest mb-1 ${textSub}`}>Key Contact</p>
              <p className={`text-lg font-bold truncate ${textTitle}`}>{opportunity.contacts[0].name}</p>
              <p className={`text-xs mt-1 ${textSub}`}>{opportunity.contacts[0].role}</p>
          </div>
      </div>
  );

  return (
    <div className="animate-fade-in pb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate('/')} className={`p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-900' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}>
                <ArrowLeft size={20} />
            </button>
            <h1 className={`text-xl font-bold ${textTitle}`}>{opportunity.companyName}</h1>
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wide border ${isLight ? 'bg-slate-100 text-slate-500 border-gray-200' : 'bg-white/10 text-gray-300 border-white/5'}`}>
                {opportunity.stage}
            </span>
        </div>

        {renderProjectMetrics()}

        {/* Tabs */}
        <div className={`flex border-b mb-6 ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
            {['interactions', 'documents', 'brief'].map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors capitalize ${activeTab === tab ? (isLight ? 'border-slate-900 text-slate-900' : 'border-white text-white') : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                    {tab}
                </button>
            ))}
        </div>

        {/* Interactions Feed */}
        {activeTab === 'interactions' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {/* Toolbar */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                        {['all', 'phone_call', 'video_meeting', 'email', 'in_person_meeting'].map(type => (
                            <button 
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors ${filterType === type ? (isLight ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-black border-white') : (isLight ? 'bg-transparent text-slate-500 border-gray-300' : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500')}`}
                            >
                                {type.replace(/_/g, ' ').replace('all', 'All Interactions')}
                            </button>
                        ))}
                    </div>

                    {filteredInteractions.length === 0 && (
                        <div className={`p-8 text-center border border-dashed rounded-xl ${isLight ? 'border-gray-300 text-slate-400' : 'border-gray-800 text-gray-500'}`}>
                            No interactions found matching filters.
                        </div>
                    )}

                    {filteredInteractions.map((interaction, idx) => (
                        <div key={idx} className={`p-5 rounded-xl border transition-colors group ${cardBg} ${isLight ? 'hover:border-slate-300' : 'hover:border-white/20'}`}>
                             <div className="flex justify-between items-start mb-3">
                                 <div className="flex items-center gap-3">
                                     <div className={`p-2 rounded-lg border ${getInteractionColor(interaction.type)}`}>
                                         {getInteractionIcon(interaction.type)}
                                     </div>
                                     <div>
                                         <h3 className={`text-sm font-bold capitalize ${textTitle}`}>{interaction.type.replace(/_/g, ' ')}</h3>
                                         <p className={`text-xs ${textSub}`}>{new Date(interaction.date).toLocaleString()} • {interaction.participants?.join(', ') || interaction.from}</p>
                                     </div>
                                 </div>
                                 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                     {interaction.audio_url && <button className={`p-2 rounded ${isLight ? 'bg-slate-200 text-slate-600 hover:text-slate-900' : 'bg-black/30 text-gray-300 hover:text-white'}`}><PlayCircle size={16}/></button>}
                                     {interaction.video_url && <button className={`p-2 rounded ${isLight ? 'bg-slate-200 text-slate-600 hover:text-slate-900' : 'bg-black/30 text-gray-300 hover:text-white'}`}><PlayCircle size={16}/></button>}
                                 </div>
                             </div>

                             <div className="pl-12">
                                 {interaction.ai_summary && (
                                     <div className={`mb-3 p-3 rounded-lg text-sm leading-relaxed ${isLight ? 'bg-slate-50 text-slate-700' : 'bg-black/20 text-gray-300'}`}>
                                         <span className="text-blue-400 font-bold text-xs uppercase mr-2">AI Summary</span>
                                         {interaction.ai_summary}
                                     </div>
                                 )}
                                 
                                 {interaction.action_items && interaction.action_items.length > 0 && (
                                     <div className="space-y-2">
                                         {interaction.action_items.map((item, i) => (
                                             <div key={i} className={`flex items-center gap-2 text-xs ${textSub}`}>
                                                 <input type="checkbox" className={`rounded ${isLight ? 'bg-white border-gray-300' : 'bg-black border-gray-700'}`} checked={item.status === 'completed'} readOnly />
                                                 <span className={item.status === 'completed' ? 'line-through' : ''}>{item.item}</span>
                                                 <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded text-[10px]">Due {item.due_date}</span>
                                             </div>
                                         ))}
                                     </div>
                                 )}

                                 {interaction.photos && (
                                     <div className="flex gap-2 mt-3">
                                         {interaction.photos.map((photo, i) => (
                                             <div key={i} className={`w-16 h-16 rounded-lg flex items-center justify-center cursor-pointer ${isLight ? 'bg-slate-100 text-slate-400 hover:bg-slate-200' : 'bg-gray-800 text-gray-500 hover:bg-gray-700'}`}>
                                                 <Image size={16} />
                                             </div>
                                         ))}
                                     </div>
                                 )}
                             </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className={`p-6 rounded-xl border ${cardBg}`}>
                        <h3 className={`font-bold mb-4 ${textTitle}`}>Client Intelligence</h3>
                        <div className="space-y-4">
                            <div>
                                <p className={`text-xs uppercase ${textSub}`}>Sentiment</p>
                                <p className={`text-sm font-bold ${opportunity.sentiment === 'Positive' ? 'text-green-400' : 'text-yellow-400'}`}>{opportunity.sentiment}</p>
                            </div>
                            <div>
                                <p className={`text-xs uppercase ${textSub}`}>Engagement Frequency</p>
                                <p className={`text-sm ${textTitle}`}>High (Every 2 days)</p>
                            </div>
                            <div>
                                <p className={`text-xs uppercase ${textSub}`}>Risk Level</p>
                                <p className={`text-sm ${textTitle}`}>Low</p>
                            </div>
                        </div>
                    </div>

                    <div className={`p-6 rounded-xl border ${cardBg}`}>
                        <h3 className={`font-bold mb-4 ${textTitle}`}>Contacts</h3>
                        <div className="space-y-3">
                            {opportunity.contacts.map((c, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isLight ? 'bg-slate-200 text-slate-700' : 'bg-gray-700 text-white'}`}>
                                        {c.name[0]}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-bold ${textTitle}`}>{c.name}</p>
                                        <p className={`text-xs ${textSub}`}>{c.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'documents' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {opportunity.files.map(file => (
                    <div key={file.id} className={`p-5 rounded-xl border transition-all cursor-pointer group hover:shadow-md ${cardBg} ${isLight ? 'hover:border-slate-300' : 'hover:border-white/30'}`}>
                         <div className="flex justify-between items-start mb-4">
                             <div className={`p-3 rounded-lg transition-colors ${isLight ? 'bg-slate-100 text-slate-700 group-hover:text-blue-600' : 'bg-black/30 text-white group-hover:text-blue-400'}`}>
                                 <FileText size={24} />
                             </div>
                             <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button className={`p-2 rounded-lg ${isLight ? 'hover:bg-slate-100 text-slate-400 hover:text-slate-900' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}>
                                     <Download size={18} />
                                 </button>
                             </div>
                         </div>
                         <h3 className={`font-bold mb-1 truncate ${textTitle}`}>{file.name}</h3>
                         <p className={`text-xs ${textSub}`}>{file.size} • {file.uploadDate}</p>
                         {file.aiSummary && (
                             <p className={`mt-4 text-xs line-clamp-2 p-2 rounded border ${isLight ? 'bg-slate-50 text-slate-500 border-gray-200' : 'bg-black/20 text-gray-400 border-white/5'}`}>
                                 {file.aiSummary}
                             </p>
                         )}
                    </div>
                ))}
                <div className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors cursor-pointer ${isLight ? 'border-gray-300 text-slate-400 hover:border-slate-500 hover:text-slate-600' : 'border-gray-800 text-gray-500 hover:border-gray-600 hover:text-white'}`}>
                    <Upload size={24} className="mb-2" />
                    <span className="text-sm font-bold">Upload Document</span>
                </div>
            </div>
        )}

        {activeTab === 'brief' && (
            <div className={`max-w-3xl mx-auto p-8 rounded-xl border ${cardBg}`}>
                <h2 className={`text-2xl font-bold mb-6 ${textTitle}`}>AI Executive Brief</h2>
                <div className="prose prose-invert max-w-none">
                    <h3 className="text-lg font-bold text-blue-400">Project Status</h3>
                    <p className={`${isLight ? 'text-slate-700' : 'text-gray-300'} mb-4`}>
                        The {opportunity.companyName} project "{opportunity.projectDetails?.name}" is currently 
                        <span className={`font-bold ${textTitle}`}> {opportunity.projectDetails?.statusDescription}</span>. 
                        Budget utilization is at {((opportunity.projectDetails!.budgetSpent / opportunity.projectDetails!.budgetTotal) * 100).toFixed(1)}%.
                    </p>

                    <h3 className="text-lg font-bold text-blue-400">Recent Developments</h3>
                    <ul className={`list-disc pl-5 space-y-2 mb-4 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                        {interactions.slice(0, 3).map((i, idx) => (
                            <li key={idx}>
                                <strong className={textTitle}>{new Date(i.date).toLocaleDateString()}:</strong> {i.ai_summary}
                            </li>
                        ))}
                    </ul>

                    <h3 className="text-lg font-bold text-blue-400">Action Plan</h3>
                    <div className="space-y-3 mt-2">
                        {opportunity.tasks.map((task, i) => (
                            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${isLight ? 'bg-slate-50 border-gray-200' : 'bg-black/20 border-white/5'}`}>
                                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">{i+1}</span>
                                <span className={`text-sm ${textTitle}`}>{task.text}</span>
                                <span className="ml-auto text-xs text-red-400">Due {task.due}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ClientHub;
