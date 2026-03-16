/* ========================================================================
 * SECCIÓN 1: IMPORTACIONES
 * ======================================================================== */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../LanguageSelector';

// Activos
import logo from '../../assets/logo-bonanza.jpeg';

/* ========================================================================
 * SECCIÓN 2: CONFIGURACIÓN
 * ======================================================================== */
const NAV_ITEMS = [
  { path: '/', key: 'navbar.home' },
  { path: '/propiedades', key: 'navbar.properties' },
  { path: '/ventas', key: 'navbar.sales', special: true }, 
  { path: '/sobre-nosotros', key: 'navbar.about' },
  { path: '/contacto', key: 'navbar.contact' }
];

/* ========================================================================
 * SECCIÓN 3: COMPONENTE PRINCIPAL
 * ======================================================================== */
const Navbar = ({ user, onLogout }) => {
  // 3.1 Hooks
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Extraemos 't' para traducciones y 'language' para saber el idioma actual
  const { t, language } = useLanguage(); 
  const location = useLocation();

  // 3.2 Lógica Auxiliar
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const isActiveLink = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
  };

  // Traducción manual para el label de idioma en móvil según el código actual
  const getLanguageLabel = () => {
    const labels = {
      es: "Idioma",
      en: "Language",
      fr: "Langue",
      de: "Sprache",
      zh: "语言"
    };
    return labels[language] || labels.es;
  };

/* ========================================================================
 * SECCIÓN 4: RENDERIZADO (JSX) CORREGIDO
 * ======================================================================== */
  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* A. LOGO */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg overflow-hidden">
                  <img src={logo} alt="RB Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Reservas La Bonanza</span>
            </Link>

{/* B. MENÚ DE ESCRITORIO */}
<div className="hidden md:flex items-center space-x-6">
  <LanguageSelector />
  
  {NAV_ITEMS.map((item) => (
    <Link 
      key={item.path}
      to={item.path} 
      className="text-sm font-bold text-gray-600 hover:text-black transition-colors"
    >
      {t(item.key)}
    </Link>
  ))}

  {/* Botón Iniciar Sesión centrado/destacado */}
  {user ? (
    <button onClick={onLogout} className="text-sm font-bold text-gray-500 hover:text-red-600">
      {t('navbar.logout')}
    </button>
  ) : (
    <Link 
      to="/login" 
      className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-all"
    >
      {t('navbar.login')}
    </Link>
  )}
</div>

            {/* C. BOTÓN HAMBURGUESA */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 p-2">
                {isMobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
              </button>
            </div>
          </div>
        </div>

{/* 4.2 MENÚ DESPLEGABLE MÓVIL */}
{isMobileMenuOpen && (
  <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b shadow-lg z-50">
    <div className="flex flex-col p-6 space-y-6">
      
      {/* Selector de Idioma Móvil */}
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
        <span className="font-bold text-gray-700">{t('common.language')}</span>
        <LanguageSelector />
      </div>

      {NAV_ITEMS.map((item) => (
        <Link 
          key={item.path}
          to={item.path} 
          onClick={closeMobileMenu}
          className="text-lg font-bold text-gray-800 text-center"
        >
          {t(item.key)}
        </Link>
      ))}

      {/* Botón Login */}
      <div className="pt-6 border-t border-gray-100 flex justify-center">
        {!user && (
          <Link to="/login" onClick={closeMobileMenu} className="w-full max-w-[200px] bg-black text-white py-3 rounded-full font-bold text-center">
            {t('navbar.login')}
          </Link>
        )}
      </div>
    </div>
  </div>
)}
      </nav>
      <div className="h-20 w-full"></div>
    </>
  );
};

export default Navbar;