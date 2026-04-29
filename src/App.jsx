import React, { useState, useEffect } from 'react';
// 1. IMPORTA EL COMPONENTE (Asegúrate de haber corrido: npm i @vercel/analytics)
import { Analytics } from '@vercel/analytics/react';

// Context
import { LanguageProvider } from './context/LanguageContext';
// ... rest of your imports ...

// (El resto de tu código de lógica se mantiene igual)
function App() {
  // ... (toda tu lógica de user, session, isAdmin, etc)

  if (loading) return <ElegantLoader />;

  return (
    <LanguageProvider>
      {session && isAdmin ? (
        <AdminPanel session={session} onLogout={handleLogout} />
      ) : session && !isAdmin ? (
        <HostLayout session={session} onLogout={handleLogout} />
      ) : (
        <AppRouter
          user={user}
          onLogout={handleLogout}
          onLogin={actualizarEstado}
        />
      )}

      {/* 2. AÑADE ESTA LÍNEA AQUÍ AL FINAL */}
      <Analytics />

    </LanguageProvider>
  );
}

export default App;