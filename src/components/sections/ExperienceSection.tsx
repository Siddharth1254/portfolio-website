import { useLanguage } from '@/contexts/LanguageContext';
import { Briefcase, MapPin, Building, Laptop, ExternalLink } from 'lucide-react';
import { SparklesBackground } from '@/components/ui/sparkles-background';
import { Timeline } from '@/components/ui/timeline';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ExperienceSection = () => {
  const { t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const experiences = [
    {
      titleKey: 'experience.job1.title',
      companyKey: 'experience.job1.company',
      dateKey: 'experience.job1.date',
      locationKey: 'experience.job1.location',
      descKeys: ['experience.job1.desc1', 'experience.job1.desc2', 'experience.job1.desc3'],
      contractType: 'contract',
      workMode: 'remote',
    },
    {
      titleKey: 'experience.job2.title',
      companyKey: 'experience.job2.company',
      dateKey: 'experience.job2.date',
      locationKey: 'experience.job2.location',
      descKeys: ['experience.job2.desc1', 'experience.job2.desc2', 'experience.job2.desc3'],
      contractType: 'aiClinic',
      workMode: 'remote',
    },
    {
      titleKey: 'experience.job3.title',
      companyKey: 'experience.job3.company',
      dateKey: 'experience.job3.date',
      locationKey: 'experience.job3.location',
      descKeys: ['experience.job3.desc1', 'experience.job3.desc2', 'experience.job3.desc3'],
      contractType: 'internship',
      workMode: 'remote',
    },
    {
      titleKey: 'experience.job4.title',
      companyKey: 'experience.job4.company',
      dateKey: 'experience.job4.date',
      locationKey: 'experience.job4.location',
      descKeys: ['experience.job4.desc1', 'experience.job4.desc2', 'experience.job4.desc3'],
      contractType: 'aiClinic',
      workMode: 'remote',
      companyUrl: 'https://www.pangea-summit.com/pangea-labs',
    },
    {
      titleKey: 'experience.job5.title',
      companyKey: 'experience.job5.company',
      dateKey: 'experience.job5.date',
      locationKey: 'experience.job5.location',
      descKeys: ['experience.job5.desc1', 'experience.job5.desc2', 'experience.job5.desc3'],
      contractType: 'aiClinic',
      workMode: 'remote',
    },
    {
      titleKey: 'experience.job6.title',
      companyKey: 'experience.job6.company',
      dateKey: 'experience.job6.date',
      locationKey: 'experience.job6.location',
      descKeys: ['experience.job6.desc1', 'experience.job6.desc2', 'experience.job6.desc3'],
      contractType: 'internship',
      workMode: 'remote',
      companyUrl: 'https://www.algoetico.com/about',
    },
    {
      titleKey: 'experience.job7.title',
      companyKey: 'experience.job7.company',
      dateKey: 'experience.job7.date',
      locationKey: 'experience.job7.location',
      descKeys: ['experience.job7.desc1', 'experience.job7.desc2', 'experience.job7.desc3'],
      contractType: 'aiClinic',
      workMode: 'remote',
    },
    {
      titleKey: 'experience.job8.title',
      companyKey: 'experience.job8.company',
      dateKey: 'experience.job8.date',
      locationKey: 'experience.job8.location',
      descKeys: ['experience.job8.desc1', 'experience.job8.desc2', 'experience.job8.desc3'],
      contractType: 'aiClinic',
      workMode: 'remote',
    },
  ];

  const getContractLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      contract: 'experience.contract',
      internship: 'experience.internship',
      aiClinic: 'experience.aiClinic',
      partTime: 'experience.partTime',
    };
    return t(typeMap[type] || type);
  };

  const getWorkModeLabel = (mode: string) => {
    const modeMap: Record<string, string> = {
      onsite: 'experience.onsite',
      remote: 'experience.remote',
    };
    return t(modeMap[mode] || mode);
  };

  // Transform experiences into Timeline data format
  const timelineData = experiences.map((exp) => ({
    title: t(exp.dateKey),
    content: (
      <div className="card-accent">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex w-12 h-12 rounded-lg bg-primary/10 items-center justify-center flex-shrink-0">
            <Briefcase className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-foreground">
                {t(exp.titleKey)}
              </h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <p className="text-secondary font-medium">
                {t(exp.companyKey)}
              </p>
              <span className="px-3 py-1 text-sm rounded-full bg-primary/15 text-primary font-semibold border border-primary/20">
                {getContractLabel(exp.contractType)}
              </span>
              <span className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground font-medium flex items-center gap-1">
                {exp.workMode === 'remote' ? (
                  <Laptop className="w-3 h-3" />
                ) : (
                  <Building className="w-3 h-3" />
                )}
                {getWorkModeLabel(exp.workMode)}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {t(exp.locationKey)}
              </span>
            </div>
            
            {exp.companyUrl && (
              <a
                href={exp.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors mb-4"
              >
                <ExternalLink className="w-4 h-4" />
                {exp.companyUrl}
              </a>
            )}
            <ul className="space-y-2">
              {exp.descKeys.map((descKey, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                  {t(descKey)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    ),
  }));

  return (
    <SparklesBackground>
      <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">
            {t('experience.title')}
          </h2>

          {/* AI Clinic Definition */}
          <div className="mb-8 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">{t('experience.aiClinicLabel')}:</span>{' '}
              {t('experience.aiClinicDefinition')}
            </p>
          </div>

          {/* Animated Timeline in Scroll Container */}
          <ScrollArea className="h-[600px] w-full rounded-lg border border-border/50" viewportRef={scrollContainerRef}>
            <Timeline data={timelineData} scrollContainerRef={scrollContainerRef} />
          </ScrollArea>
        </div>
      </section>
    </SparklesBackground>
  );
};

export default ExperienceSection;
