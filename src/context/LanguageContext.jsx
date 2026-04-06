import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n'; // <--- IMPORTANTE: Esto carga tu configuración de los archivos JSON

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { t, i18n } = useTranslation();

  // Función para cambiar el idioma (usa la lógica oficial de i18next)
  const switchLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
  };

  // El valor de 'language' ahora viene del estado global de i18n
  const language = i18n.language;

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe ser usado dentro de un LanguageProvider');
  }
  return context;
};