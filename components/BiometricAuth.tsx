import React, { useState, useEffect } from 'react';
import { Scan, Fingerprint, Lock, CheckCircle2 } from 'lucide-react';

interface BiometricAuthProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  actionName: string;
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({ isOpen, onSuccess, onCancel, actionName }) => {
  const [stage, setStage] = useState<'prompt' | 'scanning' | 'success'>('prompt');

  useEffect(() => {
    if (isOpen) setStage('prompt');
  }, [isOpen]);

  const startScan = () => {
    setStage('scanning');
    setTimeout(() => {
      setStage('success');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-xl">
      <div className="w-full max-w-sm p-8 text-center">
        
        {stage === 'prompt' && (
            <div className="animate-in zoom-in duration-300">
                <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 relative">
                     <Lock size={40} className="text-white" />
                     <div className="absolute inset-0 rounded-full border border-accentCyan/30 animate-ping"></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Authentication Required</h3>
                <p className="text-textSecondary mb-8">Secure Access: {actionName}</p>
                
                <div className="space-y-3">
                    <button 
                        onClick={startScan}
                        className="w-full py-4 rounded-xl bg-accentCyan text-bgDark font-bold flex items-center justify-center gap-2 hover:bg-cyan-400 transition-colors"
                    >
                        <Scan size={20} />
                        Use Face ID
                    </button>
                    <button 
                        onClick={startScan}
                        className="w-full py-4 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                    >
                        <Fingerprint size={20} />
                        Use Fingerprint
                    </button>
                    <button onClick={onCancel} className="text-sm text-textSecondary hover:text-white mt-4">
                        Cancel
                    </button>
                </div>
            </div>
        )}

        {stage === 'scanning' && (
            <div className="relative">
                <div className="w-64 h-64 mx-auto border-2 border-accentCyan/30 rounded-lg relative overflow-hidden bg-accentCyan/5">
                    {/* Grid Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                    
                    {/* Scanning Bar */}
                    <div className="absolute left-0 right-0 h-1 bg-accentCyan shadow-[0_0_20px_rgba(0,255,255,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                    
                    {/* Face Target */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-40 border-2 border-dashed border-accentCyan/50 rounded-[50%]"></div>
                    </div>
                </div>
                <p className="mt-6 text-accentCyan font-mono animate-pulse">VERIFYING BIOMETRICS...</p>
            </div>
        )}

        {stage === 'success' && (
            <div className="animate-in zoom-in duration-300">
                <div className="w-24 h-24 mx-auto bg-accentGreen/20 rounded-full flex items-center justify-center mb-6 border border-accentGreen relative">
                     <CheckCircle2 size={48} className="text-accentGreen" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Identity Confirmed</h3>
                <p className="text-textSecondary">Access Granted</p>
            </div>
        )}

      </div>
      <style>{`
        @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default BiometricAuth;
