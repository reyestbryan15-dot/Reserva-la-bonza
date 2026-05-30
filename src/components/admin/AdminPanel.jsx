import React, { useState, useEffect } from 'react';
import { supabase } from '../../../backend/supabaseClient';
import SidebarPC from './sidebar-pc';
import SidebarMovil from './sidebar-movil';
import InventoryAlquiler from './inventory-alquiler';
import InventoryVentas from './inventory-ventas';
import InventoryReservas from './inventory-reservas';

// IMPORTAMOS TUS DOS COMPONENTES DE TOURS INDEPENDIENTES
import ToursDesktop from '../../components/admin/ToursDesktop';
import ToursMovil from '../../components/admin/ToursMobile';

// IMPORTAMOS AMBOS COMPONENTES DE CALENDARIO
import BookingCalendar from './BookingCalendar';
import BookingCalendarMovil from './BookingCalendarMovil';

// ICONOS PARA LOS MODALES DE TOURS
import { Plus, X, Check, Search, AlertTriangle, Upload, Image as ImageIcon } from 'lucide-react';

const AdminPanel = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('alquiler');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // Estado de carga de fotos
  const [data, setData] = useState({ alquiler: [], ventas: [], reservas: [] });

  // ESTADOS PROPIOS PARA LA GESTION DE TOURS
  const [tours, setTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  // Lista de URLs reales (oculta en el backend) y previsualizacion
  const [imagenesUrls, setImagenesUrls] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '', ubicacion: '', precio: '', duracion: '', tipo_servicio: '', beneficiosInput: '', activo: true
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: alq } = await supabase.from('alojamientos').select('*');
      const { data: vnt } = await supabase.from('ventas_propiedades').select('*');
      const { data: res } = await supabase.from('reservas').select('*').order('created_at', { ascending: false });
      const { data: trs } = await supabase.from('tours').select('*').order('created_at', { ascending: false });

      setData({
        alquiler: alq || [],
        ventas: vnt || [],
        reservas: res || []
      });

      setTours(trs || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // FUNCIONES DE CONTROL PARA CREAR, EDITAR Y ELIMINAR TOURS
  const handleCreateOpen = () => {
    setSelectedTour(null);
    setImagenesUrls([]); // Inicia vacio de imagenes
    setFormData({ titulo: '', ubicacion: '', precio: '', duracion: '', tipo_servicio: '', beneficiosInput: '', activo: true });
    setIsFormOpen(true);
  };

  const handleEditOpen = (tour) => {
    if (!tour) return;
    setSelectedTour(tour);
    setImagenesUrls(Array.isArray(tour.imagenes) ? tour.imagenes : []); // Guardamos las URLs sin mostrarlas en inputs
    setFormData({
      titulo: tour.titulo || '',
      ubicacion: tour.ubicacion || '',
      precio: tour.precio || '',
      duracion: tour.duracion || '',
      tipo_servicio: tour.tipo_servicio || '',
      beneficiosInput: Array.isArray(tour.beneficios) ? tour.beneficios.join(', ') : '',
      activo: tour.activo !== undefined ? tour.activo : true
    });
    setIsFormOpen(true);
  };

  // 🌟 SUBIDA AUTOMATICA AL STORAGE DE SUPABASE
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const nuevasUrls = [...imagenesUrls];

    for (const file of files) {
      try {
        // Creamos un nombre único para el archivo basado en el tiempo exacto
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `tours/${fileName}`;

        // 1. Subir el binario al bucket llamado 'tours'
        const { error: uploadError } = await supabase.storage
          .from('tours') // ⚠️ Asegúrate de tener un Bucket creado público en Supabase con este nombre
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Obtener la URL publica generada por el Storage
        const { data: publicUrlData } = supabase.storage
          .from('tours')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          nuevasUrls.push(publicUrlData.publicUrl);
        }
      } catch (error) {
        alert('Error al subir imagen: ' + error.message);
      }
    }

    setImagenesUrls(nuevasUrls);
    setUploading(false);
  };

  // Quitar una foto de la lista de previsualizacion antes de guardar
  const handleRemoveImage = (indexToRemove) => {
    setImagenesUrls(imagenesUrls.filter((_, index) => index !== indexToRemove));
  };

  const handleDeleteOpen = (tour) => {
    setSelectedTour(tour);
    setIsDeleteOpen(true);
  };

  const handleSaveTour = async (e) => {
    e.preventDefault();
    const beneficiosArray = formData.beneficiosInput ? formData.beneficiosInput.split(',').map(i => i.trim()).filter(i => i !== '') : [];

    const payload = {
      titulo: formData.titulo,
      ubicacion: formData.ubicacion,
      precio: parseFloat(formData.precio) || 0,
      duracion: formData.duracion,
      tipo_servicio: formData.tipo_servicio,
      beneficios: beneficiosArray,
      imagenes: imagenesUrls, // 🌟 Se inyecta la coleccion de URLs limpias creadas desde el Storage
      activo: formData.activo
    };

    try {
      const { error } = selectedTour
        ? await supabase.from('tours').update(payload).eq('id', selectedTour.id)
        : await supabase.from('tours').insert([payload]);
      if (error) throw error;
      setIsFormOpen(false);
      fetchData();
    } catch (error) {
      alert('Error guardando tour: ' + error.message);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const { error } = await supabase.from('tours').delete().eq('id', selectedTour.id);
      if (error) throw error;
      setIsDeleteOpen(false);
      fetchData();
    } catch (error) {
      alert('Error eliminando tour: ' + error.message);
    }
  };

  const filteredTours = tours.filter(t => {
    if (!t) return false;
    const target = searchTerm.toLowerCase();
    return (t.titulo || '').toLowerCase().includes(target) || (t.ubicacion || '').toLowerCase().includes(target);
  });

  const formatPrice = (p) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p || 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans">
      <SidebarPC activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
        <div className="p-4 md:p-10">
          {activeTab === 'alquiler' && <InventoryAlquiler items={data.alquiler} refresh={fetchData} loading={loading} />}
          {activeTab === 'ventas' && <InventoryVentas items={data.ventas} refresh={fetchData} loading={loading} />}
          {activeTab === 'reservas' && <InventoryReservas items={data.reservas} refresh={fetchData} loading={loading} />}

          {activeTab === 'tours' && (
            <div className="animate-in fade-in duration-500 w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-indigo-950">Panel de Tours</h1>
                  <p className="text-xs md:text-sm text-gray-500">Mantenimiento rapido de productos comerciales</p>
                </div>
                <button onClick={handleCreateOpen} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-2xl text-sm shadow-md">
                  <Plus size={18} /> Nuevo Tour
                </button>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input type="text" placeholder="Buscar por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-gray-200 text-sm focus:outline-none shadow-sm" />
              </div>

              {loading ? (
                <div className="text-center py-20 text-indigo-900 font-bold animate-pulse">Sincronizando...</div>
              ) : (
                <>
                  <div className="hidden md:block">
                    <ToursDesktop tours={filteredTours} onEdit={handleEditOpen} onDelete={handleDeleteOpen} formatPrice={formatPrice} />
                  </div>
                  <div className="md:hidden">
                    <ToursMovil tours={filteredTours} onEdit={handleEditOpen} onDelete={handleDeleteOpen} formatPrice={formatPrice} />
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'calendario' && (
            <div className="animate-in fade-in duration-500">
              <div className="hidden md:block">
                <BookingCalendar alojamientos={data.alquiler} reservas={data.reservas} loading={loading} />
              </div>
              <div className="md:hidden">
                <BookingCalendarMovil alojamientos={data.alquiler} reservas={data.reservas} loading={loading} />
              </div>
            </div>
          )}
        </div>
      </main>

      <SidebarMovil activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      {/* MODAL: CREAR / EDICION DE TOURS */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-indigo-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-black text-indigo-950">{selectedTour ? 'Editar Tour' : 'Crear Tour'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="p-1.5 rounded-xl text-gray-400"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveTour} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Titulo</label>
                  <input type="text" required value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} className="w-full px-4 py-2 rounded-xl border text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Ubicacion</label>
                  <input type="text" required value={formData.ubicacion} onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })} className="w-full px-4 py-2 rounded-xl border text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Precio (COP)</label>
                  <input type="number" required value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })} className="w-full px-4 py-2 rounded-xl border text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Duracion</label>
                  <input type="text" required value={formData.duracion} onChange={(e) => setFormData({ ...formData, duracion: e.target.value })} className="w-full px-4 py-2 rounded-xl border text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Tipo de Servicio</label>
                  <input type="text" required value={formData.tipo_servicio} onChange={(e) => setFormData({ ...formData, tipo_servicio: e.target.value })} className="w-full px-4 py-2 rounded-xl border text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Beneficios (Separados por coma)</label>
                  <textarea value={formData.beneficiosInput} onChange={(e) => setFormData({ ...formData, beneficiosInput: e.target.value })} rows="2" className="w-full px-4 py-2 rounded-xl border text-sm"></textarea>
                </div>

                {/* 🌟 SECCIÓN REDISEÑADA Y SEGURA: SUBIDA DE IMÁGENES AL STORAGE */}
                <div className="md:col-span-2 border-t pt-2 border-gray-100">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Fotos del Producto</label>

                  {/* Grid de previsualización estética */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                    {imagenesUrls.map((url, idx) => (
                      <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border bg-gray-50 group shadow-sm">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition-all opacity-90 sm:opacity-0 group-hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    {/* Botón de carga interactivo */}
                    <label className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer aspect-[4/3] p-2 transition-all ${uploading ? 'bg-slate-50 border-indigo-300 animate-pulse' : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30'}`}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={uploading}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      {uploading ? (
                        <span className="text-[10px] text-indigo-600 font-bold">Subiendo...</span>
                      ) : (
                        <>
                          <Upload size={16} className="text-gray-400 mb-1" />
                          <span className="text-[11px] font-bold text-gray-500 text-center">Subir foto</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="activo" checked={formData.activo} onChange={(e) => setFormData({ ...formData, activo: e.target.checked })} />
                  <label htmlFor="activo" className="text-sm font-semibold text-gray-700">Tour Activo</label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 rounded-xl text-sm bg-gray-100 font-bold">Cancelar</button>
                <button type="submit" disabled={uploading} className="px-5 py-2.5 rounded-xl text-sm bg-indigo-600 text-white font-bold flex items-center gap-1 disabled:opacity-50"><Check size={16} /> Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BORRADO CONFIRMADO */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 bg-indigo-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-md text-center">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={28} /></div>
            <h3 className="text-lg font-black text-gray-950 mb-1">¿Eliminar definitivo?</h3>
            <p className="text-xs text-gray-500 mb-6">El tour desaparecerra del sistema.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 rounded-xl text-sm bg-gray-100 text-gray-600 font-bold">Cancelar</button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 rounded-xl text-sm bg-red-600 text-white font-bold">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;