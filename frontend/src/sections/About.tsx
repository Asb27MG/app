import { Wrench, Package, Network, Headset, ShieldCheck, Plane, Building2, Factory } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function About({ scrollToSection }: { readonly scrollToSection?: (sectionId: string) => void }) {
  const { t } = useTranslation();
  return (
    <div id="about">
      {/* Hero Section - AHORA CON FONDO BLANCO COMO PRODUCTOS */}
    {/* Hero Section - AHORA CON FONDO BLANCO COMO PRODUCTOS */}
      <section className="relative py-20 bg-white text-slate-900 overflow-hidden">
        {/* Eliminado el glow background oscuro */}
        
        <div className="container mx-auto px-4 relative z-10 text-center py-20">
          {/* Badge "NOSOTROS" agregado aquí */}
          <div className="inline-block mb-6 px-4 py-2 bg-blue-100 rounded-full">
            <span className="text-blue-600 font-semibold text-sm tracking-wide">
              {t('about-badge')}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {t('about-titulo')}
            <span className="block text-blue-600">{t('about-subtitulo')}</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t('about-descripcion')}
          </p>
        </div>
      </section>
      {/* About Content Section - FONDO BLANCO */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Left Text */}
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full">
                <span className="text-blue-600 font-semibold text-sm">{t('about-integrador')}</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                {t('about-aliados-titulo')}
                <span className="block text-blue-600">{t('about-aliados-subtitulo')}</span>
              </h2>

              <p className="text-lg text-slate-600 mb-6">
                {t('about-parrafo')}
              </p>

              <ul className="space-y-3">
                <li className="flex gap-3 items-start">
                  <span className="text-blue-600 text-xl mt-1">✔</span>
                  <span className="text-slate-700">{t('about-experiencia')}</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-blue-600 text-xl mt-1">✔</span>
                  <span className="text-slate-700">{t('about-integracion')}</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-blue-600 text-xl mt-1">✔</span>
                  <span className="text-slate-700">{t('about-enfoque')}</span>
                </li>
              </ul>
            </div>

            {/* Right Image - Mantenido el gradiente azul para contraste */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl h-96 flex items-center justify-center shadow-xl">
              <div className="w-48 h-48 bg-white/10 rounded-lg backdrop-blur flex items-center justify-center">
                <ShieldCheck className="w-32 h-32 text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section - GRADIENTE AZUL MANTENIDO PARA CONTRASTE */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10+</div>
              <p className="text-blue-100">{t('about-anos')}</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <p className="text-blue-100">{t('about-proyectos')}</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">99%</div>
              <p className="text-blue-100">{t('about-satisfaccion')}</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <p className="text-blue-100">{t('about-soporte')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section - FONDO BLANCO */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto mb-20">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                {t('about-quienes-titulo')}
              </h2>
              <p className="text-lg text-slate-700 font-semibold mb-4">
                {t('about-quienes-desc')}
              </p>
              <p className="text-slate-600 mb-4">
                {t('about-quienes-parrafo1')}
              </p>
              <p className="text-slate-600 font-semibold mb-6">
                {t('about-quienes-parrafo2')}
              </p>

              <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                <p className="text-slate-700 font-semibold">
                  {t('about-quienes-especialidades')}
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-48 h-48 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center shadow-lg">
                <Network className="w-32 h-32 text-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section - FONDO GRIS CLARO (como en Products) */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <ShieldCheck className="w-4 h-4" />
              {t('about-integrador')}
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {t('about-capacidades-titulo')}
            </h2>
            
            {/* Decorative element */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-600/50 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-600/30 rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Ingeniería propia */}
            <div className="group bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                  <Wrench className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {t('about-capacidad-ingenieria-titulo')}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('about-capacidad-ingenieria-desc')}
                </p>
              </div>
            </div>

            {/* Proyectos llave en mano */}
            <div className="group bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                  <Package className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {t('about-capacidad-llave-titulo')}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('about-capacidad-llave-desc')}
                </p>
              </div>
            </div>

            {/* Integración multidisciplinaria */}
            <div className="group bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                  <Network className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {t('about-capacidad-integracion-titulo')}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('about-capacidad-integracion-desc')}
                </p>
              </div>
            </div>

            {/* Soporte técnico especializado */}
            <div className="group bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                  <Headset className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {t('about-capacidad-soporte-titulo')}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('about-capacidad-soporte-desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section - FONDO BLANCO */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">
            {t('about-industrias-titulo')}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Airports */}
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 border border-blue-100">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t('about-industria-aeropuertos-titulo')}</h3>
              <p className="text-sm text-slate-600">
                {t('about-industria-aeropuertos-desc')}
              </p>
            </div>

            {/* Corporate */}
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 border border-blue-100">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t('about-industria-corporativos-titulo')}</h3>
              <p className="text-sm text-slate-600">
                {t('about-industria-corporativos-desc')}
              </p>
            </div>

            {/* Manufacturing */}
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 border border-blue-100">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                <Factory className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t('about-industria-manufactura-titulo')}</h3>
              <p className="text-sm text-slate-600">
                {t('about-industria-manufactura-desc')}
              </p>
            </div>

            {/* Hospitality */}
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 border border-blue-100">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t('about-industria-hospitalidad-titulo')}</h3>
              <p className="text-sm text-slate-600">
                {t('about-industria-hospitalidad-desc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;