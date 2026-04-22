import React from 'react';
import { LayoutGrid, Tag, Bell, LogOut } from 'lucide-react';

const SidebarPC = ({ activeTab, setActiveTab, onLogout }) => (
    <aside className="w-72 bg-[#0f172a] text-white hidden md:flex flex-col h-screen sticky top-0 shadow-2xl">
        <div className="p-8 text-center font-black text-2xl text-blue-400 italic uppercase">
            ADMIN<span className="text-white">PANEL</span>
        </div>
        <nav className="flex flex-col gap-2 px-4 flex-1">
            <button onClick={() => setActiveTab('alquiler')} className={`flex items-center gap-3 p-4 rounded-xl font-bold ${activeTab === 'alquiler' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                <LayoutGrid size={20} /> Alquileres
            </button>
            <button onClick={() => setActiveTab('ventas')} className={`flex items-center gap-3 p-4 rounded-xl font-bold ${activeTab === 'ventas' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                <Tag size={20} /> Ventas
            </button>
            <button onClick={() => setActiveTab('reservas')} className={`flex items-center gap-3 p-4 rounded-xl font-bold ${activeTab === 'reservas' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                <Bell size={20} /> Reservas
            </button>
        </nav>
        <button onClick={onLogout} className="p-8 text-slate-400 hover:text-red-400 flex items-center gap-3 font-bold">
            <LogOut size={20} /> Salir
        </button>
    </aside>
);

export default SidebarPC;