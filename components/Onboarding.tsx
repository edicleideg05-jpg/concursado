import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ShieldCheck, Target, Clock, ChevronRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [targetExam, setTargetExam] = useState('');
  const [dailyHours, setDailyHours] = useState(2);
  const [level, setLevel] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Iniciante');

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      onComplete({ name, targetExam, dailyHours, level });
    }
  };

  return (
    <div className="min-h-screen bg-militar-900 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-zinc-700 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full z-10">
        <div className="mb-8 text-center">
            <ShieldCheck size={48} className="text-gold-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold font-mono tracking-tighter">RECRUTAMENTO</h2>
            <p className="text-zinc-400 mt-2">Configure seu perfil tático.</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl shadow-xl">
            {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
                    <label className="block">
                        <span className="text-xs font-bold uppercase text-gold-500 tracking-wider">Identificação</span>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Seu Nome de Guerra"
                            className="w-full mt-2 bg-zinc-950 border border-zinc-800 p-4 rounded-lg focus:border-gold-500 focus:outline-none text-lg"
                        />
                    </label>
                     <label className="block">
                        <span className="text-xs font-bold uppercase text-gold-500 tracking-wider">Alvo da Missão</span>
                        <select 
                            value={targetExam}
                            onChange={(e) => setTargetExam(e.target.value)}
                            className="w-full mt-2 bg-zinc-950 border border-zinc-800 p-4 rounded-lg focus:border-gold-500 focus:outline-none text-lg"
                        >
                            <option value="">Selecione o Concurso</option>
                            <option value="ESA">ESA (Sargento)</option>
                            <option value="EsPCEx">EsPCEx (Oficial)</option>
                            <option value="PM-SP">Polícia Militar</option>
                            <option value="PF">Polícia Federal</option>
                            <option value="ENEM">ENEM</option>
                            <option value="Banco do Brasil">Banco do Brasil</option>
                        </select>
                    </label>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                    <div>
                         <span className="text-xs font-bold uppercase text-gold-500 tracking-wider flex items-center gap-2 mb-4">
                            <Clock size={14}/> Disponibilidade Diária
                         </span>
                         <input 
                            type="range" 
                            min="1" 
                            max="12" 
                            value={dailyHours}
                            onChange={(e) => setDailyHours(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
                        />
                        <div className="text-center mt-2 font-mono text-2xl font-bold text-gold-400">{dailyHours} Horas</div>
                    </div>

                    <div>
                        <span className="text-xs font-bold uppercase text-gold-500 tracking-wider flex items-center gap-2 mb-4">
                            <Target size={14}/> Nível Atual
                         </span>
                         <div className="grid grid-cols-3 gap-2">
                             {(['Iniciante', 'Intermediário', 'Avançado'] as const).map((l) => (
                                 <button
                                    key={l}
                                    onClick={() => setLevel(l)}
                                    className={`p-2 rounded-lg text-sm font-bold border ${level === l ? 'bg-gold-500 text-black border-gold-500' : 'bg-zinc-950 border-zinc-800 text-zinc-400'}`}
                                 >
                                    {l}
                                 </button>
                             ))}
                         </div>
                    </div>
                </div>
            )}

             {step === 3 && (
                <div className="text-center animate-in fade-in slide-in-from-right duration-500 space-y-4">
                    <p className="text-lg">Soldado <strong>{name}</strong>, confirme seus dados.</p>
                    <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-left space-y-2 font-mono text-sm">
                        <div className="flex justify-between"><span>Alvo:</span> <span className="text-gold-500">{targetExam}</span></div>
                        <div className="flex justify-between"><span>Tempo:</span> <span className="text-gold-500">{dailyHours}h/dia</span></div>
                        <div className="flex justify-between"><span>Nível:</span> <span className="text-gold-500">{level}</span></div>
                    </div>
                    <p className="text-zinc-500 text-sm">A Inteligência Artificial irá gerar sua estratégia agora.</p>
                </div>
            )}
            
            <button 
                onClick={handleNext}
                disabled={step === 1 && (!name || !targetExam)}
                className="w-full mt-8 bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {step === 3 ? 'INICIAR OPERAÇÃO' : 'PRÓXIMO'} <ChevronRight size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};