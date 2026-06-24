import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../LanguageSelector';
import logo from '../../assets/logo-bonanza.jpeg';

const NAV_ITEMS = [
  { path: '/', key: 'navbar.home' },
  { path: '/propiedades', key: 'navbar.properties' },
  { path: '/ventas', key: 'navbar.sales' },
  { path: '/tours', key: 'navbar.tours' },
  { path: '/servicios', key: 'navbar.services' },
  { path: '/sobre-nosotros', key: 'navbar.about' },
  { path: '/contacto', key: 'navbar.contact' }
];

const Navbar = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* A. LOGO Y NOMBRE (Compacto) */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 mr-4" onClick={() => window.scrollTo(0, 0)}>
              <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                <img src={logo} alt="RB Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-[13px] lg:text-[14px] font-black text-gray-900 uppercase tracking-tighter sm:tracking-tight">
                Reservas La Bonanza
              </span>
            </Link>

            {/* B. MENÚ DE ESCRITORIO (Espacios optimizados) */}
            <div className="hidden md:flex items-center">
              {/* Links con espacio mínimo */}
              <div className="flex items-center space-x-1 lg:space-x-2">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-[11px] lg:text-[12px] font-bold transition-colors whitespace-nowrap px-1 ${isActive(item.path) ? 'text-blue-600' : 'text-gray-600 hover:text-black'
                      }`}
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </div>

              {/* Selector de idioma pegado al último link con una línea fina */}
              <div className="flex items-center ml-1 border-l border-gray-200 pl-1 scale-90 lg:scale-100">
                <LanguageSelector />
              </div>

              {/* Botón de Ingresar con margen para respirar */}
              <div className="ml-3">
                {user ? (
                  <div className="flex items-center gap-3">
                    <Link to="/admin" className="text-gray-600 hover:text-black"><User size={18} /></Link>
                    <button onClick={onLogout} className="text-gray-500 hover:text-red-600">
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="bg-black text-white px-4 py-2 rounded-full text-[11px] font-bold hover:bg-gray-800 transition-all flex-shrink-0"
                  >
                    {t('navbar.login')}
                  </Link>
                )}
              </div>
            </div>

            {/* C. MÓVIL */}
            <div className="md:hidden flex items-center gap-1">
              <LanguageSelector />
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 p-2">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* MENÚ MÓVIL (Con scroll automático y sección de login agregada) */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b shadow-2xl z-50 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="flex flex-col p-6 space-y-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path} to={item.path} onClick={closeMobileMenu}
                  className={`text-lg font-bold p-2 rounded-lg ${isActive(item.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-800'}`}
                >
                  {t(item.key)}
                </Link>
              ))}

              {/* LÍNEA DIVISORIA Y SECCIÓN DE SESIÓN PARA MÓVILES */}
              <div className="border-t border-gray-100 pt-4 mt-2">
                {user ? (
                  <div className="flex items-center justify-between p-2">
                    <Link to="/admin" onClick={closeMobileMenu} className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                      <User size={22} />
                      <span>Mi Cuenta</span>
                    </Link>
                    <button
                      onClick={() => { onLogout(); closeMobileMenu(); }}
                      className="text-gray-500 hover:text-red-600 p-2"
                    >
                      <LogOut size={22} />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="w-full bg-black text-white py-3 rounded-full text-center text-base font-bold hover:bg-gray-800 transition-all block"
                  >
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