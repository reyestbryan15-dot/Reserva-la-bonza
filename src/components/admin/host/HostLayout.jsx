import React, { useState } from 'react';
import { LayoutDashboard, BedDouble, CalendarDays, LogOut } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext'; // IMPORTADO

// Importación de Componentes
import HostDashboard from './HostDashboard';
import MyRooms from './MyRooms';
import CreateRoomForm from './CreateRoomForm';

import logo from '../../../assets/logo-bonanza.jpeg';

const HostLayout = ({ session, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t } = useLanguage(); // HOOK DE IDIOMA
  const user = session?.user;

  // Lista de pestañas traducidas
  const menuItems = [
    { id: 'dashboard', label: t('hostLayout.menu_summary'), icon: LayoutDashboard },
    { id: 'rooms', label: t('hostLayout.menu_rooms'), icon: BedDouble },
    { id: 'reservations', label: t('hostLayout.menu_reservations'), icon: CalendarDays },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <HostDashboard user={user} onChangeTab={setActiveTab} />;

      case 'create-room':
        return <CreateRoomForm
          onCancel={() => setActiveTab('dashboard')}
          onSave={() => {
            alert(t('hostLayout.alert_save'));
            setActiveTab('rooms');
          }}
        />;

      case 'rooms':
        return <MyRooms />;

      case 'reservations':
        return (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <CalendarDays size={48} className="text-gray-300 mb-4" />
            <p className="text-xl font-medium text-gray-500">{t('hostLayout.res_panel_title')}</p>
            <p className="text-sm text-gray-400">{t('hostLayout.res_panel_soon')}</p>
          </div>
        );

      default:
        return <HostDashboard user={user} onChangeTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* 1. ENCABEZADO PRINCIPAL */}
      <header className="bg-white border-b border-gray-200 h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Reservas Turismo"
              className="h-14 w-auto object-contain"
            />
            <span className="text-2xl font-bold text-gray-900 tracking-tight hidden sm:block">
              Reservas <span className="text-blue-600">Turismo</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.email}
              </p>
              <p className="text-xs text-gray-500">{t('hostLayout.host_panel')}</p>
            </div>

            <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
              title={t('hostLayout.logout_tooltip')}
            >
              <span className="font-medium text-sm hidden sm:block">{t('hostLayout.logout_btn')}</span>
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. BARRA DE NAVEGACIÓN (Tabs) */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-14 items-center overflow-x-auto no-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`inline-flex items-center gap-2 px-1 h-full border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default HostLayout;