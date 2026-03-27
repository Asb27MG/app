import { useEffect, useMemo, useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SuccessCase, SuccessCaseResult } from '@/types';

interface SuccessCaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  caseItem?: SuccessCase | null;
}

const INDUSTRY_OPTIONS = [
  { id: 'retail', label: 'Retail' },
  { id: 'corporativo', label: 'Corporativo' },
  { id: 'industrial', label: 'Industrial' },
  { id: 'salud', label: 'Salud' },
  { id: 'educacion', label: 'Educacion' },
  { id: 'aeropuerto', label: 'Transporte' },
  { id: 'hotel', label: 'Hospitality' },
];

const EMPTY_RESULT: SuccessCaseResult = { metric: '', label: '' };

export function SuccessCaseFormModal({
  isOpen,
  onClose,
  onSubmit,
  caseItem,
}: Readonly<SuccessCaseFormModalProps>) {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [industry, setIndustry] = useState('corporativo');
  const [location, setLocation] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [products, setProducts] = useState<string[]>(['']);
  const [results, setResults] = useState<SuccessCaseResult[]>([EMPTY_RESULT, EMPTY_RESULT, EMPTY_RESULT]);
  const [tags, setTags] = useState<string[]>(['']);
  const [testimonialText, setTestimonialText] = useState('');
  const [testimonialAuthor, setTestimonialAuthor] = useState('');
  const [testimonialRole, setTestimonialRole] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isEditing = useMemo(() => !!caseItem, [caseItem]);

  useEffect(() => {
    if (!isOpen) return;

    if (caseItem) {
      setTitle(caseItem.title);
      setClient(caseItem.client);
      setIndustry(caseItem.industry);
      setLocation(caseItem.location);
      setShortDesc(caseItem.shortDesc);
      setChallenge(caseItem.challenge);
      setSolution(caseItem.solution);
      setProducts(caseItem.products.length > 0 ? caseItem.products : ['']);
      setResults(caseItem.results.length > 0 ? caseItem.results : [EMPTY_RESULT, EMPTY_RESULT, EMPTY_RESULT]);
      setTags(caseItem.tags.length > 0 ? caseItem.tags : ['']);
      setTestimonialText(caseItem.testimonial.text);
      setTestimonialAuthor(caseItem.testimonial.author);
      setTestimonialRole(caseItem.testimonial.role);
      setImageUrl(caseItem.image);
      setImageFile(null);
    } else {
      setTitle('');
      setClient('');
      setIndustry('corporativo');
      setLocation('');
      setShortDesc('');
      setChallenge('');
      setSolution('');
      setProducts(['']);
      setResults([EMPTY_RESULT, EMPTY_RESULT, EMPTY_RESULT]);
      setTags(['']);
      setTestimonialText('');
      setTestimonialAuthor('');
      setTestimonialRole('');
      setImageUrl('');
      setImageFile(null);
    }

    setErrorMessage('');
  }, [caseItem, isOpen]);

  if (!isOpen) return null;

  const updateResult = (index: number, key: 'metric' | 'label', value: string) => {
    setResults((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const updateArrayValue = (
    values: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter(values.map((item, i) => (i === index ? value : item)));
  };

  const removeArrayValue = (
    values: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter(values.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!title.trim() || !client.trim() || !industry.trim() || !location.trim()) {
      return 'Completa titulo, cliente, industria y ubicacion.';
    }

    if (!shortDesc.trim() || !challenge.trim() || !solution.trim()) {
      return 'Completa descripcion corta, desafio y solucion.';
    }

    if (!testimonialText.trim() || !testimonialAuthor.trim() || !testimonialRole.trim()) {
      return 'Completa todo el bloque de testimonio.';
    }

    if (!isEditing && !imageFile && !imageUrl.trim()) {
      return 'Sube una imagen o ingresa una URL de imagen.';
    }

    const validResults = results.filter((item) => item.metric.trim() && item.label.trim());
    if (validResults.length === 0) {
      return 'Agrega al menos un resultado con metrica y etiqueta.';
    }

    return '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const payload = new FormData();
    payload.append('title', title.trim());
    payload.append('client', client.trim());
    payload.append('industry', industry.trim());
    payload.append('location', location.trim());
    payload.append('shortDesc', shortDesc.trim());
    payload.append('challenge', challenge.trim());
    payload.append('solution', solution.trim());
    payload.append(
      'products',
      JSON.stringify(products.map((item) => item.trim()).filter(Boolean))
    );
    payload.append(
      'results',
      JSON.stringify(
        results
          .map((item) => ({ metric: item.metric.trim(), label: item.label.trim() }))
          .filter((item) => item.metric && item.label)
      )
    );
    payload.append(
      'tags',
      JSON.stringify(tags.map((item) => item.trim()).filter(Boolean))
    );
    payload.append('testimonialText', testimonialText.trim());
    payload.append('testimonialAuthor', testimonialAuthor.trim());
    payload.append('testimonialRole', testimonialRole.trim());
    payload.append('imageUrl', imageUrl.trim());

    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      setSubmitting(true);
      setErrorMessage('');
      await onSubmit(payload);
      onClose();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'No se pudo guardar el caso de exito';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <button
        type="button"
        aria-label="Cerrar modal"
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="relative z-10 w-full max-w-4xl rounded-2xl bg-white shadow-2xl max-h-[92vh] overflow-y-auto">
          <button
            type="button"
            className="sticky top-0 float-right m-4 rounded-full p-2 hover:bg-slate-100"
            onClick={onClose}
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>

          <div className="p-8">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              {isEditing ? 'Editar Caso de Exito' : 'Nuevo Caso de Exito'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titulo"
                  className="rounded-lg border border-slate-300 px-4 py-3"
                />
                <input
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Cliente"
                  className="rounded-lg border border-slate-300 px-4 py-3"
                />
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="rounded-lg border border-slate-300 px-4 py-3"
                >
                  {INDUSTRY_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ubicacion"
                  className="rounded-lg border border-slate-300 px-4 py-3"
                />
              </div>

              <textarea
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Descripcion corta"
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
                rows={3}
              />

              <textarea
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="Desafio"
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
                rows={4}
              />

              <textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Solucion"
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
                rows={4}
              />

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Productos Utilizados</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => setProducts((prev) => [...prev, ''])}>
                    <Plus className="mr-1 h-4 w-4" /> Agregar
                  </Button>
                </div>
                <div className="space-y-2">
                  {products.map((item, index) => (
                    <div key={`product-${index}`} className="flex gap-2">
                      <input
                        value={item}
                        onChange={(e) => updateArrayValue(products, setProducts, index, e.target.value)}
                        placeholder={`Producto ${index + 1}`}
                        className="flex-1 rounded-lg border border-slate-300 px-4 py-3"
                      />
                      {products.length > 1 && (
                        <Button type="button" variant="outline" onClick={() => removeArrayValue(products, setProducts, index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Resultados</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => setResults((prev) => [...prev, { metric: '', label: '' }])}>
                    <Plus className="mr-1 h-4 w-4" /> Agregar
                  </Button>
                </div>
                <div className="space-y-2">
                  {results.map((item, index) => (
                    <div key={`result-${index}`} className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
                      <input
                        value={item.metric}
                        onChange={(e) => updateResult(index, 'metric', e.target.value)}
                        placeholder="Metrica"
                        className="rounded-lg border border-slate-300 px-4 py-3"
                      />
                      <input
                        value={item.label}
                        onChange={(e) => updateResult(index, 'label', e.target.value)}
                        placeholder="Etiqueta"
                        className="rounded-lg border border-slate-300 px-4 py-3"
                      />
                      {results.length > 1 && (
                        <Button type="button" variant="outline" onClick={() => setResults((prev) => prev.filter((_, i) => i !== index))}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Tags</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => setTags((prev) => [...prev, ''])}>
                    <Plus className="mr-1 h-4 w-4" /> Agregar
                  </Button>
                </div>
                <div className="space-y-2">
                  {tags.map((item, index) => (
                    <div key={`tag-${index}`} className="flex gap-2">
                      <input
                        value={item}
                        onChange={(e) => updateArrayValue(tags, setTags, index, e.target.value)}
                        placeholder={`Tag ${index + 1}`}
                        className="flex-1 rounded-lg border border-slate-300 px-4 py-3"
                      />
                      {tags.length > 1 && (
                        <Button type="button" variant="outline" onClick={() => removeArrayValue(tags, setTags, index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <textarea
                  value={testimonialText}
                  onChange={(e) => setTestimonialText(e.target.value)}
                  placeholder="Texto del testimonio"
                  className="rounded-lg border border-slate-300 px-4 py-3 md:col-span-2"
                  rows={4}
                />
                <input
                  value={testimonialAuthor}
                  onChange={(e) => setTestimonialAuthor(e.target.value)}
                  placeholder="Autor"
                  className="rounded-lg border border-slate-300 px-4 py-3"
                />
                <input
                  value={testimonialRole}
                  onChange={(e) => setTestimonialRole(e.target.value)}
                  placeholder="Rol"
                  className="rounded-lg border border-slate-300 px-4 py-3"
                />
              </div>

              <div className="space-y-3 rounded-lg border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900">Imagen</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="O usa URL de imagen"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                />
                {imageUrl && (
                  <img src={imageUrl} alt="preview" className="h-40 w-full rounded-lg object-cover" />
                )}
              </div>

              {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

              <div className="flex gap-3 border-t border-slate-200 pt-6">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" disabled={submitting}>
                  {submitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Caso'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
