import { Camera, Lock, Wifi, Shield, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceModal } from '@/components/ServiceModal';

const services = [
  {
    id: 'vigilancia',
    icon: Camera,
    titleKey: 'services-vigilancia-titulo',
    descKey: 'services-vigilancia-desc',
    detailsKey: 'services-vigilancia-detalles',
    featuresKeys: [
      'services-vigilancia-feature-1',
      'services-vigilancia-feature-2',
      'services-vigilancia-feature-3',
      'services-vigilancia-feature-4',
      'services-vigilancia-feature-5'
    ],
  },
  {
    id: 'acceso',
    icon: Lock,
    titleKey: 'services-acceso-titulo',
    descKey: 'services-acceso-desc',
    detailsKey: 'services-acceso-detalles',
    featuresKeys: [
      'services-acceso-feature-1',
      'services-acceso-feature-2',
      'services-acceso-feature-3',
      'services-acceso-feature-4'
    ],
  },
  {
    id: 'redes',
    icon: Wifi,
    titleKey: 'services-red-titulo',
    descKey: 'services-red-desc',
    detailsKey: 'services-red-detalles',
    featuresKeys: [
      'services-red-feature-1',
      'services-red-feature-2',
      'services-red-feature-3',
      'services-red-feature-4'
    ],
  },
  {
    id: 'ciberseguridad',
    icon: Shield,
    titleKey: 'services-ciber-titulo',
    descKey: 'services-ciber-desc',
    detailsKey: 'services-ciber-detalles',
    featuresKeys: [
      'services-ciber-feature-1',
      'services-ciber-feature-2',
      'services-ciber-feature-3',
      'services-ciber-feature-4'
    ],
  },
];

export default function Services({ scrollToSection }: { readonly scrollToSection: (sectionId: string) => void }) {
  const { t } = useTranslation();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const handleRequestInfo = () => {
    setSelectedServiceId(null);
    scrollToSection('contact');
  };

  return (
    <section id="services" className="py-16 lg:py-24 bg-slate-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gmh-blue/10 text-gmh-blue px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Shield className="w-4 h-4" />
            {t('services-badge')}
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {t('services-main-title')}
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t('services-main-description')}
          </p>
          
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="w-12 h-1 bg-gmh-blue rounded-full"></div>
            <div className="w-3 h-3 bg-gmh-blue/50 rounded-full"></div>
            <div className="w-2 h-2 bg-gmh-blue/30 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card
              key={service.titleKey}
              className="group bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-lg bg-gmh-blue/10 flex items-center justify-center mb-4 group-hover:bg-gmh-blue transition-colors duration-300">
                  <service.icon className="w-7 h-7 text-gmh-blue group-hover:text-white transition-colors duration-300" />
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-gmh-blue transition-colors">
                  {t(service.titleKey)}
                </h3>

                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  {t(service.descKey)}
                </p>

                <button
                  onClick={() => setSelectedServiceId(service.id)}
                  className="inline-flex items-center text-sm font-semibold text-gmh-blue hover:text-gmh-blue-dark transition-colors group"
                >
                  {t('services-saber-mas')}
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Service Modal */}
      <ServiceModal
        serviceId={selectedServiceId || ''}
        isOpen={!!selectedServiceId}
        onClose={() => setSelectedServiceId(null)}
        onRequestInfo={handleRequestInfo}
      />
    </section>
  );
}
