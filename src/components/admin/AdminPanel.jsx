import React, { useState, useEffect } from 'react';
import { supabase } from '../../../backend/supabaseClient';
import { useLanguage } from '../../context/LanguageContext';
import {
  LogOut, Plus, Edit, MapPin, Trash2, LayoutGrid, Tag, Bell,
  X, Upload, Loader2, CheckCircle, Video, Calendar, User, Mail, CreditCard
} from 'lucide-react';

const AdminPanel = ({ onLogout }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [sales, setSales] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialForm = {
    titulo: '', ubicacion: '', tipo: '',
    precio_temporada_baja: '', precio_alta: '', precio_media: '',
    precio_semana_santa: '', precio_semana_uribe: '',
    costo_manilla: '', costo_aseo: '',
    precio_cop: '', precio_usd: '',
    metros_cuadrados: '', habitaciones: '', banos: '',
    imagenes: [], video_url: '', descripcion: '',
    amenities: []
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    setLoading(true);
    const { data: props } = await supabase.from('alojamientos').select('*');
    setProperties(props || []);
    const { data: vntas } = await supabase.from('ventas_propiedades').select('*').order('created_at', { ascending: false });
    setSales(vntas || []);
    const { data: reser } = await supabase.from('reservas').select('*').order('created_at', { ascending: false });
    setReservations(reser || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    if (onLogout) onLogout();
    else window.location.href = '/';
  };

  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        const fileName = `${Date.now()}-${file.name}`;
        const folder = activeTab === 'sales' ? 'ventas' : 'alquiler';
        const { error: uploadError } = await supabase.storage.from('hoteles').upload(`${folder}/${fileName}`, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('hoteles').getPublicUrl(`${folder}/${fileName}`);
        return data.publicUrl;
      });
      const urls = await Promise.all(uploadPromises);
      setFormData(prev => ({ ...prev, imagenes: [...(prev.imagenes || []), ...urls] }));
    } catch (error) {
      alert("Error subiendo imagen: " + error.message);
    } finally { setUploading(false); }
  };

  const removeImage = (index) => {
    setFormData(prev => ({ ...prev, imagenes: prev.imagenes.filter((_, i) => i !== index) }));
  };

  const saveEntry = async (e) => {
    e.preventDefault();
    const isSales = activeTab === 'sales';
    const table = isSales ? 'ventas_propiedades' : 'alojamientos';

    const payload = {
      titulo: formData.titulo,
      ubicacion: formData.ubicacion,
      descripcion: formData.descripcion,
      video_url: formData.video_url,
      tipo: formData.tipo || (isSales ? 'Venta' : 'Alquiler')
    };

    if (isSales) {
      payload.precio_cop = formData.precio_cop;
      payload.precio_usd = formData.precio_usd;
      payload.imagenes = formData.imagenes;
      payload.metros_cuadrados = formData.metros_cuadrados;
      payload.habitaciones = formData.habitaciones;
      payload.banos = formData.banos;
    } else {
      payload.precio_temporada_baja = formData.precio_temporada_baja;
      payload.precio_temporada_alta = formData.precio_temporada_alta;
      payload.precio_temporada_media = formData.precio_temporada_media;
      payload.precio_semana_santa = formData.precio_semana_santa;
      payload.precio_semana_uribe = formData.precio_semana_uribe;
      payload.costo_manilla = formData.costo_manilla;
      payload.costo_aseo = formData.costo_aseo;
      payload.galeria = formData.imagenes;
    }

    const { error } = await supabase.from(table).upsert([{
      ...(editingId ? { id: editingId } : {}),
      ...payload
    }]);

    if (!error) {
      setIsModalOpen(false);
      fetchData();
      alert("Guardado exitosamente");
    } else {
      alert("Error: " + error.message);
    }
  };

  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans pb-24 md:pb-0">

      {/* --- SIDEBAR DESKTOP --- */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-6 h-screen sticky top-0 hidden md:flex">
        <div className="mb-10 text-center">
          <span className="font-black text-2xl tracking-tighter text-blue-900 italic uppercase">Admin Panel</span>
        </div>
        <nav className="flex flex-col gap-3 flex-1">
          <button onClick={() => setActiveTab('properties')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition ${activeTab === 'properties' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
            <LayoutGrid size={20} /> Alquileres
          </button>
          <button onClick={() => setActiveTab('sales')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition ${activeTab === 'sales' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
            <Tag size={20} /> Ventas
          </button>
          <button onClick={() => setActiveTab('reservations')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition ${activeTab === 'reservations' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
            <Bell size={20} /> Reservas
          </button>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold p-4 hover:bg-red-50 rounded-2xl transition mt-auto w-full">
          <LogOut size={20} /> Salir
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 mt-4 md:mt-0">
          <h2 className="text-2xl md:text-3xl font-black uppercase text-slate-800 tracking-tight italic">
            {activeTab === 'properties' ? "Gestión Alquileres" : activeTab === 'sales' ? "Gestión Ventas" : "Centro de Reservas"}
          </h2>

          {activeTab !== 'reservations' && (
            <button
              onClick={() => { setFormData(initialForm); setEditingId(null); setIsModalOpen(true); }}
              className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-600 transition shadow-xl uppercase tracking-widest text-xs active:scale-95"
            >
              <Plus size={20} /> Añadir Propiedad
            </button>
          )}
        </header>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : activeTab === 'reservations' ? (
          /* --- TABLA DE RESERVAS MEJORADA --- */
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-5 text-left text-[10px] font-black uppercase text-slate-400">Cliente / Propiedad</th>
                    <th className="p-5 text-center text-[10px] font-black uppercase text-slate-400">Fechas</th>
                    <th className="p-5 text-center text-[10px] font-black uppercase text-slate-400">Total Pago</th>
                    <th className="p-5 text-center text-[10px] font-black uppercase text-slate-400">Estado</th>
                    <th className="p-5 text-right text-[10px] font-black uppercase text-slate-400">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map(res => (
                    <tr key={res.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-800 text-sm uppercase">{res.nombre_cliente}</span>
                          <span className="text-[10px] text-blue-600 font-bold uppercase">{res.propiedad_titulo}</span>
                        </div>
                      </td>
                      <td className="p-5 text-center font-bold text-xs text-slate-500">
                        {res.fecha_inicio} <br /> <span className="text-[9px] text-slate-300 italic">al</span> <br /> {res.fecha_fin}
                      </td>
                      <td className="p-5 text-center font-black text-indigo-600">{formatCOP(res.precio_total)}</td>
                      <td className="p-5 text-center">
                        <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${res.estado === 'confirmada' ? 'bg-green-100 text-green-600' :
                            res.estado === 'cancelada' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                          {res.estado || 'pendiente'}
                        </span>
                      </td>
                      <td className="p-5 text-right flex justify-end gap-2">
                        {res.estado !== 'confirmada' && res.estado !== 'cancelada' && (
                          <button onClick={async () => { await supabase.from('reservas').update({ estado: 'confirmada' }).eq('id', res.id); fetchData(); }} className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"><CheckCircle size={18} /></button>
                        )}
                        {res.estado !== 'cancelada' && (
                          <button onClick={async () => { if (window.confirm("¿Cancelar reserva y liberar fechas?")) { await supabase.from('reservas').update({ estado: 'cancelada' }).eq('id', res.id); fetchData(); } }} className="p-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition"><X size={18} /></button>
                        )}
                        <button onClick={async () => { if (window.confirm("¿Eliminar registro?")) { await supabase.from('reservas').delete().eq('id', res.id); fetchData(); } }} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* --- GRILLA DE PROPIEDADES --- */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === 'properties' ? properties : sales).map(item => (
              <div key={item.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group">
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  <img src={(item.imagenes?.[0] || item.galeria?.[0]) || 'https://placehold.co/600x400?text=Sin+Imagen'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                </div>
                <div className="p-5">
                  <h4 className="font-black text-lg text-slate-800 truncate">{item.titulo}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-4 italic"><MapPin size={12} /> {item.ubicacion}</p>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl">
                    <p className="font-black text-blue-900 text-sm">
                      {formatCOP(activeTab === 'properties' ? (item.precio_temporada_baja || item.precio_noche) : item.precio_cop)}
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        setFormData({
                          ...item,
                          imagenes: item.imagenes || item.galeria || [],
                          video_url: item.video_url || '',
                          descripcion: item.descripcion || ''
                        });
                        setEditingId(item.id);
                        setIsModalOpen(true);
                      }} className="p-2 bg-white text-blue-600 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition"><Edit size={16} /></button>
                      <button onClick={async () => { if (window.confirm("¿Eliminar propiedad permanentemente?")) { await supabase.from(activeTab === 'sales' ? 'ventas_propiedades' : 'alojamientos').delete().eq('id', item.id); fetchData(); } }} className="p-2 bg-white text-red-500 rounded-lg shadow-sm hover:bg-red-500 hover:text-white transition"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- MENU MÓVIL (CORREGIDO PARA FUNCIONAR) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-3 flex justify-around items-center z-[100] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActiveTab('properties')} className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'properties' ? 'text-blue-600' : 'text-slate-400'}`}>
          <LayoutGrid size={22} /> <span className="text-[9px] font-black uppercase tracking-tighter">Alquiler</span>
        </button>
        <button onClick={() => setActiveTab('sales')} className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'sales' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Tag size={22} /> <span className="text-[9px] font-black uppercase tracking-tighter">Ventas</span>
        </button>
        <button onClick={() => setActiveTab('reservations')} className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'reservations' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Bell size={22} /> <span className="text-[9px] font-black uppercase tracking-tighter">Reservas</span>
        </button>
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 flex-1 text-red-400">
          <LogOut size={22} /> <span className="text-[9px] font-black uppercase tracking-tighter">Salir</span>
        </button>
      </nav>

      {/* --- MODAL DE CREACIÓN/EDICIÓN --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-2 md:p-4">
          <form onSubmit={saveEntry} className="bg-white p-6 md:p-10 rounded-[2.5rem] w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <button type="button" onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-red-50 text-slate-500 rounded-full transition"><X size={20} /></button>

            <h3 className="font-black text-xl md:text-2xl mb-8 uppercase italic text-blue-900 pr-10">
              {editingId ? "Actualizar" : "Nueva"} {activeTab === 'properties' ? "Propiedad Alquiler" : "Propiedad Venta"}
            </h3>

            <div className="space-y-8">
              {/* Imágenes */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-4 ml-1 tracking-widest">Galería Fotográfica</label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  <label className="border-2 border-dashed border-slate-200 rounded-2xl h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition">
                    {uploading ? <Loader2 className="animate-spin text-blue-600" /> : <Upload size={24} className="text-slate-400" />}
                    <input type="file" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                  {formData.imagenes?.map((img, i) => (
                    <div key={i} className="relative h-24 rounded-2xl overflow-hidden group border border-slate-100">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* URL Video */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-blue-50">
                <div className="flex items-center gap-2 mb-4">
                  <Video size={18} className="text-blue-600" />
                  <label className="text-[10px] font-black uppercase text-slate-500">Link de Recorrido Virtual (YouTube)</label>
                </div>
                <input
                  type="url"
                  className="input-admin"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.video_url || ''}
                  onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                />
              </div>

              {/* Inputs Generales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required className="input-admin" placeholder="Título Comercial" value={formData.titulo || ''} onChange={e => setFormData({ ...formData, titulo: e.target.value })} />
                <input required className="input-admin" placeholder="Ubicación / Dirección" value={formData.ubicacion || ''} onChange={e => setFormData({ ...formData, ubicacion: e.target.value })} />

                {activeTab === 'sales' ? (
                  <>
                    <input type="number" className="input-admin" placeholder="Precio COP" value={formData.precio_cop || ''} onChange={e => setFormData({ ...formData, precio_cop: e.target.value })} />
                    <input type="number" className="input-admin" placeholder="Precio USD (Opcional)" value={formData.precio_usd || ''} onChange={e => setFormData({ ...formData, precio_usd: e.target.value })} />
                  </>
                ) : (
                  <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-blue-600 ml-1">T. Baja</label>
                      <input type="number" className="input-admin" value={formData.precio_temporada_baja || ''} onChange={e => setFormData({ ...formData, precio_temporada_baja: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-red-500 ml-1">T. Alta</label>
                      <input type="number" className="input-admin" value={formData.precio_temporada_alta || ''} onChange={e => setFormData({ ...formData, precio_temporada_alta: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-green-600 ml-1">Aseo</label>
                      <input type="number" className="input-admin" value={formData.costo_aseo || ''} onChange={e => setFormData({ ...formData, costo_aseo: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-indigo-600 ml-1">Manilla</label>
                      <input type="number" className="input-admin" value={formData.costo_manilla || ''} onChange={e => setFormData({ ...formData, costo_manilla: e.target.value })} />
                    </div>
                  </div>
                )}

                <div className="md:col-span-2">
                  <textarea className="input-admin min-h-[120px] pt-4" placeholder="Descripción detallada de la propiedad..." value={formData.descripcion || ''} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} />
                </div>

                <div className="grid grid-cols-3 gap-3 md:col-span-2">
                  <input type="number" className="input-admin" placeholder="m²" value={formData.metros_cuadrados || ''} onChange={e => setFormData({ ...formData, metros_cuadrados: e.target.value })} />
                  <input type="number" className="input-admin" placeholder="Hab" value={formData.habitaciones || ''} onChange={e => setFormData({ ...formData, habitaciones: e.target.value })} />
                  <input type="number" className="input-admin" placeholder="Baños" value={formData.banos || ''} onChange={e => setFormData({ ...formData, banos: e.target.value })} />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full mt-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black hover:bg-slate-900 transition-all shadow-2xl uppercase tracking-widest active:scale-95">
              {editingId ? "Actualizar Registro" : "Publicar Propiedad"}
            </button>
          </form>
        </div>
      )}

      <style>{`
        .input-admin { padding: 0.9rem 1.2rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 1.2rem; font-weight: 500; outline: none; width: 100%; transition: all 0.2s; font-size: 14px; }
        .input-admin:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminPanel;