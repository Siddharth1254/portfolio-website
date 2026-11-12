/* PROJECTS — cards on a tilted ring around "Selected work".
   Page scroll gives the ring a slow spin as the section glides past; it does NOT pin.
   When scrolling stops, the ring settles on the nearest project. */
import { useEffect, useRef, useState } from 'react';
import { GITHUB_USER, PROJECTS } from '@/data/projects';
import { useLanguage } from '@/i18n/LanguageContext';
import type { Reels as ReelsEngine } from '@/lib/reels';
import { clamp, isLight, pad, prefersReducedMotion } from '@/lib/util';

const P = PROJECTS.length, STEP = (2 * Math.PI) / P;
const SPIN_PER_PASS = 2.2; // projects turned while the section crosses the screen — lower = slower

export function Projects() {
  const { t, pick } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLButtonElement[]>([]);
  const canvasRefs = useRef<HTMLCanvasElement[]>([]);
  const pdCanvasRef = useRef<HTMLCanvasElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLElement>(null);
  const ctl = useRef<{ open: (i: number) => void; close: () => void; turn: (n: number) => void } | null>(null);
  const [detail, setDetail] = useState({ idx: -1, shown: false });

  useEffect(() => {
    const psec = sectionRef.current!, pst = stageRef.current!;
    const pcards = cardRefs.current;
    const RM_REELS = prefersReducedMotion();
    let pAng = 0, pActive = -1, openIdx = -1, goingTo = -1, pOffset = 0, pdStart = 0;

    // the reels engine and its fonts load only when the section comes near the viewport
    let Reels: typeof ReelsEngine | null = null, disposed = false;
    const reelsIo = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      reelsIo.disconnect();
      // canvas text does not trigger web-font loading by itself
      document.fonts?.load('600 12px "Bricolage Grotesque"').catch(() => {});
      document.fonts?.load('400 12px "IBM Plex Sans"').catch(() => {});
      document.fonts?.load('400 12px "JetBrains Mono"').catch(() => {});
      import('@/lib/reels').then((m) => { if (!disposed) Reels = m.Reels; }).catch(() => {});
    }, { rootMargin: '150% 0px' });
    reelsIo.observe(psec);

    // arrows/clicks turn the ring on top of the scroll position; it loops endlessly
    const pTurn = (n: number) => { if (!Number.isFinite(pOffset)) pOffset = 0; pOffset += n; };
    function pTarget() {
      const r = psec.getBoundingClientRect(), den = innerHeight + r.height;
      if (!(den > 0)) return 0; // can report zero size while the page starts up
      const p = clamp((innerHeight - r.top) / den, 0, 1);
      return Number.isFinite(p) ? p * SPIN_PER_PASS : 0;
    }
    let lastScrollAt = 0, settled = true;
    const onScroll = () => { lastScrollAt = performance.now(); settled = false; };
    addEventListener('scroll', onScroll, { passive: true });

    // sideways wheel / trackpad swipe = one project per gesture
    let hAcc = 0, hLock = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical: let the page scroll
      e.preventDefault();
      const now = performance.now(); if (now < hLock) return;
      hAcc += e.deltaX; if (Math.abs(hAcc) > 30) { pTurn(Math.sign(hAcc)); hAcc = 0; hLock = now + 550; }
    };
    pst.addEventListener('wheel', onWheel, { passive: false });

    // drag / swipe the ring
    let dragX: number | null = null, dragMoved = false, dragBase = 0;
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element).closest('.pctrl,.pdetail,.pback')) return;
      dragX = e.clientX; dragMoved = false; dragBase = pOffset;
    };
    const onMove = (e: PointerEvent) => {
      if (dragX === null) return;
      const dx = e.clientX - dragX;
      if (Math.abs(dx) > 6) { dragMoved = true; pst.classList.add('dragging'); }
      if (dragMoved) pOffset = dragBase - dx / 220;
    };
    const onUp = () => {
      if (dragX === null) return;
      dragX = null; pst.classList.remove('dragging');
      if (dragMoved) { const tg = pTarget() + pOffset; pOffset += Math.round(tg) - tg; }
    };
    const onClickCapture = (e: MouseEvent) => { if (dragMoved) { e.stopPropagation(); e.preventDefault(); dragMoved = false; } };
    pst.addEventListener('pointerdown', onDown);
    addEventListener('pointermove', onMove);
    addEventListener('pointerup', onUp);
    addEventListener('pointercancel', onUp);
    pst.addEventListener('click', onClickCapture, true);

    function openProject(i: number) {
      openIdx = i; goingTo = i;
      const cur = Math.round(pTarget() + pOffset), act = ((cur % P) + P) % P;
      let d = i - act; if (d > P / 2) d -= P; if (d < -P / 2) d += P; pTurn(d);
      pdStart = performance.now();
      setDetail({ idx: i, shown: true });
    }
    function closeProject() {
      openIdx = -1; goingTo = -1;
      setDetail((s) => ({ ...s, shown: false }));
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && openIdx >= 0) closeProject(); };
    addEventListener('keydown', onKey);
    ctl.current = { open: openProject, close: closeProject, turn: pTurn };

    let pLast = performance.now(), raf = 0;
    function pFrame(now: number) {
      if (!Number.isFinite(now)) now = performance.now();
      const dt = clamp((now - pLast) / 1000, 0, 0.05); pLast = now; raf = requestAnimationFrame(pFrame);
      if (!Number.isFinite(pOffset)) pOffset = 0;
      if (!Number.isFinite(pAng)) pAng = 0;
      if (!pst.clientWidth || !pst.clientHeight) return; // not laid out yet: wait, never write NaN positions
      const r = psec.getBoundingClientRect(); if (r.bottom < -100 || r.top > innerHeight + 100) return;
      if (!settled && dragX === null && now - lastScrollAt > 220) { const tg = pTarget() + pOffset; pOffset += Math.round(tg) - tg; settled = true; }
      const tgt = pTarget() + pOffset;
      pAng += (tgt - pAng) * (1 - Math.exp(-dt * (dragX !== null ? 14 : 4))); if (Math.abs(tgt - pAng) < 1e-4) pAng = tgt;
      const tAct = ((Math.round(tgt) % P) + P) % P;
      if (goingTo >= 0 && tAct === goingTo) goingTo = -1;
      if (openIdx >= 0 && goingTo < 0 && tAct !== openIdx) closeProject();
      const W = pst.clientWidth, H = pst.clientHeight, mob = W < 760;
      const Rx = mob ? W * 0.47 : Math.min(W * 0.4, 600), Ry = mob ? H * 0.2 : Math.min(H * 0.2, 190), cy = mob ? H * 0.47 : H * 0.5;
      const act = ((Math.round(pAng) % P) + P) % P;
      pcards.forEach((c, i) => {
        const th = (i - pAng) * STEP, d = Math.cos(th), sx = Math.sin(th), k = (d + 1) / 2;
        const x = W / 2 + Rx * sx, y = cy + Ry * d, sc = 0.58 + 0.47 * k;
        c.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${sc})`;
        c.style.opacity = (0.56 + 0.44 * Math.pow(k, 1.2)).toFixed(3); c.classList.toggle('back', d < 0.1);
        const bl = Math.max(0, 0.15 - d) * 1.1; c.style.filter = bl > 0.05 ? `blur(${bl.toFixed(2)}px)` : 'none';
        c.style.zIndex = String(d < -0.05 ? Math.round(20 + d * 10) : Math.round(60 + d * 20));
        c.classList.toggle('front', i === act && Math.abs(pAng - Math.round(pAng)) < 0.08);
        c.tabIndex = i === act ? 0 : -1;
      });
      // animated covers: dark reels at night, light reels by day
      if (Reels) {
        const R = Reels, theme = isLight() ? 'light' : 'dark';
        canvasRefs.current.forEach((cv, i) => {
          const key = PROJECTS[i].reel, cov = R.COVERS[key]; if (!cov || !cv) return;
          const pp = RM_REELS ? 0.88 : ((now + i * 977) % cov.dur) / cov.dur;
          try { R.render(cv, key, pp, { theme, width: cv.clientWidth || 250 }); } catch { /* keep the ring running */ }
        });
        const pc = pdCanvasRef.current;
        if (pc && openIdx >= 0) {
          const key = PROJECTS[openIdx].reel, cov = R.COVERS[key];
          try { R.render(pc, key, ((now - pdStart) % cov.dur) / cov.dur, { theme, width: pc.clientWidth || 560 }); } catch { /* ignore */ }
        }
      }
      if (act !== pActive) {
        pActive = act;
        if (countRef.current) countRef.current.textContent = `${pad(act + 1)} / ${pad(P)}`;
        if (nameRef.current) nameRef.current.textContent = PROJECTS[act].name;
      }
    }
    raf = requestAnimationFrame(pFrame);

    return () => {
      disposed = true;
      reelsIo.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener('scroll', onScroll);
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerup', onUp);
      removeEventListener('pointercancel', onUp);
      removeEventListener('keydown', onKey);
      pst.removeEventListener('wheel', onWheel);
      pst.removeEventListener('pointerdown', onDown);
      pst.removeEventListener('click', onClickCapture, true);
      ctl.current = null;
    };
  }, []);

  const dp = detail.idx >= 0 ? PROJECTS[detail.idx] : null;

  return (
    <section className="proj" id="projects" ref={sectionRef}>
      <div className="pstage" id="pstage" ref={stageRef}>
        <div className="pcenter">
          <div className="num mono">{t('proj.num')}</div>
          <h2>{t('proj.title1')}<br />{t('proj.title2')}</h2>
          <p>{t('proj.hint')}</p>
        </div>
        <div id="ring">
          {PROJECTS.map((p, i) => (
            <button
              type="button"
              key={p.gh}
              className="pcard"
              ref={(el) => { if (el) cardRefs.current[i] = el; }}
              aria-label={t('proj.cardAria', { n: pad(i + 1), name: p.name })}
              onClick={() => ctl.current?.open(i)}
            >
              <div className="pthumb reelthumb">
                <canvas aria-hidden="true" ref={(el) => { if (el) canvasRefs.current[i] = el; }} />
              </div>
              <div className="pmeta"><span className="n">{pad(i + 1)}</span>{' '}<b>{p.name}</b></div>
            </button>
          ))}
        </div>
        <div className="pctrl glass">
          <button type="button" className="arrow" id="pPrev" aria-label={t('proj.prev')} onClick={() => ctl.current?.turn(-1)}>←</button>
          <div className="pinfo"><span className="mono" id="pCount" ref={countRef}>01 / {pad(P)}</span><b id="pName" ref={nameRef}>—</b></div>
          <button type="button" className="arrow" id="pNext" aria-label={t('proj.next')} onClick={() => ctl.current?.turn(1)}>→</button>
        </div>
        <div className={`pback${detail.shown ? ' show' : ''}`} id="pback" onClick={() => ctl.current?.close()} />
        <article className={`pdetail glass${detail.shown ? ' show' : ''}`} id="pdetail" role="dialog" aria-label={t('proj.details')} aria-hidden={!detail.shown}>
          {dp && (
            <>
              <div className="pthumb reelthumb big">
                <canvas id="pdCanvas" ref={pdCanvasRef} role="img" aria-label={t('proj.cover', { name: dp.name })} />
              </div>
              <div className="pdbody">
                <div className="pdtop mono">
                  <span>{t('proj.label')} {pad(detail.idx + 1)}</span>
                  <button type="button" className="pclose" aria-label={t('proj.close')} onClick={() => ctl.current?.close()} tabIndex={detail.shown ? 0 : -1}>✕</button>
                </div>
                <h3>{dp.name}</h3>
                <p className="pdesc">{pick(dp.desc)}</p>
                <div className="pstack">{dp.stack}</div>
                <div className="row">
                  <a className="btn primary" href={`https://github.com/${GITHUB_USER}/${dp.gh}`} target="_blank" rel="noopener" tabIndex={detail.shown ? 0 : -1}>
                    {t('proj.github')}
                  </a>
                </div>
              </div>
            </>
          )}
        </article>
      </div>
    </section>
  );
}
