import React, { useState, useEffect } from 'react';
import { supabase } from '../../../backend/supabaseClient';
import { useLanguage } from '../../context/LanguageContext'; // IMPORTADO
import {
  LogOut, Plus, Edit, MapPin, Trash2, LayoutGrid, Tag, Bell,
  X, Upload, Loader2, CheckCircle
} from 'lucide-react';

const AdminPanel = ({ onLogout }) => {
  const { t } = useLanguage(); // HOOK DE IDIOMA
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
    precio_noche: '',
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
      payload.precio_noche = formData.precio_noche;
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col p-6 h-screen sticky top-0 hidden md:flex">
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

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            localStorage.clear();
            sessionStorage.clear();
            if (onLogout) onLogout();
            else window.location.href = '/';
          }}
          className="flex items-center gap-2 text-red-500 font-bold p-4 hover:bg-red-50 rounded-2xl transition mt-auto w-full"
        >
          <LogOut size={20} /> {t('adminPanel.logout')}
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black uppercase text-slate-800">
            {activeTab === 'properties' ? t('adminPanel.menu_rentals') : activeTab === 'sales' ? t('adminPanel.menu_sales') : t('adminPanel.menu_reservations')}
          </h2>
          {activeTab !== 'reservations' && (
            <button onClick={() => { setFormData(initialForm); setEditingId(null); setIsModalOpen(true); }} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-900 transition shadow-xl">
              <Plus size={20} /> {t('adminPanel.btn_add_new')}
            </button>
          )}
        </header>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : activeTab === 'reservations' ? (
          /* TABLA DE RESERVAS */
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden text-center">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-5 text-xs font-black uppercase text-slate-400">{t('adminPanel.table_client')}</th>
                  <th className="p-5 text-xs font-black uppercase text-slate-400">{t('adminPanel.table_status')}</th>
                  <th className="p-5 text-xs font-black uppercase text-slate-400">{t('adminPanel.table_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => (
                  <tr key={res.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                    <td className="p-5 font-bold text-slate-700">{res.nombre_cliente}</td>
                    <td className="p-5">
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
          /* GRID DE PROPIEDADES */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(activeTab === 'properties' ? properties : sales).map(item => (
              <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="h-52 bg-slate-100 relative">
                  <img src={(item.imagenes?.[0] || item.galeria?.[0]) || 'https://via.placeholder.com/400x300'} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="p-6">
                  <h4 className="font-black text-xl text-slate-800 truncate">{item.titulo}</h4>
                  <p className="text-sm text-slate-400 flex items-center gap-1 mb-6"><MapPin size={14} /> {item.ubicacion}</p>
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                    <p className="font-black text-blue-900 text-lg">
                      ${activeTab === 'properties' ? item.precio_noche?.toLocaleString() : item.precio_cop?.toLocaleString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setFormData({
                            ...item,
                            imagenes: item.imagenes || item.galeria || [],
                            descripcion: item.descripcion || ''
                          });
                          setEditingId(item.id);
                          setIsModalOpen(true);
                        }}
                        className="p-3 bg-white text-blue-600 rounded-xl shadow-sm hover:bg-blue-600 hover:text-white transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button onClick={async () => { if (window.confirm(t('adminPanel.confirm_delete_prop'))) { await supabase.from(activeTab === 'sales' ? 'ventas_propiedades' : 'alojamientos').delete().eq('id', item.id); fetchData(); } }} className="p-3 bg-white text-red-500 rounded-xl shadow-sm hover:bg-red-500 hover:text-white transition"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <form onSubmit={saveEntry} className="bg-white p-8 md:p-12 rounded-[3rem] w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <button type="button" onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 bg-slate-100 hover:bg-red-50 text-slate-500 rounded-full transition"><X size={24} /></button>
            <h3 className="font-black text-2xl mb-8 uppercase tracking-tight">
              {editingId ? t('adminPanel.modal_update') : t('adminPanel.modal_create')} {activeTab === 'properties' ? t('adminPanel.type_rental') : t('adminPanel.type_sale')}
            </h3>

            <div className="space-y-6">
              {/* GALERÍA */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-3 ml-1">{t('adminPanel.label_gallery')}</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <label className="border-2 border-dashed border-slate-200 rounded-2xl h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition">
                    {uploading ? <Loader2 className="animate-spin text-blue-600" /> : <Upload size={20} className="text-slate-400" />}
                    <input type="file" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                  {formData.imagenes?.map((img, i) => (
                    <div key={i} className="relative h-24 rounded-2xl overflow-hidden group border border-slate-100">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* INPUTS DINÁMICOS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required className="input-admin" placeholder={t('adminPanel.ph_title')} value={formData.titulo || ''} onChange={e => setFormData({ ...formData, titulo: e.target.value })} />
                <input required className="input-admin" placeholder={t('adminPanel.ph_location')} value={formData.ubicacion || ''} onChange={e => setFormData({ ...formData, ubicacion: e.target.value })} />

                {activeTab === 'sales' ? (
                  <>
                    <input type="number" className="input-admin" placeholder={t('adminPanel.ph_price_cop')} value={formData.precio_cop || ''} onChange={e => setFormData({ ...formData, precio_cop: e.target.value })} />
                    <input type="number" className="input-admin" placeholder={t('adminPanel.ph_price_usd')} value={formData.precio_usd || ''} onChange={e => setFormData({ ...formData, precio_usd: e.target.value })} />
                  </>
                ) : (
                  <input type="number" className="input-admin" placeholder={t('adminPanel.ph_price_night')} value={formData.precio_noche || ''} onChange={e => setFormData({ ...formData, precio_noche: e.target.value })} />
                )}

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">{t('adminPanel.label_desc')}</label>
                  <textarea
                    className="input-admin min-h-[150px] pt-4"
                    placeholder={t('adminPanel.ph_desc')}
                    value={formData.descripcion || ''}
                    onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2 grid grid-cols-3 gap-4">
                  <input type="number" className="input-admin" placeholder="m²" value={formData.metros_cuadrados || ''} onChange={e => setFormData({ ...formData, metros_cuadrados: e.target.value })} />
                  <input type="number" className="input-admin" placeholder={t('adminPanel.ph_rooms')} value={formData.habitaciones || ''} onChange={e => setFormData({ ...formData, habitaciones: e.target.value })} />
                  <input type="number" className="input-admin" placeholder={t('adminPanel.ph_bathrooms')} value={formData.banos || ''} onChange={e => setFormData({ ...formData, banos: e.target.value })} />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-blue-600 transition shadow-2xl">
              {editingId ? t('adminPanel.btn_save_changes') : t('adminPanel.btn_publish')}
            </button>
          </form>
        </div>
      )}

      <style>{`
        .input-admin { padding: 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 1rem; font-weight: 500; outline: none; width: 100%; transition: all 0.2s; }
        .input-admin:focus { border-color: #2563eb; background: white; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
      `}</style>
    </div>
  );
};

export default AdminPanel;