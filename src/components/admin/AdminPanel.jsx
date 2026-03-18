import React, { useState, useEffect } from 'react';
import { supabase } from '../../../backend/supabaseClient';
import { useLanguage } from '../../context/LanguageContext';
import {
  LogOut, Plus, Edit, MapPin, Trash2, LayoutGrid, Tag, Bell,
  X, Upload, Loader2, CheckCircle
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

  // 1. ESTADO INICIAL CON TODAS LAS TEMPORADAS Y COSTOS
  const initialForm = {
    titulo: '', ubicacion: '', tipo: '',
    precio_temporada_baja: '',
    precio_alta: '',
    precio_media: '',
    precio_semana_santa: '',
    precio_semana_uribe: '',
    costo_manilla: '',
    costo_aseo: '',
    precio_cop: '', precio_usd: '',
    metros_cuadrados: '', habitaciones: '', banos: '',
    imagenes: [],
    descripcion: '',
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
      alert(t('adminPanel.error_upload') + error.message);
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
      // Guardamos el valor "corto" (ej: 150)
      payload.precio_temporada_baja = formData.precio_temporada_baja;
      payload.precio_temporada_alta = formData.precio_temporada_alta;
      payload.precio_temporada_media = formData.precio_temporada_media;
      payload.precio_semana_santa = formData.precio_semana_santa;
      payload.precio_semana_uribe = formData.precio_semana_uribe;
      payload.costo_manilla = formData.costo_manilla;
      payload.costo_aseo = formData.costo_aseo;
      payload.galeria = formData.imagenes;
      payload.amenities = formData.amenities;
    }

    const { error } = await supabase.from(table).upsert([{
      ...(editingId ? { id: editingId } : {}),
      ...payload
    }]);

    if (!error) {
      setIsModalOpen(false);
      fetchData();
      alert(t('adminPanel.alert_success'));
    } else {
      alert("Error: " + error.message);
    }
  };

  // Formateador para ver Pesos Colombianos Reales
  const formatCOP = (val) => {
    const num = Number(val) || 0;
    const isSmall = num < 10000; // Si es menor a 10.000, asumimos formato corto
    const finalVal = isSmall ? num * 1000 : num;
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(finalVal);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans pb-20 md:pb-0">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-6 h-screen sticky top-0 hidden md:flex">
        <div className="mb-10 text-center">
          <span className="font-black text-2xl tracking-tighter text-blue-900 italic uppercase">Admin Panel</span>
        </div>
        <nav className="flex flex-col gap-3 flex-1">
          <button onClick={() => setActiveTab('properties')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition ${activeTab === 'properties' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
            <LayoutGrid size={20} /> {t('adminPanel.menu_rentals')}
          </button>
          <button onClick={() => setActiveTab('sales')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition ${activeTab === 'sales' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
            <Tag size={20} /> {t('adminPanel.menu_sales')}
          </button>
          <button onClick={() => setActiveTab('reservations')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition ${activeTab === 'reservations' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
            <Bell size={20} /> {t('adminPanel.menu_reservations')}
          </button>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold p-4 hover:bg-red-50 rounded-2xl transition mt-auto w-full">
          <LogOut size={20} /> {t('adminPanel.logout')}
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 mt-4 md:mt-0">
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase text-slate-800 tracking-tight">
              {activeTab === 'properties' ? t('adminPanel.menu_rentals') : activeTab === 'sales' ? t('adminPanel.menu_sales') : t('adminPanel.menu_reservations')}
            </h2>
          </div>

          {activeTab !== 'reservations' && (
            <button
              onClick={() => { setFormData(initialForm); setEditingId(null); setIsModalOpen(true); }}
              className="w-full md:w-auto bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition shadow-xl"
            >
              <Plus size={20} /> {t('adminPanel.btn_add_new')}
            </button>
          )}
        </header>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : activeTab === 'reservations' ? (
          /* TABLA RESERVAS CON PRECIO REAL */
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-x-auto">
            <table className="w-full border-collapse min-w-[500px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-5 text-left text-xs font-black uppercase text-slate-400">Cliente / Propiedad</th>
                  <th className="p-5 text-center text-xs font-black uppercase text-slate-400">Total Pago</th>
                  <th className="p-5 text-center text-xs font-black uppercase text-slate-400">Estado</th>
                  <th className="p-5 text-center text-xs font-black uppercase text-slate-400">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => (
                  <tr key={res.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                    <td className="p-5">
                      <p className="font-bold text-slate-700">{res.nombre_cliente}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black">{res.propiedad_titulo}</p>
                    </td>
                    <td className="p-5 text-center font-black text-indigo-600">
                      {formatCOP(res.precio_total)}
                    </td>
                    <td className="p-5 text-center">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black ${res.estado === 'confirmada' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        {(res.estado || 'pendiente').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-5 flex justify-center gap-3">
                      <button onClick={async () => { await supabase.from('reservas').update({ estado: 'confirmada' }).eq('id', res.id); fetchData(); }} className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"><CheckCircle size={18} /></button>
                      <button onClick={async () => { if (window.confirm(t('adminPanel.confirm_delete_res'))) { await supabase.from('reservas').delete().eq('id', res.id); fetchData(); } }} className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* GRID DE CARDS CON MULTIPLICACIÓN POR 1000 */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === 'properties' ? properties : sales).map(item => (
              <div key={item.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group">
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  <img src={(item.imagenes?.[0] || item.galeria?.[0]) || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400&h=300&auto=format&fit=crop'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                </div>
                <div className="p-5">
                  <h4 className="font-black text-lg text-slate-800 truncate">{item.titulo}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-4"><MapPin size={12} /> {item.ubicacion}</p>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl">
                    <p className="font-black text-blue-900 text-md">
                      {formatCOP(activeTab === 'properties' ? (item.precio_temporada_baja || item.precio_noche) : item.precio_cop)}
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        setFormData({ ...item, imagenes: item.imagenes || item.galeria || [], descripcion: item.descripcion || '' });
                        setEditingId(item.id);
                        setIsModalOpen(true);
                      }} className="p-2 bg-white text-blue-600 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition"><Edit size={16} /></button>
                      <button onClick={async () => { if (window.confirm(t('adminPanel.confirm_delete_prop'))) { await supabase.from(activeTab === 'sales' ? 'ventas_propiedades' : 'alojamientos').delete().eq('id', item.id); fetchData(); } }} className="p-2 bg-white text-red-500 rounded-lg shadow-sm hover:bg-red-500 hover:text-white transition"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL DE EDICIÓN CON RANGOS DE PRECIO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-2 md:p-4">
          <form onSubmit={saveEntry} className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] w-full max-w-4xl shadow-2xl max-h-[95vh] overflow-y-auto relative">
            <button type="button" onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-red-50 text-slate-500 rounded-full transition"><X size={20} /></button>

            <h3 className="font-black text-xl md:text-2xl mb-6 uppercase tracking-tight pr-10 italic">
              {editingId ? "Actualizar" : "Crear"} {activeTab === 'properties' ? "Alquiler" : "Venta"}
            </h3>

            <div className="space-y-6">
              {/* GALERÍA */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-1">Imágenes de la propiedad</label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                  <label className="border-2 border-dashed border-slate-200 rounded-xl h-20 md:h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition">
                    {uploading ? <Loader2 className="animate-spin text-blue-600" /> : <Upload size={20} className="text-slate-400" />}
                    <input type="file" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                  {formData.imagenes?.map((img, i) => (
                    <div key={i} className="relative h-20 md:h-24 rounded-xl overflow-hidden group border border-slate-100">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center transition"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* FORMULARIO DINÁMICO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <input required className="input-admin" placeholder="Título" value={formData.titulo || ''} onChange={e => setFormData({ ...formData, titulo: e.target.value })} />
                <input required className="input-admin" placeholder="Ubicación" value={formData.ubicacion || ''} onChange={e => setFormData({ ...formData, ubicacion: e.target.value })} />

                {activeTab === 'sales' ? (
                  <>
                    <input type="number" className="input-admin" placeholder="Precio COP (Ej: 450000000)" value={formData.precio_cop || ''} onChange={e => setFormData({ ...formData, precio_cop: e.target.value })} />
                    <input type="number" className="input-admin" placeholder="Precio USD" value={formData.precio_usd || ''} onChange={e => setFormData({ ...formData, precio_usd: e.target.value })} />
                  </>
                ) : (
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-blue-600 uppercase ml-1">Precio Baja (Ej: 150)</label>
                      <input type="number" className="input-admin" placeholder="150" value={formData.precio_temporada_baja || ''} onChange={e => setFormData({ ...formData, precio_temporada_baja: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-red-500 uppercase ml-1">Precio Alta (Dic/Ene)</label>
                      <input type="number" className="input-admin" placeholder="250" value={formData.precio_temporada_alta || ''} onChange={e => setFormData({ ...formData, precio_temporada_alta: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-orange-500 uppercase ml-1">Semana Santa</label>
                      <input type="number" className="input-admin" placeholder="350" value={formData.precio_semana_santa || ''} onChange={e => setFormData({ ...formData, precio_semana_santa: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-indigo-500 uppercase ml-1">Semana Uribe</label>
                      <input type="number" className="input-admin" placeholder="200" value={formData.precio_semana_uribe || ''} onChange={e => setFormData({ ...formData, precio_semana_uribe: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-green-600 uppercase ml-1">Costo Manilla</label>
                      <input type="number" className="input-admin" placeholder="8" value={formData.costo_manilla || ''} onChange={e => setFormData({ ...formData, costo_manilla: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-green-700 uppercase ml-1">Costo Aseo (Final)</label>
                      <input type="number" className="input-admin" placeholder="50" value={formData.costo_aseo || ''} onChange={e => setFormData({ ...formData, costo_aseo: e.target.value })} />
                    </div>
                  </div>
                )}

                <div className="md:col-span-2">
                  <textarea className="input-admin min-h-[100px]" placeholder="Descripción" value={formData.descripcion || ''} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} />
                </div>

                <div className="grid grid-cols-3 gap-2 md:col-span-2">
                  <input type="number" className="input-admin" placeholder="m²" value={formData.metros_cuadrados || ''} onChange={e => setFormData({ ...formData, metros_cuadrados: e.target.value })} />
                  <input type="number" className="input-admin" placeholder="Hab" value={formData.habitaciones || ''} onChange={e => setFormData({ ...formData, habitaciones: e.target.value })} />
                  <input type="number" className="input-admin" placeholder="Baños" value={formData.banos || ''} onChange={e => setFormData({ ...formData, banos: e.target.value })} />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition shadow-2xl">
              {editingId ? "Guardar Cambios" : "Publicar Ahora"}
            </button>
          </form>
        </div>
      )}

      <style>{`
        .input-admin { padding: 0.8rem 1rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 1rem; font-weight: 500; outline: none; width: 100%; transition: all 0.2s; font-size: 14px; }
        .input-admin:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
      `}</style>
    </div>
  );
};

export default AdminPanel;