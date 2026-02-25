import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// Páginas (Asumiendo que estas siguen en la raíz de components o muévelas a pages si quieres)
import HeroSection from '../components/HeroSection';
import GridAlojamientos from '../components/GridAlojamientos';
import PropertyDetail from '../components/PropertyDetail';
import ReservationPage from '../components/ReservationPage';
import ConfirmationPage from '../components/ConfirmationPage';
import AboutPage from '../components/AboutPage';
import Ventas from "../components/Ventas";
import CancelarReserva from "../components/CancelarReserva";
import Contacto from '../components/Contacto';

// Auth
import LoginPage from '../components/auth/LoginPage';

const AppRouter = ({ user, onLogout, onLogin }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800">
      
      {/* Navbar con rutas actualizadas */}
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <GridAlojamientos limit={3} />
            </>
          } />
          
          <Route path="/cancelar" element={<div className="text-5xl font-black p-20">ENTRÓ A CANCELAR</div>} />
          <Route path="/propiedades" element={<GridAlojamientos />} />
          <Route path="/propiedad/:id" element={<PropertyDetail />} />
          <Route path="/reservar" element={<ReservationPage />} />
          <Route path="/confirmacion" element={<ConfirmationPage />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/contacto" element={<Contacto />} />

          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default AppRouter;