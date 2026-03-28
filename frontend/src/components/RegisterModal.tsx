import { useState, type FormEvent } from 'react';
import { X, Eye, EyeOff, Lock, User, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { apiUrl } from '@/lib/api';
import { useTranslation } from 'react-i18next';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: Readonly<RegisterModalProps>) {
  const { t } = useTranslation();
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { register, verifyCode } = useAuth();

  if (!isOpen) return null;

  const validateRegisterForm = () => {
    if (!name.trim()) return t('auth-register-error-name-required');
    if (!email.trim()) return t('auth-register-error-email-required');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return t('auth-login-error-email');
    if (password.length < 6) return t('auth-register-error-password-length');
    if (password !== confirmPassword) return t('auth-register-error-password-match');
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateRegisterForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(name, email, password);
      if (result.success) {
        setSuccess(t('auth-register-success'));
        setTimeout(() => {
          setStep('verify');
          setSuccess('');
        }, 1500);
      } else {
        setError(result.error || t('auth-register-error-generic'));
      }
    } catch {
      setError(t('auth-register-error-generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!confirmationCode.trim()) {
      setError(t('auth-verify-error-code-required'));
      return;
    }

    if (confirmationCode.length !== 6) {
      setError(t('auth-verify-error-code-length'));
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyCode(email, confirmationCode);
      
      if (result.success) {
        setSuccess(t('auth-verify-success'));
        setTimeout(() => {
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setConfirmationCode('');
          setStep('register');
          setSuccess('');
          onClose();
        }, 1500);
      } else {
        setError(result.error || t('auth-verify-error-invalid'));
      }
    } catch {
      setError(t('auth-verify-error-generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setSuccess('');
    setResendLoading(true);

    try {
      const response = await fetch(apiUrl('/api/auth/resend-code'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(t('auth-verify-resend-success'));
      } else {
        setError(data.message || t('auth-verify-resend-error'));
      }
    } catch {
      setError(t('auth-verify-resend-error'));
    } finally {
      setResendLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setConfirmationCode('');
    setError('');
    setSuccess('');
    setStep('register');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 min-h-screen">
      <button
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClose();
          }
        }}
        type="button"
        aria-label={t('auth-close-modal')}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full z-10">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
            type="button"
            aria-label={t('auth-close')}
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>

          <div className="p-8">
            {step === 'register' ? (
              <>
                <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
                  {t('auth-register-title')}
                </h2>
                <p className="text-center text-slate-600 mb-6">
                  {t('auth-register-subtitle')}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-1">
                      {t('auth-name-label')}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        id="name"
                        type="text"
                        placeholder={t('auth-name-placeholder')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-1">
                      {t('auth-email-label')}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
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
                        aria-label={t('auth-toggle-password-visibility')}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-900 mb-1">
                      {t('auth-confirm-password-label')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label={t('auth-toggle-confirm-password-visibility')}
                      >
                        {showConfirmPassword ? (
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

                  {success && (
                    <div className="p-4 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
                      {success}
                    </div>
                  )}

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-slate-700 text-white hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {isLoading ? t('auth-register-loading') : t('auth-register-title')}
                    </Button>
                  </div>

                  <p className="text-center text-sm text-slate-600 mt-4">
                    {t('auth-register-have-account')}{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setName('');
                        setEmail('');
                        setPassword('');
                        setConfirmPassword('');
                        setError('');
                        setSuccess('');
                        onSwitchToLogin?.();
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      {t('auth-register-switch-login')}
                    </button>
                  </p>
                </form>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex justify-center items-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    {t('auth-verify-title')}
                  </h2>
                  <p className="text-center text-slate-600 mb-2">
                    {t('auth-verify-subtitle')}
                  </p>
                  <p className="text-center text-slate-900 font-semibold">
                    {email}
                  </p>
                </div>

                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div>
                    <label htmlFor="code" className="block text-sm font-semibold text-slate-900 mb-1">
                      {t('auth-verify-code-label')}
                    </label>
                    <input
                      id="code"
                      type="text"
                      placeholder={t('auth-verify-code-placeholder')}
                      value={confirmationCode}
                      onChange={(e) => setConfirmationCode(e.target.value.replaceAll(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                    <p className="text-center text-sm text-slate-500 mt-2">
                      {t('auth-verify-code-hint')}
                    </p>
                  </div>

                  {error && (
                    <div className="p-4 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-4 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      {success}
                    </div>
                  )}

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-slate-700 text-white hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {isLoading ? t('auth-verify-loading') : t('auth-verify-title')}
                    </Button>
                  </div>

                  <p className="text-center text-sm text-slate-600 mt-4">
                    {t('auth-verify-no-code')}{' '}
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendLoading}
                      className="text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-50"
                    >
                      {resendLoading ? t('auth-verify-resend-loading') : t('auth-verify-resend-button')}
                    </button>
                  </p>
                </form>
              </>
            )}
          </div>
      </div>
    </div>
  );
}
