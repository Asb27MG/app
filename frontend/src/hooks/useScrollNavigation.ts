import { useEffect, useState } from 'react';

export const useScrollNavigation = () => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    // Simple scroll listener para detectar qué sección está visible
    const handleScroll = () => {
      const sections = ['hero', 'services', 'solutions', 'products', 'about', 'contact'];
      
      let currentSection = 'hero';
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Si la sección está en el top 30% de la pantalla, es la activa
          if (rect.top <= window.innerHeight * 0.3) {
            currentSection = sectionId;
          }
        }
      }
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Height of fixed header
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth',
      });
      // Actualizar activeSection después de un pequeño delay
      setTimeout(() => {
        setActiveSection(sectionId);
      }, 100);
    }
  };

  return { activeSection, setActiveSection, scrollToSection };
};
