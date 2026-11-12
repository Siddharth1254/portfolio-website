import type { Localized } from '@/i18n/types';

/** p = prompt, d = dim status, s = file row, a = answer. */
export type TermKind = 'p' | 'd' | 's' | 'a';

export interface TermLine {
  kind: TermKind;
  key: Localized<string>;
  text: Localized<string>;
  /** Typed character by character instead of appearing at once. */
  typed?: boolean;
}

const same = (s: string) => ({ en: s, fr: s });

export const TERM: TermLine[] = [
  { kind: 'p', key: same('$'), text: { en: 'whoami --ask "Who is Siddharth?"', fr: 'whoami --ask "Qui est Siddharth\u00a0?"' }, typed: true },
  { kind: 'd', key: same('→'), text: { en: 'reading ~/siddharth', fr: 'lecture de ~/siddharth' } },
  { kind: 's', key: same('about.md'), text: { en: '4th-year AI & Data Science student · aivancity Paris', fr: 'Étudiant en 4e année en IA & Data Science · aivancity Paris' } },
  { kind: 's', key: same('experience.md'), text: { en: 'AI Clinic projects for real companies · internships · contracts', fr: 'Projets Clinique IA pour de vraies entreprises · stages · contrats' } },
  { kind: 's', key: same('builds.md'), text: { en: 'AI agents · automation · RAG assistants · data science', fr: 'Agents IA · automatisation · assistants RAG · data science' } },
  { kind: 's', key: same('principles.md'), text: { en: '"a model that makes things up is unusable"', fr: '«\u00a0un modèle qui invente est inutilisable\u00a0»' } },
  { kind: 's', key: same('now.md'), text: { en: 'research on LLM reliability · learning every week', fr: "recherche sur la fiabilité des LLM · j'apprends chaque semaine" } },
  { kind: 'a', key: { en: 'answer:', fr: 'réponse\u00a0:' }, text: { en: 'Builds AI and data projects end to end, properly. Open to an alternance — available now.', fr: 'Conçoit des projets IA et data de bout en bout, avec rigueur. Ouvert à une alternance — disponible dès maintenant.' }, typed: true },
];
