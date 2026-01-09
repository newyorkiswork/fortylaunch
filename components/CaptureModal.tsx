import React, { useState, useEffect } from 'react';
import { X, Mic, CheckCircle, Loader2, Globe, Radio, Monitor, Phone, Mail, Users, MessageSquare } from 'lucide-react';
import { CommunicationSource, Opportunity } from '../types';

interface CaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunities: Opportunity[];
  onSave: (data: {
      opportunityId: string;
      source: CommunicationSource;
      content: string;
      language: string;
      isTranslated: boolean;
  }) => void;
}

const CaptureModal: React.FC<CaptureModalProps> = ({ isOpen, onClose, opportunities, onSave }) => {
  const [step, setStep] = useState<'config' | 'recording' | 'processing' | 'review'>('config');
  const [selectedOpp, setSelectedOpp] = useState<string>(opportunities[0]?.id || '');
  const [source, setSource] = useState<CommunicationSource>('Zoom');
  const [language, setLanguage] = useState<string>('English');
  const [transcript, setTranscript] = useState('');
  
  // Mock Translation state
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('config');
      setTranscript('');
      setIsTranslating(false);
    }
  }, [isOpen]);

  const startRecording = () => {
    setStep('recording');
    // Simulate recording duration
    setTimeout(() => {
      setStep('processing');
      // Simulate AI Processing & Translation
      setTimeout(() => {
        let text = "The client is concerned about the implementation timeline for Q3. They want to move the deadline up by two weeks.";
        if (language === 'Spanish') text = "El cliente está preocupado por el cronograma de implementación para el Q3. Quieren adelantar la fecha límite dos semanas.";
        if (language === 'French') text = "Le client s'inquiète du calendrier de mise en œuvre pour le troisième trimestre. Ils veulent avancer la date limite de deux semaines.";
        if (language === 'Mandarin') text = "客户担心第三季度的实施时间表。他们希望将截止日期提前两周。";
        
        setTranscript(text);
        setStep('review');
      }, 2000);
    }, 3000);
  };

  const handleSave = () => {
    onSave({
        opportunityId: selectedOpp,
        source,
        content: transcript,
        language,
        isTranslated: language !== 'English'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-lg bg-bgCard border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
        
        {/* Header */}
        <div className="p-6 border-b border-border bg-bgElevated flex justify-between items-center">
            <div>
                <h2 className="font-sans text-xl font-bold text-white tracking-wide flex items-center gap-2">
                    <Radio className="text-accentCyan animate-pulse" size={20} />
                    UNIVERSAL CAPTURE
                </h2>
                <p className="text-xs text-textSecondary uppercase tracking-widest">Ingest • Translate • Track</p>
            </div>
            <button onClick={onClose} className="text-textSecondary hover:text-white">
                <X size={24} />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
            
            {step === 'config' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    {/* Source Selector */}
                    <div className="space-y-3">
                        <label className="text-xs text-textSecondary uppercase font-bold">Communication Source</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Zoom', 'GoogleMeet', 'Phone', 'Email', 'InPerson', 'NetworkEvent'].map((src) => (
                                <button
                                    key={src}
                                    onClick={() => setSource(src as CommunicationSource)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${source === src ? 'bg-accentCyan/20 border-accentCyan text-white' : 'bg-bgElevated border-border text-textSecondary hover:border-white/20'}`}
                                >
                                    {src === 'Zoom' && <Monitor size={20} />}
                                    {src === 'GoogleMeet' && <Monitor size={20} />}
                                    {src === 'Phone' && <Phone size={20} />}
                                    {src === 'Email' && <Mail size={20} />}
                                    {src === 'InPerson' && <Users size={20} />}
                                    {src === 'NetworkEvent' && <MessageSquare size={20} />}
                                    <span className="text-[10px] mt-2 font-bold">{src}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Client Selector */}
                    <div className="space-y-3">
                        <label className="text-xs text-textSecondary uppercase font-bold">Link to Project / Client</label>
                        <select 
                            value={selectedOpp}
                            onChange={(e) => setSelectedOpp(e.target.value)}
                            className="w-full bg-bgDark border border-border rounded-xl p-3 text-white focus:border-accentCyan outline-none"
                        >
                            {opportunities.map(opp => (
                                <option key={opp.id} value={opp.id}>{opp.companyName} ({opp.contacts[0].name})</option>
                            ))}
                        </select>
                    </div>

                    {/* Language Selector */}
                    <div className="space-y-3">
                         <label className="text-xs text-textSecondary uppercase font-bold flex justify-between">
                            <span>Input Language</span>
                            <span className="text-accentPurple flex items-center gap-1"><Globe size={12}/> AI Translation Active</span>
                         </label>
                         <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                             {['English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese'].map(lang => (
                                 <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-colors ${language === lang ? 'bg-accentPurple/20 border-accentPurple text-white' : 'bg-bgDark border-border text-textSecondary hover:border-white/20'}`}
                                 >
                                     {lang}
                                 </button>
                             ))}
                         </div>
                    </div>
                </div>
            )}

            {step === 'recording' && (
                <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in zoom-in-50">
                    <div className="relative">
                        <div className="absolute inset-0 bg-accentCyan/20 rounded-full animate-ping"></div>
                        <div className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-br from-bgElevated to-bgDark border-2 border-accentCyan flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.3)]">
                             <div className="flex gap-1 items-end h-10">
                                <div className="w-1.5 bg-accentCyan animate-[wave_1s_ease-in-out_infinite]" style={{ animationDelay: '0s' }}></div>
                                <div className="w-1.5 bg-accentCyan animate-[wave_1s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-1.5 bg-accentCyan animate-[wave_1s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-1.5 bg-accentCyan animate-[wave_1s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }}></div>
                                <div className="w-1.5 bg-accentCyan animate-[wave_1s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }}></div>
                             </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white mb-2">Listening to {source}...</h3>
                        <p className="text-accentCyan font-mono text-sm">Detecting Language: {language}</p>
                    </div>
                </div>
            )}

            {step === 'processing' && (
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                    <Loader2 size={48} className="text-accentPurple animate-spin" />
                    <p className="text-textSecondary animate-pulse">Transcribing & Translating...</p>
                </div>
            )}

            {step === 'review' && (
                <div className="h-full flex flex-col animate-in slide-in-from-bottom-4">
                    <div className="flex-1 bg-bgDark rounded-xl p-4 border border-border mb-4 overflow-y-auto">
                        <p className="text-sm text-textSecondary mb-2 font-mono">TRANSCRIPT_PREVIEW_V1.0</p>
                        <p className="text-white text-lg leading-relaxed">{transcript}</p>
                    </div>
                    <div className="p-4 bg-accentGreen/10 rounded-xl border border-accentGreen/30 mb-4 flex items-start gap-3">
                        <CheckCircle size={20} className="text-accentGreen mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-white">Capture Successful</p>
                            <p className="text-xs text-textSecondary">Ready to merge into {opportunities.find(o => o.id === selectedOpp)?.companyName} timeline.</p>
                        </div>
                    </div>
                </div>
            )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-bgElevated">
            {step === 'config' && (
                <button 
                    onClick={startRecording}
                    className="w-full py-4 rounded-xl bg-accentCyan text-bgDark font-bold flex items-center justify-center gap-2 hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                >
                    <Mic size={20} />
                    Start Capture
                </button>
            )}
            {step === 'review' && (
                <button 
                    onClick={handleSave}
                    className="w-full py-4 rounded-xl bg-accentGreen text-bgDark font-bold flex items-center justify-center gap-2 hover:bg-green-400 transition-colors"
                >
                    <CheckCircle size={20} />
                    Confirm & Save to Project
                </button>
            )}
        </div>

      </div>
    </div>
  );
};

export default CaptureModal;