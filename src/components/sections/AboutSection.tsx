import { useLanguage } from '@/contexts/LanguageContext';
import { Languages, BrainCircuit, Rocket, GraduationCap } from 'lucide-react';
import { SparklesBackground } from '@/components/ui/sparkles-background';
import profilePhoto from '@/assets/profile-photo.png';

const AboutSection = () => {
  const { t } = useLanguage();

  const languages = [
    { nameKey: 'about.language.french', proficiencyKey: 'about.proficiency.working' },
    { nameKey: 'about.language.english', proficiencyKey: 'about.proficiency.professional' },
    { nameKey: 'about.language.hindi', proficiencyKey: 'about.proficiency.native' },
    { nameKey: 'about.language.sindhi', proficiencyKey: 'about.proficiency.native' },
    { nameKey: 'about.language.gujarati', proficiencyKey: 'about.proficiency.professional' },
  ];

  return (
    <SparklesBackground>
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">
          {t('about.title')}
        </h2>

        {/* Two-Column Layout: Image + Content */}
        <div className="grid md:grid-cols-[auto_1fr] gap-8 lg:gap-12 mb-16 items-center">
          {/* Left: Profile Photo */}
          <div className="relative flex justify-center md:justify-start">
            <div className="relative">
              <img 
                src={profilePhoto} 
                alt="Profile photo" 
                className="w-full max-w-xs rounded-xl shadow-lg border border-border object-cover"
              />
              {/* Decorative accent */}
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-xl border-2 border-secondary/30 -z-10" />
            </div>
          </div>

          {/* Right: Description paragraphs */}
          <div className="flex flex-col gap-5">
            <div className="card-accent flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <BrainCircuit className="w-5 h-5 text-primary" />
              </div>
              <p className="text-foreground font-medium leading-relaxed">
                {t('about.description')}
              </p>
            </div>
            <div className="card-accent flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <p className="text-foreground font-medium leading-relaxed">
                {t('about.paragraph2')}
              </p>
            </div>
            <div className="card-accent flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <p className="text-foreground font-medium leading-relaxed">
                {t('about.paragraph3')}
              </p>
            </div>
          </div>
        </div>

        {/* Languages Section */}
        <div className="bg-gradient-to-br from-card via-card to-background-alt border border-border rounded-xl p-8 shadow-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center border border-secondary/30">
              <Languages className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              {t('about.languagesTitle')}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {languages.map((lang, index) => (
              <div
                key={index}
                className="relative rounded-xl p-5 text-center transition-all duration-300 border border-primary/30 bg-primary/10 hover:bg-primary/15 hover:border-primary/50 hover:scale-105 hover:shadow-lg"
              >
                <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-secondary" />
                <p className="font-bold text-foreground text-lg mb-2">
                  {t(lang.nameKey)}
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  {t(lang.proficiencyKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      </section>
    </SparklesBackground>
  );
};

export default AboutSection;
