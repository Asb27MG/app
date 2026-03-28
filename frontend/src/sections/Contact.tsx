import { useState } from 'react';
import { Mail, MapPin, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiUrl } from '@/lib/api';

interface ContactResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

function Contact({ scrollToSection }: { readonly scrollToSection?: (sectionId: string) => void }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    mensaje: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { nombre, correo, mensaje } = formData;

    if (!nombre || !correo || !mensaje) {
      setMessage(t('contact-validacion'));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(apiUrl('/api/contacto'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          correo,
          descripcion: mensaje,
        }),
      });

      const text = await response.text();
      let data: ContactResponse = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        console.error('JSON inválido de /api/contacto:', text, err);
        setMessage('Ocurrió un error inesperado. Revisa la consola.');
        setLoading(false);
        return;
      }

      if (response.ok && data?.success) {
        setMessage(data.message || 'Mensaje enviado correctamente');
        setFormData({ nombre: '', correo: '', mensaje: '' });
      } else {
        console.error('Error enviando contacto:', response.status, data);
        setMessage(
          data?.message || 'Ocurrió un error al enviar el mensaje'
        );
      }
    } catch (error) {
      console.error('Error de red al enviar contacto:', error);
      setMessage('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full">
            <span className="text-blue-600 font-semibold text-sm">{t('contact-tag')}</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            {t('contact-titulo')}
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t('contact-subtitulo')}
          </p>
        </div>

        {/* Contact Form & Info */}
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Left Side - Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {t('contact-info-titulo')}
              </h3>
              <p className="text-slate-600">
                {t('contact-info-desc')}
              </p>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">{t('contact-email')}</h4>
                <p className="text-slate-600">Info@solucionesgmh.com</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">{t('contact-ubicacion')}</h4>
                <p className="text-slate-600">Argentina</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">{t('contact-horario')}</h4>
                <p className="text-slate-600">{t('contact-dias')}</p>
                <p className="text-slate-600">{t('contact-horas')}</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
            <h3 className="text-2xl font-bold text-center mb-2 text-slate-900">
              {t('contact-form-titulo')}
            </h3>
            <p className="text-center text-slate-600 mb-8">
              {t('contact-form-desc')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  id="nombre"
                  type="text"
                  placeholder={t('contact-nombre')}
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <input
                  id="correo"
                  type="email"
                  placeholder={t('contact-correo')}
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <textarea
                  id="mensaje"
                  placeholder={t('contact-mensaje')}
                  rows={4}
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                />
              </div>

              {message && (
                <div
                  className={`p-4 rounded-lg text-sm ${
                    message.includes('correctamente')
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('contact-enviando') : t('contact-enviar')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
