import './i18n';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// --- IMPORTACIONES CLAVE ---
// 1. Importar BrowserRouter (Esto es lo que faltaba)
import { BrowserRouter } from 'react-router-dom';

// 2. Importar el proveedor de idioma (Si lo usas en tu proyecto)
import { LanguageProvider } from './context/LanguageContext';

// 3. Importar nuestro nuevo Escudo de Error
import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* El ErrorBoundary envuelve TODO para proteger la app completa */}
    <ErrorBoundary>
      <BrowserRouter>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);