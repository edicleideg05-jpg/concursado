import React, { useState, useEffect } from 'react';
import { UserProfile, ViewState, UserStats } from '../types';
import { Trophy, Target, TrendingUp, Calendar, Zap, AlertCircle, Download } from 'lucide-react';
import { db } from '../services/storage';

interface DashboardProps {
  user: UserProfile;
  setView: (view: ViewState) => void;
}

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-${color}-500/20`}></div>
    <div className={`p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-${color}-500`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-mono font-bold text-white">{value}</p>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ user, setView }) => {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    // Carregar stats do banco
    const data = db.getStats();
    setStats(data);
  }, []);

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold text-white">Olá, {user.name}</h2>
            <p className="text-zinc-400">Objetivo: <span className="text-gold-500 font-bold">{user.targetExam}</span></p>
        </div>
        <button 
            onClick={() => setView('SESSION')}
            className="bg-gold-500 hover:bg-gold-600 text-black font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors self-start"
        >
            <Zap size={18} /> Estudo Rápido
        </button>
      </div>

      {/* Stats Grid - DADOS DO BANCO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Download} label="PDFs Baixados" value={stats.pdfsDownloaded} color="gold" />
        <StatCard icon={Trophy} label="XP Acumulado" value={stats.xp} color="blue" />
        <StatCard icon={TrendingUp} label="Questões" value={stats.questionsAnswered} color="green" />
        <StatCard icon={Calendar} label="Dias Seguidos" value={stats.streak} color="purple" />
      </div>

      {/* Main Action Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Next Mission */}
        <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 relative flex flex-col justify-center items-center text-center">
            <div className="mb-4">
                 <AlertCircle size={48} className="text-zinc-700 mx-auto mb-2"/>
                 <h3 className="text-lg font-bold text-white">Próxima Missão</h3>
                 <p className="text-zinc-500 text-sm">Gere seu plano de estudos para continuar evoluindo.</p>
            </div>
            
            <button onClick={() => setView('PLAN')} className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-black rounded-lg text-sm font-bold transition-colors shadow-lg shadow-gold-500/20">
                GERAR PLANO ALFA
            </button>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
            <div 
                onClick={() => setView('PDFS')}
                className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl cursor-pointer hover:bg-zinc-800 transition-colors group"
            >
                <div className="w-12 h-12 bg-zinc-950 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Download className="text-gold-500" />
                </div>
                <h3 className="font-bold text-lg">Biblioteca PDF</h3>
                <p className="text-zinc-500 text-sm">Baixe provas reais.</p>
            </div>

            <div 
                onClick={() => setView('ESSAY')}
                className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl cursor-pointer hover:bg-zinc-800 transition-colors group"
            >
                <div className="w-12 h-12 bg-zinc-950 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <TrendingUp className="text-blue-500" />
                </div>
                <h3 className="font-bold text-lg">Correção IA</h3>
                <p className="text-zinc-500 text-sm">Envie sua redação.</p>
            </div>
        </div>
      </div>
    </div>
  );
};