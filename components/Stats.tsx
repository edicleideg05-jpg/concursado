import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity } from 'lucide-react';
import { db } from '../services/storage';

export const Stats: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Transformar dados do banco para o gráfico
    const stats = db.getStats();
    
    // Simulação de dados semanais baseados no stats (para demo, já que só temos o total no exemplo simples)
    // Em um app real, o DB armazenaria histórico diário.
    const chartData = [
      { name: 'Seg', horas: stats.studyHours[0], xp: Math.floor(stats.xp * 0.1) },
      { name: 'Ter', horas: stats.studyHours[1], xp: Math.floor(stats.xp * 0.15) },
      { name: 'Qua', horas: stats.studyHours[2], xp: Math.floor(stats.xp * 0.2) },
      { name: 'Qui', horas: stats.studyHours[3], xp: Math.floor(stats.xp * 0.05) },
      { name: 'Sex', horas: stats.studyHours[4], xp: Math.floor(stats.xp * 0.25) },
      { name: 'Sab', horas: stats.studyHours[5], xp: Math.floor(stats.xp * 0.15) },
      { name: 'Dom', horas: stats.studyHours[6], xp: Math.floor(stats.xp * 0.1) },
    ];
    setData(chartData);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Activity className="text-gold-500" /> Relatório de Campanha
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Hours Chart */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-6 text-zinc-300">Tempo de Estudo (Horas)</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="name" stroke="#71717a" />
                        <YAxis stroke="#71717a" domain={[0, 5]} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                            itemStyle={{ color: '#eab308' }}
                        />
                        <Bar dataKey="horas" fill="#eab308" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* XP Chart */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-6 text-zinc-300">Evolução de XP</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="name" stroke="#71717a" />
                        <YAxis stroke="#71717a" />
                        <Tooltip 
                             contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                             itemStyle={{ color: '#3b82f6' }}
                        />
                        <Line type="monotone" dataKey="xp" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
      
      {/* Weakness Analysis */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
        <h3 className="font-bold text-white mb-4">Análise de Pontos Fracos</h3>
        {data.every(d => d.xp === 0) ? (
            <p className="text-zinc-500 text-sm italic">Dados insuficientes para análise. Realize downloads ou questões para gerar métricas.</p>
        ) : (
             <p className="text-zinc-300 text-sm">Baseado no seu histórico, recomendamos reforçar os estudos nos finais de semana para aumentar a consistência.</p>
        )}
      </div>
    </div>
  );
};