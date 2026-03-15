// Language context for bilingual support (EN/FR)
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.about': 'About',
    'nav.education': 'Education',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.certifications': 'Certifications',
    'nav.contact': 'Contact',

    // Hero
    'hero.title': 'Siddharth Taurani',
    'hero.subtitle': 'AI and Data Science Student',
    'hero.tagline': 'I design and build end-to-end AI prototypes — from data ingestion and modeling to deployment — with a focus on retrieval systems, LLM orchestration, data pipelines, and real-world applications.',
    'hero.availability': 'Currently seeking an alternance in AI / ML engineering, Data Science/Analyst starting June 2026.',
    'hero.cta': 'Get in Touch',

    // About
    'about.title': 'About Me',
    'about.description': 'I\'m an AI and Data Science student focused on building applied machine learning and retrieval systems that solve real problems.',
    'about.paragraph2': 'I enjoy working on projects where AI moves beyond experimentation into something usable — dashboards, automation tools, search systems, or ML pipelines that people can interact with.',
    'about.paragraph3': 'Currently, I\'m deepening my skills in Retrieval-Augmented Generation (RAG), NL-to-database systems, MLOps workflows, and AI agents for automation.',
    'about.finalLine': 'I\'m actively looking for an alternance role where I can contribute to real AI systems in production environments.',
    'about.languagesTitle': 'Languages',
    'about.language.french': 'French',
    'about.language.english': 'English',
    'about.language.hindi': 'Hindi',
    'about.language.sindhi': 'Sindhi',
    'about.language.gujarati': 'Gujarati',
    'about.proficiency.native': 'Native',
    'about.proficiency.professional': 'Full Professional',
    'about.proficiency.working': 'Limited Working',

    // Education
    'education.title': 'Education',
    'education.degree1.title': 'Programme Grande École in AI and Data Science',
    'education.degree1.school': 'aivancity Paris-Cachan',
    'education.degree1.date': 'Sept 2023 - June 2028',
    'education.degree1.location': 'Paris, France',
    'education.degree2.title': 'High School Diploma',
    'education.degree2.school': 'Zydus School for Excellence',
    'education.degree2.date': 'Sept 2011 - June 2022',
    'education.degree2.location': 'Ahmedabad, India',

    // Experience
    'experience.title': 'Experience',
    'experience.aiClinicLabel': 'AI Clinic',
    'experience.aiClinicDefinition': 'AI Clinic is a hands-on consultancy program where students work on real AI projects for companies, bridging academic learning with industry application.',
    'experience.contract': 'Contract',
    'experience.internship': 'Internship',
    'experience.aiClinic': 'AI Clinic',
    'experience.partTime': 'Part-time',
    'experience.onsite': 'On-site',
    'experience.remote': 'Remote',

    'experience.job1.title': 'AI Engineer',
    'experience.job1.company': 'Pangea Summit',
    'experience.job1.date': 'Oct 2025 - Present',
    'experience.job1.location': 'Île-de-France, France',
    'experience.job1.desc1': 'Built web scrapers to extract and structure real estate-related data from multiple sources',
    'experience.job1.desc2': 'Developed real-time stats and analytics features for user-facing platform',
    'experience.job1.desc3': 'Designed UI components for data visualization and match insights',

    'experience.job2.title': 'AI Engineer (Language & Retrieval)',
    'experience.job2.company': 'AF Advisory',
    'experience.job2.date': 'Sept 2025 - Dec 2025',
    'experience.job2.location': 'Île-de-France, France',
    'experience.job2.desc1': 'Built a natural language to database query system with semantic routing',
    'experience.job2.desc2': 'Developed embedding pipelines for intelligent query generation',
    'experience.job2.desc3': 'Implemented context-aware retrieval mechanisms for structured data',

    'experience.job3.title': 'RAG Engineer Intern',
    'experience.job3.company': 'Pangea Summit',
    'experience.job3.date': 'May 2025 - Aug 2025',
    'experience.job3.location': 'Île-de-France, France',
    'experience.job3.desc1': 'Built multi-source RAG system for knowledge ingestion from diverse data sources',
    'experience.job3.desc2': 'Developed scalable scrapers for automated data collection',
    'experience.job3.desc3': 'Orchestrated AI agents for complex retrieval and reasoning tasks',

    'experience.job4.title': 'AI Compliance Workflow Builder',
    'experience.job4.company': 'Pangea Summit',
    'experience.job4.date': 'Jan 2025 - Apr 2025',
    'experience.job4.location': 'Île-de-France, France',
    'experience.job4.desc1': 'Built no-code compliance workflow builder for AI governance',
    'experience.job4.desc2': 'Integrated RAG and LLM capabilities for automated compliance checking',
    'experience.job4.desc3': 'Developed real-time dashboard for compliance monitoring',

    'experience.job5.title': 'Data Extraction Engineer',
    'experience.job5.company': 'CMI',
    'experience.job5.date': 'Sept 2024 - Dec 2024',
    'experience.job5.location': 'Île-de-France, France',
    'experience.job5.desc1': 'Developed YouTube metadata scraping pipelines for content analysis',
    'experience.job5.desc2': 'Automated data extraction workflows for large-scale processing',
    'experience.job5.desc3': 'Built predictive models using extracted data features',

    'experience.job6.title': 'AI Ethics Consultant',
    'experience.job6.company': 'Algo Etico',
    'experience.job6.date': 'Jul 2024 - Sept 2024',
    'experience.job6.location': 'Barcelona, Spain',
    'experience.job6.desc1': 'Advised AI ethics startup on responsible AI implementation',
    'experience.job6.desc2': 'Developed content strategy for AI ethics education',
    'experience.job6.desc3': 'Created compliance frameworks for ethical AI deployment',

    'experience.job7.title': 'NLP Engineer',
    'experience.job7.company': 'X & Y CORP',
    'experience.job7.date': 'Jan 2024 - Mar 2024',
    'experience.job7.location': 'Île-de-France, France',
    'experience.job7.desc1': 'Collected and processed data for NLP model training',
    'experience.job7.desc2': 'Performed statistical analysis on text data',
    'experience.job7.desc3': 'Built HTML dashboards for results visualization',

    'experience.job8.title': 'Data Visualisation Engineer',
    'experience.job8.company': 'Substrate AI',
    'experience.job8.date': 'Nov 2023 - Dec 2023',
    'experience.job8.location': 'Île-de-France, France',
    'experience.job8.desc1': 'Extracted and cleaned data from multiple sources',
    'experience.job8.desc2': 'Performed data analysis for business insights',
    'experience.job8.desc3': 'Created Power BI dashboards for stakeholder reporting',

    // Projects
    'projects.title': 'Projects',
    'projects.project1.title': 'AI Cold Email Generator',
    'projects.project1.desc': 'Outreach tool with tone control (Formal/Friendly/Startup), editable emails with attachment support, built-in analytics dashboard, and circuit-breaker reliability with anti-hallucination guardrails.',
    'projects.project1.tech': 'Python, Streamlit, Mistral API, Gmail SMTP',
    'projects.project2.title': 'Sentiment Analysis with BERT',
    'projects.project2.desc': 'End-to-end MLOps pipeline for sentiment classification. Includes data preprocessing, model training, CI/CD automation with GitHub Actions, and Docker containerization for reproducible deployment.',
    'projects.project2.tech': 'Python, BERT, Docker, GitHub Actions, pytest',
    'projects.project3.title': 'Gaming Market Insights',
    'projects.project3.desc': 'Comprehensive data wrangling and EDA project analyzing 16,000+ video game titles. Features data cleaning, temporal/genre/platform analysis, and custom metrics like Market Power Index and Regional Preference Divergence.',
    'projects.project3.tech': 'Python, Pandas, NumPy, Matplotlib, Seaborn',
    'projects.viewGithub': 'View on GitHub',

    // Skills
    'skills.title': 'Skills & Technologies',
    'skills.programming': 'Programming',
    'skills.ai': 'AI & Machine Learning',
    'skills.data': 'Data',
    'skills.mlops': 'MLOps & Tools',
    'skills.tools': 'Visualization',
    'skills.responsible': 'Responsible AI',

    // Certifications
    'certifications.title': 'Certifications',
    'certifications.cert1.name': 'Retrieval Augmented Generation (RAG)',
    'certifications.cert1.issuer': 'DeepLearning.AI',
    'certifications.cert2.name': 'Machine Learning Specialization',
    'certifications.cert2.issuer': 'DeepLearning.AI & Stanford',

    // Contact
    'contact.title': 'Get in Touch',
    'contact.description1': 'I\'m currently seeking an alternance opportunity in AI / ML engineering starting Summer 2026.',
    'contact.description2': 'I\'m open to collaborations, applied AI projects, and discussions around data systems, retrieval, and ML deployment.',
    'contact.description3': 'Email or LinkedIn is the fastest way to reach me — I reply quickly.',
    'contact.email': 'Email',
    'contact.connect': 'Connect with me',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'GitHub',
    'contact.medium': 'View my blogs on Medium',
    'contact.substack': 'View my blogs on Substack',
  },
  fr: {
    // Navigation
    'nav.about': 'À propos',
    'nav.education': 'Formation',
    'nav.experience': 'Expérience',
    'nav.projects': 'Projets',
    'nav.skills': 'Compétences',
    'nav.certifications': 'Certifications',
    'nav.contact': 'Contact',

    // Hero
    'hero.title': 'Siddharth Taurani',
    'hero.subtitle': 'Étudiant en IA et Science des Données',
    'hero.tagline': 'Je conçois et développe des prototypes IA de bout en bout — de l\'ingestion de données et la modélisation au déploiement — avec un focus sur les systèmes de recherche, l\'orchestration LLM, les pipelines de données et les applications concrètes.',
    'hero.availability': 'Actuellement à la recherche d\'une alternance en ingénierie IA / ML, Data Science/Analyst à partir de juin 2026.',
    'hero.cta': 'Me Contacter',

    // About
    'about.title': 'À Propos de Moi',
    'about.description': 'Je suis un étudiant en IA et Science des Données, spécialisé dans la construction de systèmes d\'apprentissage automatique appliqué et de recherche qui résolvent des problèmes concrets.',
    'about.paragraph2': 'J\'aime travailler sur des projets où l\'IA dépasse le stade de l\'expérimentation pour devenir quelque chose d\'utilisable — tableaux de bord, outils d\'automatisation, systèmes de recherche ou pipelines ML avec lesquels les utilisateurs peuvent interagir.',
    'about.paragraph3': 'Actuellement, j\'approfondis mes compétences en Retrieval-Augmented Generation (RAG), systèmes NL-to-database, workflows MLOps et agents IA pour l\'automatisation.',
    'about.finalLine': 'Je recherche activement une alternance où je peux contribuer à de vrais systèmes IA en environnement de production.',
    'about.languagesTitle': 'Langues',
    'about.language.french': 'Français',
    'about.language.english': 'Anglais',
    'about.language.hindi': 'Hindi',
    'about.language.sindhi': 'Sindhi',
    'about.language.gujarati': 'Gujarati',
    'about.proficiency.native': 'Natif',
    'about.proficiency.professional': 'Professionnel',
    'about.proficiency.working': 'Intermédiaire',

    // Education
    'education.title': 'Formation',
    'education.degree1.title': 'Programme Grande École en IA et Science des Données',
    'education.degree1.school': 'aivancity Paris-Cachan',
    'education.degree1.date': 'Sept 2023 - Juin 2028',
    'education.degree1.location': 'Paris, France',
    'education.degree2.title': 'Diplôme de Fin d\'Études Secondaires',
    'education.degree2.school': 'Zydus School for Excellence',
    'education.degree2.date': 'Sept 2011 - Juin 2022',
    'education.degree2.location': 'Ahmedabad, Inde',

    // Experience
    'experience.title': 'Expérience',
    'experience.aiClinicLabel': 'Clinique IA',
    'experience.aiClinicDefinition': 'La Clinique IA est un programme de conseil pratique où les étudiants travaillent sur des projets IA réels pour des entreprises, faisant le lien entre l\'apprentissage académique et l\'application industrielle.',
    'experience.contract': 'Contrat',
    'experience.internship': 'Stage',
    'experience.aiClinic': 'Clinique IA',
    'experience.partTime': 'Temps partiel',
    'experience.onsite': 'Sur site',
    'experience.remote': 'À distance',

    'experience.job1.title': 'Ingénieur IA',
    'experience.job1.company': 'Pangea Summit',
    'experience.job1.date': 'Oct 2025 - Présent',
    'experience.job1.location': 'Île-de-France, France',
    'experience.job1.desc1': 'Développement de web scrapers pour extraire et structurer des données immobilières',
    'experience.job1.desc2': 'Création de fonctionnalités de statistiques et analyses en temps réel',
    'experience.job1.desc3': 'Conception de composants UI pour la visualisation de données',

    'experience.job2.title': 'Ingénieur IA (Langage & Recherche)',
    'experience.job2.company': 'AF Advisory',
    'experience.job2.date': 'Sept 2025 - Déc 2025',
    'experience.job2.location': 'Île-de-France, France',
    'experience.job2.desc1': 'Système de requêtes base de données en langage naturel avec routage sémantique',
    'experience.job2.desc2': 'Pipelines d\'embeddings pour génération intelligente de requêtes',
    'experience.job2.desc3': 'Mécanismes de recherche contextuelle pour données structurées',

    'experience.job3.title': 'Stagiaire Ingénieur RAG',
    'experience.job3.company': 'Pangea Summit',
    'experience.job3.date': 'Mai 2025 - Août 2025',
    'experience.job3.location': 'Île-de-France, France',
    'experience.job3.desc1': 'Système RAG multi-sources pour l\'ingestion de connaissances',
    'experience.job3.desc2': 'Scrapers évolutifs pour la collecte automatisée de données',
    'experience.job3.desc3': 'Orchestration d\'agents IA pour des tâches complexes de recherche',

    'experience.job4.title': 'Développeur Workflows de Conformité IA',
    'experience.job4.company': 'Pangea Summit',
    'experience.job4.date': 'Jan 2025 - Avr 2025',
    'experience.job4.location': 'Île-de-France, France',
    'experience.job4.desc1': 'Constructeur de workflows de conformité no-code pour la gouvernance IA',
    'experience.job4.desc2': 'Intégration RAG et LLM pour la vérification automatisée de conformité',
    'experience.job4.desc3': 'Tableau de bord temps réel pour le suivi de conformité',

    'experience.job5.title': 'Ingénieur Extraction de Données',
    'experience.job5.company': 'CMI',
    'experience.job5.date': 'Sept 2024 - Déc 2024',
    'experience.job5.location': 'Île-de-France, France',
    'experience.job5.desc1': 'Pipelines de scraping de métadonnées YouTube pour l\'analyse de contenu',
    'experience.job5.desc2': 'Automatisation des workflows d\'extraction de données',
    'experience.job5.desc3': 'Modèles prédictifs à partir des données extraites',

    'experience.job6.title': 'Consultant en Éthique de l\'IA',
    'experience.job6.company': 'Algo Etico',
    'experience.job6.date': 'Juil 2024 - Sept 2024',
    'experience.job6.location': 'Barcelone, Espagne',
    'experience.job6.desc1': 'Conseil à une startup d\'éthique IA sur l\'implémentation responsable',
    'experience.job6.desc2': 'Stratégie de contenu pour l\'éducation à l\'éthique de l\'IA',
    'experience.job6.desc3': 'Cadres de conformité pour un déploiement éthique de l\'IA',

    'experience.job7.title': 'Ingénieur NLP',
    'experience.job7.company': 'X & Y CORP',
    'experience.job7.date': 'Jan 2024 - Mar 2024',
    'experience.job7.location': 'Île-de-France, France',
    'experience.job7.desc1': 'Collecte et traitement de données pour l\'entraînement de modèles NLP',
    'experience.job7.desc2': 'Analyse statistique de données textuelles',
    'experience.job7.desc3': 'Tableaux de bord HTML pour la visualisation des résultats',

    'experience.job8.title': 'Ingénieur Visualisation de Données',
    'experience.job8.company': 'Substrate AI',
    'experience.job8.date': 'Nov 2023 - Déc 2023',
    'experience.job8.location': 'Île-de-France, France',
    'experience.job8.desc1': 'Extraction et nettoyage de données de sources multiples',
    'experience.job8.desc2': 'Analyse de données pour insights business',
    'experience.job8.desc3': 'Tableaux de bord Power BI pour reporting aux parties prenantes',

    // Projects
    'projects.title': 'Projets',
    'projects.project1.title': 'Générateur d\'Emails de Prospection IA',
    'projects.project1.desc': 'Outil de prospection avec contrôle de ton (Formel/Amical/Startup), emails éditables avec pièces jointes, tableau de bord analytique, et fiabilité circuit-breaker avec garde-fous anti-hallucination.',
    'projects.project1.tech': 'Python, Streamlit, Mistral API, Gmail SMTP',
    'projects.project2.title': 'Analyse de Sentiment avec BERT',
    'projects.project2.desc': 'Pipeline MLOps complet pour la classification de sentiment. Inclut prétraitement des données, entraînement du modèle, automatisation CI/CD avec GitHub Actions, et conteneurisation Docker pour un déploiement reproductible.',
    'projects.project2.tech': 'Python, BERT, Docker, GitHub Actions, pytest',
    'projects.project3.title': 'Analyse du Marché du Gaming',
    'projects.project3.desc': 'Projet complet de data wrangling et d\'analyse exploratoire sur 16 000+ jeux vidéo. Inclut nettoyage de données, analyse temporelle/genre/plateforme, et métriques personnalisées comme l\'Indice de Puissance de Marché.',
    'projects.project3.tech': 'Python, Pandas, NumPy, Matplotlib, Seaborn',
    'projects.viewGithub': 'Voir sur GitHub',

    // Skills
    'skills.title': 'Compétences & Technologies',
    'skills.programming': 'Programmation',
    'skills.ai': 'IA & Machine Learning',
    'skills.data': 'Données',
    'skills.mlops': 'MLOps & Outils',
    'skills.tools': 'Visualisation',
    'skills.responsible': 'IA Responsable',

    // Certifications
    'certifications.title': 'Certifications',
    'certifications.cert1.name': 'Génération Augmentée par Récupération (RAG)',
    'certifications.cert1.issuer': 'DeepLearning.AI',
    'certifications.cert2.name': 'Spécialisation en Machine Learning',
    'certifications.cert2.issuer': 'DeepLearning.AI & Stanford',

    // Contact
    'contact.title': 'Me Contacter',
    'contact.description1': 'Je recherche actuellement une alternance en ingénierie IA / ML à partir de l\'été 2026.',
    'contact.description2': 'Je suis ouvert aux collaborations, projets d\'IA appliquée et discussions autour des systèmes de données, de la recherche et du déploiement ML.',
    'contact.description3': 'Email ou LinkedIn est le moyen le plus rapide de me joindre — je réponds rapidement.',
    'contact.email': 'Email',
    'contact.connect': 'Connectez avec moi',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'GitHub',
    'contact.medium': 'Voir mes articles sur Medium',
    'contact.substack': 'Voir mes articles sur Substack',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'fr' : 'en'));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
