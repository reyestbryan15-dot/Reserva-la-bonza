import React, { useState } from 'react';
import { supabase } from '../../../backend/supabaseClient';
import { Plus, Edit, MapPin, Trash2, X, Upload, Loader2, Play, Home, Ruler, Droplets, Layers } from 'lucide-react';

const InventoryVentas = ({ items, refresh, loading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Estado inicial con TODAS tus columnas de Supabase
    const initialForm = {
        titulo: '', ubicacion: '', precio_cop: '', precio_usd: '',
        metros_cuadrados: '', habitaciones: '', banos: '', estrato: '',
        tipo: 'Venta', detalles: '', imagenes: [], video_url: '',
        precio_min: '', precio_max: '', descripcion: ''
    };

    const [formData, setFormData] = useState(initialForm);

    // FUNCIÓN DE LIMPIEZA DINÁMICA: Convierte strings a números o null si están vacíos
    const cleanDataForSQL = (data) => {
        const cleaned = { ...data };
        const numericFields = ['precio_cop', 'precio_usd', 'metros_cuadrados', 'habitaciones', 'banos', 'estrato', 'precio_min', 'precio_max'];

        numericFields.forEach(field => {
            if (cleaned[field] === '' || cleaned[field] === undefined) {
                cleaned[field] = null;
            } else {
                cleaned[field] = Number(cleaned[field]);
            }
        });
        return cleaned;
    };

    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const files = Array.from(e.target.files);
            const uploadPromises = files.map(async (file) => {
                const fileName = `${Date.now()}-${file.name}`;
                const { error: uploadError } = await supabase.storage.from('hoteles').upload(`ventas/${fileName}`, file);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('hoteles').getPublicUrl(`ventas/${fileName}`);
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
        const payload = cleanDataForSQL(formData);

        const { error } = await supabase
            .from('ventas_propiedades')
            .upsert([{
                ...(editingId ? { id: editingId } : {}),
                ...payload
            }]);

        if (!error) {
            setIsModalOpen(false);
            refresh();
            alert("Guardado exitosamente");
        } else {
            alert("Error de validación: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Eliminar propiedad permanentemente?")) {
            const { error } = await supabase.from('ventas_propiedades').delete().eq('id', id);
            if (!error) refresh();
        }
    };

    const formatCOP = (val) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val || 0);
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
                <div>
                    <h2 className="text-3xl font-black uppercase text-slate-900 tracking-tight italic">Ventas</h2>
                    <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest">Gestión de propiedades en venta</p>
                </div>
                <button
                    onClick={() => { setFormData(initialForm); setEditingId(null); setIsModalOpen(true); }}
                    className="w-full md:w-auto bg-[#0f172a] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl uppercase tracking-wider text-xs"
                >
                    <Plus size={20} /> Añadir Propiedad
                </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map(item => (
                    <div key={item.id} className="group bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">
                        <div className="h-56 bg-slate-100 relative overflow-hidden">
                            <img src={item.imagenes?.[0] || ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/20">Estrato {item.estrato || 'N/A'}</div>
                        </div>
                        <div className="p-6">
                            <h4 className="font-bold text-slate-800 text-lg truncate group-hover:text-blue-600 transition-colors">{item.titulo}</h4>
                            <div className="flex items-center gap-1.5 mt-2 text-slate-500 mb-6">
                                <MapPin size={14} className="text-blue-500" />
                                <span className="text-xs font-medium truncate">{item.ubicacion}</span>
                            </div>
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[9px] uppercase text-slate-400 font-black">Precio Venta</span>
                                    <span className="font-black text-slate-900 text-lg tracking-tight">{formatCOP(item.precio_cop)}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setFormData(item); setEditingId(item.id); setIsModalOpen(true); }} className="p-2.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 transition-all shadow-sm"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                    <form onSubmit={saveEntry} className="bg-white p-6 md:p-10 rounded-xl w-full max-w-5xl shadow-2xl max-h-[90vh] overflow-y-auto relative">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-red-50 text-slate-500 rounded-full transition-all"><X size={20} /></button>

                        <h3 className="font-black text-2xl mb-8 uppercase text-slate-900 border-b pb-4">
                            {editingId ? "Editar Propiedad" : "Nueva Propiedad de Venta"}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* COLUMNA 1: Multimedia */}
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block tracking-widest">Galería de Imágenes</label>
                                    <div className="grid grid-cols-2 gap-3">
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
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase">URL del Video (YouTube/Vimeo)</label>
                                    <input type="url" className="input-admin" placeholder="https://..." value={formData.video_url || ''} onChange={e => setFormData({ ...formData, video_url: e.target.value })} />
                                </div>
                            </div>

                            {/* COLUMNA 2: Info Básica y Precios */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase">Información General</label>
                                <input required className="input-admin" placeholder="Título de la propiedad" value={formData.titulo || ''} onChange={e => setFormData({ ...formData, titulo: e.target.value })} />
                                <input required className="input-admin" placeholder="Ubicación (Barrio/Ciudad)" value={formData.ubicacion || ''} onChange={e => setFormData({ ...formData, ubicacion: e.target.value })} />

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Precio COP</span>
                                        <input type="number" className="input-admin" value={formData.precio_cop || ''} onChange={e => setFormData({ ...formData, precio_cop: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Precio USD</span>
                                        <input type="number" className="input-admin" value={formData.precio_usd || ''} onChange={e => setFormData({ ...formData, precio_usd: e.target.value })} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Rango Min</span>
                                        <input type="number" className="input-admin" value={formData.precio_min || ''} onChange={e => setFormData({ ...formData, precio_min: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Rango Max</span>
                                        <input type="number" className="input-admin" value={formData.precio_max || ''} onChange={e => setFormData({ ...formData, precio_max: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            {/* COLUMNA 3: Detalles Técnicos */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase">Detalles de la Estructura</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="number" className="input-admin" placeholder="Habitaciones" value={formData.habitaciones || ''} onChange={e => setFormData({ ...formData, habitaciones: e.target.value })} />
                                    <input type="number" className="input-admin" placeholder="Baños" value={formData.banos || ''} onChange={e => setFormData({ ...formData, banos: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="number" className="input-admin" placeholder="Área (m2)" value={formData.metros_cuadrados || ''} onChange={e => setFormData({ ...formData, metros_cuadrados: e.target.value })} />
                                    <input type="number" className="input-admin" placeholder="Estrato" value={formData.estrato || ''} onChange={e => setFormData({ ...formData, estrato: e.target.value })} />
                                </div>
                                <textarea className="input-admin min-h-[120px] pt-3" placeholder="Descripción detallada de la propiedad..." value={formData.descripcion || ''} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} />
                            </div>
                        </div>

                        <button type="submit" className="w-full mt-10 py-5 bg-[#0f172a] text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-xl uppercase tracking-widest text-sm active:scale-95">
                            {editingId ? "Actualizar Propiedad" : "Publicar en Inventario de Ventas"}
                        </button>
                    </form>
                </div>
            )}
            <style>{`.input-admin { padding: 0.8rem 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; font-weight: 500; outline: none; width: 100%; transition: all 0.3s; font-size: 14px; color: #1e293b; } .input-admin:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }`}</style>
        </>
    );
};

export default InventoryVentas;