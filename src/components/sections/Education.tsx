import { Reveal, SplitHeading } from '@/components/common';
import { EDUCATION } from '@/data/profile';
import { useLanguage } from '@/i18n/LanguageContext';

export function Education() {
  const { t, pick } = useLanguage();
  return (
    <section className="block" id="education">
      <div className="shead"><SplitHeading text={t('edu.title')} /></div>
      <Reveal as="ul" className="edulist">
        {EDUCATION.map((e) => (
          <li key={e.school}>
            <span className={`dot${e.current ? ' now' : ''}`} />
            <div>
              <h3>{pick(e.title)}</h3>
              <div className="where">
                {e.schoolUrl ? <a href={e.schoolUrl} target="_blank" rel="noopener">{e.school}</a> : e.school} · {pick(e.place)}
              </div>
            </div>
            <div className="when mono">{pick(e.when)}</div>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
