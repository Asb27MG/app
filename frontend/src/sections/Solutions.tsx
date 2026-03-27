import { Building2, Users, Video, Server, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';



const solutions = [
  {
    tagKey: 'solutions-cctv-tag',
    titleKey: 'solutions-cctv-titulo',
    descKey: 'solutions-cctv-desc',
    detailsKey: 'solutions-cctv-detalles',
    featuresKeys: [
      'solutions-cctv-feature-1',
      'solutions-cctv-feature-2',
      'solutions-cctv-feature-3',
      'solutions-cctv-feature-4',
      'solutions-cctv-feature-5',
      'solutions-cctv-feature-6',
      'solutions-cctv-feature-7',
      'solutions-cctv-feature-8'
    ],
    image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=800&h=500&fit=crop',
    icon: Video,
  },
  {
    tagKey: 'solutions-ia-tag',
    titleKey: 'solutions-ia-titulo',
    descKey: 'solutions-ia-desc',
    detailsKey: 'solutions-ia-detalles',
    featuresKeys: [
      'solutions-ia-feature-1',
      'solutions-ia-feature-2',
      'solutions-ia-feature-3',
      'solutions-ia-feature-4',
      'solutions-ia-feature-5',
      'solutions-ia-feature-6',
      'solutions-ia-feature-7',
      'solutions-ia-feature-8'
    ],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop',
    icon: Server,
  },
  {
    tagKey: 'solutions-traffic-tag',
    titleKey: 'solutions-traffic-titulo',
    descKey: 'solutions-traffic-desc',
    detailsKey: 'solutions-traffic-detalles',
    featuresKeys: [
      'solutions-traffic-feature-1',
      'solutions-traffic-feature-2',
      'solutions-traffic-feature-3',
      'solutions-traffic-feature-4',
      'solutions-traffic-feature-5',
      'solutions-traffic-feature-6',
      'solutions-traffic-feature-7',
      'solutions-traffic-feature-8'
    ],
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=500&fit=crop',
    icon: Building2,
  },
];

const industries = [
  { nameKey: 'industry-retail', icon: Building2 },
  { nameKey: 'industry-manufactura', icon: Server },
  { nameKey: 'industry-educativo', icon: Users },
  { nameKey: 'industry-salud', icon: Building2 },
  { nameKey: 'industry-oficinas', icon: Building2 },
  { nameKey: 'industry-residencias', icon: Building2 },
];

export default function Solutions({ scrollToSection }: { readonly scrollToSection: (sectionId: string) => void }) {
  const { t } = useTranslation();
  const [selectedSolution, setSelectedSolution] = useState<typeof solutions[0] | null>(null);

  return (
    <section id="solutions" className="pt-32 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Solutions Section */}
<div className="text-center mb-10">
  {/* Badge "SOLUCIONES" agregado aquí */}
  <div className="inline-block mb-6 px-4 py-2 bg-blue-100 rounded-full">
    <span className="text-blue-600 font-semibold text-sm tracking-wide">
      {t('solutions-badge')}
    </span>
  </div>
  
  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
    {t('solutions-titulo')}
  </h2>
  <p className="text-lg text-slate-600">
    {t('solutions-subtitulo')}
  </p>
</div>
        

        {/* Industries Section */}
        <div className="bg-slate-50 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {t('solutions-industria-titulo')}
            </h3>
            <p className="text-slate-600">
              {t('solutions-industria-desc')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((industry) => (
              <button
                key={industry.nameKey}
                className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow cursor-pointer border border-slate-200 w-full"
                onClick={() => scrollToSection('contact')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    scrollToSection('contact');
                  }
                }}
              >
                <industry.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-700">{t(industry.nameKey)}</p>
              </button>
            ))}
          </div>
        </div>


        {/* Solutions Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {solutions.map((solution) => (
            <button
              key={solution.titleKey}
              className="relative h-96 rounded-2xl overflow-hidden cursor-pointer group bg-gradient-to-br from-slate-800 to-slate-900 border-0 p-0 w-full text-left"
              onClick={() => scrollToSection('productos')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  scrollToSection('productos');
                }
              }}
            >
              {/* Background Image */}
              <img
                src={solution.image}
                alt={t(solution.titleKey)}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/70 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                <div className="flex items-center gap-2 mb-3">
                  <solution.icon className="h-6 w-6 text-blue-400" />
                  <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">
                    {t(solution.tagKey)}
                  </span>
                </div>
                <h3 className="text-white text-2xl font-bold mb-3 leading-tight">
                  {t(solution.titleKey)}
                </h3>
                <p className="text-slate-200 text-sm mb-4 opacity-90">
                  {t(solution.descKey)}
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSolution(solution);
                  }}
                  className="inline-flex items-center text-sm text-blue-300 font-semibold hover:text-blue-200 transition-colors group">
                  {t('solutions-ver-mas')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </button>
          ))}
        </div>

      </div>

      {/* Detail Modal */}
      {selectedSolution && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <selectedSolution.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-blue-100 text-sm font-semibold mb-1">{t(selectedSolution.tagKey)}</p>
                  <h2 className="text-3xl font-bold">{t(selectedSolution.titleKey)}</h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedSolution(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Image */}
              <img
                src={selectedSolution.image}
                alt={t(selectedSolution.titleKey)}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t('solutions-descripcion')}</h3>
                <p className="text-slate-700 leading-relaxed">
                  {t(selectedSolution.detailsKey)}
                </p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{t('solutions-caracteristicas')}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {selectedSolution.featuresKeys.map((featureKey) => (
                    <div key={featureKey} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      <span className="text-slate-700 text-sm">{t(featureKey)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-200">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedSolution(null)}
                >
                  {t('solutions-cerrar')}
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    setSelectedSolution(null);
                    scrollToSection('contact');
                  }}
                >
                  {t('solutions-solicitar')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
