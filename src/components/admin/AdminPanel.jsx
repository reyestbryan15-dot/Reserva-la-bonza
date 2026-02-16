import React, { useState, useEffect } from 'react';
import { supabase } from '../../../backend/supabaseClient'; 
import { 
  LayoutDashboard, LogOut, User, Home, 
  Plus, Edit, Trash2, Save, X, AlertCircle, Star, MapPin, Upload, Loader2
} from 'lucide-react';

const AdminPanel = ({ session, onLogout }) => {
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // NUEVO: Estado para subida de fotos
  const [editingProp, setEditingProp] = useState(null);
  const [isCreating, setIsCreating] = useState(false); 
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('alojamientos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      setErrorMsg("Error al cargar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  // --- NUEVA FUNCIÓN: SUBIDA DE 5 IMÁGENES AL STORAGE ---
  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      alert("Solo puedes seleccionar un máximo de 5 imágenes.");
      return;
    }

    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `hoteles/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('hoteles') 
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('hoteles')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        alert("Error subiendo una imagen: " + error.message);
      }
    }

    setEditingProp({ ...editingProp, galeria: uploadedUrls });
    setUploading(false);
  };

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingProp({
      titulo: '',
      descripcion: '',
      ubicacion: '',
      tipo: 'Apartamento',
      precio_noche: 0,
      calificacion: 5,
      galeria: [] 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return; // Evitar guardar mientras se suben fotos

    try {
      const payload = {
        titulo: editingProp.titulo,
        descripcion: editingProp.descripcion,
        ubicacion: editingProp.ubicacion,
        tipo: editingProp.tipo,
        precio_noche: parseFloat(editingProp.precio_noche),
        calificacion: parseFloat(editingProp.calificacion),
        galeria: Array.isArray(editingProp.galeria) ? editingProp.galeria : [editingProp.galeria]
      };

      let error;
      if (isCreating) {
        const { error: insertError } = await supabase.from('alojamientos').insert([payload]);
        error = insertError;
      } else {
        const { error: updateError } = await supabase.from('alojamientos').update(payload).eq('id', editingProp.id);
        error = updateError;
      }

      if (error) throw error;
      
      alert(isCreating ? "¡Creado con éxito!" : "¡Actualizado con éxito!");
      setEditingProp(null);
      setIsCreating(false);
      fetchProperties();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este alojamiento?")) {
      await supabase.from('alojamientos').delete().eq('id', id);
      fetchProperties();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden">
      {/* SIDEBAR (Diseño original) */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-blue-900 text-white p-2 rounded-xl"><LayoutDashboard size={24} /></div>
          <span className="font-black text-xl text-slate-900 tracking-tighter">BONANZA</span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => setActiveTab('properties')} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold bg-blue-50 text-blue-900">
            <Home size={20} /> Mis Alojamientos
          </button>
        </nav>
        <div className="p-6"><button onClick={onLogout} className="flex items-center gap-3 w-full px-5 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition font-bold"><LogOut size={20} /> Salir</button></div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-10 py-5 flex justify-between items-center shadow-sm">
          <h2 className="text-xl font-black text-slate-800">Panel de Socios</h2>
          <div className="text-right"><p className="text-sm font-bold text-slate-900">{session.user.email}</p></div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Inventario</h3>
              <button onClick={handleOpenCreate} className="bg-blue-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-800 transition shadow-lg shadow-blue-200">
                <Plus size={20} /> Nuevo Alojamiento
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20 font-black text-slate-300 animate-pulse tracking-widest text-xs uppercase">Cargando...</div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {properties.map(item => (
                  <div key={item.id} className="bg-white border border-slate-100 rounded-[2rem] p-5 flex items-center gap-6 hover:shadow-xl transition-all group">
                    <div className="w-44 h-32 bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
                      <img src={Array.isArray(item.galeria) ? item.galeria[0] : item.galeria} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-900 text-xl leading-tight">{item.titulo}</h4>
                      <p className="text-sm text-slate-400 font-bold flex items-center gap-1 mt-1 uppercase"><MapPin size={14} className="text-blue-400"/> {item.ubicacion}</p>
                      <div className="mt-2 text-blue-900 font-black text-2xl tracking-tighter">${item.precio_noche}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setIsCreating(false); setEditingProp(item); }} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-blue-900 transition"><Edit size={22} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-red-600 transition"><Trash2 size={22} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL CON MEJORA DE IMÁGENES */}
      {editingProp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-12 shadow-2xl relative">
            <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase italic tracking-tighter">
              {isCreating ? "Registrar Nuevo Alojamiento" : "Editar Alojamiento"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* AREA DE SUBIDA DE IMÁGENES (NUEVA MEJORA) */}
              <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 px-1">Galería (Máximo 5 fotos)</label>
                
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {editingProp.galeria?.slice(0, 5).map((url, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                      <img src={url} className="w-full h-full object-cover" alt="Vista previa" />
                    </div>
                  ))}
                </div>

                <label className="flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-all p-4 rounded-2xl border border-transparent hover:border-slate-200">
                  {uploading ? (
                    <Loader2 className="animate-spin text-blue-900" size={32} />
                  ) : (
                    <Upload className="text-slate-400" size={32} />
                  )}
                  <span className="text-sm font-bold text-slate-500 mt-2">
                    {uploading ? "Subiendo archivos..." : "Click para subir 5 imágenes"}
                  </span>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImagesUpload} 
                    disabled={uploading} 
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Título</label>
                  <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 ring-blue-500/10"
                    value={editingProp.titulo} onChange={e => setEditingProp({...editingProp, titulo: e.target.value})} required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Precio</label>
                  <input type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                    value={editingProp.precio_noche} onChange={e => setEditingProp({...editingProp, precio_noche: e.target.value})} required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Ubicación</label>
                  <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                    value={editingProp.ubicacion} onChange={e => setEditingProp({...editingProp, ubicacion: e.target.value})} required />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Descripción</label>
                  <textarea rows="4" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 outline-none font-medium"
                    value={editingProp.descripcion} onChange={e => setEditingProp({...editingProp, descripcion: e.target.value})} required />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="flex-[2] bg-blue-900 text-white font-black py-5 rounded-[1.5rem] hover:bg-blue-800 transition shadow-xl shadow-blue-100 disabled:opacity-50"
                >
                  {isCreating ? "CREAR AHORA" : "GUARDAR CAMBIOS"}
                </button>
                <button type="button" onClick={() => setEditingProp(null)} className="flex-1 bg-slate-100 text-slate-500 font-black py-5 rounded-[1.5rem]">
                  CANCELAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;