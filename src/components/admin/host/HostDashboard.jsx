import React from 'react';
import { Plus, BarChart3, Info } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const HostDashboard = ({ user, onChangeTab, realData = [] }) => {
  const { t } = useLanguage();

  // 1. LÓGICA DE DETECCIÓN: ¿Hay datos reales?
  const hasData = realData.length > 0;

  // Datos por defecto para que el gráfico no rompa si no hay nada
  const chartData = hasData ? realData : [
    { name: 'Lun', ingresos: 0 }, { name: 'Mar', ingresos: 0 },
    { name: 'Mie', ingresos: 0 }, { name: 'Jue', ingresos: 0 },
    { name: 'Vie', ingresos: 0 }, { name: 'Sab', ingresos: 0 },
    { name: 'Dom', ingresos: 0 },
  ];

  const emptyPieData = [{ name: 'Sin datos', value: 100 }];

  return (
    <div className="px-4 py-6 sm:px-0 bg-[#f8f7f2] min-h-screen text-slate-900 font-sans">

      {/* Banner de Bienvenida (Se puede ocultar si ya hay datos, para más realismo) */}
      {!hasData && (
        <div className="mb-10 bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-700">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
              {t('dashboard.welcome_user').replace('{name}', user?.email?.split('@')[0])}
            </h1>
            <p className="text-slate-400 font-medium text-lg mb-8 leading-relaxed">
              Tu panel está listo. Registra tu primera propiedad para empezar a ver estadísticas reales.
            </p>
            <button
              onClick={() => onChangeTab('create-room')}
              className="flex items-center gap-3 bg-[#f8f7f2] text-slate-900 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all active:scale-95"
            >
              <Plus size={20} />
              {t('dashboard.btn_new_property')}
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card-initial">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('dashboard.monthly_earnings')}</p>
          {/* Si hay datos, el color es negro, si no, es gris suave */}
          <h3 className={`text-3xl font-black tracking-tighter ${hasData ? 'text-slate-900' : 'text-slate-300'}`}>
            ${hasData ? "1,250.00" : "0.00"}
          </h3>
          {!hasData && (
            <div className="mt-4 flex items-center gap-1.5 text-slate-300 border border-slate-100 w-fit px-2 py-1 rounded-lg">
              <Info size={12} />
              <span className="text-[9px] font-bold uppercase italic">Esperando datos...</span>
            </div>
          )}
        </div>

        {/* ... (Otros KPIs iguales) */}
      </div>

      {/* SECCIÓN DE GRÁFICOS CON LÓGICA CONDICIONAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

        <div className="lg:col-span-2 bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden">

          {/* 2. OVERLAY: Solo se muestra si NO hay datos */}
          {!hasData && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
              <BarChart3 className="text-slate-300 mb-2" size={40} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Los gráficos aparecerán aquí</p>
            </div>
          )}

          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest italic mb-8">Ingresos Semanales</h3>

          {/* 3. EL GRÁFICO: Cambia la opacidad si no hay datos */}
          <div className={`h-64 w-full transition-opacity duration-1000 ${hasData ? 'opacity-100' : 'opacity-10'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip cursor={{ stroke: '#0f172a', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#0f172a"
                  strokeWidth={3}
                  fill="url(#colorIngresos)"
                  animationDuration={2000}
                />
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pie (Lógica similar) */}
        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center justify-center text-center">
          <div className={`w-full h-48 relative mb-6 transition-all ${hasData ? 'scale-100' : 'scale-90 opacity-20'}`}>
            {/* Aquí iría el PieChart real con data de categorías */}
          </div>
          {!hasData && <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sin actividad</p>}
        </div>
      </div>
    </div>
  );
};