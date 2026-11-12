import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import { Rich } from '@/components/common';
import { TYPED_WORDS } from '@/data/profile';
import { useLanguage } from '@/i18n/LanguageContext';
import { createNet } from '@/lib/net';
import { TREES_BACK, TREES_FRONT } from '@/lib/trees';
import { prefersReducedMotion, sleep } from '@/lib/util';

const GLYPHS = '!<>-_\\/[]{}=+*^?#01✦·';
const busy = new WeakSet<HTMLElement>();

/* name scramble (on reveal, and again on hover) */
function scramble(el: HTMLElement, dur = 900) {
  if (prefersReducedMotion() || busy.has(el)) return;
  busy.add(el);
  const final = el.dataset.text ?? '', t0 = performance.now();
  const step = (now: number) => {
    const p = (now - t0) / dur;
    let out = '';
    for (let i = 0; i < final.length; i++) out += i < p * final.length ? final[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    el.textContent = out;
    if (p < 1) requestAnimationFrame(step);
    else { el.textContent = final; busy.delete(el); }
  };
  step(t0);
}

function ScrambleText({ text, elRef }: { text: string; elRef: (el: HTMLSpanElement | null) => void }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  useLayoutEffect(() => {
    if (ref.current) ref.current.textContent = text;
  }, [text]);
  return (
    <span
      className="scr"
      data-text={text}
      ref={(el) => { ref.current = el; elRef(el); }}
      onMouseEnter={(e) => scramble(e.currentTarget, 600)}
    />
  );
}

function scrollToExperience(e?: MouseEvent) {
  const sec = document.getElementById('experience');
  if (!sec) return;
  e?.preventDefault();
  scrollTo({ top: sec.offsetTop + sec.offsetHeight / 2 - innerHeight / 2, behavior: 'smooth' });
}

export function Hero({ started }: { started: boolean }) {
  const { t, rich, lang } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const netRef = useRef<HTMLCanvasElement>(null);
  const scrRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [typed, setTyped] = useState('');

  useEffect(() => createNet(netRef.current!, heroRef.current!), []);

  useEffect(() => {
    if (!started) return;
    const timers = [window.setTimeout(() => {
      scrRefs.current.forEach((el, i) => timers.push(window.setTimeout(() => el && scramble(el), i * 180)));
    }, 400)];
    return () => timers.forEach(clearTimeout);
  }, [started]);

  /* typed role line — restarts from the first word when the language changes */
  useEffect(() => {
    if (!started) return;
    const words = TYPED_WORDS[lang];
    if (prefersReducedMotion()) {
      setTyped(words[0]);
      return;
    }
    let cancelled = false;
    (async () => {
      for (let k = 0; !cancelled; k = (k + 1) % words.length) {
        const w = words[k];
        for (let i = 1; i <= w.length && !cancelled; i++) { setTyped(w.slice(0, i)); await sleep(55 + Math.random() * 40); }
        await sleep(1700);
        for (let i = w.length; i >= 0 && !cancelled; i--) { setTyped(w.slice(0, i)); await sleep(28); }
        await sleep(250);
      }
    })();
    return () => { cancelled = true; };
  }, [started, lang]);

  return (
    <section className={`hero${started ? ' hero-in' : ''}`} id="top" ref={heroRef}>
      <canvas id="net" ref={netRef} aria-hidden="true" />
      <h1 aria-label="Siddharth Taurani">
        <span className="ln"><ScrambleText text="Siddharth" elRef={(el) => { scrRefs.current[0] = el; }} /></span>
        <span className="ln"><ScrambleText text="Taurani" elRef={(el) => { scrRefs.current[1] = el; }} /></span>
      </h1>
      <div className="typed fx d1">
        <span className="typed-in">
          {t('hero.typedPrefix')}
          <b id="typed">{typed}</b>
          <span className="caret" />
        </span>
      </div>
      <p className="fx d2 intro">
        <span className="br">[</span> {t('hero.intro')} <span className="br">]</span>
      </p>
      <p className="fx d2 hero-sub"><Rich parts={rich('hero.sub')} /></p>
      <p className="fx d2 avail">
        <span className="live" aria-hidden="true" />
        <span>
          <Rich parts={rich('hero.avail')} />
          <small className="mono">{t('hero.availSmall')}</small>
        </span>
      </p>
      <div className="ctas fx d3">
        <a className="btn primary" href="#experience" onClick={scrollToExperience}>{t('hero.ctaJourney')}</a>
        <a className="btn ghost" href="#contact">{t('hero.ctaContact')}</a>
      </div>
      <svg className="trees" viewBox="0 0 1600 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <path className="back" d={TREES_BACK} />
        <path className="front" d={TREES_FRONT} />
      </svg>
      <div className="scrollcue mono" aria-hidden="true">{t('hero.scroll')}</div>
    </section>
  );
}
