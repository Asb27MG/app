import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  product?: Product | null;
}

const CATEGORIES = [
  'Videovigilancia',
  'Networking',
  'Grabación',
  'Control de Acceso',
  'Ciberseguridad',
];

const INITIAL_FORM_DATA = {
  name: '',
  description: '',
  category: 'Videovigilancia',
  image: '',
  features: [''],
  specs: [{ label: '', value: '' }],
};

export function ProductFormModal({ isOpen, onClose, onSubmit, product }: Readonly<ProductFormModalProps>) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        image: product.image,
        features: product.features && product.features.length > 0 ? product.features : [''],
        specs: product.specs && product.specs.length > 0 ? product.specs : [{ label: '', value: '' }],
      });
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
    setErrors({});
  }, [product, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.image.trim()) newErrors.image = 'La URL de la imagen es requerida';

    const validFeatures = formData.features.filter((f) => f.trim());
    if (validFeatures.length === 0) newErrors.features = 'Al menos una característica es requerida';

    const validSpecs = formData.specs.filter((s) => s.label.trim() && s.value.trim());
    if (validSpecs.length === 0) newErrors.specs = 'Al menos una especificación es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        features: formData.features.filter((f) => f.trim()),
        specs: formData.specs.filter((s) => s.label.trim() && s.value.trim()),
        fullSpecs: formData.features.filter((f) => f.trim()),
      });
      onClose();
    }
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f)),
    }));
  };

  const addSpec = () => {
    setFormData((prev) => ({ ...prev, specs: [...prev.specs, { label: '', value: '' }] }));
  };

  const removeSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };

  const updateSpec = (index: number, field: 'label' | 'value', value: string) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <button
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClose();
          }
        }}
        aria-label="Cerrar modal"
        type="button"
      />

      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="sticky top-0 right-0 p-4 float-right z-10 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-600" />
          </button>

          <div className="p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              {product ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="product-name" className="block text-sm font-semibold text-slate-900 mb-1">
                    Nombre del Producto *
                  </label>
                  <input
                    id="product-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Cámara Pro 4K"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.name ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="product-category" className="block text-sm font-semibold text-slate-900 mb-1">
                    Categoría *
                  </label>
                  <select
                    id="product-category"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="product-description" className="block text-sm font-semibold text-slate-900 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    id="product-description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe el producto..."
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${
                      errors.description ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label htmlFor="product-image" className="block text-sm font-semibold text-slate-900 mb-1">
                    URL de la Imagen *
                  </label>
                  <input
                    id="product-image"
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.image ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                </div>
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="block text-sm font-semibold text-slate-900">
                    Características *
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFeature}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={`feature-${index}-${feature}`} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder={`Característica ${index + 1}`}
                        className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features}</p>}
              </div>

              {/* Specs */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="block text-sm font-semibold text-slate-900">
                    Especificaciones Técnicas *
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSpec}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.specs.map((spec, index) => (
                    <div key={`spec-${index}-${spec.label}-${spec.value}`} className="flex gap-2">
                      <input
                        type="text"
                        value={spec.label}
                        onChange={(e) => updateSpec(index, 'label', e.target.value)}
                        placeholder="Etiqueta (ej: Resolución)"
                        className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => updateSpec(index, 'value', e.target.value)}
                        placeholder="Valor (ej: 4K UHD)"
                        className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                      {formData.specs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpec(index)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {errors.specs && <p className="text-red-500 text-sm mt-1">{errors.specs}</p>}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-slate-200">
                <Button variant="outline" className="flex-1" onClick={onClose} type="button">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-slate-700 text-white hover:shadow-lg transition-all">
                  {product ? 'Guardar Cambios' : 'Crear Producto'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
