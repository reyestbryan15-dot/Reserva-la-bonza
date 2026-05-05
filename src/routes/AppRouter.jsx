import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// Páginas existentes
import HeroSection from '../components/HeroSection';
import GridAlojamientos from '../components/GridAlojamientos';
import PropertyDetail from '../components/PropertyDetail';
import ReservationPage from '../components/ReservationPage';
import ConfirmationPage from '../components/ConfirmationPage';
import AboutPage from '../components/AboutPage';
import Ventas from "../components/Ventas";
import CancelarReserva from "../components/CancelarReserva";
import Contacto from '../components/Contacto';
import ResetPassword from '../components/ResetPassword';

// NUEVOS COMPONENTES (Asegúrate de crearlos con los códigos que te pasé)
import ToursPage from '../components/ToursPage';
import ServiciosHelp from '../components/ServiciosHelp';

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
              {/* Sugerencia: Puedes poner aquí el componente de ServiciosHelp 
                  para que la gente lo vea apenas entre, o dejarlo solo en su ruta */}
              <GridAlojamientos limit={3} />
            </>
          } />

          <Route path="/propiedades" element={<GridAlojamientos />} />
          <Route path="/propiedad/:id" element={<PropertyDetail />} />
          <Route path="/reservar" element={<ReservationPage />} />
          <Route path="/confirmacion" element={<ConfirmationPage />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/servicios" element={<ServiciosHelp />} />

          {/* Ruta de cancelación corregida */}
          <Route path="/cancelar" element={<CancelarReserva />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default AppRouter;