import type { Localized } from '@/i18n/types';

export interface Certification {
  key: 'rag' | 'ml';
  name: Localized<string>;
  issuer: string;
  /** Image on the back of the flip card. */
  image: string;
  /** Opened in a new tab once the card is revealed; falls back to the full-size image until the PDF is added. */
  pdf: string | null;
  fullImage: string;
}

export const CERTS: Certification[] = [
  {
    key: 'rag',
    name: { en: 'Retrieval Augmented Generation (RAG)', fr: 'Génération Augmentée par Récupération (RAG)' },
    issuer: 'DeepLearning.AI',
    image: '/certificates/rag-certificate.webp',
    pdf: null,
    fullImage: '/certificates/rag-certificate.png',
  },
  {
    key: 'ml',
    name: { en: 'Machine Learning Specialization', fr: 'Spécialisation en Machine Learning' },
    issuer: 'DeepLearning.AI & Stanford',
    image: '/certificates/ml-specialization.webp',
    pdf: null,
    fullImage: '/certificates/ml-specialization.png',
  },
];
