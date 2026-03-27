import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Product, ProductsContextType } from '@/types';
import { useAuth } from './AuthContext';

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useAuth();

  // Cargar productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.success && data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          console.warn('API returned no products, using sample data');
          // fallback sample products for development
          setProducts([
            {
              id: '1',
              name: 'Cámara Bullet SECUREYE',
              description: 'Cámara de vigilancia bullet 1080p con visión nocturna IR',
              category: 'Categoría A',
              image: '/product-camera1.jpg',
              price: 100.00,
              specs: [{ label: 'Resolución', value: '1080p' }, { label: 'Visión Nocturna', value: '40 LEDs IR' }],
              features: ['Garantía 1 año', 'Soporte técnico'],
            },
            {
              id: '2',
              name: 'Cámara Domo Profesional',
              description: 'Cámara domo motorizada con zoom óptico 4x',
              category: 'Categoría B',
              image: '/product-camera2.jpg',
              price: 150.00,
              specs: [{ label: 'Resolución', value: '2MP' }, { label: 'Zoom Óptico', value: '4x' }],
              features: ['Incluye estuche'],
            },
            {
              id: '3',
              name: 'NVR ACME Secure 9000',
              description: 'Network Video Recorder 16 canales con PoE integrado',
              category: 'Categoría A',
              image: '/product-nvr.jpg',
              price: 200.00,
              specs: [{ label: 'Canales', value: '16' }, { label: 'Almacenamiento', value: 'HDD interno' }],
              features: ['Resistente al agua'],
            },
            {
              id: '4',
              name: 'Switch Nexuscore 9000 Series',
              description: 'Switch Ethernet profesional 24 puertos Gigabit',
              category: 'Admin Test',
              image: '/product-switch1.jpg',
              price: 0.00,
              specs: [{ label: 'Puertos', value: '24 Gigabit' }, { label: 'Velocidad', value: '1000 Mbps' }],
              features: [],
            },
            {
              id: '5',
              name: 'Switch Profesional PoE+',
              description: 'Switch PoE+ 18 puertos con soporte para cámaras IP',
              category: 'Test',
              image: '/product-switch2.jpg',
              price: 123.45,
              specs: [{ label: 'Puertos PoE+', value: '18' }, { label: 'Power Budget', value: '370W' }],
              features: ['Feature1'],
            },
          ]);
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
        // fallback sample products
        setProducts([
          {
            id: '1',
            name: 'Cámara Bullet SECUREYE',
            description: 'Cámara de vigilancia bullet 1080p con visión nocturna IR',
            category: 'Categoría A',
            image: '/product-camera1.jpg',
            price: 100.00,
            specs: [{ label: 'Resolución', value: '1080p' }, { label: 'Visión Nocturna', value: '40 LEDs IR' }],
            features: ['Garantía 1 año', 'Soporte técnico'],
          },
          {
            id: '2',
            name: 'Cámara Domo Profesional',
            description: 'Cámara domo motorizada con zoom óptico 4x',
            category: 'Categoría B',
            image: '/product-camera2.jpg',
            price: 150.00,
            specs: [{ label: 'Resolución', value: '2MP' }, { label: 'Zoom Óptico', value: '4x' }],
            features: ['Incluye estuche'],
          },
          {
            id: '3',
            name: 'NVR ACME Secure 9000',
            description: 'Network Video Recorder 16 canales con PoE integrado',
            category: 'Categoría A',
            image: '/product-nvr.jpg',
            price: 200.00,
            specs: [{ label: 'Canales', value: '16' }, { label: 'Almacenamiento', value: 'HDD interno' }],
            features: ['Resistente al agua'],
          },
          {
            id: '4',
            name: 'Switch Nexuscore 9000 Series',
            description: 'Switch Ethernet profesional 24 puertos Gigabit',
            category: 'Admin Test',
            image: '/product-switch1.jpg',
            price: 0.00,
            specs: [{ label: 'Puertos', value: '24 Gigabit' }, { label: 'Velocidad', value: '1000 Mbps' }],
            features: [],
          },
          {
            id: '5',
            name: 'Switch Profesional PoE+',
            description: 'Switch PoE+ 18 puertos con soporte para cámaras IP',
            category: 'Test',
            image: '/product-switch2.jpg',
            price: 123.45,
            specs: [{ label: 'Puertos PoE+', value: '18' }, { label: 'Power Budget', value: '370W' }],
            features: ['Feature1'],
          },
        ]);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    if (user?.role !== 'admin') {
      throw new Error('Solo los administradores pueden agregar productos');
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': user.role,
        },
        body: JSON.stringify({
          nombre: product.name,
          descripcion: product.description,
          categoria: product.category,
          imagen_url: product.image,
        }),
      });

      const data = await response.json();

      if (data.success && data.product) {
        setProducts([...products, data.product]);
        return data.product;
      } else {
        throw new Error(data.error || 'Error al agregar producto');
      }
    } catch (error) {
      console.error('Error al agregar producto:', error);
      throw error;
    }
  }, [user, products]);

  const updateProduct = useCallback(async (id: string, updatedProduct: Partial<Product>) => {
    if (user?.role !== 'admin') {
      throw new Error('Solo los administradores pueden actualizar productos');
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': user.role,
        },
        body: JSON.stringify({
          nombre: updatedProduct.name,
          descripcion: updatedProduct.description,
          categoria: updatedProduct.category,
          imagen_url: updatedProduct.image,
        }),
      });

      const data = await response.json();

      if (data.success && data.product) {
        setProducts(products.map(p => p.id === id ? data.product : p));
        return data.product;
      } else {
        throw new Error(data.error || 'Error al actualizar producto');
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }, [user, products]);

  const deleteProduct = useCallback(async (id: string) => {
    if (user?.role !== 'admin') {
      throw new Error('Solo los administradores pueden eliminar productos');
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-role': user.role,
        },
      });

      const data = await response.json();

      if (data.success) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        throw new Error(data.error || 'Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }, [user, products]);

  const getProductById = useCallback((id: string) => {
    return products.find((product) => product.id === id);
  }, [products]);

  const value = useMemo<ProductsContextType>(() => ({
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
  }), [products, addProduct, updateProduct, deleteProduct, getProductById]);

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within ProductsProvider');
  }
  return context;
}
