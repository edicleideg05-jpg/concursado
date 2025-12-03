import React, { useState, useEffect } from 'react';
import { Dumbbell, Smile, Frown, Meh, Battery, Utensils, Zap, Shield, Swords, Activity, ChefHat, Info } from 'lucide-react';
import { db } from '../services/storage';
import { generateRecipe } from '../services/geminiService';
import { Recipe, TfmRecord } from '../types';

export const TFM: React.FC = () => {
  const [km, setKm] = useState(0);
  const [workoutDone, setWorkoutDone] = useState(false);
  const [mood, setMood] = useState<TfmRecord['mood']>('neutro');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);

  useEffect(() => {
    const today = db.getTfmToday();
    if (today) {
        setKm(today.runKm);
        setWorkoutDone(today.workoutDone);
        setMood(today.mood);
    }
  }, []);

  const handleSave = () => {
    const record: TfmRecord = {
        date: new Date().toISOString().split('T')[0],
        mood,
        workoutDone,
        runKm: km
    };
    db.saveTfmRecord(record);
    alert('Progresso TFM salvo! Continue firme.');
  };

  const handleGetRecipe = async () => {
    setLoadingRecipe(true);
    const result = await generateRecipe("Acelerar recuperação muscular e explosão para corrida");
    setRecipe(result);
    setLoadingRecipe(false);
  };

  const CombatCard = ({ title, type, desc, howTo, image }: { title: string, type: string, desc: string, howTo: string, image: string }) => (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group hover:border-gold-500 transition-all flex flex-col h-full">
          <div className="h-48 relative overflow-hidden">
              <img src={image} alt={title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-110 transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-black/50 backdrop-blur-sm ${type === 'boxe' ? 'text-red-500 border border-red-500/30' : 'text-blue-500 border border-blue-500/30'}`}>
                    {type.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 drop-shadow-md">{title}</h3>
              </div>
          </div>
          <div className="p-4 flex flex-col flex-1">
              <p className="text-zinc-400 text-sm mb-4 border-b border-zinc-800 pb-2">{desc}</p>
              
              <div className="mt-auto">
                <span className="text-xs font-bold text-gold-500 uppercase flex items-center gap-1 mb-1">
                    <Info size={12} /> Aplicação Tática
                </span>
                <p className="text-xs text-zinc-500 italic">
                    {howTo}
                </p>
              </div>
          </div>
      </div>
  );

  return (
    <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Dumbbell className="text-gold-500" /> TFM - Treinamento Físico
                </h2>
                <p className="text-zinc-400 text-sm">Mens sana in corpore sano. Prepare-se para o TAF.</p>
            </div>
        </div>

        {/* Tracker Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Humor Tracker */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Activity size={18} className="text-blue-500"/> Estado Mental</h3>
                <div className="flex justify-between mt-4">
                    {[
                        { val: 'feliz', icon: Smile, color: 'text-green-500' },
                        { val: 'neutro', icon: Meh, color: 'text-yellow-500' },
                        { val: 'cansado', icon: Battery, color: 'text-orange-500' },
                        { val: 'triste', icon: Frown, color: 'text-red-500' }
                    ].map((m) => (
                        <button 
                            key={m.val}
                            onClick={() => setMood(m.val as any)}
                            className={`p-3 rounded-xl border ${mood === m.val ? `border-${m.color.split('-')[1]}-500 bg-zinc-800` : 'border-transparent hover:bg-zinc-800'}`}
                        >
                            <m.icon className={`${m.color}`} size={32} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Run Tracker */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                 <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Zap size={18} className="text-gold-500"/> Corrida (KM)</h3>
                 <div className="flex items-center gap-4">
                     <button onClick={() => setKm(Math.max(0, km - 0.5))} className="w-10 h-10 rounded-full bg-zinc-800 text-white font-bold">-</button>
                     <span className="text-4xl font-mono font-bold text-white">{km.toFixed(1)}</span>
                     <button onClick={() => setKm(km + 0.5)} className="w-10 h-10 rounded-full bg-gold-500 text-black font-bold">+</button>
                 </div>
            </div>

             {/* Workout Check */}
             <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
                 <h3 className="font-bold text-white mb-2">Treino do Dia</h3>
                 <button 
                    onClick={() => {
                        setWorkoutDone(!workoutDone);
                        if (!workoutDone) handleSave(); // Auto save on check
                    }}
                    className={`w-full py-4 rounded-xl font-bold transition-all ${workoutDone ? 'bg-green-500 text-black' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'}`}
                 >
                    {workoutDone ? 'MISSÃO CUMPRIDA' : 'MARCAR COMO FEITO'}
                 </button>
            </div>
        </div>

        {/* Self Defense Section */}
        <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="text-red-500" /> Defesa Pessoal & Combate
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <CombatCard 
                    title="Jab-Direto" 
                    type="boxe" 
                    image="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=500&auto=format&fit=crop"
                    desc="Combinação fundamental de golpes retos para manter distância."
                    howTo="Mão da frente estica rápido (Jab). Ao recolher, gira o quadril e lança a mão de trás (Direto). Queixo sempre protegido."
                />
                <CombatCard 
                    title="Mata-Leão" 
                    type="jiu-jitsu" 
                    image="https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=500&auto=format&fit=crop"
                    desc="Estrangulamento sanguíneo pelas costas."
                    howTo="Encaixe o braço no pescoço do oponente (bíceps na carótida). Mão no bíceps oposto. Mão livre atrás da cabeça. Aperte e infle o peito."
                />
                <CombatCard 
                    title="Esquiva Lateral" 
                    type="boxe" 
                    image="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=500&auto=format&fit=crop"
                    desc="Movimento de tronco para sair da linha de ataque."
                    howTo="Flexione levemente os joelhos e mova o tronco para a diagonal externa do golpe vindo. Mantenha os olhos no adversário."
                />
                <CombatCard 
                    title="Armlock" 
                    type="jiu-jitsu" 
                    image="https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?q=80&w=500&auto=format&fit=crop"
                    desc="Chave de braço hiperextendendo o cotovelo."
                    howTo="Isole o braço. Passe a perna sobre a cabeça. Aperte os joelhos. Levante o quadril segurando o punho do oponente (polegar para cima)."
                />
            </div>
        </div>

        {/* Nutrition Section */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="flex flex-col md:flex-row gap-8 relative z-10">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <ChefHat className="text-green-500" /> Nutrição de Combate
                    </h3>
                    <p className="text-zinc-400 mb-6">A IA gera receitas personalizadas para acelerar seu metabolismo e performance.</p>
                    
                    <button 
                        onClick={handleGetRecipe}
                        disabled={loadingRecipe}
                        className="bg-white hover:bg-zinc-200 text-black font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {loadingRecipe ? 'GERANDO...' : 'GERAR NOVA RECEITA'} <Utensils size={18} />
                    </button>
                </div>

                {recipe && (
                    <div className="flex-1 bg-zinc-950 border border-zinc-800 p-6 rounded-xl animate-in slide-in-from-right">
                        <h4 className="text-lg font-bold text-gold-500 mb-2">{recipe.name}</h4>
                        <div className="mb-4">
                            <span className="text-xs font-bold uppercase text-zinc-500">Benefício</span>
                            <p className="text-sm text-zinc-300">{recipe.benefits}</p>
                        </div>
                        <div className="mb-4">
                            <span className="text-xs font-bold uppercase text-zinc-500">Ingredientes</span>
                            <ul className="text-sm text-zinc-300 list-disc pl-4">
                                {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                            </ul>
                        </div>
                        <div>
                             <span className="text-xs font-bold uppercase text-zinc-500">Preparo</span>
                             <p className="text-sm text-zinc-300">{recipe.instructions}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};