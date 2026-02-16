/* ========================================================================
 * SECCIÓN 1: IMPORTACIONES
 * ======================================================================== */
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';

/* ========================================================================
 * SECCIÓN 2: CONFIGURACIÓN
 * ======================================================================== */
const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', label: '中文', flag: '🇨🇳' }
];

/* ========================================================================
 * SECCIÓN 3: COMPONENTE PRINCIPAL
 * ======================================================================== */
const LanguageSelector = () => {
  // 3.1 Hooks
  const { language, switchLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // 3.2 Lógica
  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const handleSelect = (code) => {
    switchLanguage(code);
    setIsOpen(false);
  };

  // Traducción rápida para el encabezado del selector
  const getHeaderLabel = () => {
    const labels = {
      es: "Selecciona idioma",
      en: "Select language",
      fr: "Choisir la langue",
      de: "Sprache wählen",
      zh: "选择语言"
    };
    return labels[language] || labels.es;
  };

/* ========================================================================
 * SECCIÓN 4: RENDERIZADO (JSX)
 * ======================================================================== */
  return (
    <div className="relative z-50">
      
      {/* 4.1 Botón Activador */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-full 
          transition-all duration-200 border
          ${isOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-transparent border-transparent hover:bg-gray-100 text-gray-700'}
        `}
        title="Cambiar idioma / Change language"
      >
        <Globe size={18} />
        <span className="hidden md:inline text-lg leading-none">{currentLang.flag}</span>
        <span className="text-sm font-semibold uppercase tracking-wide">{language}</span>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* 4.2 Menú Desplegable */}
      {isOpen && (
        <>
          {/* Overlay invisible para cerrar al hacer clic fuera */}
          <div 
            className="fixed inset-0 z-10 cursor-default" 
            onClick={() => setIsOpen(false)}
          />

          {/* Lista de Idiomas */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
            <div className="px-4 py-2 border-b border-gray-50 mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {getHeaderLabel()}
              </span>
            </div>
            
            {LANGUAGES.map((lang) => {
              const isActive = language === lang.code;
              
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between group transition-colors hover:bg-gray-50`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl shadow-sm rounded-sm overflow-hidden">{lang.flag}</span>
                    <span className={`font-medium ${isActive ? 'text-indigo-600' : 'text-gray-700 group-hover:text-gray-900'}`}>
                      {lang.label}
                    </span>
                  </div>
                  
                  {isActive && <Check size={16} className="text-indigo-600" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;