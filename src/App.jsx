import React, { useState, useEffect } from 'react';

// Context
import { LanguageProvider } from './context/LanguageContext';

// Router
import AppRouter from './routes/AppRouter';

// Componentes Privados
// ---------------------------------------------------------
// OJO: Aquí estaba el error. Antes importabas 'Dashboard', 
// ahora importamos 'HostLayout' que es el que tiene el menú.
import HostLayout from './components/admin/host/HostLayout';
// ---------------------------------------------------------

import AdminPanel from './components/admin/AdminPanel';
import ElegantLoader from './components/ui/ElegantLoader';

// Backend
import { supabase } from '../backend/supabaseClient';

const SOCIOS_EMAILS = [
  'toncelbryan17@gmail.com',
  'luboguarnizojoserafa@gmail.com',
  'labonanzar@gmail.com'
];

function App() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const actualizarEstado = (newSession) => {
    if (!newSession?.user?.email) {
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      return;
    }
    setSession(newSession);
    setUser(newSession.user);

    const emailUsuario = newSession.user.email.toLowerCase().trim();
    const esSocio = SOCIOS_EMAILS.includes(emailUsuario);
    setIsAdmin(esSocio);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setIsAdmin(false);
    window.location.href = '/';
  };

  useEffect(() => {
    const obtenerSesion = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.log("Error sesión:", error);
      actualizarEstado(session);
      setLoading(false);
    };

    obtenerSesion();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      actualizarEstado(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <ElegantLoader />;

  return (
    <LanguageProvider>
      {session && isAdmin ? (
        <AdminPanel session={session} onLogout={handleLogout} />
      ) : session && !isAdmin ? (
        // -----------------------------------------------------
        // AQUÍ ESTÁ EL CAMBIO VISUAL:
        // Usamos HostLayout para ver el menú y las pestañas
        <HostLayout session={session} onLogout={handleLogout} />
        // -----------------------------------------------------
      ) : (
        <AppRouter
          user={user}
          onLogout={handleLogout}
          onLogin={actualizarEstado}
        />
      )}
    </LanguageProvider>
  );
}

export default App;