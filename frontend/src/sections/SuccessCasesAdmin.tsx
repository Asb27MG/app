import { useCallback, useEffect, useMemo, useState } from 'react';
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
  Filter,
  Pencil,
  Trash2,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { SuccessCaseFormModal } from '@/components/SuccessCaseFormModal';
import type { SuccessCase } from '@/types';
import { useTranslation } from 'react-i18next';

const industries = [
  { id: 'all', labelKey: 'successcases-industry-all', icon: Filter },
  { id: 'retail', labelKey: 'successcases-industry-retail', icon: Store },
  { id: 'corporativo', labelKey: 'successcases-industry-corporativo', icon: Building2 },
  { id: 'industrial', labelKey: 'successcases-industry-industrial', icon: Factory },
  { id: 'salud', labelKey: 'successcases-industry-salud', icon: Stethoscope },
  { id: 'educacion', labelKey: 'successcases-industry-educacion', icon: GraduationCap },
  { id: 'aeropuerto', labelKey: 'successcases-industry-aeropuerto', icon: Plane },
  { id: 'hotel', labelKey: 'successcases-industry-hotel', icon: Hotel },
];

interface SuccessCasesProps {
  readonly scrollToSection: (sectionId: string) => void;
}

export default function SuccessCasesAdmin({ scrollToSection }: Readonly<SuccessCasesProps>) {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<SuccessCase | null>(null);
  const [cases, setCases] = useState<SuccessCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<SuccessCase | null>(null);

  const isAdmin = isAuthenticated && user?.role === 'admin';

  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const response = await fetch('/api/success-cases');
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || t('successcases-error-load'));
      }

      setCases(data.cases || []);
    } catch (error) {
      const msg = error instanceof Error ? error.message : t('successcases-error-load');
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const filteredCases = useMemo(() => {
    if (selectedIndustry === 'all') return cases;
    return cases.filter((item) => item.industry === selectedIndustry);
  }, [cases, selectedIndustry]);

  const getIndustryIcon = (industryId: string) => {
    const industry = industries.find((i) => i.id === industryId);
    return industry?.icon || Building2;
  };

  const getIndustryLabel = (industryId: string) => {
    const industry = industries.find((i) => i.id === industryId);
    return industry ? t(industry.labelKey) : industryId;
  };

  const submitCase = async (formData: FormData) => {
    if (!isAdmin || !user) {
      throw new Error(t('successcases-error-admin-only'));
    }

    const isEditing = !!editingCase;
    const endpoint = isEditing ? `/api/success-cases/${editingCase.id}` : '/api/success-cases';

    const response = await fetch(endpoint, {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'x-user-role': user.role,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || t('successcases-error-save'));
    }

    setIsFormOpen(false);
    setEditingCase(null);
    await fetchCases();
  };

  const handleDeleteCase = async (id: string) => {
    if (!isAdmin || !user) return;

    const confirmed = globalThis.confirm(t('successcases-confirm-delete'));
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/success-cases/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-role': user.role,
        },
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || t('successcases-error-delete'));
      }

      if (selectedCase?.id === id) {
        setSelectedCase(null);
      }

      await fetchCases();
    } catch (error) {
      const msg = error instanceof Error ? error.message : t('successcases-error-delete');
      setErrorMessage(msg);
    }
  };

  return (
    <section id="success-cases" className="py-16 lg:py-24 bg-slate-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gmh-blue/10 text-gmh-blue px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <TrendingUp className="w-4 h-4" />
            {t('successcases-badge')}
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            {t('successcases-title-prefix')} <span className="text-gmh-blue">{t('successcases-title-highlight')}</span>
          </h2>

          <p className="text-xl text-slate-600 leading-relaxed">
            {t('successcases-subtitle')}
          </p>
        </div>

        {isAdmin && (
          <div className="mb-8 flex justify-center">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setEditingCase(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('successcases-add-button')}
            </Button>
          </div>
        )}

        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 mb-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-1">{cases.length}+</div>
              <div className="text-slate-300 text-sm">{t('successcases-stat-published')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-1">{Math.max(1, industries.length - 1)}+</div>
              <div className="text-slate-300 text-sm">{t('successcases-stat-industries')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-1">99%</div>
              <div className="text-slate-300 text-sm">{t('successcases-stat-satisfaction')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-1">24/7</div>
              <div className="text-slate-300 text-sm">{t('successcases-stat-support')}</div>
            </div>
          </div>
        </div>

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
                {t(industry.labelKey)}
              </button>
            );
          })}
        </div>

        {loading && <div className="text-center py-10 text-slate-600">{t('successcases-loading')}</div>}
        {errorMessage && <div className="text-center mb-8 text-red-600">{errorMessage}</div>}

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
                  <img src={caseItem.image} alt={caseItem.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-800">
                      <IndustryIcon className="w-3.5 h-3.5 text-gmh-blue" />
                      {getIndustryLabel(caseItem.industry)}
                    </span>
                  </div>

                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <button
                        className="rounded-md bg-white/90 p-2 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCase(caseItem);
                          setIsFormOpen(true);
                        }}
                        title={t('successcases-edit')}
                      >
                        <Pencil className="h-4 w-4 text-slate-700" />
                      </button>
                      <button
                        className="rounded-md bg-red-600/90 p-2 hover:bg-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCase(caseItem.id);
                        }}
                        title={t('successcases-delete')}
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white/90 text-sm flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {caseItem.location}
                    </p>
                    <h3 className="text-white text-xl font-bold mt-1 line-clamp-2">{caseItem.title}</h3>
                  </div>
                </div>

                <CardContent className="p-6">
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{caseItem.shortDesc}</p>
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-gmh-blue/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-gmh-blue" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{t('successcases-client')}</p>
                      <p className="font-semibold text-slate-900">{caseItem.client}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      {caseItem.results.slice(0, 2).map((result, idx) => (
                        <div key={`${result.metric}-${result.label}-${idx}`}>
                          <p className="text-lg font-bold text-gmh-blue">{result.metric}</p>
                          <p className="text-xs text-slate-500">{result.label}</p>
                        </div>
                      ))}
                    </div>
                    <span className="text-gmh-blue font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t('successcases-view-case')} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {!loading && filteredCases.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{t('successcases-empty-title')}</h3>
            <p className="text-slate-600">{t('successcases-empty-desc')}</p>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">{t('successcases-cta-title')}</h3>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            {t('successcases-cta-desc')}
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8"
              onClick={() => scrollToSection('contact')}
            >
              <Phone className="w-5 h-5 mr-2" />
              {t('successcases-cta-button')}
            </Button>
          </div>
        </div>
      </div>

      {selectedCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <button
              type="button"
              aria-label="Cerrar detalle"
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setSelectedCase(null)}
            />

            <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
              <button
                onClick={() => setSelectedCase(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition shadow-lg"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>

              <div className="relative h-72 md:h-96">
                <img src={selectedCase.image} alt={selectedCase.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-gmh-blue rounded-full text-xs font-semibold">{getIndustryLabel(selectedCase.industry)}</span>
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
                <div className="grid grid-cols-3 gap-4 mb-10 -mt-16 relative z-10">
                  {selectedCase.results.map((result, idx) => (
                    <div key={`${result.metric}-${result.label}-${idx}`} className="bg-white rounded-xl p-6 shadow-lg border border-slate-100 text-center">
                      <div className="text-3xl font-bold text-gmh-blue mb-1">{result.metric}</div>
                      <div className="text-sm text-slate-600">{result.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full" />
                        </span>
                        {t('successcases-challenge')}
                      </h3>
                      <p className="text-slate-600 leading-relaxed pl-10">{selectedCase.challenge}</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </span>
                        {t('successcases-solution')}
                      </h3>
                      <p className="text-slate-600 leading-relaxed pl-10">{selectedCase.solution}</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">{t('successcases-products')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCase.products.map((product) => (
                          <span key={product} className="px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-700 border border-slate-200">
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-gmh-blue">
                      <p className="text-slate-700 italic mb-6 text-lg leading-relaxed">"{selectedCase.testimonial.text}"</p>
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

                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">{t('successcases-technologies')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCase.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-10 pt-8 border-t border-slate-200">
                  <Button
                    className="flex-1 bg-gmh-blue hover:bg-gmh-blue-dark text-white"
                    onClick={() => {
                      setSelectedCase(null);
                      scrollToSection('contact');
                    }}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    {t('successcases-consult-similar')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <SuccessCaseFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCase(null);
        }}
        onSubmit={submitCase}
        caseItem={editingCase}
      />
    </section>
  );
}
