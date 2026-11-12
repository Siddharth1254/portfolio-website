import { useEffect, useRef } from 'react';
import { createSky } from '@/lib/sky';

export function Sky() {
  const night = useRef<HTMLCanvasElement>(null);
  const day = useRef<HTMLCanvasElement>(null);
  const twinkle = useRef<HTMLCanvasElement>(null);

  useEffect(() => createSky(night.current!, day.current!, twinkle.current!), []);

  return (
    <>
      <canvas className="sky" id="skyNight" ref={night} aria-hidden="true" />
      <canvas className="sky" id="skyDay" ref={day} aria-hidden="true" />
      <canvas className="sky" id="twinkle" ref={twinkle} aria-hidden="true" />
    </>
  );
}
