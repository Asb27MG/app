import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { apiUrl } from '@/lib/api';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export function DeleteAccountModal({ isOpen, onClose, userEmail }: Readonly<DeleteAccountModalProps>) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();

  if (!isOpen) return null;

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('La contraseña es requerida');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(apiUrl('/api/auth/delete-account'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Cerrar sesión y limpiar
        logout();
        setPassword('');
        onClose();
      } else {
        setError(data.message || 'Error al eliminar la cuenta');
      }
    } catch {
      setError('Error al eliminar la cuenta. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClose();
          }
        }}
        type="button"
        aria-label="Cerrar modal"
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full z-10">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
            type="button"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>

          <div className="p-8">
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex justify-center items-center w-16 h-16 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
              Eliminar Cuenta
            </h2>
            <p className="text-center text-slate-600 mb-6">
              Esta acción es permanente e irreversible.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">
                Se eliminarán permanentemente:
              </p>
              <ul className="text-sm text-red-700 mt-2 space-y-1 ml-4">
                <li>• Tu perfil de usuario</li>
                <li>• Todos tus datos personales</li>
                <li>• Tus cotizaciones guardadas</li>
                <li>• Tu historial de cuenta</li>
              </ul>
            </div>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-2">
                  Confirma tu contraseña para eliminar la cuenta
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  required
                />
              </div>

              {error && (
                <div className="p-4 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                  {error}
                </div>
              )}

              <div className="pt-4 space-y-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                >
                  {isLoading ? 'Eliminando...' : 'Eliminar Mi Cuenta Permanentemente'}
                </Button>

                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
