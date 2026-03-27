import { Network, Shield, Phone, Mail, MapPin, Users, MessageCircle, Image, Briefcase, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Agrega esta interfaz para las props
interface FooterProps {
  scrollToSection?: (sectionId: string) => void;
}

export default function Footer({ scrollToSection }: FooterProps) {
  const { t } = useTranslation();

  const handleNavClick = (href: string) => {
    if (scrollToSection && href.startsWith('#')) {
      const sectionId = href.replace('#', '');
      scrollToSection(sectionId);
    }
  };

  const translatedFooterLinks = {
    soluciones: [
      { label: t('footer-soluciones-vigilancia'), href: '#services' },
      { label: t('footer-soluciones-acceso'), href: '#solutions' },
      { label: t('footer-soluciones-red'), href: '#products' },
      { label: t('footer-soluciones-ciber'), href: '#services' },
    ],
    empresa: [
      { label: t('footer-empresa-sobre'), href: '#about' },
      { label: t('footer-empresa-equipo'), href: '#about' },
      { label: t('footer-empresa-casos'), href: '#success-cases' }, // ← Cambiado a #success-cases
      { label: t('footer-empresa-noticias'), href: '#' },
    ],
    soporte: [
      { label: t('footer-soporte-ayuda'), href: '#contact' },
      { label: t('footer-soporte-documentacion'), href: '#' },
      { label: t('footer-soporte-descargas'), href: '#' },
      { label: t('footer-soporte-garantia'), href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Users, href: '#', label: 'Facebook' },
    { icon: MessageCircle, href: '#', label: 'X (Twitter)' },
    { icon: Image, href: '#', label: 'Instagram' },
    { icon: Briefcase, href: '#', label: 'LinkedIn' },
    { icon: Play, href: '#', label: 'YouTube' },
  ];

  return (
    <footer id="contact" className="bg-[#0f2440] text-white">
      {/* Main Footer */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="#hero" className="flex items-center justify-center group">
      <img 
        src="/gmhlogo.png" 
        alt="GMH Soluciones Tecnológicas" 
        className="h-28 lg:h-36 w-auto transition-opacity opacity-100 hover:opacity-80"
      />
    </a>
            
            <p className="text-slate-300 mb-6 max-w-sm leading-relaxed">
              {t('footer-descripcion')}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-5 h-5 text-blue-300" />
                <span>+54 9 11 6230-5099</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-5 h-5 text-blue-300" />
                <span>info@gmh-tech.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-5 h-5 text-blue-300" />
                <span>Castillo 1332, C1427 Cdad. Autónoma de Buenos Aires</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer-empresa')}</h4>
            <ul className="space-y-3">
              {translatedFooterLinks.empresa.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-slate-300 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer-soporte')}</h4>
            <ul className="space-y-3">
              {translatedFooterLinks.soporte.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-slate-300 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              {t('footer-derechos')}
            </p>
            
           
          </div>
        </div>
      </div>
    </footer>
  );
}