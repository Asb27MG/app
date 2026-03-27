import './App.css';
import { AuthProvider } from './context/AuthContext';
import { ProductsProvider } from './context/ProductsContext';
import { CartProvider } from './context/CartContext';
import Header from './sections/Header';
import Hero from './sections/Hero';
import Services from './sections/Services';
import Solutions from './sections/Solutions';
import Products from './sections/Products';
import About from './sections/About';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import SuccessCases from './sections/SuccessCasesAdmin';
import { useState, useCallback } from 'react';

function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [productSearchQuery, setProductSearchQuery] = useState<string>('');

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  }, []);

  const renderSection = (sectionKey: string, Component: any) => (
    <div id={sectionKey} className={`section ${activeSection === sectionKey ? 'active' : ''}`} data-section={sectionKey}>
      <Component scrollToSection={scrollToSection} />
    </div>
  );

  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <div className={`min-h-screen ${activeSection === 'hero' ? 'bg-transparent' : 'bg-white'}`}>
            <Header
              setActiveSection={setActiveSection}
              activeSection={activeSection}
              scrollToSection={scrollToSection}
              onProductSearchChange={setProductSearchQuery}
            />
            
            <main className="sections-container">
              {renderSection('hero', Hero)}
              {renderSection('services', Services)}
              {renderSection('solutions', Solutions)}
              <div id="products" className={`section ${activeSection === 'products' ? 'active' : ''}`} data-section="products">
                <Products scrollToSection={scrollToSection} searchQuery={productSearchQuery} />
              </div>
              {renderSection('about', About)}
              {renderSection('success-cases', SuccessCases)} {/* ← Agregado aquí */}
              {renderSection('contact', Contact)}
            </main>
            
            {/* Solo UN Footer al final */}
            <Footer scrollToSection={scrollToSection} />
          </div>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;