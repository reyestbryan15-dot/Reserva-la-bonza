import React, { useState, useEffect } from 'react';
import { supabase } from '../../../backend/supabaseClient';
import { LogOut, Home, Bell, CheckCircle, Clock, Plus, Edit, MapPin, Trash2, Upload } from 'lucide-react';

const AdminPanel = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '', descripcion: '', ubicacion: '', tipo: '', precio_noche: '',
    max_adultos: '', max_ninos: '', admite_mascotas: false, calificacion: 5, amenities: []
  });

  const fetchData = async () => {
    const { data: props } = await supabase.from('alojamientos').select('*');
    setProperties(props || []);
    const { data: reser } = await supabase.from('reservas').select('*');
    setReservations(reser || []);
  };

  useEffect(() => { fetchData(); }, []);

  const saveProperty = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('alojamientos')
      .upsert([{ ...(editingId ? { id: editingId } : {}), ...formData }]);
    
    if (!error) {
      setIsModalOpen(false);
      fetchData();
    } else alert(error.message);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-white border-b md:border-r border-slate-200 flex flex-row md:flex-col p-4 fixed bottom-0 md:relative z-50">
        <div className="p-4 hidden md:block"><span className="font-black text-lg uppercase">La Bonanza</span></div>
        <nav className="flex flex-row md:flex-col gap-2 w-full">
          <button onClick={() => setActiveTab('properties')} className={`flex-1 p-3 rounded-xl font-bold ${activeTab === 'properties' ? 'bg-blue-50 text-blue-900' : 'text-slate-400'}`}>Inventario</button>
          <button onClick={() => setActiveTab('reservations')} className={`flex-1 p-3 rounded-xl font-bold ${activeTab === 'reservations' ? 'bg-blue-50 text-blue-900' : 'text-slate-400'}`}>Reservas</button>
        </nav>
      </aside>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={saveProperty} className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl">
            <h3 className="font-black text-xl mb-4">{editingId ? 'EDITAR' : 'NUEVO'} ALOJAMIENTO</h3>
            <div className="grid grid-cols-2 gap-3">
              <input className="p-3 border rounded-xl" placeholder="Título" required value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} />
              <input className="p-3 border rounded-xl" placeholder="Ubicación" value={formData.ubicacion} onChange={e => setFormData({...formData, ubicacion: e.target.value})} />
              <input className="p-3 border rounded-xl" type="number" placeholder="Precio" value={formData.precio_noche} onChange={e => setFormData({...formData, precio_noche: e.target.value})} />
              <input className="p-3 border rounded-xl" placeholder="Tipo" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})} />
              <input className="p-3 border rounded-xl" type="number" placeholder="Max Adultos" value={formData.max_adultos} onChange={e => setFormData({...formData, max_adultos: e.target.value})} />
              <input className="p-3 border rounded-xl" type="number" placeholder="Max Niños" value={formData.max_ninos} onChange={e => setFormData({...formData, max_ninos: e.target.value})} />
            </div>
            <textarea className="w-full p-3 my-3 border rounded-xl" placeholder="Descripción" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
            <label className="flex items-center gap-2 mb-4">
              <input type="checkbox" checked={formData.admite_mascotas} onChange={e => setFormData({...formData, admite_mascotas: e.target.checked})} /> Admite Mascotas
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-slate-500">CANCELAR</button>
              <button type="submit" className="flex-1 py-3 bg-blue-900 text-white rounded-xl font-bold">GUARDAR</button>
            </div>
          </form>
        </div>
      )}

      {/* MAIN */}
      <main className="flex-1 p-6 pb-24">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black uppercase tracking-tighter">{activeTab}</h2>
          {activeTab === 'properties' && (
            <button onClick={() => { setFormData({}); setEditingId(null); setIsModalOpen(true); }} className="bg-blue-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
              <Plus size={16} /> NUEVO
            </button>
          )}
        </header>

        {activeTab === 'properties' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-2xl border shadow-sm">
                <h4 className="font-black text-lg">{p.titulo}</h4>
                <p className="text-xs text-slate-400 mb-2">{p.ubicacion}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-900">${p.precio_noche}</span>
                  <button onClick={() => { setFormData(p); setEditingId(p.id); setIsModalOpen(true); }} className="text-blue-600"><Edit size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {reservations.map(res => (
              <div key={res.id} className="bg-white p-5 rounded-2xl border flex justify-between items-center">
                <div>
                  <h4 className="font-bold">{res.propiedad_titulo}</h4>
                  <p className="text-xs text-slate-400 uppercase">{res.nombre_cliente}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${res.estado === 'confirmado' ? 'bg-green-100 text-green-700' : 'bg-amber-100'}`}>{res.estado}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;