import { useState, useEffect, useCallback } from 'react';
import { Search, Globe, User, Menu, X, LogOut, ShoppingCart, Trash2, Lock, Contact } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { LoginModal } from '@/components/LoginModal';
import { RegisterModal } from '@/components/RegisterModal';
import { CartPanel } from '@/components/CartPanel';
import { AdminPanel } from '@/components/AdminPanel';
import { DeleteAccountModal } from '@/components/DeleteAccountModal';
import { UserProfileModal } from '@/components/UserProfileModal';
import { useTranslation } from 'react-i18next';
import { Portal } from '@radix-ui/react-tooltip';
import type Services from './Services';
import Products from './Products';

function Logo({ activeSection }: { activeSection: string }) {

  const logoMap: Record<string, string> = {
    hero: "/gmhlogo.png",
    services: "/logo_gmh.png",
    solutions: "/logo_gmh.png",
    contact: "/logo_gmh.png",
    products: "/logo_gmh.png",
    about: "/gmhlogo.png",
  };

  const logoSrc = logoMap[activeSection] || "/logo_gmh.png";
  const isSmallLogo = logoSrc.includes("logo_gmh");

  return (
    <a href="#hero" className="flex items-center h-16 lg:h-20 w-[140px]">
  <img 
  src={logoSrc}
  alt="GMH Soluciones Tecnológicas" 
  className={`w-full h-full object-contain ${
    isSmallLogo ? "scale-150" : "scale-100"
  }`}
/>
</a>
  );
}
function DesktopNav({ navItems, setActiveSection, hasDarkBackground, isScrolled, scrollToSection }: { readonly navItems: { label: string; key: string }[]; readonly setActiveSection: (section: string) => void; readonly hasDarkBackground: boolean; readonly isScrolled: boolean; readonly scrollToSection: (sectionId: string) => void }) {
  const textColor = isScrolled && hasDarkBackground ? 'text-white' : hasDarkBackground ? 'text-white/90' : 'text-slate-700';
  const hoverColor = isScrolled && hasDarkBackground ? 'hover:text-blue-200' : hasDarkBackground ? 'hover:text-white' : 'hover:text-gmh-blue';
  const hoverBg = isScrolled && hasDarkBackground ? 'hover:bg-white/20' : hasDarkBackground ? 'hover:bg-white/10' : 'hover:bg-slate-100';

  return (
    <nav className="hidden lg:flex items-center justify-center gap-2">
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => scrollToSection(item.key)}
          className={`px-6 py-3 text-base font-medium transition-all rounded-lg ${hoverBg} ${textColor} ${hoverColor}`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

function AuthenticatedActions({
  hasDarkBackground,
  isScrolled,
  setShowUserProfile
}: {
  readonly hasDarkBackground: boolean;
  readonly isScrolled: boolean;
  readonly setShowUserProfile: (show: boolean) => void;
}) {
  const buttonClass = isScrolled && hasDarkBackground 
    ? 'text-white hover:text-blue-200 hover:bg-white/20' 
    : hasDarkBackground 
      ? 'text-white hover:text-white hover:bg-white/10' 
      : 'text-slate-700 hover:text-gmh-blue hover:bg-slate-100';
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setShowUserProfile(true)}
      className={`hidden sm:flex ${buttonClass}`}
      title="Ver perfil"
    >
      <User className="w-5 h-5" />
    </Button>
  );
}



function RightActions({
  hasDarkBackground,
  isScrolled,
  i18n,
  t,
  cartCount,
  setIsCartOpen,
  isAuthenticated,
  setIsLoginOpen,
  setIsRegisterOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  setShowUserProfile,
  onProductSearchChange,
  scrollToSection
}: {
  readonly hasDarkBackground: boolean;
  readonly isScrolled: boolean;
  readonly i18n: any;
  readonly t: any;
  readonly cartCount: number;
  readonly setIsCartOpen: (open: boolean) => void;
  readonly isAuthenticated: boolean;
  readonly setIsLoginOpen: (open: boolean) => void;
  readonly setIsRegisterOpen: (open: boolean) => void;
  readonly isMobileMenuOpen: boolean;
  readonly setIsMobileMenuOpen: (open: boolean) => void;
  readonly setShowUserProfile: (show: boolean) => void;
  readonly onProductSearchChange: (value: string) => void;
  readonly scrollToSection: (sectionId: string) => void;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const buttonClass = isScrolled && hasDarkBackground 
    ? 'text-white hover:text-blue-200 hover:bg-white/20' 
    : hasDarkBackground 
      ? 'text-white hover:text-white hover:bg-white/10' 
      : 'text-slate-700 hover:text-gmh-blue hover:bg-slate-100';
  
  // Clases para botones de autenticación en el header
  const loginBtnClass = hasDarkBackground
    ? 'text-white hover:text-blue-200 font-medium transition-colors hidden sm:flex'
    : 'text-slate-700 hover:text-gmh-blue font-medium transition-colors hidden sm:flex';
    
  const registerBtnClass = 'bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-2 rounded-full transition-all hover:shadow-lg text-sm';

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedQuery = searchValue.trim();
    onProductSearchChange(normalizedQuery);
    scrollToSection('products');
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
      {/* Iconos - Solo desktop/tablet */}
      <div className="hidden sm:flex items-center gap-2">
        {isSearchOpen && (
          <form onSubmit={handleSearchSubmit} className="mr-1">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Buscar productos..."
              className="w-52 h-9 px-3 rounded-md border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
        )}

        <Button
          variant="ghost"
          onClick={() => {
            setIsSearchOpen((prev) => !prev);
            if (isSearchOpen && !searchValue.trim()) {
              onProductSearchChange('');
            }
          }}
          className={`flex items-center gap-1 px-2 ${buttonClass}`}
          title="Buscar productos"
        >
          <Search className="w-5 h-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`flex items-center gap-1 px-2 min-w-[60px] justify-center ${buttonClass}`}
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">
                {(i18n.resolvedLanguage ?? i18n.language).split('-')[0].toUpperCase()}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" sideOffset={10} className="z-[9999]">
            <DropdownMenuItem onClick={() => i18n.changeLanguage('en')}>
              EN
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => i18n.changeLanguage('es')}>
              ES
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => i18n.changeLanguage('zh')}>
              ZH
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Cart Button */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(true)}
            className={`relative ${buttonClass}`}
            title={t('carrito-compras')}
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      </div>

      {/* Botones de Autenticación - VISIBLES EN TODOS LOS TAMAÑOS */}
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <AuthenticatedActions
            hasDarkBackground={hasDarkBackground}
            isScrolled={isScrolled}
            setShowUserProfile={setShowUserProfile}
          />
        ) : (
          <>
            {/* Sign In - Icono solo en móvil, texto en sm+ */}
            <Button
              variant="ghost"
              onClick={() => setIsLoginOpen(true)}
              className={loginBtnClass}
            >
              <User className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{t('iniciar-sesion')}</span>
            </Button>
            
            {/* Sign In - Icono circular solo para móvil */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLoginOpen(true)}
              className={`sm:hidden ${buttonClass}`}
              title={t('iniciar-sesion')}
            >
              <User className="w-5 h-5" />
            </Button>

            {/* Sign Up - Botón compacto */}
            <Button
              onClick={() => setIsRegisterOpen(true)}
              className={registerBtnClass}
            >
              <User className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">{t('registrarse')}</span>
            </Button>
          </>
        )}

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`lg:hidden ${buttonClass}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>
    </div>
  );
}

function MobileAuthenticatedMenu({
  logout,
  setIsMobileMenuOpen,
  t,
  setShowDeleteAccount,
  setShowUserProfile
}: {
  readonly logout: () => void;
  readonly setIsMobileMenuOpen: (open: boolean) => void;
  readonly t: any;
  readonly setShowDeleteAccount: (show: boolean) => void;
  readonly setShowUserProfile: (show: boolean) => void;
}) {
  return (
    <>
      <button
        onClick={() => {
          setShowUserProfile(true);
          setIsMobileMenuOpen(false);
        }}
        className="w-full px-6 py-3 text-slate-700 hover:bg-slate-50 hover:text-gmh-blue font-medium transition-colors text-left flex items-center gap-2"
      >
        <User className="w-4 h-4" />
        Mi Perfil
      </button>
      <button
        onClick={() => {
          logout();
          setIsMobileMenuOpen(false);
        }}
        className="w-full px-6 py-3 text-slate-700 hover:bg-slate-50 hover:text-red-600 font-medium transition-colors text-left flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        {t('cerrar-sesion')}
      </button>
      <button
        onClick={() => {
          setShowDeleteAccount(true);
          setIsMobileMenuOpen(false);
        }}
        className="w-full px-6 py-3 text-red-700 hover:bg-red-50 font-medium transition-colors text-left flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Eliminar cuenta
      </button>
    </>
  );
}

function MobileUnauthenticatedMenu({
  setIsLoginOpen,
  setIsRegisterOpen,
  setIsMobileMenuOpen,
  t
}: {
  readonly setIsLoginOpen: (open: boolean) => void;
  readonly setIsRegisterOpen: (open: boolean) => void;
  readonly setIsMobileMenuOpen: (open: boolean) => void;
  readonly t: any;
}) {
  return (
    <>
      <button
        onClick={() => {
          setIsLoginOpen(true);
          setIsMobileMenuOpen(false);
        }}
        className="w-full px-6 py-3 text-slate-700 hover:bg-slate-50 hover:text-gmh-blue font-medium transition-colors text-left flex items-center gap-2"
      >
        <User className="w-4 h-4" />
        {t('iniciar-sesion')}
      </button>
      <button
        onClick={() => {
          setIsRegisterOpen(true);
          setIsMobileMenuOpen(false);
        }}
        className="w-full px-6 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors text-left flex items-center gap-2"
      >
        <User className="w-4 h-4" />
        {t('registrarse')}
      </button>
    </>
  );
}

function MobileMenu({
  isMobileMenuOpen,
  navItems,
  isAuthenticated,
  logout,
  setIsMobileMenuOpen,
  setIsLoginOpen,
  setIsRegisterOpen,
  t,
  setShowDeleteAccount,
  setShowUserProfile,
  setActiveSection,
  scrollToSection,
  onProductSearchChange
}: {
  readonly isMobileMenuOpen: boolean;
  readonly navItems: { label: string; key: string }[];
  readonly isAuthenticated: boolean;
  readonly logout: () => void;
  readonly setIsMobileMenuOpen: (open: boolean) => void;
  readonly setIsLoginOpen: (open: boolean) => void;
  readonly setIsRegisterOpen: (open: boolean) => void;
  readonly t: any;
  readonly setShowDeleteAccount: (show: boolean) => void;
  readonly setShowUserProfile: (show: boolean) => void;
  readonly setActiveSection: (section: string) => void;
  readonly scrollToSection: (sectionId: string) => void;
  readonly onProductSearchChange: (value: string) => void;
}) {
  const [mobileSearchValue, setMobileSearchValue] = useState('');

  const handleMobileSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedQuery = mobileSearchValue.trim();
    onProductSearchChange(normalizedQuery);
    scrollToSection('products');
    setIsMobileMenuOpen(false);
  };

  if (!isMobileMenuOpen) return null;

  return (
    <div className="lg:hidden bg-white border-t shadow-lg">
      <nav className="flex flex-col py-4">
        <form onSubmit={handleMobileSearchSubmit} className="px-6 pb-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={mobileSearchValue}
              onChange={(e) => setMobileSearchValue(e.target.value)}
              placeholder="Buscar productos..."
              className="flex-1 h-10 px-3 rounded-md border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" variant="outline" size="sm" className="h-10 px-3">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </form>

        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              scrollToSection(item.key);
              setIsMobileMenuOpen(false);
            }}
            className="px-6 py-3 text-slate-700 hover:bg-slate-50 hover:text-gmh-blue font-medium transition-colors text-left"
          >
            {item.label}
          </button>
        ))}
        <div className="border-t border-slate-200 mt-2 pt-2">
          {isAuthenticated ? (
            <MobileAuthenticatedMenu
              logout={logout}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              t={t}
              setShowDeleteAccount={setShowDeleteAccount}
              setShowUserProfile={setShowUserProfile}
            />
          ) : (
            <MobileUnauthenticatedMenu
              setIsLoginOpen={setIsLoginOpen}
              setIsRegisterOpen={setIsRegisterOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              t={t}
            />
          )}
        </div>
      </nav>
    </div>
  );
}

function AdminPanelModal({ showAdminPanel, user, setShowAdminPanel, t }: { readonly showAdminPanel: boolean; readonly user: any; readonly setShowAdminPanel: (show: boolean) => void; readonly t: any }) {
  if (!showAdminPanel || user?.role !== 'admin') return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">{t('panel-administracion')}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAdminPanel(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <AdminPanel />
        </div>
      </div>
    </div>
  );
}

interface HeaderProps {
  setActiveSection: (section: string) => void;
  activeSection: string;
  readonly scrollToSection: (sectionId: string) => void;
  readonly onProductSearchChange: (value: string) => void;
}

export default function Header({ setActiveSection, activeSection, scrollToSection, onProductSearchChange }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [isOverDarkSection, setIsOverDarkSection] = useState(activeSection === 'hero' || activeSection === 'about'); // Estado inicial correcto
  const { isAuthenticated, logout, user } = useAuth();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  // Detectar si estamos sobre una sección oscura - SIMPLIFICADO
  const detectBackgroundType = useCallback(() => {
    // Secciones con fondo oscuro
    const darkSections = ['hero', 'about'];

    // Si activeSection está en darkSections, es oscuro
    return darkSections.includes(activeSection);
  }, [activeSection]);

  const navItems = [
    { label: t('inicio'), key: 'hero' },
    { label: t('footer-servicios'), key: 'services' },
    { label: t('soluciones'), key: 'solutions' },
    { label: t('productos'), key: 'products' },
    { label: t('Nosotros'), key: 'about' },
    { label: t('contacto'), key: 'contact' },
    
  ];

  // Reset admin panel state when user changes or logs out
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      setShowAdminPanel(false);
    }
  }, [isAuthenticated, user?.role]);

  // Manejar scroll - SIMPLIFICADO
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detectar fondo basado en activeSection - SIMPLIFICADO
  useEffect(() => {
    const isDark = detectBackgroundType();
    setIsOverDarkSection(isDark);
    console.log('Active section changed:', activeSection, 'isDark:', isDark);
  }, [activeSection, detectBackgroundType]);

  // CLASES CSS CORREGIDAS - Versión simplificada y funcional
  const getHeaderClasses = () => {
    const baseClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ";
    
    // SIEMPRE usar fondo oscuro si estamos sobre sección oscura, independiente del scroll
    if (isOverDarkSection) {
      return baseClasses + "bg-slate-900/85 backdrop-blur-md shadow-lg h-20 lg:h-20";
    } else {
      return baseClasses + "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/50 h-20 lg:h-20";
    }
  };

  const isOverlayOpen = isLoginOpen || isRegisterOpen || isCartOpen || showAdminPanel || showUserProfile || showDeleteAccount;
  const headerClassName = getHeaderClasses() + (isOverlayOpen ? '' : '');

 // Debug para verificar estado
console.log('Header state - activeSection:', activeSection, 'isScrolled:', isScrolled, 'isOverDarkSection:', isOverDarkSection);

return (
  <header className={headerClassName}>
    <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
      
      <div className="flex items-center justify-between h-16 lg:h-20">

        {/* Logo */}
        <Logo activeSection={activeSection} />

        {/* Navbar centrado */}
        <div className="flex-1 flex justify-center">
          <DesktopNav
            navItems={navItems}
            setActiveSection={setActiveSection}
            hasDarkBackground={isOverDarkSection}
            isScrolled={isScrolled}
            scrollToSection={scrollToSection}
          />
        </div>

        {/* Acciones derecha */}
        <div className="flex-shrink-0">
          <RightActions
            hasDarkBackground={isOverDarkSection}
            isScrolled={isScrolled}
            i18n={i18n}
            t={t}
            cartCount={cartCount}
            setIsCartOpen={setIsCartOpen}
            isAuthenticated={isAuthenticated}
            setIsLoginOpen={setIsLoginOpen}
            setIsRegisterOpen={setIsRegisterOpen}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            setShowUserProfile={setShowUserProfile}
            onProductSearchChange={onProductSearchChange}
            scrollToSection={scrollToSection}
          />
        </div>

      </div>

    </div>

    <MobileMenu
      isMobileMenuOpen={isMobileMenuOpen}
      navItems={navItems}
      isAuthenticated={isAuthenticated}
      logout={logout}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      setIsLoginOpen={setIsLoginOpen}
      setIsRegisterOpen={setIsRegisterOpen}
      t={t}
      setShowDeleteAccount={setShowDeleteAccount}
      setShowUserProfile={setShowUserProfile}
      setActiveSection={setActiveSection}
      scrollToSection={scrollToSection}
      onProductSearchChange={onProductSearchChange}
    />

    <LoginModal 
      isOpen={isLoginOpen} 
      onClose={() => setIsLoginOpen(false)}
      onSwitchToRegister={() => {
        setIsLoginOpen(false);
        setIsRegisterOpen(true);
      }}
    />

        <RegisterModal 
      isOpen={isRegisterOpen} 
      onClose={() => setIsRegisterOpen(false)}
      onSwitchToLogin={() => {
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
      }}
    />
    
    
    <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

    <AdminPanelModal showAdminPanel={showAdminPanel} user={user} setShowAdminPanel={setShowAdminPanel} t={t} />

    <UserProfileModal
      isOpen={showUserProfile}
      onClose={() => setShowUserProfile(false)}
      user={user}
      onLogout={() => {
        logout();
        setShowUserProfile(false);
      }}
      onDeleteAccount={() => setShowDeleteAccount(true)}
    />

    <DeleteAccountModal 
      isOpen={showDeleteAccount} 
      onClose={() => setShowDeleteAccount(false)}
      userEmail={user?.email || ''}
    />
  </header>
);
}