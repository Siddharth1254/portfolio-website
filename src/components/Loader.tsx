import { useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLatest } from '@/lib/useLatest';
import { clamp } from '@/lib/util';

const SESSION_KEY = 'st-loaded';
const LABELS = ['loader.1', 'loader.2', 'loader.3', 'loader.4'] as const;

/* Drives the loading screen that index.html paints before any script runs. The pre-paint script
   removes it on later visits in the session (and with reduced motion); the CSS failsafe clears it
   even if scripts stall. */
export function Loader({ onDone }: { onDone: () => void }) {
  const { t } = useLanguage();
  const tRef = useLatest(t);
  const onDoneRef = useLatest(onDone);

  useEffect(() => {
    const L = document.getElementById('loader');
    if (!L) {
      onDoneRef.current();
      return;
    }
    const count = document.getElementById('lc'), pct = document.getElementById('lp'), bar = document.getElementById('lb'), label = document.getElementById('ll');
    // the % sign follows the growing number via a transform, which does not count as a layout shift
    const placePct = () => { if (count && pct) pct.style.transform = `translateX(${count.offsetWidth}px)`; };
    placePct();
    count?.parentElement?.classList.add('js');
    let raf = 0;
    const timers: number[] = [];
    const t0 = performance.now(), D = 1700;
    const tick = (now: number) => {
      const p = clamp((now - t0) / D, 0, 1), e = 1 - Math.pow(1 - p, 3);
      if (count) {
        const next = String(Math.round(e * 100));
        if (count.textContent !== next) { count.textContent = next; placePct(); }
      }
      if (bar) bar.style.transform = `scaleX(${e})`;
      if (label) label.textContent = tRef.current(LABELS[Math.min(3, Math.floor(e * 3.999))]);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      timers.push(
        window.setTimeout(() => {
          L.classList.add('done');
          try {
            sessionStorage.setItem(SESSION_KEY, '1');
          } catch {
            /* storage can be unavailable (private mode) */
          }
          timers.push(window.setTimeout(() => onDoneRef.current(), 350));
          timers.push(window.setTimeout(() => L.remove(), 1300));
        }, 250),
      );
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [tRef, onDoneRef]);

  return null;
}
