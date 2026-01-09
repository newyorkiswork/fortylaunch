import React, { useState, useEffect } from 'react';
import { X, Mic, CheckCircle, Loader2 } from 'lucide-react';
import { MOCK_TRANSCRIPT } from '../constants';

interface VoiceRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (transcript: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ isOpen, onClose, onComplete }) => {
  const [state, setState] = useState<'idle' | 'recording' | 'processing' | 'success'>('idle');
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (isOpen) {
      setState('idle');
      setTranscript('');
    }
  }, [isOpen]);

  const startRecording = () => {
    setState('recording');
    // Simulate recording duration
    setTimeout(() => {
      stopRecording();
    }, 3000);
  };

  const stopRecording = () => {
    setState('processing');
    // Simulate AI Processing
    setTimeout(() => {
      setTranscript(MOCK_TRANSCRIPT);
      setState('success');
      // Auto close after success
      setTimeout(() => {
        onComplete(MOCK_TRANSCRIPT);
        onClose();
      }, 1500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-bgCard border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center p-8">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-textSecondary hover:text-white">
          <X size={24} />
        </button>

        <div className="mb-6 text-center">
            <h2 className="font-sans text-xl font-bold text-white mb-2">
                {state === 'idle' && "Tap to Speak"}
                {state === 'recording' && "Listening..."}
                {state === 'processing' && "AI Processing..."}
                {state === 'success' && "Update Captured!"}
            </h2>
            <p className="text-textSecondary text-sm">
                {state === 'idle' && "Describe your meeting, deal updates, or tasks."}
                {state === 'recording' && "Speak naturally. We'll handle the rest."}
                {state === 'processing' && "Extracting entities and intent..."}
                {state === 'success' && "Syncing to pipeline."}
            </p>
        </div>

        <div className="relative h-40 w-full flex items-center justify-center mb-6">
            {state === 'idle' && (
                <button 
                    onClick={startRecording}
                    className="w-24 h-24 rounded-full bg-bgElevated border-2 border-accentCyan flex items-center justify-center hover:scale-105 transition-transform"
                >
                    <Mic size={40} className="text-accentCyan" />
                </button>
            )}

            {state === 'recording' && (
                <div className="relative">
                    <div className="absolute inset-0 bg-accentCyan/20 rounded-full animate-ping"></div>
                    <button 
                        onClick={stopRecording}
                        className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-accentCyan to-accentPurple flex items-center justify-center animate-pulse-glow"
                    >
                        <div className="flex gap-1 items-end h-8">
                            <div className="w-1 bg-white animate-wave" style={{ animationDelay: '0s' }}></div>
                            <div className="w-1 bg-white animate-wave" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 bg-white animate-wave" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-1 bg-white animate-wave" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 bg-white animate-wave" style={{ animationDelay: '0s' }}></div>
                        </div>
                    </button>
                </div>
            )}

            {state === 'processing' && (
                <div className="flex flex-col items-center">
                     <Loader2 size={48} className="text-accentPurple animate-spin mb-4" />
                     <div className="h-1 w-32 bg-bgElevated rounded-full overflow-hidden">
                        <div className="h-full bg-accentPurple w-1/2 animate-[shimmer_1s_infinite]"></div>
                     </div>
                </div>
            )}

             {state === 'success' && (
                <div className="flex flex-col items-center scale-110 transition-transform">
                     <CheckCircle size={64} className="text-accentGreen mb-4" />
                </div>
            )}
        </div>

        {transcript && (
            <div className="w-full bg-bgElevated p-4 rounded-xl border border-border text-sm text-textSecondary italic">
                "{transcript}"
            </div>
        )}

      </div>
    </div>
  );
};

export default VoiceRecorder;
