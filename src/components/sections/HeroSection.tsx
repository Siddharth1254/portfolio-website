import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowDown, Briefcase } from 'lucide-react';
import { AuroraBackground } from '@/components/ui/aurora-background';

const HeroSection = () => {
  const { t } = useLanguage();

  const scrollToAbout = () => {
    const element = document.querySelector('#about');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AuroraBackground className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-left sm:text-center relative z-10">
        {/* Name with Lora serif font */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary dark:text-[hsl(213_50%_62%)] mb-4 fade-in-up tracking-tight drop-shadow-sm">
          {t('hero.title')}
        </h1>
        
        {/* Decorative line under title */}
        <div className="flex items-center justify-center gap-2 mb-6 fade-in-up fade-in-up-delay-1">
          <div className="h-[2px] w-8 bg-secondary/40" />
          <div className="w-2 h-2 rotate-45 bg-secondary" />
          <div className="h-[2px] w-8 bg-secondary/40" />
        </div>
        
        {/* Subtitle with maroon accent */}
        <p className="text-xl sm:text-2xl text-secondary font-medium mb-6 fade-in-up fade-in-up-delay-1">
          {t('hero.subtitle')}
        </p>
        
        {/* Tagline with brackets */}
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6 fade-in-up fade-in-up-delay-2 leading-relaxed">
          <span className="font-mono-accent text-secondary/60">[</span>
          {' '}{t('hero.tagline')}{' '}
          <span className="font-mono-accent text-secondary/60">]</span>
        </p>

        {/* Availability line */}
        <p className="flex items-center justify-start sm:justify-center gap-2.5 text-base text-foreground/80 font-medium max-w-2xl mx-auto mb-10 fade-in-up fade-in-up-delay-3">
          <Briefcase size={16} className="shrink-0 text-secondary/70" />
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span>{t('hero.availability')}</span>
        </p>
        
        {/* CTA Button - Navy with maroon hover effect */}
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-all duration-300 fade-in-up fade-in-up-delay-3 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          {t('hero.cta')}
        </a>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-secondary transition-colors duration-200 animate-bounce"
        aria-label="Scroll to About section"
      >
        <ArrowDown size={24} />
      </button>
    </AuroraBackground>
  );
};

export default HeroSection;
