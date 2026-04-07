import React, { useEffect, useState } from 'react';
import { supabase } from '../../../backend/supabaseClient';
import { useLanguage } from '../context/LanguageContext';
import {
  LogOut, Building, MapPin, Calendar, DollarSign, User, Search, Loader2,
  TrendingUp, Bell, ChevronRight, PieChart as PieChartIcon, LayoutGrid
} from 'lucide-react';
// Importamos componentes de gráficos (Asegúrate de tener instalada la librería: npm install recharts)
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const Dashboard = ({ session }) => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Datos dummy para el diseño de gráficos (Lógica visual)
  const revenueData = [
    { name: 'Lun', ingresos: 400 }, { name: 'Mar', ingresos: 300 },
    { name: 'Mie', ingresos: 600 }, { name: 'Jue', ingresos: 800 },
    { name: 'Vie', ingresos: 500 }, { name: 'Sab', ingresos: 900 },
    { name: 'Dom', ingresos: 1200 },
  ];

  const pieData = [
    { name: 'Confirmadas', value: 400, color: '#3b82f6' },
    { name: 'Pendientes', value: 300, color: '#f59e0b' },
  ];

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
    localStorage.clear();
    sessionStorage.clear();
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.log("Error ignorado en signOut");
    }
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#020617]">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  const userName = profile?.role === 'hotel'
    ? profile?.company_name
    : profile?.full_name?.split(' ')[0];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-10">

      {/* --- NAVBAR PREMIUM --- */}
      <nav className="bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Building size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">
            Bonanza<span className="text-blue-500 font-light">PRO</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-none">
              {profile?.full_name || profile?.company_name}
            </p>
            <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest mt-1">
              {profile?.role === 'hotel' ? t('dashboard.role_hotel') : t('dashboard.role_traveler')}
            </p>
          </div>

          <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center text-blue-400 border border-slate-700 shadow-inner">
            <User size={20} />
          </div>

          <button
            onClick={handleLogout}
            className="p-2.5 text-slate-500 hover:text-red-400 transition-all rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
            title={t('navbar.logout')}
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* SALUDO E INTRO */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <h2 className="text-4xl font-black text-white tracking-tight italic uppercase">
              {t('dashboard.welcome_user').replace('{name}', userName)} 👋
            </h2>
            <p className="text-slate-500 mt-2 font-bold text-xs uppercase tracking-[0.2em]">
              {profile?.role === 'hotel' ? t('dashboard.summary_today') : t('dashboard.traveler_subtitle')}
            </p>
          </div>

          {profile?.role === 'hotel' && (
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2">
              <LayoutGrid size={16} /> {t('dashboard.btn_new_property')}
            </button>
          )}
        </div>

        {/* --- VISTA: HOTELERO (DISEÑO CON GRÁFICOS) --- */}
        {profile?.role === 'hotel' && (
          <div className="space-y-8 animate-in fade-in duration-1000">

            {/* GRID DE MÉTRICAS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-metric bg-gradient-to-br from-blue-600/20 to-transparent">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] mb-1">{t('dashboard.monthly_earnings')}</h3>
                    <p className="text-3xl font-black text-white tracking-tighter">$0.00</p>
                  </div>
                  <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/40"><DollarSign size={20} className="text-white" /></div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">+0%</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{t('dashboard.vs_last_month')}</span>
                </div>
              </div>

              <div className="card-metric">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] mb-1">{t('dashboard.active_bookings')}</h3>
                    <p className="text-3xl font-black text-white tracking-tighter">0</p>
                  </div>
                  <div className="p-3 bg-slate-800 border border-slate-700 rounded-2xl text-blue-400"><Calendar size={20} /></div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp size={14} className="text-slate-600" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{t('dashboard.no_pending')}</span>
                </div>
              </div>

              <div className="card-metric">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] mb-1">{t('dashboard.my_hotels')}</h3>
                    <p className="text-3xl font-black text-white tracking-tighter">0</p>
                  </div>
                  <div className="p-3 bg-slate-800 border border-slate-700 rounded-2xl text-purple-400"><Building size={20} /></div>
                </div>
                <button className="mt-4 text-[10px] text-blue-500 font-black uppercase hover:text-white transition-colors flex items-center gap-1">
                  {t('dashboard.register_property')} <ChevronRight size={12} />
                </button>
              </div>
            </div>

            {/* SECCIÓN DE ANALÍTICA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Gráfico de Ingresos */}
              <div className="lg:col-span-2 bg-[#0f172a]/40 border border-slate-800 p-6 rounded-[2rem] backdrop-blur-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Rendimiento Semanal</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                      <Area type="monotone" dataKey="ingresos" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Estado de Reservas (Donut) */}
              <div className="bg-[#0f172a]/40 border border-slate-800 p-6 rounded-[2rem] flex flex-col items-center">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 self-start">Estados</h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2 w-full">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Confirmadas</span>
                    <span className="text-white">400</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> Pendientes</span>
                    <span className="text-white">300</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- VISTA: VIAJERO --- */}
        {profile?.role === 'client' && (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="bg-[#0f172a]/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl shadow-black/50">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-[2] relative">
                  <MapPin className="absolute left-4 top-4 text-blue-500" size={20} />
                  <input type="text" placeholder={t('dashboard.search_place')} className="input-premium-search pl-12" />
                </div>
                <div className="flex-1 relative">
                  <Calendar className="absolute left-4 top-4 text-blue-500" size={20} />
                  <input type="date" className="input-premium-search pl-12 text-slate-400" />
                </div>
                <button className="bg-blue-600 hover:bg-white hover:text-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95">
                  <Search size={18} /> {t('dashboard.btn_search')}
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3 italic uppercase tracking-tighter">
                <span className="w-12 h-1.5 bg-blue-600 rounded-full block"></span>
                {t('dashboard.recommended_destinations')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Skeleton Loader de ejemplo para diseño */}
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-slate-900/50 rounded-[2rem] border border-slate-800 border-dashed flex items-center justify-center text-slate-700 font-bold uppercase tracking-widest text-[10px]">
                    Próximamente...
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .card-metric {
          background-color: #0f172a;
          padding: 1.5rem;
          border-radius: 1.5rem;
          border: 1px solid #1e293b;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-metric:hover {
          border-color: #3b82f6;
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
        }
        .input-premium-search { 
          width: 100%; 
          padding: 1rem 1rem 1rem 1rem; 
          background: #1e293b; 
          border: 1px solid #334155; 
          border-radius: 1.2rem; 
          font-weight: 600; 
          color: white;
          outline: none; 
          transition: all 0.3s; 
        }
        .input-premium-search:focus { 
          border-color: #3b82f6; 
          background: #0f172a; 
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15); 
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;