export interface UserProfile {
  name: string;
  targetExam: string; // e.g., "ESA", "PM-SP", "Banco do Brasil"
  dailyHours: number;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
}

export interface UserStats {
  xp: number;
  streak: number;
  questionsAnswered: number;
  correctAnswers: number;
  essaysSubmitted: number;
  pdfsDownloaded: number;
  studyHours: number[]; // Array de 7 dias
}

export interface TfmRecord {
  date: string;
  mood: 'feliz' | 'neutro' | 'triste' | 'cansado';
  workoutDone: boolean;
  runKm: number;
}

export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string;
  benefits: string; // Por que acelera o treino
}

export interface StudyTask {
  subject: string;
  topic: string;
  durationMinutes: number;
  type: 'theory' | 'questions' | 'revision';
  completed: boolean;
}

export interface StudyPlan {
  day: string;
  tasks: StudyTask[];
}

export interface Question {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Pegadinha';
}

export interface EssayCorrection {
  score: number;
  feedback: string;
  grammarErrors: string[];
  structureSuggestions: string;
}

export interface PdfFile {
  id: string;
  title: string;
  year: string;
  exam: string;
  size: string;
  url: string; // Link real
}

export interface LogicChallenge {
  title: string;
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface InformaticsDaily {
  topic: string;
  tip: string;
  shortcut?: string;
  quizQuestion: Question;
}

export type ViewState = 
  | 'SPLASH' 
  | 'ONBOARDING' 
  | 'DASHBOARD' 
  | 'PLAN' 
  | 'SESSION' 
  | 'QUESTIONS' 
  | 'ESSAY' 
  | 'STATS'
  | 'PDFS'
  | 'TFM'
  | 'LOGIC'
  | 'INFORMATICS';