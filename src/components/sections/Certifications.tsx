import { useRef, useState, type KeyboardEvent } from 'react';
import { SplitHeading } from '@/components/common';
import { CERTS, type Certification } from '@/data/certifications';
import { useLanguage } from '@/i18n/LanguageContext';
import { useReveal } from '@/lib/reveal';

/* Hover (or tap / Enter) to reveal the certificate; once revealed, a click opens the full certificate. */
function CertCard({ cert }: { cert: Certification }) {
  const { t, pick } = useLanguage();
  const [ref, shown] = useReveal<HTMLDivElement>();
  const [on, setOn] = useState(false);
  const hovering = useRef(false);
  const name = pick(cert.name);

  const open = () => window.open(cert.pdf ?? cert.fullImage, '_blank', 'noopener');
  const activate = () => (on || hovering.current ? open() : setOn(true));
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (on) open();
      else setOn(true);
    }
  };

  return (
    <div
      ref={ref}
      className={`flip reveal${shown ? ' in' : ''}${on ? ' on' : ''}`}
      tabIndex={0}
      role="button"
      aria-label={t('cert.aria', { name })}
      onClick={activate}
      onKeyDown={onKey}
      onBlur={() => setOn(false)}
      onPointerEnter={(e) => { hovering.current = e.pointerType === 'mouse'; }}
      onPointerLeave={() => { hovering.current = false; }}
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
