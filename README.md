# 🛡️ CONCURSADOS.AI

> **A Plataforma Definitiva de Preparação Tática para Concursos Militares e Civis.**

![Status](https://img.shields.io/badge/Status-Operacional-green)
![Version](https://img.shields.io/badge/Versão-1.0.0-gold)
![AI Powered](https://img.shields.io/badge/AI-Gemini%20Powered-blue)

O **CONCURSADOS.AI** é uma aplicação web progressiva (PWA) focada em alta performance, disciplina e inteligência. Utilizando a API Google Gemini, o app cria planos de estudo personalizados, corrige redações, gera simulados e até cuida da preparação física (TFM) e nutricional do candidato.

---

## 🚀 Funcionalidades Principais

### 🧠 Preparação Intelectual
*   **Plano Alfa (IA)**: Geração automática de cronogramas de estudo baseados no seu tempo disponível e nível.
*   **Banco de Questões Infinito**: Questões geradas por IA focadas na sua banca (ESA, EsPCEx, PF, etc), incluindo "pegadinhas".
*   **Redação Tática**: Editor de texto com correção instantânea por IA (nota, gramática e sugestões de estrutura).
*   **Tutor 24h**: Chat integrado durante as sessões de estudo para tirar dúvidas em tempo real.
*   **Laboratório de Lógica**: Desafios de Raciocínio Lógico Matemático.
*   **Centro de Informática**: Dicas diárias e testes de atalhos e conceitos tech.

### 💪 Preparação Física (TFM)
*   **Rastreador de Corrida**: Monitoramento de KM percorridos.
*   **Nutrição de Combate**: Receitas geradas por IA focadas em explosão muscular e recuperação.
*   **Defesa Pessoal**: Guia visual de golpes (Jiu-Jitsu, Boxe) com instruções de aplicação tática.
*   **Monitor de Humor**: Acompanhamento do estado mental do guerreiro.

### 📊 Gestão & Dados
*   **Biblioteca de Provas**: Links diretos para provas reais (ENEM, ESA, Bancárias).
*   **Estatísticas de Campanha**: Gráficos de XP, horas estudadas e retenção.
*   **Sistema de Gamificação**: Ganhe XP por cada missão cumprida.

---

## 🛠️ Tecnologias Utilizadas

*   **Frontend**: React.js, TypeScript
*   **Estilização**: Tailwind CSS (Tema Dark/Militar/Gold)
*   **Inteligência Artificial**: Google Gemini API (`gemini-2.5-flash`)
*   **Ícones**: Lucide React
*   **Gráficos**: Recharts
*   **Persistência**: LocalStorage (Banco de Dados Local)

---

## 🔧 Como Rodar Localmente

1.  **Clone o repositório**
    ```bash
    git clone https://github.com/SEU-USUARIO/concursados-ai.git
    cd concursados-ai
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    ```

3.  **Configure a API Key**
    Crie um arquivo `.env` na raiz do projeto e adicione sua chave do Google Gemini:
    ```env
    VITE_API_KEY=sua_chave_aqui
    ```
    *(Nota: O código atual consome `process.env.API_KEY`, ajuste conforme seu bundler se necessário)*

4.  **Inicie a Operação**
    ```bash
    npm run dev
    ```

---

## 📸 Screenshots

| Dashboard | TFM | Questões |
|:---:|:---:|:---:|
| *Interface de Comando* | *Treino Físico Militar* | *Simulados por IA* |

---

## 🔰 Missão

Democratizar o acesso à preparação de elite para concursos públicos através da tecnologia, forjando a próxima geração de servidores e militares do Brasil.

---

**"Missão dada é missão cumprida."** 🇧🇷
