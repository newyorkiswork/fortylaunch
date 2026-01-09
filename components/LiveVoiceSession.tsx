
import React, { useEffect, useState, useRef } from 'react';
import { X, Mic, MicOff, Globe, Volume2, PlayCircle, Terminal } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type } from '@google/genai';
import { AIAction } from '../types';

interface LiveVoiceSessionProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
    onAction: (action: AIAction) => void;
}

const LiveVoiceSession: React.FC<LiveVoiceSessionProps> = ({ isOpen, onClose, userName, onAction }) => {
    const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected' | 'demo'>('disconnected');
    const [isMicOn, setIsMicOn] = useState(true);
    const [volumeLevel, setVolumeLevel] = useState(0);

    // Audio Context Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const outputContextRef = useRef<AudioContext | null>(null);

    const nextStartTimeRef = useRef<number>(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const sessionRef = useRef<any>(null);

    // Tool Definitions
    const signContractTool: FunctionDeclaration = {
        name: 'signContract',
        description: 'Initiate biometric authentication to sign a specific contract.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                contractName: { type: Type.STRING, description: 'The name or company of the contract to sign (e.g., Acme Corp)' }
            },
            required: ['contractName']
        }
    };

    const controlLightTool: FunctionDeclaration = {
        name: 'controlLight',
        description: 'Adjust the room lighting or CRM theme.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                mode: { type: Type.STRING, description: 'Mode: "focus", "relax", "standard"' }
            },
            required: ['mode']
        }
    };

    const logActivityTool: FunctionDeclaration = {
        name: 'logActivity',
        description: 'Log a communication interaction like a Zoom call, Phone call, etc.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                source: { type: Type.STRING, description: 'Source: "Zoom", "Phone", "Email"' },
                summary: { type: Type.STRING, description: 'Summary of the interaction' }
            },
            required: ['source', 'summary']
        }
    };

    useEffect(() => {
        if (isOpen) {
            startSession();
        } else {
            stopSession();
        }
        return () => stopSession();
    }, [isOpen]);

    // Keep status in ref for audio processor callback
    const statusRef = useRef(status);
    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    const startSession = async () => {
        setStatus('connecting');
        try {
            // Safe access for process.env to prevent ReferenceError in browser-only environments
            const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;

            // 1. Setup Audio Inputs (Even for demo, to show visualizer)
            let stream: MediaStream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        sampleRate: 16000,
                        channelCount: 1,
                        echoCancellation: true
                    }
                });
            } catch (micError) {
                console.error('Microphone access denied:', micError);
                setStatus('demo'); // Fall back to demo if mic denied
                return;
            }
            mediaStreamRef.current = stream;

            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContextClass({ sampleRate: 16000 });
            audioContextRef.current = ctx;

            const source = ctx.createMediaStreamSource(stream);
            sourceRef.current = source;
            const processor = ctx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
                if (!isMicOn) return;
                const inputData = e.inputBuffer.getChannelData(0);

                // Calculate volume for visualizer
                let sum = 0;
                for (let i = 0; i < inputData.length; i++) sum += Math.abs(inputData[i]);
                const vol = (sum / inputData.length) * 500;

                // Use ref to avoid stale closure
                if (statusRef.current === 'connected' || statusRef.current === 'demo') {
                    setVolumeLevel(vol);
                }

                // If connected to real API, send data
                if (statusRef.current === 'connected' && sessionRef.current) {
                    const pcmData = floatTo16BitPCM(inputData);
                    const base64Data = arrayBufferToBase64(pcmData);
                    sessionRef.current.then((session: any) => {
                        session.sendRealtimeInput({
                            media: {
                                mimeType: 'audio/pcm;rate=16000',
                                data: base64Data
                            }
                        });
                    });
                }
            };

            source.connect(processor);
            processor.connect(ctx.destination);

            if (!apiKey) {
                console.warn("No API Key found. Starting Live Session in DEMO MODE.");
                setStatus('demo');
                return;
            }

            const ai = new GoogleGenAI({ apiKey });
            const outputCtx = new AudioContextClass();
            outputContextRef.current = outputCtx;

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    systemInstruction: `IDENTITY: You are "Sentinel", the Voice-First Intelligent CRM for Fortylaunch.
                PROTOCOL:
                - NEVER address the user by name.
                - Use neutral, professional greetings only (e.g., "System ready", "Processing update", "Calendar synced").
                - Tone: Efficient, robotic but helpful.
                
                You can execute tasks like signing contracts, controlling room lights, and logging calls via specialized agents.`,
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                    },
                    tools: [{ functionDeclarations: [signContractTool, controlLightTool, logActivityTool] }]
                },
                callbacks: {
                    onopen: () => {
                        setStatus('connected');
                        console.log("Gemini Live Connected");
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        handleServerMessage(message, outputCtx);
                    },
                    onclose: () => {
                        setStatus('disconnected');
                    },
                    onerror: (err) => {
                        console.error("Live Error", err);
                        setStatus('error');
                    }
                }
            });

            sessionRef.current = sessionPromise;

        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    const handleServerMessage = async (message: LiveServerMessage, ctx: AudioContext) => {
        // Handle Tool Calls
        if (message.toolCall) {
            for (const fc of message.toolCall.functionCalls) {
                console.log("Function Call Triggered:", fc.name, fc.args);
                let result = "Executed";

                if (fc.name === 'signContract') {
                    const name = (fc.args as any).contractName;
                    onAction({ type: 'SIGN_CONTRACT', payload: { title: name } });
                    result = `Biometric scanner opened for ${name}`;
                } else if (fc.name === 'controlLight') {
                    const mode = (fc.args as any).mode;
                    onAction({ type: 'CONTROL_LIGHT', payload: { mode } });
                    result = `Room lights set to ${mode}`;
                } else if (fc.name === 'logActivity') {
                    const { source, summary } = fc.args as any;
                    onAction({ type: 'LOG_ACTIVITY', payload: { source, summary } });
                    result = `Logged ${source} activity.`;
                }

                // Only send response if we have a real session
                if (sessionRef.current) {
                    sessionRef.current.then((session: any) => {
                        session.sendToolResponse({
                            functionResponses: {
                                id: fc.id,
                                name: fc.name,
                                response: { result }
                            }
                        });
                    });
                }
            }
        }

        // Handle Audio
        const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            try {
                const audioData = decode(base64Audio);
                const audioBuffer = await decodeAudioData(audioData, ctx, 24000, 1);
                setVolumeLevel(Math.random() * 100);
                playAudioBuffer(audioBuffer, ctx);
            } catch (err) {
                console.error("Audio Decode Error", err);
            }
        }

        if (message.serverContent?.interrupted) {
            stopAllAudio();
        }
    };

    const stopSession = () => {
        if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(t => t.stop());
        if (audioContextRef.current) audioContextRef.current.close();
        if (outputContextRef.current) outputContextRef.current.close();
        if (processorRef.current) processorRef.current.disconnect();
        stopAllAudio();
        setStatus('disconnected');
        setVolumeLevel(0);
    };

    const playAudioBuffer = (buffer: AudioBuffer, ctx: AudioContext) => {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        const currentTime = ctx.currentTime;

        if (ctx.state === 'suspended') ctx.resume();

        const startTime = Math.max(currentTime, nextStartTimeRef.current);
        source.start(startTime);
        nextStartTimeRef.current = startTime + buffer.duration;
        sourcesRef.current.add(source);
        source.onended = () => {
            sourcesRef.current.delete(source);
            if (sourcesRef.current.size === 0) setVolumeLevel(0);
        };
    };

    const stopAllAudio = () => {
        sourcesRef.current.forEach(s => s.stop());
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;
    };

    const simulateTool = (toolName: string, args: any) => {
        // Mock a server message triggering a tool call (partial mock for demo mode)
        const mockMsg = {
            toolCall: {
                functionCalls: [{
                    id: `mock-${Date.now()}`,
                    name: toolName,
                    args: args
                }]
            }
        } as LiveServerMessage;
        // We don't have a real output context in demo mode usually, but let's create one on the fly if needed
        // or just bypass audio for the tool simulation
        const mockCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        handleServerMessage(mockMsg, mockCtx);
    };

    // --- Helpers ---
    function floatTo16BitPCM(input: Float32Array) {
        const output = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, input[i]));
            output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return output.buffer;
    }

    function arrayBufferToBase64(buffer: ArrayBuffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    function decode(base64: string) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) {
        const dataInt16 = new Int16Array(data.buffer);
        const frameCount = dataInt16.length / numChannels;
        const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

        for (let channel = 0; channel < numChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
                channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
            }
        }
        return buffer;
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">

            <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                <X size={32} />
            </button>

            <div className="flex flex-col items-center gap-8 w-full max-w-md px-6">
                <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10">
                    <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-accentGreen animate-pulse' : status === 'demo' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs font-mono text-textSecondary uppercase">
                        {status === 'connected' ? 'Sentinel Voice Link Active' : status === 'demo' ? 'DEMO SIMULATION MODE' : status}
                    </span>
                </div>

                <div className="relative w-64 h-64 flex items-center justify-center">
                    <div
                        className="absolute inset-0 rounded-full bg-accentPurple/20 blur-3xl transition-all duration-100"
                        style={{ transform: `scale(${1 + volumeLevel / 50})`, opacity: 0.5 + volumeLevel / 100 }}
                    ></div>

                    <div className="relative z-10 w-48 h-48 rounded-full bg-gradient-to-br from-bgElevated to-black border border-accentPurple/30 shadow-[0_0_50px_rgba(168,85,247,0.3)] flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accentPurple/20 via-transparent to-transparent"></div>
                        <div className="flex items-center justify-center gap-1 h-20">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-2 bg-accentPurple rounded-full transition-all duration-75"
                                    style={{
                                        height: (status === 'connected' || status === 'demo') ? `${20 + Math.random() * volumeLevel * 2}px` : '4px',
                                        opacity: (status === 'connected' || status === 'demo') ? 1 : 0.3
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-white font-sans">Sentinel Voice</h2>
                    <p className="text-textSecondary text-sm">Commands: "Generate Invoice", "Scan Receipt", "Update Pipeline"</p>
                </div>

                {/* Demo Controls */}
                {status === 'demo' && (
                    <div className="flex gap-3 flex-wrap justify-center mt-4">
                        <button onClick={() => simulateTool('signContract', { contractName: 'KPMG' })} className="px-3 py-2 bg-white/10 rounded-lg text-xs font-bold text-white flex items-center gap-2 hover:bg-white/20">
                            <Terminal size={14} /> Test: Sign Contract
                        </button>
                        <button onClick={() => simulateTool('controlLight', { mode: 'focus' })} className="px-3 py-2 bg-white/10 rounded-lg text-xs font-bold text-white flex items-center gap-2 hover:bg-white/20">
                            <Terminal size={14} /> Test: Lights
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-6 mt-4">
                    <button className="p-4 rounded-full bg-white/5 text-textSecondary hover:bg-white/10 hover:text-white transition-colors">
                        <Globe size={24} />
                    </button>

                    <button
                        onClick={() => setIsMicOn(!isMicOn)}
                        className={`p-6 rounded-full transition-all duration-300 ${isMicOn ? 'bg-accentPurple text-white shadow-[0_0_30px_rgba(168,85,247,0.4)]' : 'bg-red-500/20 text-red-500 border border-red-500/50'}`}
                    >
                        {isMicOn ? <Mic size={32} /> : <MicOff size={32} />}
                    </button>

                    <button className="p-4 rounded-full bg-white/5 text-textSecondary hover:bg-white/10 hover:text-white transition-colors">
                        <Volume2 size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LiveVoiceSession;
