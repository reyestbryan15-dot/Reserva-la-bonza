import React from 'react';
import { Plus, Search, MoreVertical, BedDouble, User, DollarSign, Filter, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

const MyRooms = ({ onAddNew }) => {
    const { t } = useLanguage();

    const habitaciones = [
        { id: 1, nombre: 'Apartamento 101', tipo: 'Suite', precio: 150000, estado: 'disponible', capacidad: 4 },
        { id: 2, nombre: 'Cabaña del Mar', tipo: 'Cabaña', precio: 250000, estado: 'ocupado', capacidad: 6 },
        { id: 3, nombre: 'Habitación Estándar', tipo: 'Doble', precio: 80000, estado: 'mantenimiento', capacidad: 2 },
    ];

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'disponible': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'ocupado': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'mantenimiento': return 'bg-amber-50 text-amber-700 border-amber-100';
            default: return 'bg-slate-50 text-slate-400';
        }
    };

    return (
        <div className="px-4 py-6 sm:px-0 bg-[#f8f7f2] min-h-screen animate-in fade-in duration-700">

            {/* HEADER SUPERIOR */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 italic uppercase tracking-tighter">
                        {t('myRooms.title')}
                    </h2>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2 italic opacity-70">
                        {t('myRooms.subtitle')}
                    </p>
                </div>
                <button
                    onClick={onAddNew}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-all shadow-2xl shadow-slate-200 active:scale-95"
                >
                    <Plus size={18} />
                    {t('myRooms.btn_new')}
                </button>
            </div>

            {/* BARRA DE BÚSQUEDA Y FILTROS */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder={t('myRooms.search_placeholder')}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-medium text-slate-900 shadow-sm"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select className="appearance-none pl-10 pr-10 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-slate-900 font-black uppercase text-[10px] tracking-widest text-slate-600 cursor-pointer shadow-sm">
                        <option>{t('myRooms.filter_all')}</option>
                        <option>{t('myRooms.status_disponible')}</option>
                        <option>{t('myRooms.status_ocupado')}</option>
                        <option>{t('myRooms.status_mantenimiento')}</option>
                    </select>
                </div>
            </div>

            {/* GRID DE HABITACIONES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {habitaciones.map((room) => (
                    <div key={room.id} className="group bg-white rounded-[2.5rem] border border-slate-100 p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-2 relative overflow-hidden">

                        {/* Menú de opciones */}
                        <button className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors">
                            <MoreVertical size={20} />
                        </button>

                        {/* Icono y Titulo */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-[#f8f7f2] rounded-2xl flex items-center justify-center text-slate-900 border border-slate-50 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                                <BedDouble size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg italic">{room.nombre}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{room.tipo}</p>
                            </div>
                        </div>

                        {/* Status y Precio */}
                        <div className="flex items-center justify-between mb-8 bg-[#fcfcfb] p-4 rounded-2xl border border-slate-50">
                            <span className={`px-3 py-1.5 rounded-full text-[9px] font-black border ${getStatusColor(room.estado)} uppercase tracking-[0.15em]`}>
                                {t(`myRooms.status_${room.estado}`)}
                            </span>
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('common.price')}</p>
                                <p className="text-lg font-black text-slate-900 tracking-tighter">
                                    ${room.precio.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Footer de la Card */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2 text-slate-400">
                                <User size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-tight">
                                    {t('myRooms.max_cap').replace('{num}', room.capacidad)}
                                </span>
                            </div>
                            <button className="flex items-center gap-1 text-slate-900 font-black uppercase text-[10px] tracking-widest group-hover:text-blue-600 transition-colors">
                                {t('myRooms.btn_edit')}
                                <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* BOTÓN "AGREGAR OTRA" (Placeholder) */}
                <button
                    onClick={onAddNew}
                    className="group border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-slate-300 hover:border-slate-900 hover:text-slate-900 hover:bg-white transition-all duration-500 min-h-[300px]"
                >
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <Plus size={32} />
                    </div>
                    <span className="font-black uppercase text-[10px] tracking-[0.2em]">{t('myRooms.add_another')}</span>
                </button>
            </div>
        </div>
    );
};

export default MyRooms;