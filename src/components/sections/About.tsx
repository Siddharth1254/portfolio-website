import { Fragment, useEffect, useState, type CSSProperties, type PointerEvent } from 'react';
import photo from '@/assets/profile-photo.webp';
import photo440 from '@/assets/profile-photo-440.webp';
import photo620 from '@/assets/profile-photo-620.webp';
import { Reveal, Rich, SplitHeading } from '@/components/common';
import { LANGUAGES } from '@/data/profile';
import { TERM } from '@/data/terminal';
import { useLanguage } from '@/i18n/LanguageContext';
import { useReveal } from '@/lib/reveal';
import { useLatest } from '@/lib/useLatest';
import { prefersReducedMotion, sleep } from '@/lib/util';

const TILT = 14;

function PhotoCard() {
  const { t } = useLanguage();
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', ((0.5 - py) * TILT).toFixed(2) + 'deg');
    el.style.setProperty('--ry', ((px - 0.5) * TILT).toFixed(2) + 'deg');
    el.style.setProperty('--gx', px * 100 + '%');
    el.style.setProperty('--gy', py * 100 + '%');
    el.style.setProperty('--px', ((0.5 - px) * 10).toFixed(1) + 'px');
    el.style.setProperty('--py', ((0.5 - py) * 10).toFixed(1) + 'px');
  };
  const onLeave = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };
  return (
    <Reveal>
      <div className="photo-card" onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className="ph-in">
          {photo ? (
            <img
              src={photo}
              srcSet={`${photo440} 440w, ${photo620} 620w, ${photo} 820w`}
              // the photo is wider than the 4:5 card, so object-fit: cover renders it wider than the card
              sizes="(max-width: 900px) 290px, 360px"
              alt={t('about.photoAlt')}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="ph-empty mono"><div><b>ST</b>{t('about.photoEmpty')}</div></div>
          )}
          <div className="glare" />
        </div>
      </div>
    </Reveal>
  );
}

/* "RAG" terminal: types the question, then the file rows, then the answer. */
function Terminal() {
  const { t, pick, lang } = useLanguage();
  const [ref, shown] = useReveal<HTMLDivElement>();
  const [pos, setPos] = useState({ row: -1, chars: 0, done: false });
  const langRef = useLatest(lang);

  useEffect(() => {
    if (!shown) return;
    const RM = prefersReducedMotion();
    let cancelled = false;
    (async () => {
      for (let r = 0; r < TERM.length && !cancelled; r++) {
        const line = TERM[r];
        if (line.typed && !RM) {
          for (let c = 0; !cancelled && c <= line.text[langRef.current].length; c++) {
            setPos({ row: r, chars: c, done: false });
            await sleep(line.kind === 'p' ? 45 : 18);
          }
          await sleep(350);
        } else {
          setPos({ row: r, chars: Infinity, done: false });
          await sleep(RM ? 0 : 320);
        }
      }
      if (!cancelled) setPos({ row: TERM.length - 1, chars: Infinity, done: true });
    })();
    return () => { cancelled = true; };
  }, [shown, langRef]);

  return (
    <div ref={ref} className={`term reveal${shown ? ' in' : ''}`}>
      <div className="term-bar mono"><i /><i /><i />{t('about.terminalTitle')}</div>
      <div className="term-body mono" id="term">
        {TERM.slice(0, pos.row + 1).map((line, i) => {
          const text = pick(line.text);
          const visible = i < pos.row ? text : text.slice(0, pos.chars);
          const tight = line.kind === 'p' || line.kind === 'd';
          const last = i === TERM.length - 1;
          return (
            <div key={i} className={`tl ${line.kind}${tight ? ' tight' : ''}`}>
              <span className="k">{pick(line.key)}</span>
              <span className="v">{visible}{pos.done && last && <span className="caret" />}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Languages() {
  const { t, pick } = useLanguage();
  const [ref, shown] = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`langs glass reveal${shown ? ' in' : ''}`}>
      <h3>{t('about.languages')}</h3>
      {LANGUAGES.map((l) => (
        <div className="lang" key={l.name.en}>
          <span>{pick(l.name)}</span>
          <span className="tr"><span className="fill" style={{ '--v': l.value } as CSSProperties} /></span>
          <em>{pick(l.level)}</em>
        </div>
      ))}
    </div>
  );
}

export function About() {
  const { t, rich } = useLanguage();
  const statement = t('about.statement').split(' ');
  return (
    <section className="block" id="about">
      <div className="shead">
        <div className="num mono">{t('about.num')}</div>
        <SplitHeading text={t('about.title')} />
      </div>
      <div className="about-top">
        <PhotoCard />
        <div>
          <p className="statement hl">
            {statement.map((w, i) => (
              <Fragment key={i}>{i > 0 && ' '}<span className="hw">{w}</span></Fragment>
            ))}
          </p>
          <Reveal as="p" className="about-p"><Rich parts={rich('about.p1')} bold="strong" /></Reveal>
          <Reveal as="p" className="about-p"><Rich parts={rich('about.p2')} bold="strong" /></Reveal>
          <Reveal as="p" className="about-p">{t('about.p3')}</Reveal>
        </div>
      </div>
      <div className="about-bottom">
        <Terminal />
        <Languages />
      </div>
    </section>
  );
}
