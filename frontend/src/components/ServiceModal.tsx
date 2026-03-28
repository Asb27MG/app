import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLocalizedServiceData } from '@/lib/contentLocalization';

// ==========================================
// TIPOS
// ==========================================
interface Feature {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  benefits: string[];
  icon?: string;
}

interface ServiceData {
  id: string;
  titleKey: string;
  descriptionKey: string;
  features: Feature[];
}

// ==========================================
// COMPONENTE DE CARACTERÍSTICA INDIVIDUAL
// ==========================================
interface FeatureCardProps {
  feature: Feature;
  isExpanded: boolean;
  onToggle: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, isExpanded, onToggle }) => {
  const { t } = useTranslation();

  return (
    <div
      onClick={onToggle}
      style={{
        background: isExpanded
          ? 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'
          : '#eff6ff',
        borderRadius: '12px',
        padding: '16px 20px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: isExpanded ? 'none' : '2px solid #dbeafe',
        boxShadow: isExpanded
          ? '0 10px 25px rgba(37, 99, 235, 0.3)'
          : '0 1px 3px rgba(0,0,0,0.05)',
        transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
        marginBottom: '12px'
      }}
    >
      {/* Header siempre visible */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: isExpanded ? 'rgba(255,255,255,0.2)' : '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <span style={{
            fontSize: '20px',
            filter: isExpanded ? 'brightness(2)' : 'none'
          }}>
            {feature.icon}
          </span>
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: 0,
            fontSize: '15px',
            fontWeight: '600',
            color: isExpanded ? '#fff' : '#1e293b',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {feature.title}
          </h3>
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '13px',
            color: isExpanded ? 'rgba(255,255,255,0.85)' : '#64748b',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {feature.shortDesc}
          </p>
        </div>

        {/* Flecha indicadora */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isExpanded ? '#fff' : '#2563eb'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            flexShrink: 0
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {/* Contenido expandido */}
      <div style={{
        maxHeight: isExpanded ? '500px' : '0',
        opacity: isExpanded ? 1 : 0,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: isExpanded ? '1px solid rgba(255,255,255,0.2)' : 'none'
        }}>
          <p style={{
            color: isExpanded ? '#fff' : '#374151',
            fontSize: '14px',
            lineHeight: '1.7',
            marginBottom: '16px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {feature.fullDesc}
          </p>

          <h4 style={{
            color: isExpanded ? '#fff' : '#1e293b',
            fontSize: '12px',
            fontWeight: '700',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            opacity: isExpanded ? 0.95 : 1
          }}>
            {t('services-benefits-title')}
          </h4>

          <ul style={{
            margin: 0,
            paddingLeft: '0',
            listStyle: 'none',
            color: isExpanded ? 'rgba(255,255,255,0.95)' : '#475569',
            fontSize: '13px',
            lineHeight: '1.8',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {feature.benefits.map((benefit, index) => (
              <li key={index} style={{
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <span style={{
                  color: isExpanded ? '#fff' : '#2563eb',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  ✓
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          {isExpanded && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.9)',
              fontStyle: 'italic',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {`💡 ${t('services-feature-close-hint')}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL DEL MODAL
// ==========================================
interface ServiceModalProps {
  serviceId: string;
  isOpen: boolean;
  onClose: () => void;
  onRequestInfo: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  serviceId,
  isOpen,
  onClose,
  onRequestInfo
}) => {
  const { t, i18n } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const servicesData = getLocalizedServiceData(i18n.resolvedLanguage ?? i18n.language) as Record<string, ServiceData>;
  const service = servicesData[serviceId];

  if (!isOpen || !service) return null;

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '100px 20px 20px 20px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        animation: 'modalEnter 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 24px 0 24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {t('services-descripcion')}
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#374151',
            lineHeight: '1.6',
            marginBottom: '24px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {t(service.descriptionKey)}
          </p>
        </div>

        {/* Features Section */}
        <div style={{ padding: '24px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '16px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {t('services-caracteristicas')}
          </h2>

          <div>
            {service.features.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                isExpanded={expandedId === feature.id}
                onToggle={() => handleToggle(feature.id)}
              />
            ))}
          </div>

          <p style={{
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '13px',
            marginTop: '16px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {`👆 ${t('services-feature-hint')}`}
          </p>
        </div>

        {/* Footer Buttons */}
        <div style={{
          padding: '20px 24px 24px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              background: '#fff',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            {t('services-cerrar')}
          </button>

          <button
            onClick={onRequestInfo}
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1d4ed8';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(37, 99, 235, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#2563eb';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(37, 99, 235, 0.2)';
            }}
          >
            {t('services-solicitar')}
          </button>
        </div>
      </div>

      {/* Animación CSS */}
      <style>{`
        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ServiceModal;