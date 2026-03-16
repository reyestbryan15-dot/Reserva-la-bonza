import React from 'react';
import { LayoutDashboard, BedDouble, CalendarDays, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HostNavbar = ({ user, activeTab, setActiveTab, onLogout }) => {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', label: t('hostLayout.menu_summary'), icon: LayoutDashboard },
    { id: 'rooms', label: t('hostLayout.menu_rooms'), icon: BedDouble },
    { id: 'reservations', label: t('hostLayout.menu_reservations'), icon: CalendarDays },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">

          {/* LADO IZQUIERDO: Marca */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg">
              <span className="font-bold text-xl">RT</span> {/* Cambiado a RT por Reservas Turismo */}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 text-lg leading-tight">
                {t('hostLayout.host_panel')}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {user?.email?.split('@')[0]}
              </span>
            </div>
          </div>

          {/* CENTRO: Menú de Navegación (Desktop) */}
          <div className="hidden md:flex items-center space-x-4 bg-gray-50 px-4 py-2 rounded-full my-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                      ? "bg-white text-blue-600 shadow-sm hover:text-blue-700"
                      : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* LADO DERECHO: Estado y Salir */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block text-right">
              <p className="text-sm font-medium text-gray-900">{t('hostLayout.status_active')}</p>
              <div className="flex items-center justify-end gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-xs text-green-600">{t('hostLayout.online')}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-xl transition-all border border-red-100"
            >
              <LogOut size={18} />
              <span className="font-medium">{t('hostLayout.logout_btn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil (Bottom Bar) */}
      <div className="md:hidden flex justify-around border-t bg-white py-3 fixed bottom-0 left-0 right-0 z-50 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <item.icon size={24} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
        <button onClick={onLogout} className="flex flex-col items-center p-2 rounded-lg text-red-400">
          <LogOut size={24} />
          <span className="text-[10px] mt-1 font-medium">{t('hostLayout.logout_btn')}</span>
        </button>
      </div>
    </nav>
  );
};

export default HostNavbar;