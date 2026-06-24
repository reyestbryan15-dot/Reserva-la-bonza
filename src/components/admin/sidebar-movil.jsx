import React from 'react';
import { LayoutGrid, Tag, Bell, LogOut, Calendar, Compass, CalendarDays } from 'lucide-react'; // Añadimos CalendarDays

const SidebarMovil = ({ activeTab, setActiveTab, onLogout }) => (
    <nav className="md:hidden fixed bottom-6 left-4 right-4 bg-[#0f172a] border border-slate-800 px-2 py-4 rounded-2xl flex justify-around items-center z-[100] shadow-2xl">
        <button onClick={() => setActiveTab('alquiler')} className={activeTab === 'alquiler' ? 'text-blue-400' : 'text-slate-500'}>
            <LayoutGrid size={24} />
        </button>

        <button onClick={() => setActiveTab('ventas')} className={activeTab === 'ventas' ? 'text-blue-400' : 'text-slate-500'}>
            <Tag size={24} />
        </button>

        <button onClick={() => setActiveTab('reservas')} className={activeTab === 'reservas' ? 'text-blue-400' : 'text-slate-500'}>
            <Bell size={24} />
        </button>

        <button onClick={() => setActiveTab('tours')} className={activeTab === 'tours' ? 'text-blue-400' : 'text-slate-500'}>
            <Compass size={24} />
        </button>

        <button onClick={() => setActiveTab('calendario')} className={activeTab === 'calendario' ? 'text-blue-400' : 'text-slate-500'}>
            <Calendar size={24} />
        </button>

        {/* --- 🌟 NUEVO BOTÓN DE BLOQUEOS (AIRBNB/BOOKING) --- */}
        <button onClick={() => setActiveTab('bloqueos')} className={activeTab === 'bloqueos' ? 'text-blue-400' : 'text-slate-500'}>
            <CalendarDays size={24} />
        </button>

        <button onClick={onLogout} className="text-red-400"><LogOut size={24} /></button>
    </nav>
);

export default SidebarMovil;