import React, { useState, useEffect } from 'react';
import { supabase } from '../backend/supabaseClient';

// Componentes de Interfaz
import ElegantLoader from './components/ElegantLoader';
import AdminPanel from '../src/components/admin/AdminPanel'; // Ajusta la ruta si es necesaria
import HostLayout from '../src/components/admin/host/HostLayout'; // Ajusta la ruta si es necesaria
import AppRouter from '../src/routes/AppRouter';      // Ajusta la ruta si es necesaria

// Contexto y Analíticas
import { LanguageProvider } from './context/LanguageContext';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función para cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setIsAdmin(false);
    window.location.reload();
  };

  // Función para actualizar el estado tras el login
  const actualizarEstado = () => {
    window.location.reload();
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        // 1. Obtener sesión inicial
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);

          // 2. Lógica para identificar si es ADMIN
          // Si tu correo es el del administrador:
          if (currentSession.user.email === 'labonanzar@gmail.com') {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error en la autenticación:", error);
      } finally {
        // 3. Finalizar la carga con un pequeño delay para suavidad visual
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    checkSession();

    // Escuchar cambios en tiempo real (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user?.email === 'labonanzar@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // --- RENDERIZADO ---

  // Si está cargando, mostramos la barra azul profesional
  if (loading) {
    return <ElegantLoader />;
  }

  return (
    <LanguageProvider>
      {session && isAdmin ? (
        // Vista para el Administrador (Tú)
        <AdminPanel session={session} onLogout={handleLogout} />
      ) : session && !isAdmin ? (
        // Vista para los Hoteles/Anfitriones
        <HostLayout session={session} onLogout={handleLogout} />
      ) : (
        // Vista para Clientes / Login
        <AppRouter
          user={user}
          onLogout={handleLogout}
          onLogin={actualizarEstado}
        />
      )}

      {/* Analíticas de Vercel */}
      <Analytics />
    </LanguageProvider>
  );
}

export default App;