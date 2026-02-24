import React, {
  useState,
  useRef,
  useContext,
  createContext,
  useEffect
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring
} from "framer-motion";

// Shared mouse position context
const MouseContext = createContext({ x: 0, y: 0 });

// SVG Icons
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const MediumIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
  </svg>
);

const SubstackIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
  </svg>
);

interface DockIconProps {
  icon: React.ReactNode;
  href: string;
  label: string;
  displayLabel: string;
}

// Individual icon with magnetic effect
function DockIcon({ icon, href, label, displayLabel }: DockIconProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mouse = useContext(MouseContext);
  const distance = useMotionValue(Infinity);

  useEffect(() => {
    if (!ref.current || mouse.x === 0) {
      distance.set(Infinity);
      return;
    }
    const iconRect = ref.current.getBoundingClientRect();
    const containerRect = ref.current.parentElement?.getBoundingClientRect();
    if (!containerRect) return;
    
    const iconCenterX = iconRect.left + iconRect.width / 2;
    const mouseXAbsolute = containerRect.left + mouse.x;
    distance.set(Math.abs(mouseXAbsolute - iconCenterX));
  }, [mouse, distance]);

  const scale = useTransform(distance, [0, 80], [1.25, 1]);
  const y = useTransform(distance, [0, 80], [-8, 0]);
  const springScale = useSpring(scale, { mass: 0.1, stiffness: 150, damping: 12 });
  const springY = useSpring(y, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{ scale: springScale, y: springY }}
      className="flex flex-col items-center justify-start gap-2 px-4 py-3 rounded-xl bg-card/80 backdrop-blur-sm border border-border text-primary hover:text-secondary transition-colors w-28 min-h-[88px]"
    >
      {icon}
      <span className="text-xs font-medium text-center leading-tight">{displayLabel}</span>
    </motion.a>
  );
}

interface MagneticDockProps {
  t: (key: string) => string;
}

// Main dock component
export default function MagneticDock({ t }: MagneticDockProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const socialLinks = [
    {
      icon: <LinkedinIcon />,
      href: 'https://linkedin.com/in/siddharthtaurani',
      label: 'LinkedIn',
      displayLabel: t('contact.linkedin'),
    },
    {
      icon: <GithubIcon />,
      href: 'https://github.com/Siddharth1254',
      label: 'GitHub',
      displayLabel: t('contact.github'),
    },
    {
      icon: <MediumIcon />,
      href: 'https://medium.com/@siddharth_1254',
      label: 'Medium',
      displayLabel: t('contact.medium'),
    },
    {
      icon: <SubstackIcon />,
      href: 'https://siddharth-taurani.substack.com',
      label: 'Substack',
      displayLabel: t('contact.substack'),
    },
  ];

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, currentTarget } = e;
    const { left } = currentTarget.getBoundingClientRect();
    setPos({ x: clientX - left, y: 0 });
  };

  const onMouseLeave = () => {
    setPos({ x: 0, y: 0 });
  };

  return (
    <MouseContext.Provider value={pos}>
      <div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="inline-flex flex-wrap justify-center items-stretch gap-3 px-4 py-3 rounded-2xl bg-card/50 backdrop-blur-md border border-border"
      >
        {socialLinks.map((link) => (
          <DockIcon
            key={link.label}
            icon={link.icon}
            href={link.href}
            label={link.label}
            displayLabel={link.displayLabel}
          />
        ))}
      </div>
    </MouseContext.Provider>
  );
}
