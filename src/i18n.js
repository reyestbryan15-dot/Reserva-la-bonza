import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importamos tus archivos JSON que pusimos al 100%
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';
import frTranslation from './locales/fr.json';
import deTranslation from './locales/de.json';
import zhTranslation from './locales/zh.json';

const resources = {
    en: { translation: enTranslation },
    es: { translation: esTranslation },
    fr: { translation: frTranslation },
    de: { translation: deTranslation },
    zh: { translation: zhTranslation }
};

i18n
    .use(LanguageDetector) // Detecta el idioma del navegador automáticamente
    .use(initReactI18next) // Conecta con React
    .init({
        resources,
        fallbackLng: 'en', // Si no encuentra un idioma, usa inglés
        interpolation: {
            escapeValue: false // React ya protege contra XSS
        }
    });

export default i18n;