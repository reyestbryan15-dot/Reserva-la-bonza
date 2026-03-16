import React, { useState } from 'react';
import { Briefcase, Building } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import Toast from '../ui/Toast';
import { useLanguage } from '../../context/LanguageContext'; // IMPORTANTE
import fondoLogin from "../../assets/hero_hg.jpg";

const LoginPage = ({ onLogin }) => {
  const { t } = useLanguage(); // Hook de traducción
  const [activeTab, setActiveTab] = useState('login');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const handleLoginSuccess = (session) => {
    const userToPass = session?.user || session;
    if (userToPass) {
      onLogin({ user: userToPass });
    }
    showToast(t('loginPage.toast_welcome'), 'success');
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 relative"
      style={{ backgroundImage: `url(${fondoLogin})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-2xl flex overflow-hidden shadow-2xl min-h-[550px]">

        {/* Panel Izquierdo (Decorativo / Desktop) */}
        <div className="hidden md:flex w-1/2 bg-blue-600 text-white flex-col justify-between p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">{t('loginPage.welcome_back')}</h2>
            <p className="text-blue-100">{t('loginPage.subtitle')}</p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full"><Briefcase size={20} /></div>
              <span className="text-sm">{t('loginPage.label_travelers')}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full"><Building size={20} /></div>
              <span className="text-sm">{t('loginPage.label_hotels')}</span>
            </div>
          </div>

          <div className="relative z-10 text-xs opacity-70 mt-auto">
            © {new Date().getFullYear()} La Bonanza
          </div>
        </div>

        {/* Panel Derecho (Formularios) */}
        <div className="w-full md:w-1/2 bg-white flex flex-col">
          {/* Tabs de Navegación */}
          <div className="flex w-full border-b border-gray-100">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
            >
              {t('loginPage.tab_login')}
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
            >
              {t('loginPage.tab_register')}
            </button>
          </div>

          {/* Contenido Dinámico */}
          <div className="flex-1 overflow-y-auto p-8 relative">
            {activeTab === 'login' ? (
              <LoginForm
                onLoginSuccess={handleLoginSuccess}
                onForgotPassword={() => setIsForgotModalOpen(true)}
                showToast={showToast}
              />
            ) : (
              <RegisterForm
                onRegisterSuccess={() => {
                  showToast(t('loginPage.toast_reg_success'), 'success');
                  setActiveTab('login'); // Saltamos al login tras registrarse
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Componentes Globales de UI */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        showToast={showToast}
      />

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default LoginPage;