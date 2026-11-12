import type { Localized } from '@/i18n/types';

export interface Certification {
  key: 'rag' | 'ml';
  name: Localized<string>;
  issuer: string;
  /** Image on the back of the flip card. */
  image: string;
  /**
   * Opened in a new tab once the card is revealed.
   * Set to e.g. `/certificates/rag-certificate.pdf` when the PDF is added;
   * until then leave `null` and the card opens `fullImage`.
   */
  pdf: string | null;
  fullImage: string;
}

export const CERTS: Certification[] = [
  {
    key: 'rag',
    name: { en: 'Retrieval Augmented Generation (RAG)', fr: 'Génération Augmentée par Récupération (RAG)' },
    issuer: 'DeepLearning.AI',
    image: '/certificates/rag-certificate.webp',
    pdf: null, // → '/certificates/rag-certificate.pdf' when available
    fullImage: '/certificates/rag-certificate.png',
  },
  {
    key: 'ml',
    name: { en: 'Machine Learning Specialization', fr: 'Spécialisation en Machine Learning' },
    issuer: 'DeepLearning.AI & Stanford',
    image: '/certificates/ml-specialization.webp',
    pdf: null, // → '/certificates/ml-specialization.pdf' when available
    fullImage: '/certificates/ml-specialization.png',
  },
];
