import React, { useState, useEffect } from 'react';
import { UserProfile, StudyPlan as IStudyPlan } from '../types';
import { generateStudyPlan } from '../services/geminiService';
import { Calendar, RefreshCw, CheckCircle, Circle, Play, Loader2 } from 'lucide-react';

interface StudyPlanProps {
  user: UserProfile;
  startSession: (topic: string, subject: string) => void;
}

export const StudyPlan: React.FC<StudyPlanProps> = ({ user, startSession }) => {
  const [plan, setPlan] = useState<IStudyPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const loadPlan = async () => {
    setLoading(true);
    const newPlan = await generateStudyPlan(user.targetExam, user.dailyHours, user.level);
    setPlan(newPlan);
    setLoading(false);
  };

  useEffect(() => {
    if (!plan) loadPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="text-gold-500" /> Plano Alfa
            </h2>
            <p className="text-zinc-400 text-sm">Estratégia gerada para: {user.targetExam}</p>
        </div>
        <button 
            onClick={loadPlan} 
            disabled={loading}
            className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
        >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading && !plan ? (
         <div className="h-64 flex flex-col items-center justify-center text-zinc-500">
            <Loader2 size={48} className="animate-spin text-gold-500 mb-4" />
            <p>A Inteligência Artificial está traçando a rota...</p>
         </div>
      ) : plan ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 text-white border-b border-zinc-800 pb-4">{plan.day}</h3>
            <div className="space-y-4">
                {plan.tasks.map((task, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center justify-between bg-zinc-950 p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${task.type === 'questions' ? 'bg-blue-500/10 text-blue-500' : 'bg-gold-500/10 text-gold-500'}`}>
                                {task.completed ? <CheckCircle /> : <Circle />}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-lg">{task.subject}</h4>
                                <p className="text-zinc-400">{task.topic}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-zinc-500 bg-zinc-900 px-3 py-1 rounded text-sm">{task.durationMinutes} min</span>
                            <span className="text-xs font-bold uppercase tracking-wider bg-zinc-800 px-2 py-1 rounded text-zinc-300">{task.type}</span>
                            <button 
                                onClick={() => startSession(task.topic, task.subject)}
                                className="bg-white text-black hover:bg-zinc-200 p-3 rounded-lg transition-colors"
                            >
                                <Play size={20} fill="black" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      ) : null}
    </div>
  );
};