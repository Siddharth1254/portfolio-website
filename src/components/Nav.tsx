import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import type { StringKey } from '@/i18n/strings';
import { useTheme } from '@/theme/ThemeContext';

const LINKS: { href: string; key: StringKey }[] = [
  { href: '#about', key: 'nav.about' },
  { href: '#experience', key: 'nav.experience' },
  { href: '#projects', key: 'nav.projects' },
  { href: '#skills', key: 'nav.skills' },
  { href: '#education', key: 'nav.education' },
  { href: '#contact', key: 'nav.contact' },
];

export function Nav() {
  const { t, lang, toggleLang } = useLanguage();
  const { light, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const themeLabel = light ? t('nav.theme.night') : t('nav.theme.day');

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 40);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [lang]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onResize = () => {
      const btn = headerRef.current?.querySelector('.menuBtn');
      if (btn && getComputedStyle(btn).display === 'none') setMenuOpen(false);
    };
    addEventListener('keydown', onKey);
    addEventListener('pointerdown', onDown);
    addEventListener('resize', onResize);
    return () => {
      removeEventListener('keydown', onKey);
      removeEventListener('pointerdown', onDown);
      removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  return (
    <header className={`nav${scrolled || menuOpen ? ' scrolled' : ''}`} id="nav" ref={headerRef}>
      <a className="logo" href="#top">
        ST<span>.</span>
      </a>
      <nav className="links">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {t(l.key)}
          </a>
        ))}
        <div className="tgroup">
          <button type="button" className="toggle langToggle" onClick={toggleLang} aria-label={`EN FR — ${t('nav.lang.aria')}`}>
            <span className={lang === 'en' ? 'on' : undefined}>EN</span>{' '}
            <span className="sep" aria-hidden="true" />{' '}
            <span className={lang === 'fr' ? 'on' : undefined}>FR</span>
          </button>
          <button type="button" className="toggle" id="themeBtn" onClick={toggleTheme} aria-label={`${themeLabel} — ${t('nav.theme.aria')}`}>
            <span id="themeIcon" aria-hidden="true">{light ? '☾' : '☀︎'}</span>
            <span id="themeLabel">{themeLabel}</span>
          </button>
          <button
            type="button"
            className={`menuBtn${menuOpen ? ' open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="mnav"
            aria-label={menuOpen ? t('nav.menu.close') : t('nav.menu.open')}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <i />
            <i />
            <i />
          </button>
        </div>
      </nav>
      <div className={`mnav glass${menuOpen ? ' open' : ''}`} id="mnav" hidden={!menuOpen}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
            {t(l.key)}
          </a>
        ))}
      </div>
    </header>
  );
}
