import React from 'react';
import { Plus, TrendingUp, Building, Users } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext'; // IMPORTADO

const HostDashboard = ({ user, onChangeTab }) => {
  const { t } = useLanguage(); // HOOK DE IDIOMA

  return (
    <div className="px-4 py-4 sm:px-0">

      {/* Encabezado de Bienvenida */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('dashboard.welcome_user').replace('{name}', user?.email?.split('@')[0])} 👋
          </h1>
          <p className="text-gray-500 mt-1">{t('dashboard.summary_today')}</p>
        </div>
        <button
          onClick={() => onChangeTab('create-room')}
          className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          {t('dashboard.btn_new_property')}
        </button>
      </div>

      {/* Tarjetas de Estadísticas (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Ganancias */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={48} className="text-green-600" /></div>
          <p className="text-sm font-medium text-gray-500">{t('dashboard.monthly_earnings')}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">$0.00</h3>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 mt-4">
            +0% {t('dashboard.vs_last_month')}
          </span>
        </div>

        {/* Card 2: Reservas Activas */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Users size={48} className="text-blue-600" /></div>
          <p className="text-sm font-medium text-gray-500">{t('dashboard.active_bookings')}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">0</h3>
          <p className="text-xs text-gray-400 mt-4">{t('dashboard.no_pending')}</p>
        </div>

        {/* Card 3: Mis Hoteles */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group cursor-pointer hover:border-blue-200 transition" onClick={() => onChangeTab('properties')}>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition"><Building size={48} className="text-purple-600" /></div>
          <p className="text-sm font-medium text-gray-500">{t('dashboard.my_hotels')}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">0</h3>
          <p className="text-xs text-blue-600 mt-4 font-medium flex items-center gap-1">{t('dashboard.register_property')} +</p>
        </div>
      </div>

      {/* Sección "Empty State" (Cuando no hay hoteles) */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.empty_title')}</h3>
        <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-8">
          {t('dashboard.empty_desc')}
        </p>
        <button
          onClick={() => onChangeTab('create-room')}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          {t('dashboard.btn_new_property')}
        </button>
      </div>

    </div>
  );
};

export default HostDashboard;