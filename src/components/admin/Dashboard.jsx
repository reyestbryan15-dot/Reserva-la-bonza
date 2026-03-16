import React, { useEffect, useState } from 'react';
import { supabase } from '../../../backend/supabaseClient';
import { useLanguage } from '../context/LanguageContext';
import {
  LogOut, Building, MapPin, Calendar, DollarSign, User, Search, Loader2
} from 'lucide-react';

const Dashboard = ({ session }) => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error cargando perfil:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (session) getProfile();
  }, [session]);

  const handleLogout = async () => {
    console.log("Botón presionado"); // Si esto no sale en consola, el botón no se está pulsando

    // Limpieza inmediata
    localStorage.clear();
    sessionStorage.clear();

    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.log("Error ignorado en signOut");
    }

    // Redirección forzada al home
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  const userName = profile?.role === 'hotel'
    ? profile?.company_name
    : profile?.full_name?.split(' ')[0];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* --- 3.1 NAVBAR --- */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div>
          <h1 className="text-xl font-bold text-blue-600 italic">Reserva la Bonanza</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              {profile?.full_name || profile?.company_name}
            </p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {profile?.role === 'hotel' ? t('dashboard.role_hotel') : t('dashboard.role_traveler')}
            </p>
          </div>

          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border border-blue-200">
            <User size={20} />
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 transition-all rounded-full hover:bg-red-50"
            title={t('navbar.logout')}
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* --- 3.2 CONTENIDO --- */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Saludo */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-3xl font-black text-slate-800">
            {t('dashboard.welcome_user').replace('{name}', userName)} 👋
          </h2>
          <p className="text-gray-500 mt-1 font-medium">
            {profile?.role === 'hotel'
              ? t('dashboard.summary_today')
              : t('dashboard.traveler_subtitle')}
          </p>
        </div>

        {/* --- 3.3 VISTA: HOTELERO --- */}
        {profile?.role === 'hotel' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Ganancias */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-xs font-black uppercase tracking-wider">{t('dashboard.monthly_earnings')}</h3>
                  <div className="p-2 bg-green-50 text-green-600 rounded-xl"><DollarSign size={20} /></div>
                </div>
                <p className="text-3xl font-black text-slate-900">$0.00</p>
                <span className="text-xs text-green-600 font-bold">+0% {t('dashboard.vs_last_month')}</span>
              </div>

              {/* Reservas */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-xs font-black uppercase tracking-wider">{t('dashboard.active_bookings')}</h3>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Calendar size={20} /></div>
                </div>
                <p className="text-3xl font-black text-slate-900">0</p>
                <span className="text-xs text-gray-400 font-medium">{t('dashboard.no_pending')}</span>
              </div>

              {/* Mis Hoteles */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-xs font-black uppercase tracking-wider">{t('dashboard.my_hotels')}</h3>
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Building size={20} /></div>
                </div>
                <p className="text-3xl font-black text-slate-900">0</p>
                <button className="text-xs text-blue-600 font-bold hover:underline mt-1">{t('dashboard.register_property')} +</button>
              </div>
            </div>

            {/* Empty State */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="text-slate-300" size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">{t('dashboard.empty_title')}</h3>
                <p className="text-gray-500 mb-8 text-sm leading-relaxed">{t('dashboard.empty_desc')}</p>
                <button className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl hover:-translate-y-1">
                  {t('dashboard.btn_new_property')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- 3.4 VISTA: VIAJERO --- */}
        {profile?.role === 'client' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-4 text-blue-500" size={20} />
                  <input type="text" placeholder={t('dashboard.search_place')} className="input-search" />
                </div>
                <div className="flex-1 relative">
                  <Calendar className="absolute left-4 top-4 text-blue-500" size={20} />
                  <input type="date" className="input-search text-gray-400" />
                </div>
                <button className="bg-blue-600 hover:bg-slate-900 text-white px-10 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                  <Search size={20} /> {t('dashboard.btn_search')}
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-1 bg-blue-600 rounded-full block"></span>
                {t('dashboard.recommended_destinations')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Aquí iría el map de alojamientos reales */}
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .input-search { width: 100%; pl: 3rem; padding: 1rem 1rem 1rem 3.2rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 1.2rem; font-weight: 600; outline: none; transition: all 0.2s; }
        .input-search:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
      `}</style>
    </div>
  );
};

export default Dashboard;