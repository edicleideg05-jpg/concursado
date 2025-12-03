import React, { useState } from 'react';
import { generateLogicChallenge } from '../services/geminiService';
import { LogicChallenge } from '../types';
import { Puzzle, Brain, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

export const LogicLab: React.FC = () => {
  const [challenge, setChallenge] = useState<LogicChallenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const loadChallenge = async () => {
    setLoading(true);
    setChallenge(null);
    setRevealed(false);
    setSelected(null);
    const data = await generateLogicChallenge();
    setChallenge(data);
    setLoading(false);
  };

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Puzzle className="text-purple-500" size={32} />
          Laboratório de Lógica
        </h2>
        <p className="text-zinc-400 mt-2">Treine seu cérebro com desafios estilo PF, ABIN e EsPCEx.</p>
      </div>

      {!challenge && !loading && (
        <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-2xl text-center flex flex-col items-center">
            <Brain size={64} className="text-purple-500/50 mb-6 animate-pulse" />
            <h3 className="text-xl font-bold text-white mb-4">Pronto para o desafio?</h3>
            <button 
                onClick={loadChallenge}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/20"
            >
                GERAR DESAFIO
            </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center h-64">
            <Loader2 size={48} className="text-purple-500 animate-spin mb-4" />
            <p className="font-mono text-purple-400">Calculando variáveis...</p>
        </div>
      )}

      {challenge && (
        <div className="animate-in zoom-in-95 duration-500">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                
                <div className="p-8">
                    <span className="text-xs font-bold uppercase text-purple-400 tracking-wider mb-2 block">{challenge.title}</span>
                    <p className="text-lg text-zinc-300 italic border-l-4 border-purple-500 pl-4 mb-6 bg-zinc-950/50 p-4 rounded-r-lg">
                        "{challenge.scenario}"
                    </p>
                    <p className="text-xl font-bold text-white mb-8">
                        {challenge.question}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {challenge.options.map((opt, idx) => {
                             let style = "bg-zinc-950 border-zinc-800 hover:bg-zinc-800";
                             if (revealed) {
                                 if (idx === challenge.correctIndex) style = "bg-green-500/10 border-green-500 text-green-500";
                                 else if (idx === selected) style = "bg-red-500/10 border-red-500 text-red-500";
                                 else style = "bg-zinc-950 border-zinc-800 opacity-50";
                             }

                             return (
                                 <button
                                    key={idx}
                                    onClick={() => handleSelect(idx)}
                                    disabled={revealed}
                                    className={`p-4 rounded-xl border text-left transition-all font-mono text-sm flex items-center justify-between ${style}`}
                                 >
                                    <span>{opt}</span>
                                    {revealed && idx === challenge.correctIndex && <CheckCircle size={18} />}
                                    {revealed && idx === selected && idx !== challenge.correctIndex && <XCircle size={18} />}
                                 </button>
                             )
                        })}
                    </div>
                </div>

                {revealed && (
                    <div className="bg-zinc-950 p-6 border-t border-zinc-800 animate-in slide-in-from-bottom">
                        <h4 className="font-bold text-white mb-2">Explicação Lógica</h4>
                        <p className="text-zinc-400 text-sm mb-6">{challenge.explanation}</p>
                        <button 
                            onClick={loadChallenge}
                            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                        >
                            PRÓXIMO DESAFIO <ArrowRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};