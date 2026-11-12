import { createContext, useContext } from 'react';
import type { StringKey } from './strings';
import { STRINGS } from './strings';
import type { Lang, Localized, RichText } from './types';

export interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  /** Plain UI string; `{name}`-style placeholders are filled from `vars`. */
  t: (key: StringKey, vars?: Record<string, string>) => string;
  /** Rich (partly bold) UI string. */
  rich: (key: StringKey) => RichText;
  /** Pick the current language from a localized value. */
  pick: <T>(value: Localized<T>) => T;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LANG_STORAGE_KEY = 'st-lang';

export function readInitialLang(): Lang {
  const fromHtml = document.documentElement.lang;
  return fromHtml === 'fr' ? 'fr' : 'en';
}

export function makeTranslator(lang: Lang) {
  const table = STRINGS[lang];
  const t = (key: StringKey, vars?: Record<string, string>) => {
    const raw = table[key];
    let out = typeof raw === 'string' ? raw : raw.map((p) => (typeof p === 'string' ? p : p.b)).join('');
    if (vars) for (const k in vars) out = out.split(`{${k}}`).join(vars[k]);
    return out;
  };
  const rich = (key: StringKey): RichText => {
    const raw = table[key];
    return typeof raw === 'string' ? [raw] : raw;
  };
  return { t, rich };
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
