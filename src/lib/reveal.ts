/* Reveal-on-scroll: one shared IntersectionObserver, plus a geometry check on
   scroll/resize/interval so content never stays invisible if the observer misses. */
import { useEffect, useRef, useState } from 'react';

const pending = new Map<Element, () => void>();
let io: IntersectionObserver | null = null;
let timer = 0;

function fire(el: Element) {
  const cb = pending.get(el);
  if (!cb) return;
  pending.delete(el);
  io?.unobserve(el);
  cb();
  if (pending.size === 0) teardown();
}

function check() {
  for (const el of [...pending.keys()]) {
    const r = el.getBoundingClientRect();
    if (r.height === 0 && r.width === 0) continue;
    if (r.top < innerHeight * 0.92 && r.bottom > 0) fire(el);
  }
}

function setup() {
  if (io) return;
  io = new IntersectionObserver((ents) => ents.forEach((en) => en.isIntersecting && fire(en.target)), {
    threshold: 0.2,
    rootMargin: '0px 0px -8% 0px',
  });
  addEventListener('scroll', check, { passive: true });
  addEventListener('resize', check);
  timer = window.setInterval(check, 500);
}

function teardown() {
  io?.disconnect();
  io = null;
  removeEventListener('scroll', check);
  removeEventListener('resize', check);
  clearInterval(timer);
}

export function observeReveal(el: Element, cb: () => void) {
  setup();
  pending.set(el, cb);
  io!.observe(el);
  return () => {
    if (!pending.has(el)) return;
    pending.delete(el);
    io?.unobserve(el);
    if (pending.size === 0) teardown();
  };
}

/** Returns a ref and whether the element has been revealed (stays true once revealed). */
export function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeReveal(el, () => setShown(true));
  }, []);
  return [ref, shown] as const;
}
