import React, { useState, useEffect } from 'react';
import { ViewState, UserProfile } from './types';
import { Layout } from './components/Layout';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { StudyPlan } from './components/StudyPlan';
import { StudySession } from './components/StudySession';
import { QuestionBank } from './components/QuestionBank';
import { Essay } from './components/Essay';
import { Stats } from './components/Stats';
import { PdfLibrary } from './components/PdfLibrary';
import { TFM } from './components/TFM';
import { LogicLab } from './components/LogicLab';
import { Informatics } from './components/Informatics';
import { BrainCircuit } from 'lucide-react';
import { db } from './services/storage';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('SPLASH');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sessionData, setSessionData] = useState<{subject: string, topic: string} | null>(null);

  useEffect(() => {
    // Check local storage for existing user
    const savedUser = db.getUser();
    
    if (view === 'SPLASH') {
      const timer = setTimeout(() => {
        if (savedUser) {
            setUser(savedUser);
            setView('DASHBOARD');
        } else {
            setView('ONBOARDING');
        }
      }, 3000); // Increased splash time slightly for effect
      return () => clearTimeout(timer);
    }
  }, [view]);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUser(profile);
    db.saveUser(profile); // Save to DB
    setView('DASHBOARD');
  };

  const startSession = (topic: string, subject: string) => {
    setSessionData({ topic, subject });
    setView('SESSION');
  };

  const exitSession = () => {
    setSessionData(null);
    setView('PLAN');
  };

  // --- SPLASH SCREEN RENDER ---
  if (view === 'SPLASH') {
    return (
      <div className="min-h-screen bg-militar-900 flex flex-col items-center justify-center text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-militar-900 to-black opacity-80"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        
        <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-gold-500 blur-[60px] opacity-20 rounded-full animate-pulse-fast"></div>
                
                {/* Center Icon */}
                <div className="relative z-10 transform transition-transform duration-700 hover:scale-110">
                    <BrainCircuit size={80} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                </div>
                
                {/* Rotating Rings */}
                <div className="absolute inset-[-30px] border border-zinc-700/30 rounded-full w-[140px] h-[140px] animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-[-40px] border-2 border-transparent border-t-gold-500/50 border-r-gold-500/50 rounded-full w-[160px] h-[160px] animate-[spin_3s_linear_infinite]"></div>
                <div className="absolute inset-[-50px] border border-zinc-700/30 rounded-full w-[180px] h-[180px] animate-[spin_15s_linear_infinite_reverse]"></div>
            </div>
            
            <h1 className="text-5xl font-mono font-bold tracking-[0.2em] text-white mb-2 glitch-effect">
                CONCURSADOS<span className="text-gold-500">.AI</span>
            </h1>
            
            <div className="flex items-center gap-2">
                <div className="h-1 w-2 bg-gold-500 animate-pulse"></div>
                <p className="text-zinc-500 font-mono text-sm tracking-[0.5em] uppercase typewriter-text" style={{borderRight: 'none'}}>
                    Preparação Tática Avançada
                </p>
                <div className="h-1 w-2 bg-gold-500 animate-pulse"></div>
            </div>
        </div>

        {/* Loading Bar */}
        <div className="absolute bottom-20 w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gold-500 animate-[width_2.5s_ease-in-out_infinite]" style={{width: '30%'}}></div>
        </div>
      </div>
    );
  }

  return (
    <Layout currentView={view} setView={setView}>
      {view === 'ONBOARDING' && <Onboarding onComplete={handleOnboardingComplete} />}
      
      {view === 'DASHBOARD' && user && (
        <Dashboard user={user} setView={setView} />
      )}

      {view === 'PLAN' && user && (
        <StudyPlan user={user} startSession={startSession} />
      )}

      {view === 'SESSION' && sessionData && (
        <StudySession subject={sessionData.subject} topic={sessionData.topic} onExit={exitSession} />
      )}

      {view === 'QUESTIONS' && <QuestionBank />}
      
      {view === 'ESSAY' && <Essay />}
      
      {view === 'STATS' && <Stats />}

      {view === 'PDFS' && <PdfLibrary />}

      {view === 'TFM' && <TFM />}

      {view === 'LOGIC' && <LogicLab />}

      {view === 'INFORMATICS' && <Informatics />}
    </Layout>
  );
};

export default App;