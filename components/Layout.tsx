import React, { useState } from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, BookOpen, PenTool, BarChart2, BrainCircuit, User, MoreVertical, FileText, X, Dumbbell, Cpu, Puzzle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (currentView === 'SPLASH' || currentView === 'ONBOARDING') {
    return <>{children}</>;
  }

  const handleNavClick = (view: ViewState) => {
    setView(view);
    setIsMenuOpen(false);
  };

  const NavItem = ({ icon: Icon, label, target, delay }: { icon: any, label: string, target: ViewState, delay: number }) => (
    <button
      onClick={() => handleNavClick(target)}
      style={{ animationDelay: `${delay}ms` }}
      className={`w-full flex items-center gap-4 p-4 rounded-lg font-bold transition-all animate-in slide-in-from-right duration-500 fill-mode-backwards ${
        currentView === target 
          ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' 
          : 'text-zinc-300 hover:bg-zinc-800'
      }`}
    >
      <Icon size={20} className={currentView === target ? "text-black" : "text-gold-500"} />
      <span className="typewriter-text" style={{ width: 'fit-content', animationDuration: '0.5s' }}>
        {label}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-militar-900 text-zinc-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="h-16 border-b border-zinc-800 bg-militar-900/95 backdrop-blur-sm sticky top-0 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('DASHBOARD')}>
           <div className="w-8 h-8 bg-gold-500 rounded-sm flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
              <BrainCircuit className="text-black relative z-10" size={20} />
           </div>
           <h1 className="text-xl font-bold font-mono tracking-tighter text-white hidden md:block">
             CONCURSADOS<span className="text-gold-500 animate-pulse">.AI</span>
           </h1>
        </div>

        <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <User size={16} className="text-zinc-400" />
            </div>
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
            >
                {isMenuOpen ? <X size={24} className="text-gold-500"/> : <MoreVertical size={24} className="text-white"/>}
            </button>
        </div>
      </header>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed top-16 right-0 bottom-0 w-full md:w-80 bg-militar-900/95 backdrop-blur-xl border-l border-zinc-800 z-50 p-4 shadow-2xl overflow-y-auto">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">Navegação Tática</p>
            <div className="space-y-1">
                <NavItem icon={LayoutDashboard} label="Dashboard" target="DASHBOARD" delay={0} />
                <NavItem icon={Dumbbell} label="Treino Físico (TFM)" target="TFM" delay={50} />
                <NavItem icon={BookOpen} label="Plano Alfa" target="PLAN" delay={100} />
                <NavItem icon={BrainCircuit} label="Banco de Questões" target="QUESTIONS" delay={150} />
                <NavItem icon={Puzzle} label="Raciocínio Lógico" target="LOGIC" delay={200} />
                <NavItem icon={Cpu} label="Informática Diária" target="INFORMATICS" delay={250} />
                <NavItem icon={PenTool} label="Redação IA" target="ESSAY" delay={300} />
                <NavItem icon={FileText} label="Biblioteca (PDFs)" target="PDFS" delay={350} />
                <NavItem icon={BarChart2} label="Estatísticas" target="STATS" delay={400} />
            </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};