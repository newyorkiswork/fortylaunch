
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, BarChart2, Settings, FileText, MessageSquare, BrainCircuit, WifiOff, Radio, Calendar, Mic, Plus, Sun, Moon } from 'lucide-react';
import { UserState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onOpenAI: () => void;
  onOpenLive: () => void;
  onOpenCapture: () => void;
  onAddClient: () => void;
  themeMode: 'dark' | 'light';
  toggleTheme: () => void;
  userState: UserState;
}

const Layout: React.FC<LayoutProps> = ({ children, onOpenAI, onOpenLive, onOpenCapture, onAddClient, themeMode, toggleTheme, userState }) => {
  const location = useLocation();

  const isLight = themeMode === 'light';
  const bgColor = isLight ? 'bg-[#F1F5F9]' : 'bg-[#0F172A]'; // Bright: Slate 100, Dark: Slate 900
  const sidebarBg = isLight ? 'bg-white border-gray-200' : 'bg-[#111827] border-white/10'; // Bright: White, Dark: Gray 900
  const textColor = isLight ? 'text-slate-900' : 'text-textPrimary';
  
  const isActive = (path: string) => {
      if (location.pathname === path) {
          return isLight ? 'text-slate-900 bg-slate-100 border-l-2 border-slate-900' : 'text-white bg-white/10 border-l-2 border-white';
      }
      return isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-50' : 'text-textSecondary hover:text-white hover:bg-white/5';
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${bgColor} ${textColor} font-mono flex flex-col md:flex-row overflow-hidden`}>
      {/* Offline Banner */}
      {!userState.isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white text-xs font-bold text-center py-1 flex items-center justify-center gap-2">
            <WifiOff size={12} />
            OFFLINE MODE
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col w-72 border-r p-4 fixed h-full z-20 transition-colors duration-500 ${sidebarBg}`}>
        <div className="flex items-center gap-3 mb-8 mt-4 px-2">
          <div className={`w-8 h-8 flex items-center justify-center rounded-sm ${isLight ? 'bg-slate-900 text-white' : 'bg-white text-black'}`}>
             <span className="font-sans font-black text-lg">F</span>
          </div>
          <h1 className={`font-sans text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Fortylaunch
          </h1>
        </div>

        <button onClick={onAddClient} className={`mb-6 mx-2 p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${isLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-gray-200'}`}>
            <Plus size={18} /> New Client
        </button>

        <nav className="flex-1 space-y-1">
          <Link to="/" className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive('/')}`}>
            <Home size={18} />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          
          <button onClick={onOpenCapture} className={`flex items-center gap-3 p-3 rounded-lg transition-all w-full text-left ${isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-50' : 'text-textSecondary hover:text-white hover:bg-white/5'}`}>
              <Mic size={18} />
              <span className="text-sm font-medium">Quick Capture</span>
          </button>

          <Link to="/pipeline" className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive('/pipeline')}`}>
            <BarChart2 size={18} />
            <span className="text-sm font-medium">Pipeline</span>
          </Link>
          <Link to="/messages" className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive('/messages')}`}>
            <MessageSquare size={18} />
            <span className="text-sm font-medium">Interactions</span>
          </Link>
           <Link to="/contracts" className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive('/contracts')}`}>
            <FileText size={18} />
            <span className="text-sm font-medium">Documents</span>
          </Link>
           <Link to="/calendar" className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive('/calendar')}`}>
            <Calendar size={18} />
            <span className="text-sm font-medium">Calendar</span>
          </Link>
          
          <div className={`my-4 border-t ${isLight ? 'border-gray-200' : 'border-white/10'}`}></div>

          <button 
            onClick={toggleTheme}
            className={`flex items-center gap-3 p-3 rounded-lg w-full transition-all ${isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-textSecondary hover:text-white hover:bg-white/5'}`}
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
            <span className="text-sm font-medium">{isLight ? 'Dark Mode' : 'Bright Mode'}</span>
          </button>
        </nav>

        <div className="mt-auto space-y-4">
           {/* Status Bar */}
           <div className="flex items-center justify-between px-2 text-[10px] text-gray-500">
               <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${userState.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                   <span>SYSTEM {userState.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
               </div>
               <span>V2.0.4</span>
           </div>

           <Link to="/settings" className={`flex items-center gap-2 text-xs px-2 py-2 ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-textSecondary hover:text-white'}`}>
            <Settings size={14} />
            <span>Configuration</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className={`md:hidden flex items-center justify-between p-4 border-b sticky top-0 z-30 ${isLight ? 'bg-white border-gray-200' : 'bg-[#111827] border-white/10'}`}>
         <div className="flex items-center gap-2">
            <div className={`w-8 h-8 flex items-center justify-center rounded-sm ${isLight ? 'bg-slate-900 text-white' : 'bg-white text-black'}`}>
              <span className="font-sans font-black text-lg">F</span>
            </div>
            <h1 className={`font-sans text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Fortylaunch</h1>
         </div>
         <button onClick={onAddClient}><Plus size={24} className={isLight ? 'text-slate-900' : 'text-white'}/></button>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-4 md:p-8 pb-24 md:pb-8 relative min-h-screen">
         {/* Subtle Noise Texture - Reduced opacity for light mode */}
         <div className={`absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] ${isLight ? 'opacity-[0.015]' : 'opacity-[0.03]'}`}></div>
         
         <div className="relative max-w-7xl mx-auto">
             {children}
         </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 border-t p-4 flex justify-around items-center z-30 pb-safe ${isLight ? 'bg-white border-gray-200' : 'bg-[#111827] border-white/10'}`}>
        <Link to="/" className={isLight ? 'text-slate-900' : 'text-white'}><Home size={24} /></Link>
        <button onClick={onOpenCapture} className="text-gray-400"><Mic size={24} /></button>
        <button onClick={onOpenAI} className={`p-3 rounded-full -mt-8 shadow-lg border-4 ${isLight ? 'bg-slate-900 border-white text-white' : 'bg-white border-[#0F172A] text-black'}`}>
            <BrainCircuit size={24} />
        </button>
        <Link to="/contracts" className="text-gray-400"><FileText size={24} /></Link>
        <Link to="/calendar" className="text-gray-400"><Calendar size={24} /></Link>
      </nav>

      {/* Floating Action Buttons Desktop */}
      <div className="hidden md:flex flex-col fixed bottom-8 right-8 gap-4 z-50">
          <button 
            onClick={onOpenLive}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 border ${isLight ? 'bg-white border-gray-200 text-purple-600 hover:border-purple-200' : 'bg-[#1F2937] border-white/10 text-purple-400 hover:border-white/30'}`}
            title="Live Voice Agent"
          >
            <Radio size={24} />
          </button>

          <button 
            onClick={onOpenAI}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all hover:scale-105 ${isLight ? 'bg-slate-900 text-white' : 'bg-white text-black'}`}
            title="Neural Core"
          >
            <BrainCircuit size={28} />
          </button>
      </div>
    </div>
  );
};

export default Layout;
