import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductsContext';
import type { Product } from '@/types';

export function AdminPanel() {
  const { user } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  interface FormData {
    name: string;
    description: string;
    category: string;
    image: string;
    price: number;
    specs: { label: string; value: string }[];
    features: string[];
  }

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    image: '',
    price: 0,
    specs: [],
    features: []
  });

  // Verificación estricta de rol de admin
  if (user?.role !== "admin") {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Acceso Denegado</h3>
          <p className="text-red-600">Solo los administradores pueden acceder a esta sección.</p>
          <p className="text-sm text-red-500 mt-2">Tu rol actual: {user?.role || 'No autenticado'}</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateProduct(editingId, formData);
        setEditingId(null);
      } else {
        // agregar valores requeridos faltantes antes de enviar
       const newProd = {
  ...formData,
  specs: formData.specs?.length
    ? formData.specs
    : [{ label: "Categoría", value: formData.category }],
  features: formData.features ?? []
};

await addProduct(newProd);
setIsAdding(false);
      }

      setFormData({ name: '', description: '', category: '', image: '', price: 0, specs: [], features: [] });
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert('Error al guardar producto: ' + errorMessage);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      image: product.image,
      price: product.price ?? 0,
      specs: product.specs || [],
      features: product.features || []
    });
    setEditingId(product.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        alert('Error al eliminar producto: ' + errorMessage);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', category: '', image: '', price: 0, specs: [], features: [] });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

      <div className="mb-6">
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="mb-4"
        >
          {isAdding ? 'Cancelar' : 'Agregar Producto'}
        </Button>

        {isAdding && (
          <>
            <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingId ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="admin-name" className="block text-sm font-medium mb-1">Nombre</label>
                  <Input
                    id="admin-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="admin-category" className="block text-sm font-medium mb-1">Categoría</label>
                  <Input
                    id="admin-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="admin-price" className="block text-sm font-medium mb-1">Precio</label>
                  <Input
                    id="admin-price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="admin-description" className="block text-sm font-medium mb-1">Descripción</label>
                  <Textarea
                    id="admin-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="admin-image" className="block text-sm font-medium mb-1">URL de Imagen</label>
                  <Input
                    id="admin-image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2">
                  <h3 className="block text-sm font-medium mb-1">Especificaciones</h3>
                  {formData.specs.map((spec, idx) => (
                    <div key={`spec-${idx}-${spec.label}-${spec.value}`} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Etiqueta"
                        value={spec.label}
                        onChange={(e) => {
                          const specs = [...formData.specs];
                          specs[idx].label = e.target.value;
                          setFormData({ ...formData, specs });
                        }}
                      />
                      <Input
                        placeholder="Valor"
                        value={spec.value}
                        onChange={(e) => {
                          const specs = [...formData.specs];
                          specs[idx].value = e.target.value;
                          setFormData({ ...formData, specs });
                        }}
                      />
                      <Button variant="outline" size="icon" onClick={() => {
                        const specs = formData.specs.filter((_, i) => i !== idx);
                        setFormData({ ...formData, specs });
                      }}>
                        &times;
                      </Button>
                    </div>
                  ))}
                  <Button size="sm" onClick={() => setFormData({ ...formData, specs: [...formData.specs, { label: '', value: '' }] })}>
                    Agregar especificación
                  </Button>
                </div>

                <div className="md:col-span-2">
                  <h3 className="block text-sm font-medium mb-1">Características</h3>
                  {formData.features.map((feat, idx) => (
                    <div key={`feature-${idx}-${feat}`} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Característica"
                        value={feat}
                        onChange={(e) => {
                          const features = [...formData.features];
                          features[idx] = e.target.value;
                          setFormData({ ...formData, features });
                        }}
                      />
                      <Button variant="outline" size="icon" onClick={() => {
                        const features = formData.features.filter((_, i) => i !== idx);
                        setFormData({ ...formData, features });
                      }}>
                        &times;
                      </Button>
                    </div>
                  ))}
                  <Button size="sm" onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}>
                    Agregar característica
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button type="submit">
                  {editingId ? 'Actualizar' : 'Crear'} Producto
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>

            {/* vista previa */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Vista previa</h3>
              <Card className="bg-white border shadow flex">
                <CardContent className="p-4 flex flex-col w-full">
                  <div className="flex-1">
                    <h4 className="font-semibold text-xl">{formData.name || 'Nombre'}</h4>
                    <p className="text-sm text-gray-600 mb-2">{formData.category || 'Categoría'}</p>
                    <p className="text-sm font-medium text-green-600 mb-2">
                        {formData.price ? `$${Number(formData.price).toFixed(2)}` : 'Precio'}
                    </p>
                    <p className="text-sm text-gray-700">
                      {formData.description || 'Descripción del producto...'}
                    </p>
                    {formData.specs.length > 0 && (
                      <ul className="mt-2 text-xs text-gray-600">
                        {formData.specs.map((s, i) => (
                          <li key={`preview-spec-${i}-${s.label}-${s.value}`}>• {s.label}: {s.value}</li>
                        ))}
                      </ul>
                    )}
                    {formData.features.length > 0 && (
                      <ul className="mt-2 text-xs text-gray-600">
                        {formData.features.map((f, i) => (
                          <li key={`preview-feature-${i}-${f}`}>✓ {f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="preview"
                      className="w-full h-48 object-contain mt-4"
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium mb-4">Productos ({products.length})</h2>

          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="text-sm text-blue-600">{product.category}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}