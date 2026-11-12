import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LANG_STORAGE_KEY, LanguageContext, makeTranslator, readInitialLang, type LanguageContextValue } from './LanguageContext';
import type { Lang, Localized } from './types';

function setMeta(selector: string, content: string) {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = content;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      /* storage can be unavailable (private mode) */
    }
  }, []);

  const toggleLang = useCallback(() => setLang(lang === 'en' ? 'fr' : 'en'), [lang, setLang]);

  const value = useMemo<LanguageContextValue>(() => {
    const { t, rich } = makeTranslator(lang);
    return { lang, setLang, toggleLang, t, rich, pick: <T,>(v: Localized<T>) => v[lang] };
  }, [lang, setLang, toggleLang]);

  useEffect(() => {
    const { t } = value;
    document.documentElement.lang = lang;
    document.title = t('meta.title');
    setMeta('meta[name="description"]', t('meta.description'));
    setMeta('meta[property="og:title"]', t('meta.title'));
    setMeta('meta[property="og:description"]', t('meta.description'));
    setMeta('meta[name="twitter:title"]', t('meta.title'));
    setMeta('meta[name="twitter:description"]', t('meta.description'));
  }, [lang, value]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
