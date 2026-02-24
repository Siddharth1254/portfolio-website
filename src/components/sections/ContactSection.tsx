import { useLanguage } from '@/contexts/LanguageContext';
import { Mail } from 'lucide-react';
import MagneticDock from '@/components/ui/magnetic-dock';
import { SparklesBackground } from '@/components/ui/sparkles-background';

const ContactSection = () => {
  const { t } = useLanguage();

  return (
    <SparklesBackground>
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 section-alt">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="section-title">
          {t('contact.title')}
        </h2>

        <div className="text-lg text-muted-foreground mb-10 leading-relaxed space-y-4 text-left">
          <p>{t('contact.description1')}</p>
          <p>{t('contact.description2')}</p>
          <p>{t('contact.description3')}</p>
        </div>

        {/* Email */}
        <a
          href="mailto:siddharth.taurani@gmail.com"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors duration-300 mb-10"
        >
          <Mail className="w-5 h-5" />
          {t('contact.email')}
        </a>

        {/* Social Links */}
        <div>
          <p className="text-sm text-muted-foreground mb-4">{t('contact.connect')}</p>
          <MagneticDock t={t} />
        </div>
      </div>
      </section>
    </SparklesBackground>
  );
};

export default ContactSection;
