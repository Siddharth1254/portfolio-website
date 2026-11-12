import { useCallback, useEffect, useRef, useState } from 'react';
import { Reveal, Rich, SplitHeading } from '@/components/common';
import { STOPS } from '@/data/experience';
import { useLanguage } from '@/i18n/LanguageContext';
import type { ExperienceApi } from '@/lib/experienceScene';
import { useLatest } from '@/lib/useLatest';
import { pad } from '@/lib/util';

const N = STOPS.length;
const LOAD_TIMEOUT = 12000;

const telemetryLabel = (s: string) => s.padEnd(8, '\u00a0') + ' ';

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function Fallback() {
  const { pick } = useLanguage();
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'auto', padding: '28px 32px' }}>
      {STOPS.map((s, i) => (
        <div key={i} style={{ padding: '18px 0', borderBottom: '1px solid var(--line)' }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '.12em', color: 'var(--accent)' }}>
            {pick(s.type)} · {pick(s.dates)}
          </div>
          <h3 style={{ fontSize: 30, margin: '8px 0 2px' }}>{s.company}</h3>
          <div style={{ color: 'var(--accent2)', fontWeight: 500 }}>{pick(s.role)}</div>
          <ul style={{ margin: '10px 0 0', paddingLeft: 18 }}>
            {pick(s.bullets).map((b, j) => <li key={j} style={{ margin: '4px 0' }}>{b}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Experience() {
  const { t, rich, pick } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const tStopRef = useRef<HTMLSpanElement>(null);
  const tVelRef = useRef<HTMLSpanElement>(null);
  const tStatusRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const labelRefs = useRef<HTMLDivElement[]>([]);
  const stopRefs = useRef<HTMLButtonElement[]>([]);

  const apiRef = useRef<ExperienceApi | null>(null);
  const pendingRef = useRef<number | null>(null);
  const [wantLoad, setWantLoad] = useState(false);
  const [failed, setFailed] = useState(false);
  const [card, setCard] = useState({ idx: -1, show: false });
  const tRef = useLatest(t);

  // 3D is loaded only when the section comes near the viewport (or the visitor asks for it)
  useEffect(() => {
    const sec = sectionRef.current!;
    const io = new IntersectionObserver(([en]) => en.isIntersecting && setWantLoad(true), { rootMargin: '50% 0px' });
    io.observe(sec);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (prevRef.current) prevRef.current.disabled = true;
    if (tStopRef.current) tStopRef.current.textContent = '—';
    if (tVelRef.current) tVelRef.current.textContent = '0.0';
  }, []);

  useEffect(() => {
    if (!apiRef.current && tStatusRef.current) tStatusRef.current.textContent = t('exp.statusPad');
  }, [t]);

  useEffect(() => {
    if (!wantLoad || failed) return;
    if (!hasWebGL()) {
      setFailed(true);
      return;
    }
    let cancelled = false, loaded = false;
    const timers: number[] = [];
    const fail = (e?: unknown) => {
      if (cancelled || loaded) return;
      if (e) console.warn('experience: 3D unavailable, showing the list instead', e);
      cancelled = true;
      setFailed(true);
    };
    timers.push(window.setTimeout(() => fail(), LOAD_TIMEOUT));
    import('@/lib/experienceScene')
      .then(({ createExperience }) => {
        const start = (attempt: number) => {
          if (cancelled) return;
          try {
            apiRef.current = createExperience(
              {
                section: sectionRef.current!, stage: stageRef.current!, canvas: canvasRef.current!,
                intro: introRef.current!, pill: pillRef.current!,
                tStop: tStopRef.current!, tVel: tVelRef.current!, tStatus: tStatusRef.current!,
                labels: labelRefs.current, track: trackRef.current!, stopBtns: stopRefs.current,
                prevBtn: prevRef.current!, nextBtn: nextRef.current!,
              },
              N,
              {
                onCard: (idx) => {
                  if (idx === null) setCard((c) => ({ ...c, show: false }));
                  else {
                    setCard({ idx, show: false });
                    requestAnimationFrame(() => setCard({ idx, show: true }));
                  }
                },
                status: (kind) => tRef.current(kind === 'pad' ? 'exp.statusPad' : kind === 'transit' ? 'exp.statusTransit' : 'exp.statusDocked'),
              },
            );
            loaded = true;
            timers.forEach(clearTimeout);
            if (pendingRef.current !== null) { apiRef.current.goTo(pendingRef.current); pendingRef.current = null; }
          } catch (e) {
            // one retry: a WebGL context can fail transiently while the page is busy
            if (attempt === 0) timers.push(window.setTimeout(() => start(1), 400));
            else fail(e);
          }
        };
        start(0);
      })
      .catch(fail);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      apiRef.current?.destroy();
      apiRef.current = null;
    };
  }, [wantLoad, failed, tRef]);

  const goTo = useCallback((i: number) => {
    if (apiRef.current) apiRef.current.goTo(i);
    else { pendingRef.current = i; setWantLoad(true); }
  }, []);

  const launch = () => {
    const sec = sectionRef.current!;
    scrollTo({ top: sec.offsetTop + sec.offsetHeight / 2 - innerHeight / 2, behavior: 'smooth' });
    goTo(0);
  };

  const s = card.idx >= 0 ? STOPS[card.idx] : null;
  const cardClass = `card glass${card.idx % 2 === 1 ? ' left' : ''}${card.show ? ' show' : ''}`;

  return (
    <section className="exp" id="experience" ref={sectionRef}>
      <div className="shead exphead">
        <SplitHeading text={t('exp.title')} />
        <Reveal as="p" className="secnote"><Rich parts={rich('exp.note')} /></Reveal>
      </div>
      <div className="stage" id="stage" ref={stageRef}>
        {failed ? (
          <Fallback />
        ) : (
          <>
            <canvas id="expCanvas" ref={canvasRef} aria-hidden="true" />
            <div className="expIntro" id="expIntro" ref={introRef}>
              <div className="num mono">{t('exp.introNum')}</div>
              <h2>{t('exp.introTitle')}</h2>
              <p>{t('exp.introText')}</p>
              <button type="button" className="btn primary" id="launchBtn" onClick={launch}>{t('exp.launch')}</button>
              <div className="hint mono">{t('exp.introHint')}</div>
            </div>
            <div className="engagePill glass mono" id="engagePill" ref={pillRef}>
              <span id="pillText">{t('exp.pill')}</span>
            </div>
            <div className="telemetry mono" aria-hidden="true">
              {telemetryLabel(t('exp.tStop'))}<span ref={tStopRef} /><br />
              {telemetryLabel(t('exp.tVelocity'))}<span ref={tVelRef} /> km/s<br />
              {telemetryLabel(t('exp.tStatus'))}<span ref={tStatusRef} />
            </div>
            <div id="labels">
              {STOPS.map((st, i) => (
                <div key={i} className="plabel" ref={(el) => { if (el) labelRefs.current[i] = el; }}>
                  <b>{st.company}</b>
                  <small>{st.year}</small>
                </div>
              ))}
            </div>
            <article className={cardClass} id="card" aria-live="polite">
              {s && (
                <>
                  <div className="meta mono">
                    <span>{t('exp.cardStop')} {pad(card.idx + 1)} / {pad(N)}</span>
                    <span className="badge mono">{pick(s.type)}</span>
                  </div>
                  <h3>{s.company}</h3>
                  <div className="role">{pick(s.role)}</div>
                  <div className="dates mono">{pick(s.dates)}</div>
                  {s.link && (
                    <a className="clink mono" href={s.link} target="_blank" rel="noopener">
                      {s.link.replace(/^https?:\/\/(www\.)?/, '')} ↗
                    </a>
                  )}
                  <ul>{pick(s.bullets).map((b, j) => <li key={j}>{b}</li>)}</ul>
                </>
              )}
            </article>
            <div className="expnav glass">
              <button type="button" className="arrow" id="prevBtn" ref={prevRef} aria-label={t('exp.prev')} onClick={() => (apiRef.current ? apiRef.current.prev() : goTo(0))}>←</button>
              <div className="track" id="track" ref={trackRef}>
                {STOPS.map((st, i) => (
                  <button
                    type="button"
                    key={i}
                    className="stopBtn"
                    ref={(el) => { if (el) stopRefs.current[i] = el; }}
                    aria-label={`${st.short} ${st.year} — ${st.company}, ${pick(st.dates)}`}
                    onClick={() => goTo(i)}
                  >
                    <i />
                    <span>{st.short}</span>{' '}
                    <small>{st.year}</small>
                  </button>
                ))}
              </div>
              <button type="button" className="arrow" id="nextBtn" ref={nextRef} aria-label={t('exp.next')} onClick={() => (apiRef.current ? apiRef.current.next() : goTo(0))}>→</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
