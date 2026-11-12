import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { SplitHeading } from '@/components/common';
import { CERTS, type Certification } from '@/data/certifications';
import { useLanguage } from '@/i18n/LanguageContext';
import { useReveal } from '@/lib/reveal';

/* Mouse: CSS :hover flips; click opens.
   Touch: first tap flips (.on), second tap opens.
   Keyboard: Enter flips, Enter again opens. PNG fallback until PDFs are added. */
function CertCard({ cert }: { cert: Certification }) {
  const { t, pick } = useLanguage();
  const [ref, shown] = useReveal<HTMLDivElement>();
  const [on, setOn] = useState(false);
  const pointerType = useRef<string>('mouse');
  const name = pick(cert.name);

  const open = () => window.open(cert.pdf ?? cert.fullImage, '_blank', 'noopener');

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    pointerType.current = e.pointerType;
  };

  const onActivate = () => {
    /* mouse: hover already reveals; click opens immediately */
    if (pointerType.current === 'mouse') {
      open();
      return;
    }
    /* touch / pen: first tap flips, second opens */
    if (on) open();
    else setOn(true);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (on) open();
    else setOn(true);
  };

  return (
    <div
      ref={ref}
      className={`flip reveal${shown ? ' in' : ''}${on ? ' on' : ''}`}
      tabIndex={0}
      role="button"
      aria-label={t('cert.aria', { name })}
      onPointerDown={onPointerDown}
      onClick={onActivate}
      onKeyDown={onKey}
      onBlur={() => setOn(false)}
    >
      <div className="flip-in">
        <div className="fface front glass">
          <div className="seal" />
          <div>
            <h3>{name}</h3>
            <p className="hint mono">{cert.issuer} · {t('cert.hint')}</p>
          </div>
        </div>
        <div className="fface back">
          <img src={cert.image} alt={t('cert.alt', { name })} loading="lazy" decoding="async" />
        </div>
      </div>
    </div>
  );
}

export function Certifications() {
  const { t } = useLanguage();
  return (
    <section className="block" id="certifications">
      <div className="shead"><SplitHeading text={t('cert.title')} /></div>
      <div className="cred" id="cred">
        {CERTS.map((c) => <CertCard key={c.key} cert={c} />)}
      </div>
    </section>
  );
}
