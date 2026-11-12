import { useRef, type PointerEvent } from 'react';
import { SplitHeading } from '@/components/common';
import { SKILLS, type SkillGroup } from '@/data/skills';
import { useLanguage } from '@/i18n/LanguageContext';
import { useReveal } from '@/lib/reveal';

function SkillCard({ group }: { group: SkillGroup }) {
  const { pick } = useLanguage();
  const [ref, shown] = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`sk glass${group.wide ? ' wide' : ''}${shown ? ' in' : ''}`}>
      <h3>{pick(group.title)}</h3>
      <ul>
        {pick(group.items).map((x, i) => (
          <li key={i} style={{ transitionDelay: `${i * 45}ms` }}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

export function Skills() {
  const { t } = useLanguage();
  const gridRef = useRef<HTMLDivElement>(null);

  // glowing border follows the cursor across the whole grid
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    gridRef.current?.querySelectorAll<HTMLElement>('.sk').forEach((c) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', e.clientX - r.left + 'px');
      c.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  };
  const onLeave = () => {
    gridRef.current?.querySelectorAll<HTMLElement>('.sk').forEach((c) => {
      c.style.removeProperty('--mx');
      c.style.removeProperty('--my');
    });
  };

  return (
    <section className="block" id="skills">
      <div className="shead">
        <div className="num mono">{t('skills.num')}</div>
        <SplitHeading text={t('skills.title')} />
      </div>
      <div className="skills" id="skillsGrid" ref={gridRef} onPointerMove={onMove} onPointerLeave={onLeave}>
        {SKILLS.map((g) => <SkillCard key={g.title.en} group={g} />)}
      </div>
    </section>
  );
}
