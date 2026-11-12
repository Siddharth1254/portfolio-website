import { useCallback, useEffect, useRef, useState } from 'react';
import { Nav } from '@/components/Nav';
import { Sky } from '@/components/Sky';
import { About } from '@/components/sections/About';
import { Certifications } from '@/components/sections/Certifications';
import { Contact } from '@/components/sections/Contact';
import { Education } from '@/components/sections/Education';
import { Experience } from '@/components/sections/Experience';
import { Hero } from '@/components/sections/Hero';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { useLanguage } from '@/i18n/LanguageContext';
import { clamp } from '@/lib/util';

const Index = ({ booted }: { booted: boolean }) => {
  const { t, lang } = useLanguage();
  const [toast, setToast] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef(0);

  const showToast = useCallback(() => {
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(false), 1800);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  /* scroll: progress bar + statement highlight (re-run on language change: the statement words change) */
  useEffect(() => {
    const onScrollFx = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      const stmt = document.querySelector('.statement');
      if (!stmt) return;
      const hws = stmt.querySelectorAll('.hw');
      const st = stmt.getBoundingClientRect();
      const hp = clamp((innerHeight * 0.85 - st.top) / (st.height + innerHeight * 0.35), 0, 1);
      hws.forEach((w, i) => w.classList.toggle('on', i < hp * hws.length));
    };
    let tick = false;
    const onScroll = () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => { onScrollFx(); tick = false; });
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScrollFx();
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  }, [lang]);

  return (
    <>
      <div id="progress" ref={progressRef} />
      <div className={`toast${toast ? ' show' : ''}`} id="toast" role="status" aria-live="polite">
        {t('toast.copied')}
      </div>
      <Sky />
      <Nav />
      <main>
        <Hero started={booted} />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Certifications />
        <Contact onCopied={showToast} />
      </main>
    </>
  );
};

export default Index;
