import type { Localized } from '@/i18n/types';

export interface SkillGroup {
  title: Localized<string>;
  wide?: boolean;
  items: Localized<string[]>;
}

export const SKILLS: SkillGroup[] = [
  {
    title: { en: 'AI & Machine Learning', fr: 'IA & Machine Learning' },
    wide: true,
    items: {
      en: ['RAG (ChromaDB, LlamaParse)', 'AI Agents', 'MCP', 'Claude, Gemini & Mistral APIs', 'Prompt Engineering', 'Structured Outputs (Tool Use)', 'LLM Evaluation', 'NLP', 'Scikit-Learn', 'XGBoost'],
      fr: ['RAG (ChromaDB, LlamaParse)', 'Agents IA', 'MCP', 'API Claude, Gemini & Mistral', 'Prompt Engineering', 'Structured Outputs (Tool Use)', 'Évaluation de LLM', 'NLP', 'Scikit-Learn', 'XGBoost'],
    },
  },
  {
    title: { en: 'Programming', fr: 'Programmation' },
    items: {
      en: ['Python', 'SQL (MySQL, SQLite)', 'FastAPI', 'REST APIs', 'React', 'Streamlit', 'Linux/Ubuntu'],
      fr: ['Python', 'SQL (MySQL, SQLite)', 'FastAPI', 'API REST', 'React', 'Streamlit', 'Linux/Ubuntu'],
    },
  },
  {
    title: { en: 'Data', fr: 'Données' },
    items: {
      en: ['Data Ingestion & Preprocessing', 'Embeddings', 'Web Scraping', 'Data Wrangling', 'EDA', 'Feature Engineering', 'Regression & Clustering', 'Pandas', 'NumPy'],
      fr: ['Ingestion & prétraitement des données', 'Embeddings', 'Web Scraping', 'Data Wrangling', 'Analyse exploratoire (EDA)', 'Feature Engineering', 'Régression & clustering', 'Pandas', 'NumPy'],
    },
  },
  {
    title: { en: 'Automation', fr: 'Automatisation' },
    items: {
      en: ['n8n (Low-code)', 'Claude API', 'Slack', 'Google Sheets', 'Error Handling & Alerts'],
      fr: ['n8n (low-code)', 'API Claude', 'Slack', 'Google Sheets', 'Gestion des erreurs & alertes'],
    },
  },
  {
    title: { en: 'Engineering & Tools', fr: 'Ingénierie & Outils' },
    items: {
      en: ['Docker', 'GitHub Actions', 'Git & GitHub', 'Audit Logging'],
      fr: ['Docker', 'GitHub Actions', 'Git & GitHub', "Journalisation d'audit"],
    },
  },
  {
    title: { en: 'Visualization', fr: 'Visualisation' },
    items: {
      en: ['Power BI', 'Looker Studio', 'MS Excel', 'Matplotlib'],
      fr: ['Power BI', 'Looker Studio', 'MS Excel', 'Matplotlib'],
    },
  },
  {
    title: { en: 'Responsible AI', fr: 'IA Responsable' },
    wide: true,
    items: {
      en: ['AI Ethics', 'AI Compliance', 'Privacy & Security', 'Data Governance'],
      fr: ["Éthique de l'IA", 'Conformité IA', 'Confidentialité & sécurité', 'Gouvernance des données'],
    },
  },
];
