import React, { useState, useEffect } from 'react';
import { supabase } from '../../../backend/supabaseClient';
import { useLanguage } from '../../context/LanguageContext';
import {
  LogOut, Plus, Edit, MapPin, Trash2, LayoutGrid, Tag, Bell,
  X, Upload, Loader2, CheckCircle, Video, Play, Search
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

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: props } = await supabase.from('alojamientos').select('*');
      setProperties(props || []);
      const { data: vntas } = await supabase.from('ventas_propiedades').select('*').order('created_at', { ascending: false });
      setSales(vntas || []);
      const { data: reser } = await supabase.from('reservas').select('*').order('created_at', { ascending: false });
      setReservations(reser || []);
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
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
      payload.precio_alta = formData.precio_alta;
      payload.precio_media = formData.precio_media;
      payload.precio_semana_santa = formData.precio_semana_santa;
      payload.precio_semana_uribe = formData.precio_semana_uribe;
      payload.costo_manilla = formData.costo_manilla;
      payload.costo_aseo = formData.costo_aseo;
      payload.galeria = formData.imagenes;
    }
    const { error } = await supabase.from(table).upsert([{ ...(editingId ? { id: editingId } : {}), ...payload }]);
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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans pb-24 md:pb-0">

      {/* --- SIDEBAR DESKTOP --- */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col h-screen sticky top-0 hidden md:flex shadow-2xl">
        <div className="p-8 mb-4 text-center">
          <span className="font-black text-2xl tracking-tighter text-blue-400 italic uppercase">ADMIN<span className="text-white">PANEL</span></span>
        </div>
        <nav className="flex flex-col gap-2 px-4 flex-1">
          <button onClick={() => setActiveTab('properties')} className={`flex items-center gap-3 p-4 rounded-xl font-bold transition-all duration-300 ${activeTab === 'properties' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <LayoutGrid size={20} /> Alquileres
          </button>
          <button onClick={() => setActiveTab('sales')} className={`flex items-center gap-3 p-4 rounded-xl font-bold transition-all duration-300 ${activeTab === 'sales' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Tag size={20} /> Ventas
          </button>
          <button onClick={() => setActiveTab('reservations')} className={`flex items-center gap-3 p-4 rounded-xl font-bold transition-all duration-300 ${activeTab === 'reservations' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Bell size={20} /> Reservas
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 font-bold p-4 hover:text-red-400 transition-all w-full">
            <LogOut size={20} /> Salir
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto">
        {/* Header Superior Desktop */}
        <header className="h-20 bg-white border-b border-slate-200 hidden md:flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="flex items-center bg-slate-100 px-4 py-2 rounded-xl w-96 border border-slate-200">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Buscar..." className="bg-transparent border-none outline-none ml-3 text-sm w-full" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
              <button className="px-3 py-1 text-xs font-bold bg-white shadow-sm rounded-md text-blue-600">ES</button>
              <button className="px-3 py-1 text-xs font-bold text-slate-400">EN</button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-10">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-black uppercase text-slate-900 tracking-tight italic">
                {activeTab === 'properties' ? "Alquileres" : activeTab === 'sales' ? "Ventas" : "Reservas"}
              </h2>
              <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest">Gestión de inventario activo</p>
            </div>

            {activeTab !== 'reservations' && (
              <button
                onClick={() => { setFormData(initialForm); setEditingId(null); setIsModalOpen(true); }}
                className="w-full md:w-auto bg-[#0f172a] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl active:scale-95 uppercase tracking-wider text-xs"
              >
                <Plus size={20} /> Añadir Propiedad
              </button>
            )}
          </header>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
          ) : activeTab === 'reservations' ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full border-collapse min-w-[700px]">
                <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-black text-slate-500 tracking-widest">
                  <tr>
                    <th className="p-5 text-left">Cliente</th>
                    <th className="p-5 text-center">Fechas</th>
                    <th className="p-5 text-center">Pago</th>
                    <th className="p-5 text-center">Estado</th>
                    <th className="p-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {reservations.map(res => (
                    <tr key={res.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="p-5">
                        <div className="font-bold text-slate-800 uppercase">{res.nombre_cliente}</div>
                        <div className="text-[10px] text-blue-600 font-bold">{res.propiedad_titulo}</div>
                      </td>
                      <td className="p-5 text-center font-medium">{res.fecha_inicio} <span className="text-slate-300">|</span> {res.fecha_fin}</td>
                      <td className="p-5 text-center font-black">{formatCOP(res.precio_total)}</td>
                      <td className="p-5 text-center">
                        <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase ${res.estado === 'confirmada' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {res.estado || 'pendiente'}
                        </span>
                      </td>
                      <td className="p-5 text-right flex justify-end gap-2">
                        <button onClick={async () => { if (window.confirm("¿Eliminar?")) { await supabase.from('reservas').delete().eq('id', res.id); fetchData(); } }} className="text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(activeTab === 'properties' ? properties : sales).map(item => {
                const currentImgs = item.imagenes || item.galeria || [];
                return (
                  <div key={item.id} className="group bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">
                    <div className="h-56 bg-slate-100 relative overflow-hidden">
                      <img src={currentImgs[0] || ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/20">
                        {activeTab === 'properties' ? 'Alquiler' : 'Venta'}
                      </div>
                      {item.video_url && (
                        <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-lg"><Play size={14} fill="currentColor" /></div>
                      )}
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-slate-800 text-lg truncate group-hover:text-blue-600 transition-colors">{item.titulo}</h4>
                      <div className="flex items-center gap-1.5 mt-2 text-slate-500 mb-6">
                        <MapPin size={14} className="text-blue-500" />
                        <span className="text-xs font-medium truncate">{item.ubicacion}</span>
                      </div>
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase text-slate-400 font-black">Base</span>
                          <span className="font-black text-slate-900 text-lg tracking-tight">
                            {formatCOP(activeTab === 'properties' ? (item.precio_temporada_baja || item.precio_noche) : item.precio_cop)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setFormData({ ...item, imagenes: item.imagenes || item.galeria || [], video_url: item.video_url || '', descripcion: item.descripcion || '' }); setEditingId(item.id); setIsModalOpen(true); }} className="p-2.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit size={18} /></button>
                          <button onClick={async () => { if (window.confirm("¿Eliminar?")) { await supabase.from(activeTab === 'sales' ? 'ventas_propiedades' : 'alojamientos').delete().eq('id', item.id); fetchData(); } }} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 transition-all shadow-sm"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* --- MENU MÓVIL ESTILO DARK (IGUAL AL SIDEBAR) --- */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-[#0f172a] border border-slate-800 px-4 py-4 rounded-2xl flex justify-around items-center z-[100] shadow-2xl">
        <button onClick={() => setActiveTab('properties')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'properties' ? 'text-blue-400 scale-110' : 'text-slate-500'}`}>
          <LayoutGrid size={20} /> <span className="text-[8px] font-black uppercase">Alquiler</span>
        </button>
        <button onClick={() => setActiveTab('sales')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'sales' ? 'text-blue-400 scale-110' : 'text-slate-500'}`}>
          <Tag size={20} /> <span className="text-[8px] font-black uppercase">Ventas</span>
        </button>
        <button onClick={() => setActiveTab('reservations')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'reservations' ? 'text-blue-400 scale-110' : 'text-slate-500'}`}>
          <Bell size={20} /> <span className="text-[8px] font-black uppercase">Reservas</span>
        </button>
        <div className="w-[1px] h-6 bg-slate-800 mx-2"></div>
        <button onClick={handleLogout} className="text-red-400">
          <LogOut size={20} />
        </button>
      </nav>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <form onSubmit={saveEntry} className="bg-white p-6 md:p-10 rounded-xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <button type="button" onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-red-50 text-slate-500 rounded-full transition-all"><X size={20} /></button>
            <h3 className="font-black text-2xl mb-8 uppercase text-slate-900 border-b pb-4">
              {editingId ? "Editar" : "Nueva"} {activeTab === 'properties' ? "Propiedad" : "Venta"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block tracking-widest">Galería</label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="border-2 border-dashed border-slate-200 rounded-xl h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-all group">
                      {uploading ? <Loader2 className="animate-spin text-blue-600" /> : <Upload size={24} className="text-slate-400 group-hover:text-blue-600" />}
                      <input type="file" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                    {formData.imagenes?.map((img, i) => (
                      <div key={i} className="relative h-24 rounded-xl overflow-hidden group border border-slate-100 shadow-sm">
                        <img src={img} className="w-full h-full object-cover" alt="" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                      </div>
                    ))}
                  </div>
                </div>
                <input type="url" className="input-admin" placeholder="Video URL" value={formData.video_url || ''} onChange={e => setFormData({ ...formData, video_url: e.target.value })} />
              </div>
              <div className="space-y-4">
                <input required className="input-admin" placeholder="Título" value={formData.titulo || ''} onChange={e => setFormData({ ...formData, titulo: e.target.value })} />
                <input required className="input-admin" placeholder="Ubicación" value={formData.ubicacion || ''} onChange={e => setFormData({ ...formData, ubicacion: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" className="input-admin" placeholder="Precio Base" value={activeTab === 'sales' ? formData.precio_cop : formData.precio_temporada_baja} onChange={e => activeTab === 'sales' ? setFormData({ ...formData, precio_cop: e.target.value }) : setFormData({ ...formData, precio_temporada_baja: e.target.value })} />
                  <input type="number" className="input-admin" placeholder="Habitaciones" value={formData.habitaciones || ''} onChange={e => setFormData({ ...formData, habitaciones: e.target.value })} />
                </div>
                <textarea className="input-admin min-h-[100px] pt-3" placeholder="Descripción..." value={formData.descripcion || ''} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="w-full mt-10 py-5 bg-[#0f172a] text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-xl uppercase tracking-widest text-sm active:scale-95">
              {editingId ? "Actualizar Registro" : "Publicar"}
            </button>
          </form>
        </div>
      )}

      <style>{`
        .input-admin { padding: 0.8rem 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; font-weight: 500; outline: none; width: 100%; transition: all 0.3s; font-size: 14px; color: #1e293b; }
        .input-admin:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
      `}</style>
    </div>
  );
};

export default AdminPanel;