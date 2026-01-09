import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, Shield, Lock, PenTool, RefreshCw } from 'lucide-react';

interface SignaturePadProps {
  onSign: (dataUrl: string, saveToProfile: boolean) => void;
  onCancel: () => void;
  savedSignature?: { dataUrl: string; dateStored: string };
  userName: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSign, onCancel, savedSignature, userName }) => {
  const [mode, setMode] = useState<'stored' | 'draw'>(savedSignature ? 'stored' : 'draw');
  const [saveToProfile, setSaveToProfile] = useState(false);
  
  // Drawing State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (mode === 'draw') {
        const canvas = canvasRef.current;
        if (canvas) {
        canvas.width = canvas.parentElement?.clientWidth || 500;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.strokeStyle = '#38BDF8'; // accentCyan
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
        }
        }
    }
  }, [mode]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const { x, y } = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
    ctx?.moveTo(x, y);
    e.preventDefault();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.lineTo(x, y);
    ctx?.stroke();
    setHasDrawn(true);
    e.preventDefault();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    ctx?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
    setHasDrawn(false);
  };

  const handleCompleteDraw = () => {
    if (hasDrawn && canvasRef.current) {
        onSign(canvasRef.current.toDataURL(), saveToProfile);
    }
  };

  const handleApplyStored = () => {
      if (savedSignature) {
          onSign(savedSignature.dataUrl, false);
      }
  };

  return (
    <div className="w-full bg-bgCard border border-border rounded-xl overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
        {/* Header Tabs */}
        <div className="flex border-b border-border bg-bgElevated">
            {savedSignature && (
                <button 
                    onClick={() => setMode('stored')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${mode === 'stored' ? 'text-accentCyan bg-bgCard border-t-2 border-accentCyan' : 'text-textSecondary hover:text-white'}`}
                >
                    <Lock size={14} /> Secure Enclave
                </button>
            )}
            <button 
                onClick={() => setMode('draw')}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${mode === 'draw' ? 'text-accentCyan bg-bgCard border-t-2 border-accentCyan' : 'text-textSecondary hover:text-white'}`}
            >
                <PenTool size={14} /> New Signature
            </button>
        </div>

        {/* STORED MODE */}
        {mode === 'stored' && savedSignature && (
            <div className="p-8 text-center bg-[#0a0a0f] relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                
                <div className="relative z-10 mb-6">
                    <div className="w-20 h-20 mx-auto bg-accentCyan/10 rounded-full flex items-center justify-center border border-accentCyan/30 mb-4 shadow-[0_0_30px_rgba(56,189,248,0.2)]">
                        <Shield size={40} className="text-accentCyan" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">Identity Verified</h3>
                    <p className="text-sm text-textSecondary font-mono">{userName}</p>
                    <p className="text-xs text-accentGreen mt-2 flex items-center justify-center gap-1">
                        <Lock size={10} /> End-to-End Encrypted
                    </p>
                </div>

                <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-6 max-w-xs mx-auto">
                    <img src={savedSignature.dataUrl} alt="Stored Signature" className="h-12 mx-auto invert opacity-80" />
                </div>

                <div className="flex gap-3 justify-center">
                    <button onClick={onCancel} className="px-6 py-2 rounded-lg text-sm text-textSecondary hover:text-white">Cancel</button>
                    <button 
                        onClick={handleApplyStored}
                        className="px-6 py-2 rounded-lg bg-accentCyan text-bgDark font-bold flex items-center gap-2 text-sm hover:bg-cyan-400 shadow-lg shadow-accentCyan/20"
                    >
                        <Check size={16} /> Apply Stored Signature
                    </button>
                </div>
            </div>
        )}

        {/* DRAW MODE */}
        {mode === 'draw' && (
            <div>
                 <div className="p-3 bg-bgElevated border-b border-border flex justify-between items-center">
                    <span className="text-xs text-textSecondary uppercase tracking-widest">Canvas Active</span>
                    <span className="text-xs text-accentCyan flex items-center gap-1"><RefreshCw size={10} className="animate-spin" /> Live Input</span>
                </div>
                
                <div className="relative bg-[#0a0a0f] cursor-crosshair touch-none">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full"
                    />
                    {!hasDrawn && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-white/10 text-4xl font-sans font-bold">SIGN HERE</span>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-border bg-bgCard">
                    <label className="flex items-center gap-3 mb-4 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${saveToProfile ? 'bg-accentCyan border-accentCyan' : 'border-border bg-bgElevated group-hover:border-accentCyan'}`}>
                            {saveToProfile && <Check size={12} className="text-bgDark" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={saveToProfile} onChange={() => setSaveToProfile(!saveToProfile)} />
                        <div>
                            <p className="text-sm text-white font-bold">Save to Secure Enclave</p>
                            <p className="text-xs text-textSecondary">Encrypt and store for one-click signing in future.</p>
                        </div>
                    </label>

                    <div className="flex gap-3 justify-between">
                        <button 
                            onClick={clear}
                            className="px-4 py-2 rounded-lg bg-white/5 text-textSecondary hover:text-white hover:bg-white/10 flex items-center gap-2 text-sm"
                        >
                            <Eraser size={16} /> Clear
                        </button>
                        <div className="flex gap-2">
                             <button onClick={onCancel} className="px-4 py-2 text-sm text-textSecondary hover:text-white">Cancel</button>
                            <button 
                                onClick={handleCompleteDraw}
                                disabled={!hasDrawn}
                                className="px-6 py-2 rounded-lg bg-accentCyan text-bgDark font-bold flex items-center gap-2 text-sm disabled:opacity-50 hover:bg-cyan-400"
                            >
                                <Check size={16} /> Sign Document
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default SignaturePad;