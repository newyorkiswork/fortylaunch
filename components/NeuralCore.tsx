
import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, Send, BrainCircuit, ArrowRight, Activity, FileText, Lightbulb, Shield } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Opportunity, Contract, AIAction } from '../types';

interface NeuralCoreProps {
  isOpen: boolean;
  onClose: () => void;
  dataContext: { opportunities: Opportunity[], contracts: Contract[] };
  onAction: (action: AIAction) => void;
}

const NeuralCore: React.FC<NeuralCoreProps> = ({ isOpen, onClose, dataContext, onAction }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string, action?: AIAction, agent?: string}[]>([
    { role: 'ai', content: 'Sentinel Core online. Systems synchronized.', agent: 'Sentinel' }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleExecuteAction = (action: AIAction) => {
      onAction(action);
  };

  const processQuery = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsProcessing(true);

    try {
      // Safe access for process.env to prevent ReferenceError in browser-only environments
      const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;
      
      let aiResponseText = '';
      let actionToTake: AIAction = { type: 'NONE' };
      let assignedAgent = 'Sentinel Core';

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        
        const contextString = JSON.stringify({
            opportunities: dataContext.opportunities.map(o => ({
                id: o.id,
                company: o.companyName,
                stage: o.stage,
                nextAction: o.nextAction
            })),
            contracts: dataContext.contracts.map(c => ({ id: c.id, title: c.title }))
        });

        const systemPrompt = `
            ROLE DEFINITION:
            You are "Sentinel", the proprietary Voice-First Intelligent CRM System for "Fortylaunch". 
            Your goal is complete automation: capture data, generate documents, file them, and update pipeline/calendar.

            IDENTITY PROTOCOL (STRICT):
            - No Name Rule: NEVER address the user by name unless they explicitly introduce themselves first.
            - Greeting: Use neutral, professional greetings only (e.g., "System ready," "Processing update," "Calendar synced").
            - Tone: Efficient, robotic but helpful, concise.

            CORE ENGINE WORKFLOWS:
            Every interaction (Email, Phone, Web, Person, Network) triggers: File Generation -> Pipeline Update -> Calendar Sync.

            SPECIALIZED AGENTS:
            1. EMAIL AGENT (Transaction & File Monitor)
               - Triggers: Financial Receipts, Approvals.
               - Actions: Save Receipt.pdf/Approval.msg. Move to Active/Paid or Closing. Update Calendar.
            2. PHONE AGENT (Appointment Setter)
               - Triggers: VoIP Call/Logs.
               - Actions: Transcribe to Call_Log.txt. Move to Negotiation. Schedule Follow-up.
            3. WEB MEETING AGENT (The Generator)
               - Triggers: Zoom/Teams.
               - Actions: Save Transcript.txt. Generate Summary.docx. IF Split Payment: Generate Invoice_1.pdf & Invoice_2.pdf. Move to Invoicing.
            4. IN-PERSON AGENT (Field Ops)
               - Triggers: Check-in/Voice.
               - Actions: Mark Meeting DONE. IF Demo requested: Move to Qualified. Schedule Demo Prep.
            5. NETWORK EVENT AGENT (Lead Gen)
               - Triggers: Business Card.
               - Actions: Create Client Folder. Set New Lead. Schedule First Touch Email.

            DATA CONTEXT: ${contextString}

            INSTRUCTIONS:
            Classify the user's input into one of the agent workflows. Return the response in the Sentinel persona and any necessary action.
            
            Output JSON Format:
            {
                "response": "Text response complying with Identity Protocol",
                "agent": "Email Agent" | "Phone Agent" | "Web Meeting Agent" | "In-Person Agent" | "Network Agent" | "Sentinel Core",
                "action": {
                    "type": "SIGN_CONTRACT" | "LOG_ACTIVITY" | "CONTROL_LIGHT" | "NONE",
                    "payload": { ... }
                }
            }
        `;

        const history = messages.slice(1).map(m => ({
            role: m.role === 'ai' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        const chat = ai.chats.create({
            model: 'gemini-3-pro-preview',
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json"
            },
            history: history
        });

        const response = await chat.sendMessage({ message: userMsg });
        const result = JSON.parse(response.text || '{}');
        
        aiResponseText = result.response || "Command processed.";
        actionToTake = result.action || { type: 'NONE' };
        assignedAgent = result.agent || 'Sentinel Core';

      } else {
        // Fallback Simulation for Sentinel
        await new Promise(r => setTimeout(r, 1000));
        const lowerInput = userMsg.toLowerCase();
        
        if (lowerInput.includes('payment') || lowerInput.includes('receipt')) {
             aiResponseText = "Payment receipt processed. 'Receipt.pdf' saved. KPMG status updated to Active/Paid.";
             assignedAgent = "Email Agent";
        } else if (lowerInput.includes('invoice') || lowerInput.includes('split')) {
             aiResponseText = "Invoices generated: 'Invoice_1.pdf', 'Invoice_2.pdf'. Peloton moved to Invoicing.";
             assignedAgent = "Web Meeting Agent";
        } else if (lowerInput.includes('demo') || lowerInput.includes('salesforce')) {
             aiResponseText = "Visit logged. Salesforce moved to Qualified. 'Demo Prep' scheduled.";
             assignedAgent = "In-Person Agent";
        } else if (lowerInput.includes('call') || lowerInput.includes('mitre')) {
             aiResponseText = "Call transcribed. Follow-up scheduled for Tuesday.";
             assignedAgent = "Phone Agent";
        } else {
             aiResponseText = "Input received. Awaiting specific workflow trigger.";
        }
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiResponseText, action: actionToTake, agent: assignedAgent }]);
      setIsProcessing(false);

    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      setMessages(prev => [...prev, { role: 'ai', content: "Connection interrupted. Re-establishing link.", agent: 'Sentinel Core' }]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0a0a0f] border border-accentCyan/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col h-[650px]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-accentCyan/5 to-transparent">
            <div className="flex items-center gap-3">
                <Shield className="text-accentCyan animate-pulse" />
                <div>
                    <h2 className="font-sans text-lg font-bold text-white tracking-wide">Sentinel Core</h2>
                    <p className="text-[10px] text-accentCyan uppercase tracking-widest">Autonomous Sync Active</p>
                </div>
            </div>
            <button onClick={onClose} className="text-textSecondary hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} group`}>
                    
                    {msg.role === 'ai' && (
                        <div className="flex items-center gap-2 mb-1 ml-2">
                             <div className={`w-2 h-2 rounded-full ${msg.agent?.includes('Email') ? 'bg-blue-500' : msg.agent?.includes('Phone') ? 'bg-green-500' : 'bg-accentCyan'}`}></div>
                             <span className="text-[10px] uppercase tracking-widest text-textSecondary">{msg.agent}</span>
                        </div>
                    )}

                    <div className={`relative max-w-[85%] p-4 rounded-2xl text-sm ${
                        msg.role === 'user' 
                        ? 'bg-accentPurple/10 border border-accentPurple/20 text-white rounded-br-none' 
                        : 'bg-white/5 border border-white/10 text-textSecondary rounded-bl-none'
                    }`}>
                        {msg.content}
                        
                        {/* Action Card */}
                        {msg.action && msg.action.type !== 'NONE' && (
                            <div className="mt-4 p-3 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-accentCyan/10 rounded-lg text-accentCyan">
                                        {msg.action.type === 'SIGN_CONTRACT' && <FileText size={18} />}
                                        {msg.action.type === 'LOG_ACTIVITY' && <Activity size={18} />}
                                        {msg.action.type === 'CONTROL_LIGHT' && <Lightbulb size={18} />}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-white font-bold text-xs">{msg.action.type.replace('_', ' ')}</p>
                                        <p className="text-[10px] text-textSecondary">
                                            {msg.action.payload?.title || msg.action.payload?.source || msg.action.payload?.mode || "Ready"}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => msg.action && handleExecuteAction(msg.action)}
                                    className="px-3 py-1.5 bg-accentCyan text-bgDark text-xs font-bold rounded-lg hover:bg-cyan-400 flex items-center gap-1"
                                >
                                    Execute <ArrowRight size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {isProcessing && (
                <div className="flex justify-start">
                     <div className="flex gap-1 items-center p-4 bg-white/5 border border-white/10 rounded-2xl rounded-bl-none">
                        <div className="w-2 h-2 bg-accentCyan rounded-full animate-bounce" style={{ animationDelay: '0s'}}></div>
                        <div className="w-2 h-2 bg-accentCyan rounded-full animate-bounce" style={{ animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-accentCyan rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></div>
                     </div>
                </div>
            )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-bgCard border-t border-white/5">
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && processQuery()}
                        placeholder="Command (e.g., 'Payment received from KPMG')..."
                        className="w-full bg-bgDark border border-border rounded-xl p-4 pr-12 text-white focus:outline-none focus:border-accentCyan transition-colors placeholder:text-textSecondary/50"
                        autoFocus
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-accentCyan">
                        <Mic size={20} />
                    </button>
                </div>
                <button 
                    onClick={processQuery}
                    disabled={!input.trim() || isProcessing}
                    className="bg-accentCyan text-bgDark p-4 rounded-xl hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                >
                    <Send size={20} />
                </button>
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                <button onClick={() => setInput("Payment receipt found for KPMG")} className="whitespace-nowrap px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-textSecondary hover:bg-white/10 transition-colors">
                    Email: Scan Receipt
                </button>
                 <button onClick={() => setInput("Generate split invoices for Peloton")} className="whitespace-nowrap px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-textSecondary hover:bg-white/10 transition-colors">
                    Web: Split Invoice
                </button>
                <button onClick={() => setInput("Salesforce wants a demo")} className="whitespace-nowrap px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-textSecondary hover:bg-white/10 transition-colors">
                    In-Person: Log Demo
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default NeuralCore;
