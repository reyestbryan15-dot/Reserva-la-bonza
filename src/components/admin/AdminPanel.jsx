import React, { useState, useEffect } from 'react';
import { supabase } from '../../../backend/supabaseClient';
import SidebarPC from './sidebar-pc';
import SidebarMovil from './sidebar-movil';
import InventoryAlquiler from './inventory-alquiler';
import InventoryVentas from './inventory-ventas';
import InventoryReservas from './inventory-reservas';

const AdminPanel = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('alquiler');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ alquiler: [], ventas: [], reservas: [] });

  const fetchData = async () => {
    setLoading(true);
    const { data: alq } = await supabase.from('alojamientos').select('*');
    const { data: vnt } = await supabase.from('ventas_propiedades').select('*');
    const { data: res } = await supabase.from('reservas').select('*').order('created_at', { ascending: false });
    setData({ alquiler: alq || [], ventas: vnt || [], reservas: res || [] });
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans">
      <SidebarPC activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
        <div className="p-4 md:p-10">
          {activeTab === 'alquiler' && <InventoryAlquiler items={data.alquiler} refresh={fetchData} loading={loading} />}
          {activeTab === 'ventas' && <InventoryVentas items={data.ventas} refresh={fetchData} loading={loading} />}
          {activeTab === 'reservas' && <InventoryReservas items={data.reservas} refresh={fetchData} loading={loading} />}
        </div>
      </main>

      <SidebarMovil activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
    </div>
  );
};

export default AdminPanel;