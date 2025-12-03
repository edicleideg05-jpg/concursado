import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StudyPlan, Question, EssayCorrection, Recipe, LogicChallenge, InformaticsDaily } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";

// --- STUDY PLAN GENERATION ---

export const generateStudyPlan = async (
  targetExam: string,
  hours: number,
  level: string
): Promise<StudyPlan> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      day: { type: Type.STRING },
      tasks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            topic: { type: Type.STRING },
            durationMinutes: { type: Type.INTEGER },
            type: { type: Type.STRING, enum: ["theory", "questions", "revision"] },
            completed: { type: Type.BOOLEAN },
          },
          required: ["subject", "topic", "durationMinutes", "type", "completed"],
        },
      },
    },
    required: ["day", "tasks"],
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Gere um plano de estudos de 1 dia para o concurso ${targetExam}. 
      O aluno tem ${hours} horas disponíveis e está no nível ${level}.
      Divida o tempo em blocos lógicos. O campo 'completed' deve ser false.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "Você é um mentor militar experiente. Crie planos táticos e diretos.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    return JSON.parse(text) as StudyPlan;
  } catch (error) {
    console.error("Error generating plan:", error);
    // Fallback Mock
    return {
      day: "Plano de Contingência (Offline)",
      tasks: [
        { subject: "Português", topic: "Crase e Regência", durationMinutes: 45, type: "theory", completed: false },
        { subject: "Matemática", topic: "Logaritmos", durationMinutes: 45, type: "questions", completed: false },
      ],
    };
  }
};

// --- QUESTION GENERATION (10 Items + Pegadinhas) ---

export const generateQuestions = async (targetExam: string, topic: string): Promise<Question[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        stem: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctIndex: { type: Type.INTEGER },
        explanation: { type: Type.STRING },
        difficulty: { type: Type.STRING, enum: ["Fácil", "Médio", "Difícil", "Pegadinha"] },
      },
      required: ["id", "stem", "options", "correctIndex", "explanation", "difficulty"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Gere 10 questões de múltipla escolha estilo ${targetExam} sobre o tema: ${topic || "Geral"}.
      REGRA IMPORTANTE: Exatamente 2 das 10 questões DEVEM ser 'Pegadinhas' (questões que parecem óbvias mas têm um detalhe traiçoeiro). Marque a difficulty delas como 'Pegadinha'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No text returned");
    return JSON.parse(text) as Question[];
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
};

// --- LOGIC CHALLENGE ---

export const generateLogicChallenge = async (): Promise<LogicChallenge> => {
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        scenario: { type: Type.STRING },
        question: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctIndex: { type: Type.INTEGER },
        explanation: { type: Type.STRING },
      },
      required: ["title", "scenario", "question", "options", "correctIndex", "explanation"],
    };
  
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Gere um desafio de Raciocínio Lógico Matemático difícil, estilo concurso PF ou ABIN.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });
      const text = response.text;
      if (!text) throw new Error("No text returned");
      return JSON.parse(text) as LogicChallenge;
    } catch (error) {
        return {
            title: "Erro na Matriz",
            scenario: "Sem conexão.",
            question: "Tente novamente.",
            options: ["Ok"],
            correctIndex: 0,
            explanation: "Erro"
        }
    }
};

// --- INFORMATICS DAILY ---

export const generateInformaticsDaily = async (): Promise<InformaticsDaily> => {
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        topic: { type: Type.STRING },
        tip: { type: Type.STRING },
        shortcut: { type: Type.STRING },
        quizQuestion: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                stem: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                difficulty: { type: Type.STRING, enum: ["Fácil", "Médio", "Difícil"] },
            },
            required: ["id", "stem", "options", "correctIndex", "explanation", "difficulty"]
        }
      },
      required: ["topic", "tip", "quizQuestion"],
    };
  
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Gere uma dica de Ouro de Informática para concursos (ex: Excel, Redes, Segurança) e uma questão sobre essa dica.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });
      const text = response.text;
      if (!text) throw new Error("No text returned");
      return JSON.parse(text) as InformaticsDaily;
    } catch (error) {
        throw error;
    }
};

// --- ESSAY CORRECTION ---

export const correctEssay = async (essayText: string, theme: string): Promise<EssayCorrection> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.INTEGER, description: "Score from 0 to 1000" },
      feedback: { type: Type.STRING },
      grammarErrors: { type: Type.ARRAY, items: { type: Type.STRING } },
      structureSuggestions: { type: Type.STRING },
    },
    required: ["score", "feedback", "grammarErrors", "structureSuggestions"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Good for text analysis
      contents: `Corrija a seguinte redação com o tema "${theme}". Seja rigoroso como uma banca militar. 
      Redação: ${essayText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No text returned");
    return JSON.parse(text) as EssayCorrection;
  } catch (error) {
    console.error("Error correcting essay:", error);
    return {
      score: 0,
      feedback: "Erro ao conectar com a IA Central.",
      grammarErrors: [],
      structureSuggestions: "Tente novamente.",
    };
  }
};

// --- RECIPE GENERATION (TFM) ---

export const generateRecipe = async (goal: string): Promise<Recipe> => {
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
        instructions: { type: Type.STRING },
        benefits: { type: Type.STRING },
      },
      required: ["name", "ingredients", "instructions", "benefits"],
    };
  
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Gere uma receita prática, barata e nutritiva para um atleta militar com foco em: ${goal}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });
  
      const text = response.text;
      if (!text) throw new Error("No text returned");
      return JSON.parse(text) as Recipe;
    } catch (error) {
      return {
        name: "Suco Verde de Combate (Fallback)",
        ingredients: ["Couve", "Limão", "Gengibre"],
        instructions: "Bater tudo.",
        benefits: "Detox simples.",
      };
    }
  };

// --- AI TUTOR (CHAT) ---

export const askTutor = async (question: string, context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Contexto: ${context}. Pergunta do aluno: ${question}. Responda de forma direta e didática, máximo 2 parágrafos.`,
    });
    return response.text || "Sem resposta.";
  } catch (error) {
    return "Erro de comunicação com o QG.";
  }
};