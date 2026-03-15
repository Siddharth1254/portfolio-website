import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Award } from 'lucide-react';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { SparklesBackground } from '@/components/ui/sparkles-background';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Certification {
  nameKey: string;
  issuerKey: string;
  image: string;
  issuerLogo: string | null;
}

const CertificationsSection = () => {
  const { t } = useLanguage();
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  const certifications: Certification[] = [
    {
      nameKey: 'certifications.cert1.name',
      issuerKey: 'certifications.cert1.issuer',
      image: '/certificates/rag-certificate.png',
      issuerLogo: null,
    },
    {
      nameKey: 'certifications.cert2.name',
      issuerKey: 'certifications.cert2.issuer',
      image: '/certificates/ml-specialization.png',
      issuerLogo: null,
    },
  ];

  return (
    <SparklesBackground>
      <section id="certifications" className="py-20 px-4 sm:px-6 lg:px-8 section-alt">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">
            {t('certifications.title')}
          </h2>

          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
            <div
              className="flex gap-6 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent snap-x snap-mandatory"
              style={{ scrollbarWidth: 'thin' }}
            >
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="relative flex-shrink-0 w-[320px] sm:w-[360px] rounded-[1rem] border-2 border-border p-1.5 md:rounded-[1.25rem] md:p-2 snap-center first:ml-0 last:mr-0"
                >
                  <GlowingEffect
                    blur={0}
                    borderWidth={3}
                    spread={80}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                  />
                  <div className="relative flex flex-col h-full overflow-hidden rounded-xl bg-background shadow-sm dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                    <span className="absolute bottom-4 right-4 text-4xl font-bold text-muted-foreground/20 z-10 select-none">
                      {index + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className="relative w-full aspect-video overflow-hidden bg-muted cursor-pointer text-left"
                    >
                      <img
                        src={cert.image}
                        alt={t(cert.nameKey)}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/90 backdrop-blur-sm flex items-center justify-center">
                          <Award className="w-5 h-5 text-primary-foreground" />
                        </div>
                      </div>
                    </button>

                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {t(cert.nameKey)}
                      </h3>

                      <div className="flex items-center gap-2 mt-auto">
                        {cert.issuerLogo && (
                          <img
                            src={cert.issuerLogo}
                            alt=""
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        <span className="text-sm text-muted-foreground">
                          {t(cert.issuerKey)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Dialog open={!!selectedCert} onOpenChange={(open) => !open && setSelectedCert(null)}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>{selectedCert ? t(selectedCert.nameKey) : ''}</DialogTitle>
            {selectedCert && (
              <p className="text-sm text-muted-foreground">{t(selectedCert.issuerKey)}</p>
            )}
          </DialogHeader>
          <div className="p-4 pt-2">
            {selectedCert && (
              <img
                src={selectedCert.image}
                alt={t(selectedCert.nameKey)}
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </SparklesBackground>
  );
};

export default CertificationsSection;
