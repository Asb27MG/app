import { useState } from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { apiUrl } from '@/lib/api';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartPanel({ isOpen, onClose }: Readonly<CartPanelProps>) {
  const { items, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  if (!isOpen) return null;

  const handleSendQuotation = async () => {
    if (!user) {
      setSubmitMessage('Debes estar registrado para solicitar una cotización');
      return;
    }

    if (items.length === 0) {
      setSubmitMessage('Agrega productos al carrito primero');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch(apiUrl('/api/cotizacion'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: user.name,
          correo: user.email,
          products: items,
          descripcion: `Solicitud de cotización con ${items.length} producto(s)`,
        }),
      });

      if (response.ok) {
        setSubmitMessage('✓ Cotización enviada exitosamente. Nos pondremos en contacto pronto.');
        setTimeout(() => {
          clearCart();
          onClose();
        }, 2000);
      } else {
        setSubmitMessage('Error al enviar la cotización. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitMessage('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClose();
          }
        }}
        aria-label="Cerrar panel del carrito"
        type="button"
      />

      <div className="flex items-center justify-center min-h-screen px-4 min-h-screen py-6">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors z-10 sticky top-0"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>

          <div className="p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
              Mi Carrito
            </h2>

            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">Tu carrito está vacío</p>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Continuar comprando
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{item.productName}</h3>
                        <p className="text-sm text-slate-600">{item.category}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg">
                          <button className="p-1 hover:bg-slate-100">
                            <Minus className="w-4 h-4 text-slate-600" />
                          </button>
                          <span className="w-8 text-center font-semibold text-slate-900">
                            {item.quantity}
                          </span>
                          <button className="p-1 hover:bg-slate-100">
                            <Plus className="w-4 h-4 text-slate-600" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar del carrito"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4 mb-6">
                  <p className="text-lg font-semibold text-slate-900 text-center">
                    Total de productos: {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                </div>

                {submitMessage && (() => {
                  const isSuccess = submitMessage.includes('✓');
                  const isError = submitMessage.includes('Error') || submitMessage.includes('Debes');
                  let className = 'bg-blue-50 text-blue-700 border border-blue-200';
                  if (isSuccess) {
                    className = 'bg-green-50 text-green-700 border border-green-200';
                  } else if (isError) {
                    className = 'bg-red-50 text-red-700 border border-red-200';
                  }

                  return (
                    <div className={`p-4 rounded-lg mb-4 text-sm ${className}`}>
                      {submitMessage}
                    </div>
                  );
                })()}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100"
                    onClick={onClose}
                  >
                    Seguir comprando
                  </Button>
                  <Button
                    onClick={handleSendQuotation}
                    disabled={isSubmitting || items.length === 0 || !user}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-slate-700 text-white hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Enviando...' : 'Solicitar Cotización'}
                  </Button>
                </div>

                {!user && (
                  <p className="text-xs text-red-600 text-center mt-3">
                    Debes estar registrado para solicitar una cotización
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
