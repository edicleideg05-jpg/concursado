import React, { useState } from 'react';
import { correctEssay } from '../services/geminiService';
import { EssayCorrection } from '../types';
import { FileText, Send, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export const Essay: React.FC = () => {
  const [text, setText] = useState('');
  const [theme, setTheme] = useState('');
  const [result, setResult] = useState<EssayCorrection | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text || !theme) return;
    setLoading(true);
    const correction = await correctEssay(text, theme);
    setResult(correction);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Input Area */}
      <div className="flex flex-col gap-4 h-full">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
             <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Tema da Redação</label>
             <input 
                type="text" 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Ex: O papel da tecnologia na segurança pública"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
             />
        </div>
        
        <textarea 
            className="flex-1 w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-zinc-300 resize-none focus:border-gold-500 outline-none leading-relaxed"
            placeholder="Comece a escrever sua redação aqui..."
            value={text}
            onChange={(e) => setText(e.target.value)}
        />
        
        <button 
            onClick={handleSubmit}
            disabled={loading || !text || !theme}
            className="bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
        >
            {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> ENVIAR PARA CORREÇÃO</>}
        </button>
      </div>

      {/* Result Area */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 overflow-y-auto">
        {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-50">
                <FileText size={64} className="mb-4" strokeWidth={1} />
                <p>Aguardando envio...</p>
            </div>
        )}

        {loading && (
             <div className="h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gold-500 font-mono animate-pulse">ANALISANDO SINTAXE...</p>
            </div>
        )}

        {result && (
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div>
                        <h3 className="text-zinc-400 text-sm uppercase font-bold">Nota Final</h3>
                        <p className={`text-4xl font-mono font-bold ${result.score >= 800 ? 'text-green-500' : result.score >= 600 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {result.score}
                            <span className="text-sm text-zinc-600 ml-1">/1000</span>
                        </p>
                    </div>
                    <div className="p-3 bg-zinc-950 rounded-lg">
                        <CheckCircle2 size={32} className={result.score >= 700 ? "text-green-500" : "text-yellow-500"} />
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-2">Parecer da Banca</h4>
                    <p className="text-zinc-300 text-sm leading-relaxed bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                        {result.feedback}
                    </p>
                </div>

                {result.grammarErrors.length > 0 && (
                     <div>
                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                            <AlertTriangle size={16} className="text-red-500" /> Pontos de Atenção
                        </h4>
                        <ul className="space-y-2">
                            {result.grammarErrors.map((err, idx) => (
                                <li key={idx} className="text-xs text-red-400 bg-red-500/5 p-2 rounded border border-red-500/10">
                                    {err}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div>
                    <h4 className="font-bold text-gold-500 mb-2">Sugestão de Estrutura</h4>
                    <p className="text-zinc-400 text-sm italic">
                        {result.structureSuggestions}
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};