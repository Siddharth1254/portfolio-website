import type { Localized } from '@/i18n/types';

export const TYPED_WORDS: Localized<string[]> = {
  en: ['AI agents.', 'RAG assistants.', 'automations.', 'ML models.', 'data pipelines.', 'dashboards people read.'],
  fr: ['des agents IA.', 'des assistants RAG.', 'des automatisations.', 'des modèles de ML.', 'des pipelines de données.', 'des dashboards lisibles.'],
};

export interface SpokenLanguage {
  name: Localized<string>;
  level: Localized<string>;
  /** Bar fill, 0..1. */
  value: number;
}

export const LANGUAGES: SpokenLanguage[] = [
  { name: { en: 'French', fr: 'Français' }, level: { en: 'Intermediate (B1)', fr: 'Intermédiaire (B1)' }, value: 0.55 },
  { name: { en: 'English', fr: 'Anglais' }, level: { en: 'Fluent (C1)', fr: 'Courant (C1)' }, value: 0.9 },
  { name: { en: 'Hindi', fr: 'Hindi' }, level: { en: 'Native', fr: 'Natif' }, value: 1 },
  { name: { en: 'Sindhi', fr: 'Sindhi' }, level: { en: 'Native', fr: 'Natif' }, value: 1 },
  { name: { en: 'Gujarati', fr: 'Gujarati' }, level: { en: 'Full Professional', fr: 'Professionnel' }, value: 0.92 },
];

export interface EducationEntry {
  title: Localized<string>;
  school: string;
  schoolUrl?: string;
  place: Localized<string>;
  when: Localized<string>;
  current?: boolean;
}

export const EDUCATION: EducationEntry[] = [
  {
    title: { en: 'Programme Grande École in AI and Data Science', fr: 'Programme Grande École en IA et Science des Données' },
    school: 'aivancity Paris-Cachan',
    schoolUrl: 'https://www.aivancity.ai/',
    place: { en: 'Paris, France', fr: 'Paris, France' },
    when: { en: 'Sept 2023 – June 2028', fr: 'Sept 2023 – Juin 2028' },
    current: true,
  },
  {
    title: { en: 'High School Diploma', fr: "Diplôme de Fin d'Études Secondaires" },
    school: 'Zydus School for Excellence',
    place: { en: 'Ahmedabad, India', fr: 'Ahmedabad, Inde' },
    when: { en: 'Sept 2011 – June 2022', fr: 'Sept 2011 – Juin 2022' },
  },
];

export const EMAIL = 'siddharth.taurani@gmail.com';

export const SOCIALS = [
  { name: 'LinkedIn', href: 'https://linkedin.com/in/siddharthtaurani', icon: 'linkedin' },
  { name: 'GitHub', href: 'https://github.com/Siddharth1254', icon: 'github' },
  { name: 'Medium', href: 'https://medium.com/@siddharth_1254', icon: 'medium' },
  { name: 'Substack', href: 'https://siddharth-taurani.substack.com', icon: 'substack' },
] as const;
