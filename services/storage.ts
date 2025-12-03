import { UserProfile, UserStats, TfmRecord } from '../types';

const DB_KEY = 'concursados_db_v2';

interface DatabaseSchema {
  user: UserProfile | null;
  stats: UserStats;
  downloadHistory: string[]; // IDs of downloaded PDFs
  tfmHistory: TfmRecord[]; // Historico físico
}

const initialStats: UserStats = {
  xp: 0,
  streak: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  essaysSubmitted: 0,
  pdfsDownloaded: 0,
  studyHours: [0, 0, 0, 0, 0, 0, 0], // Seg a Dom
};

const getDB = (): DatabaseSchema => {
  const stored = localStorage.getItem(DB_KEY);
  if (!stored) {
    return {
      user: null,
      stats: initialStats,
      downloadHistory: [],
      tfmHistory: []
    };
  }
  return JSON.parse(stored);
};

const saveDB = (data: DatabaseSchema) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

export const db = {
  // User Profile
  getUser: (): UserProfile | null => {
    return getDB().user;
  },
  saveUser: (user: UserProfile) => {
    const data = getDB();
    data.user = user;
    saveDB(data);
  },

  // Stats
  getStats: (): UserStats => {
    return getDB().stats;
  },
  addXp: (amount: number) => {
    const data = getDB();
    data.stats.xp += amount;
    saveDB(data);
    return data.stats;
  },
  registerDownload: (pdfId: string) => {
    const data = getDB();
    if (!data.downloadHistory.includes(pdfId)) {
        data.downloadHistory.push(pdfId);
        data.stats.pdfsDownloaded += 1;
        data.stats.xp += 50; // 50 XP por download
        saveDB(data);
    }
  },

  // TFM
  saveTfmRecord: (record: TfmRecord) => {
      const data = getDB();
      // Remove entry if exists for today to update
      data.tfmHistory = data.tfmHistory.filter(r => r.date !== record.date);
      data.tfmHistory.push(record);
      // Give XP for workout
      if (record.workoutDone) data.stats.xp += 100;
      saveDB(data);
  },
  getTfmToday: (): TfmRecord | undefined => {
      const today = new Date().toISOString().split('T')[0];
      return getDB().tfmHistory.find(r => r.date === today);
  },
  
  // Reset (Dev only)
  reset: () => {
    localStorage.removeItem(DB_KEY);
  }
};