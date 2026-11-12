import { Fragment, type CSSProperties, type ElementType, type ReactNode } from 'react';
import type { RichText } from '@/i18n/types';
import { useReveal } from '@/lib/reveal';

export function Rich({ parts, bold: Bold = 'b' }: { parts: RichText; bold?: 'b' | 'strong' }) {
  return (
    <>
      {parts.map((p, i) => (typeof p === 'string' ? <Fragment key={i}>{p}</Fragment> : <Bold key={i}>{p.b}</Bold>))}
    </>
  );
}

/** Heading whose words slide up one after another when it scrolls into view. */
export function SplitHeading({ text }: { text: string }) {
  const [ref, shown] = useReveal<HTMLHeadingElement>();
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <h2 ref={ref} className={`split${shown ? ' in' : ''}`}>
      {words.map((w, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span className="w">
            <span style={{ transitionDelay: `${i * 70}ms` }}>{w}</span>
          </span>
        </Fragment>
      ))}
    </h2>
  );
}

interface RevealProps {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** Fades and lifts its content in once it scrolls into view (`.reveal` → `.reveal.in`). */
export function Reveal({ as: Tag = 'div', className = '', style, children }: RevealProps) {
  const [ref, shown] = useReveal<HTMLElement>();
  return (
    <Tag ref={ref} className={`${className ? className + ' ' : ''}reveal${shown ? ' in' : ''}`} style={style}>
      {children}
    </Tag>
  );
}
