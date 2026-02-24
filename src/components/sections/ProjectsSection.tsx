import { useLanguage } from '@/contexts/LanguageContext';
import { FolderGit2 } from 'lucide-react';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { ButtonColorful } from '@/components/ui/button-colorful';
import { SparklesBackground } from '@/components/ui/sparkles-background';
import aiColdEmailThumbnail from '@/assets/ai-cold-email-thumbnail.png';
import sentimentAnalysisThumbnail from '@/assets/sentiment-analysis-thumbnail.png';
import gamingMarketInsightsThumbnail from '@/assets/gaming-market-insights-thumbnail.png';

const ProjectsSection = () => {
  const { t } = useLanguage();

  const projects = [
    {
      titleKey: 'projects.project1.title',
      descKey: 'projects.project1.desc',
      techKey: 'projects.project1.tech',
      githubUrl: 'https://github.com/Siddharth1254/ai-cold-email-generator',
      thumbnail: aiColdEmailThumbnail,
    },
    {
      titleKey: 'projects.project2.title',
      descKey: 'projects.project2.desc',
      techKey: 'projects.project2.tech',
      githubUrl: 'https://github.com/Siddharth1254/sentiment-analysis-with-bert',
      thumbnail: sentimentAnalysisThumbnail,
    },
    {
      titleKey: 'projects.project3.title',
      descKey: 'projects.project3.desc',
      techKey: 'projects.project3.tech',
      githubUrl: 'https://github.com/Siddharth1254/gaming-market-insights',
      thumbnail: gamingMarketInsightsThumbnail,
    },
  ];

  return (
    <SparklesBackground>
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 section-alt">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">
          {t('projects.title')}
        </h2>

        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
          <div 
            className="flex gap-6 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent snap-x snap-mandatory"
            style={{ scrollbarWidth: 'thin' }}
          >
            {projects.map((project, index) => (
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
                  {/* Card Number */}
                  <span className="absolute bottom-4 right-4 text-4xl font-bold text-muted-foreground/20 z-10 select-none">
                    {index + 1}
                  </span>
                  
                  {/* Thumbnail Image */}
                  <div className="relative w-full aspect-video overflow-hidden bg-muted">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={t(project.titleKey)}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FolderGit2 className="w-12 h-12 text-muted-foreground/50" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/90 backdrop-blur-sm flex items-center justify-center">
                        <FolderGit2 className="w-5 h-5 text-primary-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {t(project.titleKey)}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed flex-1">
                      {t(project.descKey)}
                    </p>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4 min-h-[60px]">
                      {t(project.techKey).split(', ').map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs rounded-md bg-primary text-primary-foreground font-medium h-fit"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="mt-auto">
                      <ButtonColorful label={t('projects.viewGithub')} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </section>
    </SparklesBackground>
  );
};

export default ProjectsSection;
