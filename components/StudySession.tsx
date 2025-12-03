import React, { useState, useEffect } from 'react';
import { Play, Pause, XCircle, Send, MessageSquare, Timer } from 'lucide-react';
import { askTutor } from '../services/geminiService';
import { ViewState } from '../types';

interface StudySessionProps {
  subject: string;
  topic: string;
  onExit: () => void;
}

export const StudySession: React.FC<StudySessionProps> = ({ subject, topic, onExit }) => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      clearInterval(interval);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleAsk = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    
    setLoadingChat(true);
    const response = await askTutor(userMsg, `Matéria: ${subject}, Tópico: ${topic}`);
    setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
    setLoadingChat(false);
  };

  return (
    <div className="h-full flex flex-col gap-6">
       {/* Header / Timer */}
       <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
             <h2 className="text-3xl font-bold text-white">{subject}</h2>
             <p className="text-gold-500 font-mono text-lg">{topic}</p>
          </div>

          <div className="flex flex-col items-center">
            <div className={`text-6xl font-mono font-bold tracking-tighter ${isActive ? 'text-white' : 'text-zinc-600'}`}>
                {formatTime(seconds)}
            </div>
            <div className="flex gap-4 mt-4">
                <button onClick={toggleTimer} className="w-12 h-12 rounded-full bg-gold-500 text-black flex items-center justify-center hover:bg-gold-600 transition-colors">
                    {isActive ? <Pause /> : <Play fill="black" />}
                </button>
                <button onClick={onExit} className="w-12 h-12 rounded-full bg-zinc-800 text-red-500 flex items-center justify-center hover:bg-zinc-700 transition-colors">
                    <XCircle />
                </button>
            </div>
          </div>
       </div>

       {/* Content & Chat */}
       <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
           {/* Content Area (Mocked for Demo, ideally fetched from AI) */}
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl overflow-y-auto">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2"><Timer size={20} className="text-blue-500"/> Resumo Tático</h3>
                <div className="prose prose-invert prose-p:text-zinc-400">
                    <p>
                        Para dominar <strong>{topic}</strong>, foque nos conceitos fundamentais. 
                        Este tópico é recorrente em 30% das provas anteriores.
                    </p>
                    <ul className="list-disc pl-4 space-y-2 text-zinc-300 mt-4">
                        <li>Identifique as palavras-chave no enunciado.</li>
                        <li>Elimine as alternativas absurdas imediatamente.</li>
                        <li>Gerencie seu tempo: não gaste mais de 3 minutos por questão.</li>
                    </ul>
                    <div className="mt-6 p-4 bg-zinc-950 rounded-lg border border-l-4 border-l-gold-500 border-zinc-800">
                        <p className="font-bold text-gold-500">Dica de Ouro</p>
                        <p className="text-sm mt-1">Sempre revise a teoria básica antes de partir para exercícios complexos.</p>
                    </div>
                </div>
           </div>

           {/* AI Chat */}
           <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex items-center gap-2">
                    <MessageSquare size={18} className="text-gold-500"/>
                    <span className="font-bold text-sm uppercase">Tutor IA</span>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {chatHistory.length === 0 && (
                        <div className="text-center text-zinc-600 mt-10">
                            <p>Tem dúvidas sobre {topic}?</p>
                            <p className="text-sm">Pergunte que eu explico.</p>
                        </div>
                    )}
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-zinc-800 text-white' : 'bg-gold-500/10 text-gold-500 border border-gold-500/20'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loadingChat && (
                        <div className="flex justify-start">
                            <div className="bg-zinc-800/50 p-2 rounded-lg">
                                <span className="animate-pulse">...</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-zinc-800 bg-zinc-950">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                            placeholder="Digite sua dúvida..."
                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:border-gold-500 outline-none transition-colors"
                        />
                        <button 
                            onClick={handleAsk}
                            disabled={loadingChat}
                            className="bg-gold-500 hover:bg-gold-600 text-black p-2 rounded-lg transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
           </div>
       </div>
    </div>
  );
};