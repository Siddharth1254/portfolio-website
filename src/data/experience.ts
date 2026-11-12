import type { Localized } from '@/i18n/types';

export interface Stop {
  company: string;
  /** Short name shown in the bottom stop bar. */
  short: string;
  year: string;
  type: Localized<string>;
  role: Localized<string>;
  dates: Localized<string>;
  link?: string;
  bullets: Localized<string[]>;
}

const AI_CLINIC = { en: 'AI CLINIC', fr: 'CLINIQUE IA' };
const CONTRACT = { en: 'CONTRACT', fr: 'CONTRAT' };
const INTERNSHIP = { en: 'INTERNSHIP', fr: 'STAGE' };

/** Latest first: the rocket starts at CERC and ends at Substrate AI. */
export const STOPS: Stop[] = [
  {
    company: 'CERC', short: 'CERC', year: '2026', type: AI_CLINIC,
    role: { en: 'AI Engineer (Clinical Compliance RAG)', fr: 'Ingénieur IA (RAG Conformité Clinique)' },
    dates: { en: 'Jan 2026 – Apr 2026 · Remote · Île-de-France', fr: 'Jan 2026 – Avr 2026 · À distance · Île-de-France' },
    bullets: {
      en: [
        'Designed and delivered a clinical regulatory-compliance RAG assistant to the client',
        'Built ingestion of mixed-format documents with ChromaDB and LlamaParse',
        'Developed the FastAPI backend with strict prompt engineering and audit logging',
        'Built the React frontend: chat interface and audit-log viewer',
      ],
      fr: [
        "Conception et livraison au client d'un assistant RAG de conformité réglementaire clinique",
        'Ingestion de documents multi-formats avec ChromaDB et LlamaParse',
        "Backend FastAPI avec prompt engineering strict et journalisation d'audit",
        "Frontend React : interface de chat et visualiseur des journaux d'audit",
      ],
    },
  },
  {
    company: 'Pangea Summit', short: 'Pangea', year: '2025–26', type: CONTRACT,
    role: { en: 'AI Engineer', fr: 'Ingénieur IA' },
    dates: { en: 'Oct 2025 – Apr 2026 · Remote · Île-de-France', fr: 'Oct 2025 – Avr 2026 · À distance · Île-de-France' },
    bullets: {
      en: [
        'Built web scrapers to extract and structure real estate-related data from multiple sources',
        'Developed real-time stats and analytics features for user-facing platform',
        'Designed UI components for data visualization and match insights',
      ],
      fr: [
        'Développement de web scrapers pour extraire et structurer des données immobilières',
        'Création de fonctionnalités de statistiques et analyses en temps réel',
        'Conception de composants UI pour la visualisation de données',
      ],
    },
  },
  {
    company: 'AF Advisory', short: 'AF Advisory', year: '2025', type: AI_CLINIC,
    role: { en: 'AI Engineer (Language & Retrieval)', fr: 'Ingénieur IA (Langage & Recherche)' },
    dates: { en: 'Sept 2025 – Dec 2025 · Remote · Île-de-France', fr: 'Sept 2025 – Déc 2025 · À distance · Île-de-France' },
    bullets: {
      en: [
        'Built a natural language to database query system with semantic routing',
        'Developed embedding pipelines for intelligent query generation',
        'Implemented context-aware retrieval mechanisms for structured data',
      ],
      fr: [
        'Système de requêtes base de données en langage naturel avec routage sémantique',
        "Pipelines d'embeddings pour génération intelligente de requêtes",
        'Mécanismes de recherche contextuelle pour données structurées',
      ],
    },
  },
  {
    company: 'Pangea Summit', short: 'Pangea', year: '2025', type: INTERNSHIP,
    role: { en: 'RAG Engineer Intern', fr: 'Stagiaire Ingénieur RAG' },
    dates: { en: 'May 2025 – Aug 2025 · Remote · Île-de-France', fr: 'Mai 2025 – Août 2025 · À distance · Île-de-France' },
    bullets: {
      en: [
        'Built multi-source RAG system for knowledge ingestion from diverse data sources',
        'Developed scalable scrapers for automated data collection',
        'Orchestrated AI agents for complex retrieval and reasoning tasks',
      ],
      fr: [
        "Système RAG multi-sources pour l'ingestion de connaissances",
        'Scrapers évolutifs pour la collecte automatisée de données',
        "Orchestration d'agents IA pour des tâches complexes de recherche",
      ],
    },
  },
  {
    company: 'Pangea Summit', short: 'Pangea', year: '2025', type: AI_CLINIC,
    role: { en: 'AI Compliance Workflow Builder', fr: 'Développeur Workflows de Conformité IA' },
    dates: { en: 'Jan 2025 – Apr 2025 · Remote · Île-de-France', fr: 'Jan 2025 – Avr 2025 · À distance · Île-de-France' },
    link: 'https://www.pangea-summit.com/pangea-labs',
    bullets: {
      en: [
        'Built no-code compliance workflow builder for AI governance',
        'Integrated RAG and LLM capabilities for automated compliance checking',
        'Developed real-time dashboard for compliance monitoring',
      ],
      fr: [
        'Constructeur de workflows de conformité no-code pour la gouvernance IA',
        'Intégration RAG et LLM pour la vérification automatisée de conformité',
        'Tableau de bord temps réel pour le suivi de conformité',
      ],
    },
  },
  {
    company: 'CMI', short: 'CMI', year: '2024', type: AI_CLINIC,
    role: { en: 'Data Extraction Engineer', fr: 'Ingénieur Extraction de Données' },
    dates: { en: 'Sept 2024 – Dec 2024 · Remote · Île-de-France', fr: 'Sept 2024 – Déc 2024 · À distance · Île-de-France' },
    bullets: {
      en: [
        'Developed YouTube metadata scraping pipelines for content analysis',
        'Automated data extraction workflows for large-scale processing',
        'Built predictive models using extracted data features',
      ],
      fr: [
        "Pipelines de scraping de métadonnées YouTube pour l'analyse de contenu",
        "Automatisation des workflows d'extraction de données",
        'Modèles prédictifs à partir des données extraites',
      ],
    },
  },
  {
    company: 'Algo Etico', short: 'Algo Etico', year: '2024', type: INTERNSHIP,
    role: { en: 'AI Ethics Consultant', fr: "Consultant en Éthique de l'IA" },
    dates: { en: 'Jul 2024 – Sept 2024 · Remote · Barcelona', fr: 'Juil 2024 – Sept 2024 · À distance · Barcelone' },
    link: 'https://www.algoetico.com/about',
    bullets: {
      en: [
        'Advised AI ethics startup on responsible AI implementation',
        'Developed content strategy for AI ethics education',
        'Created compliance frameworks for ethical AI deployment',
      ],
      fr: [
        "Conseil à une startup d'éthique IA sur l'implémentation responsable",
        "Stratégie de contenu pour l'éducation à l'éthique de l'IA",
        "Cadres de conformité pour un déploiement éthique de l'IA",
      ],
    },
  },
  {
    company: 'X & Y Corp', short: 'X&Y Corp', year: '2024', type: AI_CLINIC,
    role: { en: 'NLP Engineer', fr: 'Ingénieur NLP' },
    dates: { en: 'Jan 2024 – Mar 2024 · Remote · Île-de-France', fr: 'Jan 2024 – Mars 2024 · À distance · Île-de-France' },
    bullets: {
      en: [
        'Collected and processed data for NLP model training',
        'Performed statistical analysis on text data',
        'Built HTML dashboards for results visualization',
      ],
      fr: [
        "Collecte et traitement de données pour l'entraînement de modèles NLP",
        'Analyse statistique de données textuelles',
        'Tableaux de bord HTML pour la visualisation des résultats',
      ],
    },
  },
  {
    company: 'Substrate AI', short: 'Substrate', year: '2023', type: AI_CLINIC,
    role: { en: 'Data Visualisation Engineer', fr: 'Ingénieur Visualisation de Données' },
    dates: { en: 'Nov 2023 – Dec 2023 · Remote · Île-de-France', fr: 'Nov 2023 – Déc 2023 · À distance · Île-de-France' },
    bullets: {
      en: [
        'Extracted and cleaned data from multiple sources',
        'Performed data analysis for business insights',
        'Created Power BI dashboards for stakeholder reporting',
      ],
      fr: [
        'Extraction et nettoyage de données de sources multiples',
        'Analyse de données pour insights business',
        'Tableaux de bord Power BI pour reporting aux parties prenantes',
      ],
    },
  },
];
