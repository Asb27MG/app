import { useState, useMemo } from 'react';
import { 
  Building2, 
  Factory, 
  Store, 
  GraduationCap, 
  Stethoscope, 
  Plane, 
  Hotel,
  X,
  MapPin,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Phone,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: 'retail' | 'corporativo' | 'industrial' | 'salud' | 'educacion' | 'aeropuerto' | 'hotel';
  location: string;
  image: string;
  shortDesc: string;
  challenge: string;
  solution: string;
  products: string[];
  results: { metric: string; label: string }[];
  testimonial: {
    text: string;
    author: string;
    role: string;
  };
  tags: string[];
}

const casesData: CaseStudy[] = [
  {
    id: '1',
    title: 'Centro Comercial Plaza Norte',
    client: 'Grupo Plaza',
    industry: 'retail',
    location: 'Buenos Aires, Argentina',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&h=600&fit=crop',
    shortDesc: 'Sistema de video vigilancia inteligente con análisis de IA para reducir pérdidas y optimizar operaciones en 45,000 m².',
    challenge: 'El centro comercial enfrentaba pérdidas por hurto superiores al 3% mensual y necesitaba monitorear 45,000 m² de superficie con visión nocturna de alta calidad en estacionamientos y áreas comunes.',
    solution: 'Instalación de 120 cámaras IP de alta definición con tecnología DarkFighter, integradas con sistema de análisis de video inteligente para detección de comportamientos sospechosos, conteo de personas y heatmaps de tráfico.',
    products: ['Cámaras Dome 4MP', 'NVR 128 canales', 'Software de análisis IA', 'Videowall 4x4', 'Cámaras PTZ'],
    results: [
      { metric: '65%', label: 'Reducción de pérdidas' },
      { metric: '40%', label: 'Mejora en respuesta' },
      { metric: '24/7', label: 'Monitoreo continuo' }
    ],
    testimonial: {
      text: 'La solución de GMH transformó completamente nuestra seguridad. Ahora tenemos visibilidad total y hemos reducido significativamente las pérdidas. El análisis de heatmaps nos ayudó a optimizar la ubicación de tiendas.',
      author: 'Carlos Martínez',
      role: 'Gerente de Seguridad'
    },
    tags: ['Video Vigilancia', 'Análisis IA', 'Retail']
  },
  {
    id: '2',
    title: 'Torre Corporativa Financiera',
    client: 'Banco Nacional',
    industry: 'corporativo',
    location: 'CABA, Argentina',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    shortDesc: 'Control de acceso biométrico y gestión de visitantes para edificio de 35 pisos con 2,500 empleados.',
    challenge: 'Controlar el acceso de 2,500 empleados y 500 visitantes diarios, integrando 15 puntos de acceso, estacionamiento y ascensores con los más altos estándares de seguridad bancaria.',
    solution: 'Implementación de control de acceso facial sin contacto, torniquetes inteligentes, lector de patentes para estacionamiento y gestión centralizada mediante plataforma unificada con integración a RRHH.',
    products: ['Terminales de reconocimiento facial', 'Torniquetes de alta seguridad', 'Control de ascensores', 'Sistema de gestión de visitantes', 'Barreras vehiculares'],
    results: [
      { metric: '2.5k', label: 'Empleados gestionados' },
      { metric: '0', label: 'Incidentes de seguridad' },
      { metric: '3s', label: 'Tiempo de acceso' }
    ],
    testimonial: {
      text: 'La integración perfecta entre todos los sistemas nos dio el control total que necesitábamos. La tecnología sin contacto fue clave post-pandemia y mejoró la experiencia de nuestros colaboradores.',
      author: 'María González',
      role: 'Directora de Infraestructura'
    },
    tags: ['Control de Acceso', 'Biometría', 'Corporativo']
  },
  {
    id: '3',
    title: 'Planta Industrial Automotriz',
    client: 'AutoParts SA',
    industry: 'industrial',
    location: 'Córdoba, Argentina',
    image: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=600&fit=crop',
    shortDesc: 'Cobertura completa de video vigilancia térmica y visible para planta de 80,000 m² con monitoreo de procesos.',
    challenge: 'Monitorear líneas de producción 24/7, detectar anomalías térmicas en maquinaria crítica y prevenir intrusiones en perímetro de 2km con condiciones ambientales extremas.',
    solution: 'Sistema híbrido con cámaras térmicas para detección de temperatura, cámaras PTZ para seguimiento automático y análisis de video para verificación de EPP (equipamiento de protección personal).',
    products: ['Cámaras térmicas', 'PTZ de 40x zoom', 'Analítica de video', 'Sistema de alarmas perimetrales', 'Sensores de temperatura'],
    results: [
      { metric: '80k', label: 'm² cubiertos' },
      { metric: '15', label: 'Anomalías detectadas' },
      { metric: '100%', label: 'Cumplimiento EPP' }
    ],
    testimonial: {
      text: 'La detección temprana de sobrecalentamiento en una de nuestras prensas nos salvó de una parada de planta millonaria. La inversión se recuperó en menos de 3 meses.',
      author: 'Roberto Sánchez',
      role: 'Gerente de Planta'
    },
    tags: ['Video Vigilancia', 'Termografía', 'Industrial']
  },
  {
    id: '4',
    title: 'Hospital Universitario',
    client: 'Hospital Central',
    industry: 'salud',
    location: 'Rosario, Argentina',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=600&fit=crop',
    shortDesc: 'Control de acceso especializado para áreas críticas, farmacia y neonatología con trazabilidad completa.',
    challenge: 'Restringir acceso a áreas sensibles (quirófanos, farmacia, neonatología), controlar cadena de custodia de medicamentos controlados y proteger a pacientes vulnerables.',
    solution: 'Control de acceso por roles biométrico, cerraduras electrónicas en armarios de medicamentos controlados, monitoreo de temperatura en cámaras de vacunas y video vigilancia en áreas críticas.',
    products: ['Control de acceso biométrico', 'Cerraduras electrónicas inteligentes', 'Sensores de temperatura', 'Cámaras 360°', 'Sistema de gestión hospitalaria'],
    results: [
      { metric: '50+', label: 'Puntos controlados' },
      { metric: '100%', label: 'Trazabilidad' },
      { metric: '0', label: 'Incidentes' }
    ],
    testimonial: {
      text: 'El sistema nos permite dormir tranquilos sabiendo que nuestros pacientes más vulnerables están protegidos. La trazabilidad de medicamentos cumple con todas las normativas.',
      author: 'Dra. Ana López',
      role: 'Directora Médica'
    },
    tags: ['Control de Acceso', 'Salud', 'Trazabilidad']
  },
  {
    id: '5',
    title: 'Universidad Tecnológica',
    client: 'UTN Regional',
    industry: 'educacion',
    location: 'Mendoza, Argentina',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop',
    shortDesc: 'Infraestructura de red completa para campus con 15,000 usuarios concurrentes y cobertura WiFi 6.',
    challenge: 'Proveer conectividad estable para 15,000 usuarios, 500 aulas y laboratorios, con alta densidad de dispositivos IoT y sistemas de seguridad integrados en 12 hectáreas de campus.',
    solution: 'Red estructurada categoría 6A, switches gestionables PoE+, 200 access points WiFi 6, sistema de gestión centralizada con monitoreo 24/7 y segmentación de red por facultades.',
    products: ['Switches PoE+ 48 puertos', 'Access Points WiFi 6', 'Cableado estructurado Cat 6A', 'Sistema de gestión de red', 'Firewall de próxima generación'],
    results: [
      { metric: '15k', label: 'Usuarios soportados' },
      { metric: '99.9%', label: 'Uptime' },
      { metric: '10Gbps', label: 'Backbone' }
    ],
    testimonial: {
      text: 'La red nunca había funcionado tan bien. Los profesores pueden dar clases híbridas sin problemas de conectividad y los estudiantes tienen WiFi de alta velocidad en todo el campus.',
      author: 'Ing. Pedro Ruiz',
      role: 'Director de TI'
    },
    tags: ['Redes', 'WiFi 6', 'Educación']
  },
  {
    id: '6',
    title: 'Aeropuerto Internacional',
    client: 'Aeropuertos Argentina',
    industry: 'aeropuerto',
    location: 'Ezeiza, Argentina',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop',
    shortDesc: 'Sistema de seguridad perimetral y control de acceso para terminal de 25 millones de pasajeros anuales.',
    challenge: 'Asegurar perímetro de 15km, controlar acceso a áreas restringidas (SSI), integrar con sistemas de aduana y migraciones, y cumplir con normativas internacionales de aviación.',
    solution: 'Video vigilancia perimetral con análisis de video, control de acceso multi-factor para áreas SSI, sistema de lectura de placas (LPR) y centro de comando unificado con videowall.',
    products: ['Cámaras térmicas perimetrales', 'Lectores de placas LPR', 'Control de acceso SSI', 'Videowall 6x3', 'Software de gestión unificada'],
    results: [
      { metric: '15km', label: 'Perímetro asegurado' },
      { metric: '25M', label: 'Pasajeros/año' },
      { metric: '100%', label: 'Cumplimiento OACI' }
    ],
    testimonial: {
      text: 'La integración con los sistemas de aduana y la fiabilidad del sistema perimetral nos permitió obtener la certificación de máxima categoría de seguridad.',
      author: 'Cap. Juan Pérez',
      role: 'Director de Seguridad Aeroportuaria'
    },
    tags: ['Seguridad Perimetral', 'Control de Acceso', 'Transporte']
  }
];

const industries = [
  { id: 'all', label: 'Todos', icon: Filter },
  { id: 'retail', label: 'Retail', icon: Store },
  { id: 'corporativo', label: 'Corporativo', icon: Building2 },
  { id: 'industrial', label: 'Industrial', icon: Factory },
  { id: 'salud', label: 'Salud', icon: Stethoscope },
  { id: 'educacion', label: 'Educación', icon: GraduationCap },
  { id: 'aeropuerto', label: 'Transporte', icon: Plane },
  { id: 'hotel', label: 'Hospitality', icon: Hotel },
];

export default function SuccessCases({ scrollToSection }: { readonly scrollToSection: (sectionId: string) => void }) {
  const { t } = useTranslation();
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);

  const filteredCases = useMemo(() => {
    if (selectedIndustry === 'all') return casesData;
    return casesData.filter(c => c.industry === selectedIndustry);
  }, [selectedIndustry]);

  const getIndustryIcon = (industryId: string) => {
    const industry = industries.find(i => i.id === industryId);
    return industry?.icon || Building2;
  };

  const getIndustryLabel = (industryId: string) => {
    const industry = industries.find(i => i.id === industryId);
    return industry?.label || industryId;
  };

  return (
    <section id="success-cases" className="py-16 lg:py-24 bg-slate-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gmh-blue/10 text-gmh-blue px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <TrendingUp className="w-4 h-4" />
            REFERENCIAS VERIFICADAS
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Casos de <span className="text-gmh-blue">Éxito</span>
          </h2>
          
          <p className="text-xl text-slate-600 leading-relaxed">
            Descubre cómo hemos transformado la seguridad y tecnología de empresas líderes en Argentina y Latinoamérica
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 mb-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-1">50+</div>
              <div className="text-slate-300 text-sm">Proyectos Exitosos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-1">15+</div>
              <div className="text-slate-300 text-sm">Industrias Atendidas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-1">99%</div>
              <div className="text-slate-300 text-sm">Clientes Satisfechos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-1">24/7</div>
              <div className="text-slate-300 text-sm">Soporte Técnico</div>
            </div>
          </div>
        </div>

        {/* Industry Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {industries.map((industry) => {
            const Icon = industry.icon;
            const isActive = selectedIndustry === industry.id;
            return (
              <button
                key={industry.id}
                onClick={() => setSelectedIndustry(industry.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  isActive
                    ? 'bg-gmh-blue text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {industry.label}
              </button>
            );
          })}
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredCases.map((caseItem) => {
            const IndustryIcon = getIndustryIcon(caseItem.industry);
            return (
              <Card 
                key={caseItem.id} 
                className="group bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => setSelectedCase(caseItem)}
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={caseItem.image} 
                    alt={caseItem.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Industry Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-800">
                      <IndustryIcon className="w-3.5 h-3.5 text-gmh-blue" />
                      {getIndustryLabel(caseItem.industry)}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white/90 text-sm flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {caseItem.location}
                    </p>
                    <h3 className="text-white text-xl font-bold mt-1 line-clamp-2">
                      {caseItem.title}
                    </h3>
                  </div>
                </div>

                <CardContent className="p-6">
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {caseItem.shortDesc}
                  </p>

                  {/* Client */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-gmh-blue/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-gmh-blue" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Cliente</p>
                      <p className="font-semibold text-slate-900">{caseItem.client}</p>
                    </div>
                  </div>

                  {/* Results Preview */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      {caseItem.results.slice(0, 2).map((result, idx) => (
                        <div key={idx}>
                          <p className="text-lg font-bold text-gmh-blue">{result.metric}</p>
                          <p className="text-xs text-slate-500">{result.label}</p>
                        </div>
                      ))}
                    </div>
                    <span className="text-gmh-blue font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ver caso <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCases.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No se encontraron casos
            </h3>
            <p className="text-slate-600">
              Intenta seleccionar otra industria
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            ¿Tienes un proyecto similar?
          </h3>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Contáctanos y diseñaremos una solución a medida para tus necesidades específicas. Nuestros especialistas están listos para ayudarte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8"
              onClick={() => scrollToSection('contact')}
            >
              <Phone className="w-5 h-5 mr-2" />
              Solicitar Consultoría
            </Button>
            
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setSelectedCase(null)}
            />
            
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
              {/* Close Button */}
              <button
                onClick={() => setSelectedCase(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition shadow-lg"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>

              {/* Hero Image */}
              <div className="relative h-72 md:h-96">
                <img 
                  src={selectedCase.image} 
                  alt={selectedCase.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-gmh-blue rounded-full text-xs font-semibold">
                      {getIndustryLabel(selectedCase.industry)}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-white/80">
                      <MapPin className="w-4 h-4" />
                      {selectedCase.location}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">{selectedCase.title}</h2>
                  <p className="text-xl text-white/90">{selectedCase.client}</p>
                </div>
              </div>

              <div className="p-8">
                {/* Results Stats */}
                <div className="grid grid-cols-3 gap-4 mb-10 -mt-16 relative z-10">
                  {selectedCase.results.map((result, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-6 shadow-lg border border-slate-100 text-center">
                      <div className="text-3xl font-bold text-gmh-blue mb-1">{result.metric}</div>
                      <div className="text-sm text-slate-600">{result.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  {/* Left Column */}
                  <div className="space-y-8">
                    {/* Challenge */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full" />
                        </span>
                        El Desafío
                      </h3>
                      <p className="text-slate-600 leading-relaxed pl-10">
                        {selectedCase.challenge}
                      </p>
                    </div>

                    {/* Solution */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </span>
                        La Solución
                      </h3>
                      <p className="text-slate-600 leading-relaxed pl-10">
                        {selectedCase.solution}
                      </p>
                    </div>

                    {/* Products */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">Productos Utilizados</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCase.products.map((product, idx) => (
                          <span 
                            key={idx}
                            className="px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-700 border border-slate-200"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                    {/* Testimonial */}
                    <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-gmh-blue">
                      <i className="fas fa-quote-left text-3xl text-blue-200 mb-4" />
                      <p className="text-slate-700 italic mb-6 text-lg leading-relaxed">
                        "{selectedCase.testimonial.text}"
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gmh-blue rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {selectedCase.testimonial.author.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{selectedCase.testimonial.author}</div>
                          <div className="text-sm text-slate-500">{selectedCase.testimonial.role}</div>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Tecnologías</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCase.tags.map((tag, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-10 pt-8 border-t border-slate-200">
                  <Button 
                    className="flex-1 bg-gmh-blue hover:bg-gmh-blue-dark text-white"
                    onClick={() => {
                      setSelectedCase(null);
                      scrollToSection('contact');
                    }}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Consultar Proyecto Similar
                  </Button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}