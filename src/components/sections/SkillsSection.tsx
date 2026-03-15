import { useLanguage } from '@/contexts/LanguageContext';
import { SparklesBackground } from '@/components/ui/sparkles-background';
import { motion } from 'framer-motion';
import { Code, Brain, Database, BarChart3, Shield, Settings, LucideIcon } from 'lucide-react';

const SkillsSection = () => {
  const { t } = useLanguage();

  const skillCategories: {
    titleKey: string;
    skills: string[];
    icon: LucideIcon;
  }[] = [
    {
      titleKey: 'skills.programming',
      skills: ['Python', 'SQL', 'Linux/Ubuntu'],
      icon: Code,
    },
    {
      titleKey: 'skills.ai',
      skills: ['AI Agents', 'NLP', 'LLM & Applications', 'Retrieval-Augmented Generation (RAG)', 'Scikit-Learn'],
      icon: Brain,
    },
    {
      titleKey: 'skills.data',
      skills: ['Data Pipelines', 'Data Wrangling', 'ETL', 'Data Preprocessing'],
      icon: Database,
    },
    {
      titleKey: 'skills.mlops',
      skills: ['MCP', 'Docker', 'MLOps', 'GitHub Actions'],
      icon: Settings,
    },
    {
      titleKey: 'skills.tools',
      skills: ['Power BI', 'Looker Studio', 'MS Excel'],
      icon: BarChart3,
    },
    {
      titleKey: 'skills.responsible',
      skills: ['AI Ethics', 'AI Compliance', 'Data Governance'],
      icon: Shield,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const badgeContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const badgeVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <SparklesBackground>
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            {t('skills.title')}
          </motion.h2>

          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {skillCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={{ 
                    y: -4,
                    transition: { duration: 0.2 }
                  }}
                  className="group relative p-5 rounded-xl border-l-4 border-l-secondary
                    bg-card/60 backdrop-blur-sm border border-border/50
                    hover:bg-card/80 hover:border-secondary/30 hover:shadow-lg
                    transition-all duration-300"
                >
                  {/* Header with icon */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/50">
                    <div className="p-2 rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary/20 transition-colors duration-200">
                      <IconComponent className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      {t(category.titleKey)}
                    </h3>
                  </div>

                  {/* Skills badges */}
                  <motion.div 
                    className="flex flex-wrap gap-2"
                    variants={badgeContainerVariants}
                  >
                    {category.skills.map((skill, i) => (
                      <motion.span
                        key={i}
                        variants={badgeVariants}
                        whileHover={{ 
                          scale: 1.05,
                          transition: { duration: 0.15 }
                        }}
                        className="relative px-3 py-1.5 text-sm rounded-lg 
                          bg-primary text-primary-foreground font-medium 
                          cursor-default overflow-hidden
                          hover:shadow-md transition-shadow duration-200
                          before:absolute before:inset-0 before:bg-gradient-to-r 
                          before:from-transparent before:via-white/20 before:to-transparent
                          before:translate-x-[-200%] hover:before:translate-x-[200%]
                          before:transition-transform before:duration-700"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </SparklesBackground>
  );
};

export default SkillsSection;
