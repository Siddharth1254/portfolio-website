import { useLanguage } from '@/contexts/LanguageContext';
import { GraduationCap, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { SparklesBackground } from '@/components/ui/sparkles-background';

const EducationSection = () => {
  const { t } = useLanguage();

  const education = [
    {
      titleKey: 'education.degree1.title',
      schoolKey: 'education.degree1.school',
      dateKey: 'education.degree1.date',
      locationKey: 'education.degree1.location',
      schoolUrl: 'https://www.aivancity.ai/',
    },
    {
      titleKey: 'education.degree2.title',
      schoolKey: 'education.degree2.school',
      dateKey: 'education.degree2.date',
      locationKey: 'education.degree2.location',
    },
  ];

  return (
    <SparklesBackground>
      <section id="education" className="py-20 px-4 sm:px-6 lg:px-8 section-alt">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">
          {t('education.title')}
        </h2>

        <div className="space-y-8">
          {education.map((edu, index) => (
            <div
              key={index}
              className="relative pl-8 timeline-line pb-8 last:pb-0"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-0 -translate-x-[9px] timeline-dot" />

              <div className="card-accent">
                <div className="flex items-start gap-4">
                  <div className="hidden sm:flex w-12 h-12 rounded-lg bg-primary/10 items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {t(edu.titleKey)}
                    </h3>
                    <p className="text-secondary font-medium mb-2">
                      {t(edu.schoolKey)}
                    </p>
                    {edu.schoolUrl && (
                      <a
                        href={edu.schoolUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors mb-3"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {edu.schoolUrl}
                      </a>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {t(edu.dateKey)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {t(edu.locationKey)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </section>
    </SparklesBackground>
  );
};

export default EducationSection;
