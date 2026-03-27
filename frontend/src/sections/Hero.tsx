import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HeroProps {
  readonly scrollToSection: (sectionId: string) => void;
}

export default function Hero({ scrollToSection }: HeroProps) {
  const { t } = useTranslation();

  return (
    <section id="hero" className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.jpg"
          alt="Security Operations Center"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 gradient-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-0">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
            {t('hero-titulo')}
            <span className="block text-blue-300">{t('hero-subtitulo')}</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
            {t('hero-descripcion')}
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-white text-gmh-blue hover:bg-gmh-blue-light hover:text-white font-semibold px-8 py-6 text-base rounded-md transition-all hover:shadow-lg group cursor-pointer"
              onClick={() => scrollToSection('solutions')}
            >
              {t('hero-ver-soluciones')}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-blue-500 bg-transparent text-white hover:bg-blue-500 hover:border-blue-600 font-semibold px-8 py-6 text-base rounded-md transition-all hover:shadow-lg cursor-pointer hover:text-white"
              onClick={() => scrollToSection('contact')}
            >
              {t('hero-contactanos')}
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <a href="#services" className="flex flex-col items-center text-white/60 hover:text-white transition-colors">
          <span className="text-xs mb-2 tracking-wider">{t('hero-descubrir-mas')}</span>
          <ChevronDown className="w-6 h-6" />
        </a>
      </div>
    </section>
  );
}
