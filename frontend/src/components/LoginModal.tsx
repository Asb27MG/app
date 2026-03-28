import { useState, type FormEvent } from 'react';
import { X, Eye, EyeOff, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: Readonly<LoginModalProps>) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('auth-login-error-email'));
      return;
    }

    // Validar contraseña
    if (!password) {
      setError(t('auth-login-error-password-required'));
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        setEmail('');
        setPassword('');
        onClose();
      } else {
        setError(result.error || t('auth-login-error-invalid-credentials'));
      }
    } catch {
      setError(t('auth-login-error-generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 min-h-screen">
      <button
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClose();
          }
        }}
        aria-label={t('auth-close-modal')}
        type="button"
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>

          <div className="p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
              {t('auth-login-title')}
            </h2>
            <p className="text-center text-slate-600 mb-6">
              {t('auth-login-subtitle')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-1">
                  {t('auth-email-label')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder={t('auth-email-placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-1">
                  {t('auth-password-label')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                  {error}
                </div>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-slate-700 text-white hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? t('auth-login-loading') : t('auth-login-title')}
                </Button>
              </div>

              <p className="text-center text-sm text-slate-600 mt-4">
                {t('auth-login-no-account')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setEmail('');
                    setPassword('');
                    setError('');
                    onSwitchToRegister?.();
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {t('auth-login-switch-register')}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
  );
}
