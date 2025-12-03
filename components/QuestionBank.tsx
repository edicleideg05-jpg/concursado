import React, { useState } from 'react';
import { generateQuestions } from '../services/geminiService';
import { Question } from '../types';
import { Check, X, AlertCircle, ArrowRight, Loader2, BrainCircuit } from 'lucide-react';

export const QuestionBank: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleStart = async () => {
    if (!topic) return;
    setLoading(true);
    const qs = await generateQuestions("Geral", topic);
    setQuestions(qs);
    setLoading(false);
    setCurrentQIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
    if (index === questions[currentQIndex].correctIndex) {
        setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(currentQIndex + 1);
        setShowResult(false);
        setSelectedOption(null);
    } else {
        // Finish
        setQuestions([]); // Reset for demo simplicity, or show summary screen
    }
  };

  if (loading) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center">
            <Loader2 className="animate-spin text-gold-500 mb-4" size={48} />
            <p className="text-xl font-bold">Gerando Simulado...</p>
            <p className="text-zinc-500">Acessando banco de dados de provas passadas.</p>
        </div>
    );
  }

  if (questions.length === 0) {
    return (
        <div className="max-w-xl mx-auto mt-10">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center">
                <BrainCircuit size={48} className="mx-auto text-gold-500 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Banco de Questões</h2>
                <p className="text-zinc-400 mb-6">Escolha um tópico e a IA gerará questões exclusivas.</p>
                
                <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Direito Constitucional, Crase, Regra de Três..."
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-lg text-white mb-4 focus:border-gold-500 outline-none"
                />
                <button 
                    onClick={handleStart}
                    disabled={!topic}
                    className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-lg transition-colors disabled:opacity-50"
                >
                    GERAR QUESTÕES
                </button>
            </div>
        </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center text-sm text-zinc-500 font-mono">
            <span>QUESTÃO {currentQIndex + 1}/{questions.length}</span>
            <span className={`px-2 py-1 rounded border ${currentQ.difficulty === 'Difícil' ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}>
                {currentQ.difficulty.toUpperCase()}
            </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
            <p className="text-xl text-white font-medium leading-relaxed mb-8">
                {currentQ.stem}
            </p>

            <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                    let btnClass = "w-full text-left p-4 rounded-xl border border-zinc-800 transition-all hover:bg-zinc-800 flex justify-between items-center ";
                    
                    if (showResult) {
                        if (idx === currentQ.correctIndex) {
                            btnClass = "w-full text-left p-4 rounded-xl border border-green-500 bg-green-500/10 text-green-500 flex justify-between items-center";
                        } else if (idx === selectedOption) {
                            btnClass = "w-full text-left p-4 rounded-xl border border-red-500 bg-red-500/10 text-red-500 flex justify-between items-center";
                        } else {
                            btnClass += " opacity-50";
                        }
                    } else if (selectedOption === idx) {
                        btnClass = "w-full text-left p-4 rounded-xl border border-gold-500 bg-zinc-800 flex justify-between items-center";
                    }

                    return (
                        <button 
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={showResult}
                            className={btnClass}
                        >
                            <span className="flex items-center gap-3">
                                <span className="font-mono font-bold text-sm bg-zinc-950 w-6 h-6 flex items-center justify-center rounded text-zinc-400">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                {option}
                            </span>
                            {showResult && idx === currentQ.correctIndex && <Check size={20} />}
                            {showResult && idx === selectedOption && idx !== currentQ.correctIndex && <X size={20} />}
                        </button>
                    )
                })}
            </div>

            {showResult && (
                <div className="mt-8 animate-in slide-in-from-bottom duration-300">
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-6">
                        <p className="font-bold text-blue-400 mb-1 flex items-center gap-2">
                            <AlertCircle size={18} /> Explicação
                        </p>
                        <p className="text-zinc-300 text-sm leading-relaxed">
                            {currentQ.explanation}
                        </p>
                    </div>
                    <button 
                        onClick={nextQuestion}
                        className="w-full bg-gold-500 hover:bg-gold-600 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        {currentQIndex < questions.length - 1 ? 'PRÓXIMA QUESTÃO' : 'FINALIZAR'} <ArrowRight size={18} />
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};