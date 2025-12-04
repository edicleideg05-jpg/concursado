import React, { useState } from 'react';
import { ViewState, UserProfile } from '../types';
import { LayoutDashboard, BookOpen, PenTool, BarChart2, BrainCircuit, User, MoreVertical, FileText, X, Dumbbell, Cpu, Puzzle, ChevronRight, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  user: UserProfile | null;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (currentView === 'SPLASH' || currentView === 'ONBOARDING') {
    return <>{children}</>;
  }

  const handleNavClick = (view: ViewState) => {
    setView(view);
    setIsMenuOpen(false);
  };

  const NavItem = ({ icon: Icon, label, target, delay }: { icon: any, label: string, target: ViewState, delay: number }) => {
    const isActive = currentView === target;
    return (
        <button
          onClick={() => handleNavClick(target)}
          style={{ animationDelay: `${delay}ms` }}
          className={`w-full flex items-center gap-4 p-4 rounded-lg font-bold transition-all animate-[menuSlideIn_0.4s_ease-out_backwards] hover:bg-zinc-800 group relative overflow-hidden shrink-0 ${
            isActive 
              ? 'bg-gold-500/10 border-r-4 border-gold-500 text-white' 
              : 'text-zinc-400 border-r-4 border-transparent'
          }`}
        >
          {/* Background Highlight on Hover */}
          <div className="absolute inset-0 bg-gold-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>

          <Icon size={20} className={`${isActive ? "text-gold-500" : "text-zinc-500 group-hover:text-gold-400"} transition-colors relative z-10 shrink-0`} />
          
          <div className="relative z-10 flex items-center h-6 overflow-hidden w-full">
            <span 
                className={`typewriter-effect text-sm tracking-wider uppercase ${isActive ? "text-gold-500" : "text-zinc-300"}`}
                style={{ animationDelay: `${delay + 100}ms` }} 
            >
                {label}
            </span>
          </div>
          
          {isActive && <ChevronRight size={16} className="ml-auto text-gold-500 animate-pulse" />}
        </button>
    );
  };

  return (
    <div className="min-h-screen bg-militar-900 text-zinc-100 flex flex-col font-sans selection:bg-gold-500 selection:text-black">
      {/* Top Bar */}
      <header className="h-16 border-b border-zinc-800 bg-militar-900/95 backdrop-blur-md sticky top-0 z-[60] flex items-center justify-between px-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('DASHBOARD')}>
           <div className="w-8 h-8 bg-gold-500 rounded-sm flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <div className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
              <BrainCircuit className="text-black relative z-10" size={20} />
           </div>
           <h1 className="text-xl font-bold font-mono tracking-tighter text-white hidden md:block group-hover:text-gold-500 transition-colors">
             CONCURSADOS<span className="text-gold-500 animate-pulse">.AI</span>
           </h1>
        </div>

        <div className="flex items-center gap-4">
            {user && (
                <div className="hidden md:flex flex-col items-end mr-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{user.name}</span>
                    <span className="text-[10px] text-gold-500 font-mono">Nível {user.level}</span>
                </div>
            )}
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <User size={16} className="text-zinc-400" />
            </div>
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full hover:bg-zinc-800 transition-all duration-300 relative z-50 ${isMenuOpen ? 'rotate-90 bg-gold-500 text-black' : 'text-white'}`}
            >
                {isMenuOpen ? <X size={24}/> : <MoreVertical size={24}/>}
            </button>
        </div>
      </header>

      {/* Backdrop */}
      {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          ></div>
      )}

      {/* Menu Overlay - "Cyberpunk Sidebar" */}
      {isMenuOpen && (
        <div className="fixed top-0 right-0 bottom-0 w-full md:w-[400px] bg-militar-900/95 backdrop-blur-2xl border-l border-gold-500/30 z-[80] shadow-[-20px_0_50px_rgba(0,0,0,0.8)] animate-menu-enter flex flex-col h-full">
            {/* Header do Menu */}
            <div className="p-6 border-b border-zinc-800 bg-zinc-950/50 flex items-center justify-between mt-16 md:mt-0">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-zinc-800 border border-gold-500/50 flex items-center justify-center">
                        <Shield className="text-gold-500" size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Operador</p>
                        <h3 className="text-lg font-bold text-white leading-none">{user?.name || 'Recruta'}</h3>
                        <p className="text-xs text-gold-500 font-mono mt-1">{user?.targetExam || 'Sem Missão'}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                    <span className="text-[10px] text-zinc-600 font-mono">ONLINE</span>
                </div>
            </div>

            {/* Lista Scrollavel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 crt-overlay custom-scrollbar">
                <NavItem icon={LayoutDashboard} label="Dashboard Geral" target="DASHBOARD" delay={50} />
                <NavItem icon={Dumbbell} label="Treino Físico (TFM)" target="TFM" delay={100} />
                <NavItem icon={BookOpen} label="Plano Alfa (Estudos)" target="PLAN" delay={150} />
                <NavItem icon={BrainCircuit} label="Banco de Questões" target="QUESTIONS" delay={200} />
                <NavItem icon={Puzzle} label="Raciocínio Lógico" target="LOGIC" delay={250} />
                <NavItem icon={Cpu} label="Informática Tática" target="INFORMATICS" delay={300} />
                <NavItem icon={PenTool} label="Redação Inteligente" target="ESSAY" delay={350} />
                <NavItem icon={FileText} label="Biblioteca de Provas" target="PDFS" delay={400} />
                <NavItem icon={BarChart2} label="Relatório de Campanha" target="STATS" delay={450} />
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-zinc-800 bg-black/40 text-center">
                <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest mb-1">
                    Concursados AI • v1.2
                </p>
                <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-500/30 w-1/2 animate-[shimmer_2s_infinite_linear]"></div>
                </div>
            </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-7xl mx-auto w-full relative z-0">
        {children}
      </main>
    </div>
  );
};