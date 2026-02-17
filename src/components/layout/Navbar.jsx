/* ========================================================================
 * SECCIÓN 1: IMPORTACIONES
 * ======================================================================== */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, Globe, Star } from 'lucide-react';
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
  { path: '/sobre-nosotros', key: 'navbar.about' }
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
    return location.pathname.startsWith(path);
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
 * SECCIÓN 4: RENDERIZADO (JSX)
 * ======================================================================== */
  return (
    <>
      {/* --- 4.1 NAVBAR FIJO --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* A. LOGO DE LA MARCA */}
            <Link 
              to="/" 
              className="flex-shrink-0 flex items-center gap-2 cursor-pointer group overflow-hidden" 
              onClick={() => { window.scrollTo(0,0); closeMobileMenu(); }}
            >
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={logo} 
                    alt="RB Logo" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display='none'; 
                      e.target.parentElement.innerHTML='<span class="font-bold text-sm">RB</span>';
                    }} 
                  />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight drop-shadow-md hidden sm:block">
                Reserva La Bonanza
              </span>
              <span className="text-xl font-bold text-gray-900 tracking-tight drop-shadow-md sm:hidden">
                Reserva la Bonanza
              </span>
            </Link>

            {/* B. MENÚ DE ESCRITORIO */}
            <div className="hidden md:flex space-x-4 items-center">
              
              {/* Selector de Idioma (Soporta automáticamente DE y ZH si están en el Context) */}
              <div className="mr-2">
                <LanguageSelector />
              </div>
              
              {/* Enlaces de Navegación */}
              {NAV_ITEMS.map((item) => {
                const active = isActiveLink(item.path);
                
                if (item.special) {
                    return (
                        <Link 
                          key={item.path}
                          to={item.path} 
                          className={`flex items-center gap-1 px-4 py-2 rounded-full font-bold transition-all duration-300 border ${
                            active 
                              ? 'bg-amber-100 text-amber-700 border-amber-300 shadow-sm' 
                              : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50 hover:shadow-md'
                          }`}
                        >
                          <Star size={16} className={active ? "fill-amber-700" : "fill-amber-600"} />
                          {t(item.key)}
                        </Link>
                    );
                }

                return (
                    <Link 
                    key={item.path}
                    to={item.path} 
                    className={`text-base font-bold transition-colors duration-200 px-3 py-2 rounded-md ${
                        active 
                        ? 'text-indigo-600 bg-indigo-50' 
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                    >
                    {t(item.key)}
                    </Link>
                );
              })}
              
              <div className="h-6 w-px bg-gray-200 mx-2"></div>

              {/* Área de Usuario */}
              {user ? (
                <div className="flex items-center gap-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                    <User size={16} className="text-indigo-600" />
                    <span className="max-w-[100px] truncate">{user.name}</span>
                  </div>
                  <button 
                    onClick={onLogout} 
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" 
                    title={t('navbar.logout')}
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link to="/login">
                  <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0">
                    {t('navbar.login')}
                  </button>
                </Link>
              )}
            </div>

            {/* C. BOTÓN HAMBURGUESA (Mobile) */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-indigo-600 focus:outline-none p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
              </button>
            </div>
          </div>
        </div>

        {/* --- 4.2 MENÚ DESPLEGABLE MÓVIL --- */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl max-h-[calc(100vh-80px)] overflow-y-auto absolute w-full animate-in slide-in-from-top-5 duration-200">
            <div className="px-4 py-4 space-y-2 flex flex-col">
              
              {/* Selector de Idioma en móvil */}
              <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl mb-4">
                 <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <Globe size={18} />
                    <span>{getLanguageLabel()}</span>
                 </div>
                 <LanguageSelector />
              </div>
              
              {/* Enlaces de Navegación - Móvil */}
              {NAV_ITEMS.map((item) => {
                 if (item.special) {
                    return (
                        <Link 
                            key={item.path}
                            to={item.path} 
                            onClick={closeMobileMenu} 
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-bold bg-amber-50 text-amber-700 border border-amber-200 mb-2"
                        >
                            <Star size={20} className="fill-amber-700" />
                            {t(item.key)}
                        </Link>
                    )
                 }

                 return (
                    <Link 
                        key={item.path}
                        to={item.path} 
                        onClick={closeMobileMenu} 
                        className={`block px-4 py-3 rounded-xl text-lg font-bold transition-colors ${
                        isActiveLink(item.path)
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-800 hover:text-indigo-600 hover:bg-gray-50'
                        }`}
                    >
                        {t(item.key)}
                    </Link>
                 )
              })}

              <div className="border-t border-gray-100 my-4 pt-4">
                {user ? (
                  <div className="space-y-4">
                      <div className="px-4 flex items-center gap-3 text-gray-800">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                             <User size={20} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">
                              {language === 'zh' ? '欢迎' : (language === 'de' ? 'Willkommen' : 'Bienvenido')}
                            </p>
                            <p className="font-bold">{user.name}</p>
                          </div>
                      </div>
                      <button 
                        onClick={() => { onLogout(); closeMobileMenu(); }} 
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 font-bold bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                      >
                        <LogOut size={18} />
                        {t('navbar.logout')}
                      </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={closeMobileMenu} 
                    className="block px-4 py-3 bg-indigo-600 text-white text-center rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-md"
                  >
                    {t('navbar.login')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="h-20 w-full bg-white"></div>
    </>
  );
};

export default Navbar;