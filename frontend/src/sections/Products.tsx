import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ShoppingCart, X, Check, AlertCircle, Edit2, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductsContext';
import { ProductFormModal } from '@/components/ProductFormModal';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/types';

interface CotizationFormData {
  nombre: string;
  correo: string;
  telefono: string;
  servicio: string;
  descripcion: string;
}

interface DetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCotization: (product: Product) => void;
}

interface CotizationModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

function DetailModal({ product, isOpen, onClose, onOpenCotization }: Readonly<DetailModalProps>) {
  const { t } = useTranslation();
  if (!isOpen || !product) return null;

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
            <div className="flex gap-6 mb-8">
              <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4" />
              </div>

              <div>
                <div className="inline-block mb-2 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                  {product.category}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h2>
                {product.price !== undefined && (
                  <div className="text-2xl font-semibold text-green-600 mb-2">
                    ${Number(product.price).toFixed(2)}
                  </div>
                )}
                <p className="text-lg text-slate-600 mb-4">{product.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  {t('products-especificaciones')}
                </h3>
                <ul className="space-y-3">
                  {product.specs.map((spec, idx) => (
                    <li key={`${spec.label}-${spec.value}-${idx}`} className="flex gap-3 text-slate-700">
                      <span className="text-blue-600 font-bold mt-1">•</span>
                      <span>
                        <strong>{spec.label}:</strong> {spec.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  {t('products-caracteristicas')}
                </h3>
                <ul className="space-y-3">
                  {product.features?.map((feature, idx) => (
                    <li key={`${feature}-${idx}`} className="flex gap-3 text-slate-700">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-200">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cerrar
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-slate-700 text-white hover:shadow-lg transition-all"
                onClick={() => {
                  onClose();
                  onOpenCotization(product);
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Solicitar Cotización
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CotizationModal({ product, isOpen, onClose }: Readonly<CotizationModalProps>) {
  const [formData, setFormData] = useState<CotizationFormData>({
    nombre: '',
    correo: '',
    telefono: '',
    servicio: '',
    descripcion: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (isOpen && product) {
      setFormData((prev) => ({
        ...prev,
        servicio: product.name,
      }));
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { nombre, correo, telefono, servicio, descripcion } = formData;

    if (!nombre || !correo) {
      setMessage('Por favor completa los campos requeridos (Nombre y Correo).');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/cotizacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          correo,
          telefono,
          servicio,
          descripcion,
        }),
      });

      const text = await response.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        console.error('JSON inválido de /api/cotizacion:', text, err);
        setMessage('Ocurrió un error inesperado. Revisa la consola.');
        setMessageType('error');
        setLoading(false);
        return;
      }

      if (response.ok && data?.success) {
        setMessage(data.message || 'Cotización enviada correctamente');
        setMessageType('success');
        setFormData({
          nombre: '',
          correo: '',
          telefono: '',
          servicio: product.name,
          descripcion: '',
        });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        console.error('Error enviando cotización:', response.status, data);
        setMessage(data?.message || 'Ocurrió un error al enviar la cotización');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error de red al enviar cotización:', error);
      setMessage('No se pudo conectar con el servidor');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
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
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors z-10">
            <X className="w-6 h-6 text-slate-600" />
          </button>

          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Solicitar Cotización</h2>
              <p className="text-slate-600">
                Completa el formulario para recibir una propuesta personalizada para <span className="font-semibold text-blue-600">{product.name}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-semibold text-slate-900 mb-1">
                  Nombre completo *
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="correo" className="block text-sm font-semibold text-slate-900 mb-1">
                  Correo electrónico *
                </label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  placeholder="tu.email@empresa.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-semibold text-slate-900 mb-1">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="servicio" className="block text-sm font-semibold text-slate-900 mb-1">
                  Producto/Servicio
                </label>
                <input
                  id="servicio"
                  name="servicio"
                  type="text"
                  value={formData.servicio}
                  onChange={handleChange}
                  placeholder="Producto seleccionado"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="descripcion" className="block text-sm font-semibold text-slate-900 mb-1">
                  Descripción del proyecto
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Cuéntanos más sobre tu proyecto..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                />
              </div>

              {message && (
                <div
                  className={`p-4 rounded-lg text-sm flex gap-3 ${
                    messageType === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{message}</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={onClose} type="button">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-slate-700 text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar Cotización'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Products({
  scrollToSection,
  searchQuery = ''
}: {
  readonly scrollToSection: (sectionId: string) => void;
  readonly searchQuery?: string;
}) {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  console.log('Products component received products:', products);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [cotizationModalOpen, setCotizationModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!normalizedSearch) return products;

    return products.filter((product) => {
      const searchableParts = [
        product.name,
        product.description,
        product.category,
        ...product.specs.map((spec) => `${spec.label} ${spec.value}`),
        ...(product.features ?? []),
      ];

      return searchableParts.join(' ').toLowerCase().includes(normalizedSearch);
    });
  }, [products, normalizedSearch]);

  const itemsPerPage = 4;
  const maxIndex = Math.max(0, filteredProducts.length - itemsPerPage);

  useEffect(() => {
    setCurrentIndex(0);
  }, [normalizedSearch]);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const openDetailModal = (product: Product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
  };

  const openCotizationModal = (product: Product) => {
    setSelectedProduct(product);
    setCotizationModalOpen(true);
  };

  const closeCotizationModal = () => {
    setCotizationModalOpen(false);
  };

  const handleFormSubmit = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const visibleProducts = filteredProducts.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section id="products" className="py-16 lg:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full">
            <span className="text-blue-600 font-semibold text-sm">{t('products-catalogo-tag')}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">{t('products-catalogo-titulo')}</h2>
          <p className="text-xl text-slate-600">
            {t('products-catalogo-desc')}
          </p>
        </div>

        {isAuthenticated && user?.role === 'admin' && (
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => {
                setEditingProduct(null);
                setIsFormOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              {t('products-agregar-producto')}
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between mb-10">
          <div className="text-sm text-slate-600 font-medium">
            {filteredProducts.length > 0
              ? `${t('products-mostrando')} ${currentIndex + 1} - ${Math.min(currentIndex + itemsPerPage, filteredProducts.length)} ${t('products-de')} ${filteredProducts.length}`
              : 'Sin resultados para la búsqueda actual'}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full border-slate-300 hover:bg-gmh-blue hover:text-white hover:border-gmh-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="w-10 h-10 rounded-full border-slate-300 hover:bg-gmh-blue hover:text-white hover:border-gmh-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {visibleProducts.map((product) => (
            <Card key={product.id} className="group bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative">
              {isAuthenticated && user?.role === 'admin' && (
                <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setIsFormOpen(true);
                    }}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    title={t('products-eliminar')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <CardContent className="p-0 flex flex-col h-full">
                <div className="px-5 pt-4">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                    {product.category}
                  </span>
                </div>

                <div className="relative aspect-square bg-slate-100 p-6 flex items-center justify-center flex-grow">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-gmh-blue transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{product.description}</p>

                  <div className="mb-4 space-y-1">
                    {product.price !== undefined && (
                      <div className="text-sm font-semibold text-green-600">
                        ${Number(product.price).toFixed(2)}
                      </div>
                    )}
                    {product.specs.map((spec, idx) => (
                      <div key={`${spec.label}-${spec.value}-${idx}`} className="text-xs text-slate-500">
                        <span className="text-blue-600 mr-1">✓</span>
                        {spec.label}: {spec.value}
                      </div>
                    ))}
                    {product.features?.map((f, idx) => (
                      <div key={`${f}-${idx}`} className="text-xs text-slate-500">
                        <span className="text-blue-600 mr-1">•</span>
                        {f}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gmh-blue text-gmh-blue hover:bg-gmh-blue hover:text-white transition-all"
                      onClick={() => openDetailModal(product)}
                    >
                      <span className="text-xs">Ver Detalles</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 text-white hover:bg-green-700 transition-all"
                      onClick={() => {
                        addToCart(product.id, product.name, product.category);
                        // Mostrar feedback visual
                      alert(t('products-agregado-carrito'));
                      }}
                      title={t('products-agregar-carrito')}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      <span className="text-xs">{t('products-carrito')}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center mb-10">
            <p className="text-slate-600 text-lg">No encontramos productos con esa búsqueda.</p>
            <p className="text-slate-500 text-sm mt-1">Probá con otro término, categoría o especificación.</p>
          </div>
        )}

        <div className="flex flex-col items-center gap-6">
          <div className="flex justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }, (_, i) => i).map((pageNumber) => (
              <button
                key={`page-${pageNumber}`}
                onClick={() => setCurrentIndex(pageNumber)}
                className={`w-2 h-2 rounded-full transition-all ${
                  pageNumber === currentIndex ? 'w-6 bg-gmh-blue' : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <div className="text-center mt-4">
            <p className="text-slate-600 mb-4">¿No encuentras lo que buscas? Contáctanos para conocer soluciones personalizadas.</p>
            <Button
              className="bg-gradient-to-r from-blue-600 to-slate-700 text-white hover:shadow-lg transition-all px-8 py-3"
              onClick={() => scrollToSection('contact')}
            >
              Solicitar Cotización Personalizada
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {deleteConfirm && (
        <button className="fixed inset-0 z-[100] flex items-center justify-center" onClick={() => setDeleteConfirm(null)} onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setDeleteConfirm(null);
          }
        }} aria-label="Cerrar confirmación" type="button">
          <div className="fixed inset-0 bg-black/50"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Confirmar eliminación</h3>
            <p className="text-slate-600 mb-6">{t('products-confirmar-eliminar')}</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleDelete(deleteConfirm)}
              >
                {t('products-eliminar')}
              </Button>
            </div>
          </div>
        </button>
      )}

      <DetailModal product={selectedProduct} isOpen={detailModalOpen} onClose={closeDetailModal} onOpenCotization={openCotizationModal} />
      <CotizationModal product={selectedProduct} isOpen={cotizationModalOpen} onClose={closeCotizationModal} />
      <ProductFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} product={editingProduct} />
    </section>
  );
}
