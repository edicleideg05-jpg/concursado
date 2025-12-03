import React, { useState, useEffect } from 'react';
import { generateInformaticsDaily } from '../services/geminiService';
import { InformaticsDaily } from '../types';
import { Cpu, Terminal, Keyboard, Lightbulb, RefreshCw, Check, X } from 'lucide-react';

export const Informatics: React.FC = () => {
  const [data, setData] = useState<InformaticsDaily | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const loadDaily = async () => {
    setLoading(true);
    setSelected(null);
    try {
        const result = await generateInformaticsDaily();
        setData(result);
    } catch (e) {
        console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDaily();
  }, []);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                    <Cpu className="text-blue-500" /> Centro de Informática
                </h2>
                <p className="text-zinc-400 text-sm">Domine a tecnologia para gabaritar.</p>
            </div>
            <button 
                onClick={loadDaily} 
                disabled={loading}
                className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
            >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
       </div>

       {loading && !data && (
           <div className="text-center py-20">
               <Terminal size={48} className="text-blue-500 mx-auto mb-4 animate-pulse" />
               <p className="font-mono text-blue-400">Processando dados...</p>
           </div>
       )}

       {data && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
               {/* Daily Tip Card */}
               <div className="bg-gradient-to-br from-blue-900/20 to-zinc-900 border border-blue-500/30 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 text-blue-500/10">
                        <Keyboard size={150} />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-blue-500 text-black text-xs font-bold px-2 py-1 rounded uppercase">Dica do Dia</span>
                            <span className="text-blue-400 font-mono text-sm">{data.topic}</span>
                        </div>
                        
                        <p className="text-xl font-bold text-white mb-6 leading-relaxed">
                            {data.tip}
                        </p>

                        {data.shortcut && (
                            <div className="bg-black/40 p-4 rounded-xl border border-blue-500/20 inline-block">
                                <span className="text-zinc-500 text-xs uppercase block mb-1">Atalho Útil</span>
                                <code className="text-gold-500 font-mono text-lg font-bold">{data.shortcut}</code>
                            </div>
                        )}
                    </div>
               </div>

               {/* Quiz Card */}
               <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col">
                    <div className="flex items-center gap-2 mb-6 text-zinc-400">
                        <Lightbulb size={18} />
                        <span className="font-bold text-sm">Teste Rápido</span>
                    </div>

                    <p className="text-lg text-white font-medium mb-6">
                        {data.quizQuestion.stem}
                    </p>

                    <div className="space-y-3 flex-1">
                        {data.quizQuestion.options.map((opt, idx) => {
                             const isRevealed = selected !== null;
                             const isCorrect = idx === data.quizQuestion.correctIndex;
                             const isSelected = idx === selected;
                             
                             let styles = "w-full text-left p-4 rounded-lg border border-zinc-800 transition-all hover:bg-zinc-800";
                             if (isRevealed) {
                                 if (isCorrect) styles = "w-full text-left p-4 rounded-lg border border-green-500 bg-green-500/10 text-green-500";
                                 else if (isSelected) styles = "w-full text-left p-4 rounded-lg border border-red-500 bg-red-500/10 text-red-500 opacity-50";
                                 else styles = "w-full text-left p-4 rounded-lg border border-zinc-800 opacity-30";
                             }

                             return (
                                 <button
                                    key={idx}
                                    onClick={() => setSelected(idx)}
                                    disabled={isRevealed}
                                    className={styles}
                                 >
                                    <div className="flex justify-between items-center">
                                        <span>{opt}</span>
                                        {isRevealed && isCorrect && <Check size={18} />}
                                        {isRevealed && isSelected && !isCorrect && <X size={18} />}
                                    </div>
                                 </button>
                             )
                        })}
                    </div>

                    {selected !== null && (
                        <div className="mt-4 p-3 bg-zinc-950 rounded border border-zinc-800 text-sm text-zinc-400 animate-in slide-in-from-top">
                            <span className="font-bold text-white">Explicação:</span> {data.quizQuestion.explanation}
                        </div>
                    )}
               </div>
           </div>
       )}
    </div>
  );
};