
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, FileText, User, Zap, Sun, Moon, Command, Radio } from 'lucide-react';
import { Opportunity, Contract } from '../types';

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  opportunities: Opportunity[];
  contracts: Contract[];
  toggleTheme: () => void;
  onOpenAI: () => void;
  onOpenCapture: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  sub?: string;
}

const CommandBar: React.FC<CommandBarProps> = ({ 
  isOpen, onClose, opportunities, contracts, toggleTheme, onOpenAI, onOpenCapture 
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const actions: CommandItem[] = [
    { id: 'act-ai', label: 'Ask Neural Core', icon: <Zap size={16} />, action: () => onOpenAI() },
    { id: 'act-cap', label: 'Capture Intel', icon: <Radio size={16} />, action: () => onOpenCapture() },
    { id: 'act-theme', label: 'Toggle Theme', icon: <Sun size={16} />, action: () => toggleTheme() },
  ];

  const filteredItems = query === '' ? actions : [
    ...actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase())),
    ...opportunities.filter(o => o.companyName.toLowerCase().includes(query.toLowerCase())).map(o => ({
        id: `opp-${o.id}`,
        label: `Go to ${o.companyName}`,
        sub: `Stage: ${o.stage} • $${o.amount.toLocaleString()}`,
        icon: <User size={16} />,
        action: () => navigate(`/client/${o.id}`)
    })),
    ...contracts.filter(c => c.title.toLowerCase().includes(query.toLowerCase())).map(c => ({
        id: `con-${c.id}`,
        label: `View Contract: ${c.title}`,
        sub: c.status,
        icon: <FileText size={16} />,
        action: () => navigate('/contracts')
    }))
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
        onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0a0a0f] border border-border rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        <div className="flex items-center px-4 border-b border-border">
            <Search className="text-textSecondary" size={20} />
            <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search..." 
                className="w-full bg-transparent p-4 text-white focus:outline-none placeholder:text-textSecondary/50 font-mono"
            />
            <div className="flex gap-2">
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-textSecondary">ESC</span>
            </div>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-2">
            {filteredItems.length === 0 && (
                <div className="p-8 text-center text-textSecondary">
                    No results found.
                </div>
            )}
            {filteredItems.map((item, idx) => (
                <button
                    key={item.id}
                    onClick={() => { item.action(); onClose(); }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-3 rounded-lg flex items-center justify-between group transition-colors ${idx === selectedIndex ? 'bg-accentCyan/10' : 'hover:bg-white/5'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-md ${idx === selectedIndex ? 'text-accentCyan bg-accentCyan/10' : 'text-textSecondary bg-white/5'}`}>
                            {item.icon}
                        </div>
                        <div>
                            <p className={`text-sm font-bold ${idx === selectedIndex ? 'text-white' : 'text-textSecondary group-hover:text-white'}`}>{item.label}</p>
                            {item.sub && <p className="text-xs text-textSecondary opacity-70">{item.sub}</p>}
                        </div>
                    </div>
                    {idx === selectedIndex && <ArrowRight size={16} className="text-accentCyan" />}
                </button>
            ))}
        </div>
        
        <div className="p-2 bg-bgElevated border-t border-border flex justify-between items-center text-[10px] text-textSecondary px-4">
            <span>ProTip: Use <strong className="text-white">Cmd+K</strong> to open this anytime.</span>
            <div className="flex gap-3">
                <span className="flex items-center gap-1"><Command size={10}/> Select</span>
                <span className="flex items-center gap-1">↑↓ Navigate</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CommandBar;
