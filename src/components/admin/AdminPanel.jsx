import React, { useState, useEffect } from 'react';
import { supabase } from '../../../backend/supabaseClient';
import SidebarPC from './sidebar-pc';
import SidebarMovil from './sidebar-movil';
import InventoryAlquiler from './inventory-alquiler';
import InventoryVentas from './inventory-ventas';
import InventoryReservas from './inventory-reservas';

// 1. IMPORTAMOS AMBOS COMPONENTES (PC Y MÓVIL)
import BookingCalendar from './BookingCalendar';
import BookingCalendarMovil from './BookingCalendarMovil';

const AdminPanel = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('alquiler');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ alquiler: [], ventas: [], reservas: [] });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: alq } = await supabase.from('alojamientos').select('*');
      const { data: vnt } = await supabase.from('ventas_propiedades').select('*');
      const { data: res } = await supabase.from('reservas').select('*').order('created_at', { ascending: false });

      setData({
        alquiler: alq || [],
        ventas: vnt || [],
        reservas: res || []
      });
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans">
      {/* SIDEBAR PARA PC */}
      <SidebarPC activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
        <div className="p-4 md:p-10">
          {/* TABLAS DE INVENTARIO */}
          {activeTab === 'alquiler' && <InventoryAlquiler items={data.alquiler} refresh={fetchData} loading={loading} />}
          {activeTab === 'ventas' && <InventoryVentas items={data.ventas} refresh={fetchData} loading={loading} />}
          {activeTab === 'reservas' && <InventoryReservas items={data.reservas} refresh={fetchData} loading={loading} />}

          {/* 2. LÓGICA DE CALENDARIO ADAPTATIVA */}
          {activeTab === 'calendario' && (
            <div className="animate-in fade-in duration-500">
              {/* Esta versión SOLO se ve en computadoras (md en adelante) */}
              <div className="hidden md:block">
                <BookingCalendar
                  alojamientos={data.alquiler}
                  reservas={data.reservas}
                  loading={loading}
                />
              </div>

              {/* Esta versión SOLO se ve en celulares (menor a md) */}
              <div className="md:hidden">
                <BookingCalendarMovil
                  alojamientos={data.alquiler}
                  reservas={data.reservas}
                  loading={loading}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* SIDEBAR PARA MÓVIL */}
      <SidebarMovil activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
    </div>
  );
};

export default AdminPanel;