import React, { useState } from 'react';
import { LayoutDashboard, BedDouble, CalendarDays, LogOut, Bell, User as UserIcon } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

// Importación de Componentes
import HostDashboard from './HostDashboard';
import MyRooms from './MyRooms';
import CreateRoomForm from './CreateRoomForm';

import logo from '../../../assets/logo-bonanza.jpeg';

const HostLayout = ({ session, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t } = useLanguage();
  const user = session?.user;

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
        return (
          <CreateRoomForm
            onCancel={() => setActiveTab('dashboard')}
            onSave={() => {
              alert(t('hostLayout.alert_save'));
              setActiveTab('rooms');
            }}
          />
        );
      case 'rooms':
        return <MyRooms onAddNew={() => setActiveTab('create-room')} />;
      case 'reservations':
        return (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-[#f8f7f2] rounded-full flex items-center justify-center text-slate-300 mb-6">
              <CalendarDays size={40} />
            </div>
            <p className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">{t('hostLayout.res_panel_title')}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{t('hostLayout.res_panel_soon')}</p>
          </div>
        );
      default:
        return <HostDashboard user={user} onChangeTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f2] font-sans text-slate-900">

      {/* 1. NAVEGACIÓN SUPERIOR (GLASSMORPHISM) */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 h-24 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

          {/* Logo y Nombre de Marca */}
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative">
              <img
                src={logo}
                alt="Logo"
                className="h-12 w-12 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">
                Bonanza <span className="text-slate-400 font-light">Admin</span>
              </span>
            </div>
          </div>

          {/* Acciones de Usuario */}
          <div className="flex items-center gap-4 md:gap-8">
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-px bg-slate-100 hidden md:block"></div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">
                  {t('hostLayout.host_panel')}
                </p>
                <p className="text-sm font-bold text-slate-900 tracking-tight">
                  {user?.email?.split('@')[0]}
                </p>
              </div>
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-xl shadow-slate-200 overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="User" />
                ) : (
                  <UserIcon size={18} />
                )}
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2.5 bg-slate-50 text-slate-400 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm"
              title={t('hostLayout.logout_tooltip')}
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. SUB-NAVEGACIÓN (TABS) */}
      <nav className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-10 h-16 items-center overflow-x-auto no-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2.5 h-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${isActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  <Icon size={16} className={isActive ? 'text-slate-900' : 'text-slate-300'} />
                  {item.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 rounded-t-full animate-in slide-in-from-bottom-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 3. CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto py-12 px-6">
        {renderContent()}
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default HostLayout;