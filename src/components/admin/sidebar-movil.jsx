import React from 'react';
import { LayoutGrid, Tag, Bell, LogOut, Calendar } from 'lucide-react'; // Añadimos Calendar

const SidebarMovil = ({ activeTab, setActiveTab, onLogout }) => (
    <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-[#0f172a] border border-slate-800 px-4 py-4 rounded-2xl flex justify-around items-center z-[100] shadow-2xl">
        <button onClick={() => setActiveTab('alquiler')} className={activeTab === 'alquiler' ? 'text-blue-400' : 'text-slate-500'}>
            <LayoutGrid size={24} />
        </button>
        {/* NUEVO BOTÓN CALENDARIO */}
        <button onClick={() => setActiveTab('calendario')} className={activeTab === 'calendario' ? 'text-blue-400' : 'text-slate-500'}>
            <Calendar size={24} />
        </button>
        <button onClick={() => setActiveTab('ventas')} className={activeTab === 'ventas' ? 'text-blue-400' : 'text-slate-500'}>
            <Tag size={24} />
        </button>
        <button onClick={() => setActiveTab('reservas')} className={activeTab === 'reservas' ? 'text-blue-400' : 'text-slate-500'}>
            <Bell size={24} />
        </button>
        <button onClick={onLogout} className="text-red-400"><LogOut size={24} /></button>
    </nav>
);

export default SidebarMovil;