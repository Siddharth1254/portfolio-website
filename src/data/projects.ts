import type { Localized } from '@/i18n/types';

export interface Project {
  name: string;
  /** Repository name under github.com/Siddharth1254. */
  gh: string;
  stack: string;
  /** Key of the animated cover in the Reels engine. */
  reel: 'meeting' | 'genie' | 'mcp' | 'mail' | 'score' | 'bert' | 'market';
  desc: Localized<string>;
}

export const GITHUB_USER = 'Siddharth1254';

export const PROJECTS: Project[] = [
  {
    name: 'Meeting-to-Action Assistant', gh: 'meeting-to-action', reel: 'meeting',
    stack: 'n8n · Claude API · Slack · Google Sheets · Python',
    desc: {
      en: 'Low-code workflow that turns a meeting transcript into a summary, decisions and assigned actions, with a Slack recap and Google Sheets tracking, without inventing owners or deadlines. Evaluated on 3 tricky French transcripts: 15 of 15 actions found, none invented.',
      fr: "Workflow low-code qui transforme une transcription de réunion en résumé, décisions et actions assignées, avec récap Slack et suivi Google Sheets, sans inventer de responsable ni d'échéance. Évalué sur 3 transcriptions françaises piégées : 15 actions sur 15 trouvées, aucune inventée.",
    },
  },
  {
    name: 'AlternaGenie', gh: 'alterna-genie-mvp', reel: 'genie',
    stack: 'FastAPI · React · Gemini API · Structured Outputs',
    desc: {
      en: 'Built at the GDG on Campus "Build with AI 2026" hackathon. From a job posting and a profile (or a PDF CV), generates CV bullets, a cover letter, an outreach email and a LinkedIn note, with a match score. Structured JSON output and automatic retry when the API quota is hit.',
      fr: "Réalisé lors du hackathon GDG on Campus « Build with AI 2026 ». À partir d'une offre et d'un profil (ou d'un CV PDF), génère des puces de CV, une lettre de motivation, un email de prospection et une note LinkedIn, avec un score de correspondance. Sortie JSON structurée et relance automatique en cas de quota atteint.",
    },
  },
  {
    name: 'MCP Debugging Agent', gh: 'mcp-debugging-agent', reel: 'mcp',
    stack: 'Python · MCP · Log Parsing · Anomaly Detection',
    desc: {
      en: 'MCP server for log analysis and debugging. Ingests logs from multiple sources (plaintext, JSONL, syslog), searches across files, detects anomalies with error-burst detection, and correlates events across log files within configurable time windows.',
      fr: "Serveur MCP pour l'analyse et le débogage de logs. Ingère des logs de sources multiples (texte, JSONL, syslog), recherche inter-fichiers, détecte les anomalies avec détection de rafales d'erreurs, et corrèle les événements dans des fenêtres temporelles configurables.",
    },
  },
  {
    name: 'AI Cold Email Generator', gh: 'ai-cold-email-generator', reel: 'mail',
    stack: 'Python · Streamlit · Mistral API · Gmail SMTP',
    desc: {
      en: 'Outreach tool with tone control (Formal/Friendly/Startup), editable emails with attachment support, built-in analytics dashboard, and circuit-breaker reliability with anti-hallucination guardrails.',
      fr: 'Outil de prospection avec contrôle de ton (Formel/Amical/Startup), emails éditables avec pièces jointes, tableau de bord analytique, et fiabilité circuit-breaker avec garde-fous anti-hallucination.',
    },
  },
  {
    name: 'Student Performance Prediction', gh: 'Machine-Learning-Score-Prediction', reel: 'score',
    stack: 'Python · Scikit-Learn · XGBoost · U-Net · K-means',
    desc: {
      en: 'Team ML project: exploratory analysis, feature engineering and comparison of 10 regression models, reaching up to 82.7% R². Absences and previous failures stand out as key factors. Extended with a computer-vision part on MVTec: U-Net defect segmentation and unsupervised clustering.',
      fr: "Projet ML en équipe : analyse exploratoire, feature engineering et comparaison de 10 modèles de régression, jusqu'à 82,7 % de R². Les absences et les échecs antérieurs ressortent comme facteurs clés. Complété par une partie vision par ordinateur sur MVTec : segmentation de défauts (U-Net) et clustering non supervisé.",
    },
  },
  {
    name: 'Sentiment Analysis with BERT', gh: 'sentiment-analysis-with-bert', reel: 'bert',
    stack: 'Python · BERT · Docker · GitHub Actions · pytest',
    desc: {
      en: 'End-to-end MLOps pipeline for sentiment classification. Includes data preprocessing, model training, CI/CD automation with GitHub Actions, and Docker containerization for reproducible deployment.',
      fr: 'Pipeline MLOps complet pour la classification de sentiment. Inclut prétraitement des données, entraînement du modèle, automatisation CI/CD avec GitHub Actions, et conteneurisation Docker pour un déploiement reproductible.',
    },
  },
  {
    name: 'Gaming Market Insights', gh: 'gaming-market-insights', reel: 'market',
    stack: 'Python · Pandas · NumPy · Matplotlib · Seaborn',
    desc: {
      en: 'Comprehensive data wrangling and EDA project analyzing 16,000+ video game titles. Features data cleaning, temporal/genre/platform analysis, and custom metrics like Market Power Index and Regional Preference Divergence.',
      fr: "Projet complet de data wrangling et d'analyse exploratoire sur 16 000+ jeux vidéo. Inclut nettoyage de données, analyse temporelle/genre/plateforme, et métriques personnalisées comme l'Indice de Puissance de Marché et la Divergence des Préférences Régionales.",
    },
  },
];
