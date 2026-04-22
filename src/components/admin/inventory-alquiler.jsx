import React, { useState } from 'react';
import { supabase } from '../../../backend/supabaseClient';
import {
    Plus, Edit, MapPin, Trash2, X, Upload, Loader2, Play,
    Users, Info, Dog, Star, DollarSign
} from 'lucide-react';

const InventoryAlquiler = ({ items, refresh, loading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Estado inicial alineado con tus columnas de Supabase
    const initialForm = {
        titulo: '', ubicacion: '', descripcion: '', tipo: 'Alquiler',
        max_adultos: '', max_ninos: '', admite_mascotas: false, calificacion: 5,
        precio_temporada_baja: '', precio_alta: '', precio_media: '',
        precio_festivo: '', precio_semana_santa: '', precio_semana_uribe: '',
        costo_aseo: '', costo_manilla: '',
        video_url: '', galeria: [], amenities: ''
    };

    const [formData, setFormData] = useState(initialForm);

    // LIMPIEZA DINÁMICA: Asegura que los números sean Number o null
    const cleanDataForSQL = (data) => {
        const cleaned = { ...data };
        const numericFields = [
            'max_adultos', 'max_ninos', 'calificacion', 'precio_media',
            'precio_alta', 'costo_aseo', 'costo_manilla', 'precio_festivo',
            'precio_semana_santa', 'precio_temporada_baja', 'precio_semana_uribe'
        ];

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
                const { error: uploadError } = await supabase.storage.from('hoteles').upload(`alquiler/${fileName}`, file);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('hoteles').getPublicUrl(`alquiler/${fileName}`);
                return data.publicUrl;
            });
            const urls = await Promise.all(uploadPromises);
            setFormData(prev => ({ ...prev, galeria: [...(prev.galeria || []), ...urls] }));
        } catch (error) {
            alert("Error subiendo imagen: " + error.message);
        } finally { setUploading(false); }
    };

    const removeImage = (index) => {
        setFormData(prev => ({ ...prev, galeria: prev.galeria.filter((_, i) => i !== index) }));
    };

    const saveEntry = async (e) => {
        e.preventDefault();
        const payload = cleanDataForSQL(formData);

        const { error } = await supabase
            .from('alojamientos')
            .upsert([{
                ...(editingId ? { id: editingId } : {}),
                ...payload
            }]);

        if (!error) {
            setIsModalOpen(false);
            refresh();
            alert("Alquiler actualizado exitosamente");
        } else {
            alert("Error en base de datos: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Eliminar este alojamiento permanentemente?")) {
            const { error } = await supabase.from('alojamientos').delete().eq('id', id);
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
                    <h2 className="text-3xl font-black uppercase text-slate-900 tracking-tight italic">Alquileres</h2>
                    <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest">Gestión de rentas cortas y tarifas</p>
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
                            <img src={item.galeria?.[0] || ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/20 flex items-center gap-1">
                                <Star size={10} className="text-amber-500 fill-amber-500" /> {item.calificacion || 5}
                            </div>
                        </div>
                        <div className="p-6">
                            <h4 className="font-bold text-slate-800 text-lg truncate group-hover:text-blue-600 transition-colors">{item.titulo}</h4>
                            <div className="flex items-center gap-1.5 mt-2 text-slate-500 mb-6">
                                <MapPin size={14} className="text-blue-500" />
                                <span className="text-xs font-medium truncate">{item.ubicacion}</span>
                            </div>
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[9px] uppercase text-slate-400 font-black">Noche Baja</span>
                                    <span className="font-black text-slate-900 text-lg tracking-tight">{formatCOP(item.precio_temporada_baja)}</span>
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
                    <form onSubmit={saveEntry} className="bg-white p-6 md:p-10 rounded-xl w-full max-w-6xl shadow-2xl max-h-[90vh] overflow-y-auto relative">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-red-50 text-slate-500 rounded-full transition-all"><X size={20} /></button>

                        <h3 className="font-black text-2xl mb-8 uppercase text-slate-900 border-b pb-4">
                            {editingId ? "Editar Alquiler" : "Nuevo Registro de Alquiler"}
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* COL 1: MEDIA Y CAPACIDAD */}
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block tracking-widest">Galería (galeria)</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="border-2 border-dashed border-slate-200 rounded-xl h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-all group">
                                            {uploading ? <Loader2 className="animate-spin text-blue-600" /> : <Upload size={24} className="text-slate-400 group-hover:text-blue-600" />}
                                            <input type="file" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                        </label>
                                        {formData.galeria?.map((img, i) => (
                                            <div key={i} className="relative h-24 rounded-xl overflow-hidden group border border-slate-100 shadow-sm">
                                                <img src={img} className="w-full h-full object-cover" alt="" />
                                                <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
                                    <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><Users size={14} /> Capacidad y Reglas</span>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="number" className="input-admin" placeholder="Max Adultos" value={formData.max_adultos || ''} onChange={e => setFormData({ ...formData, max_adultos: e.target.value })} />
                                        <input type="number" className="input-admin" placeholder="Max Niños" value={formData.max_ninos || ''} onChange={e => setFormData({ ...formData, max_ninos: e.target.value })} />
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                                        <span className="text-xs font-bold text-slate-600 flex items-center gap-2"><Dog size={16} /> ¿Mascotas?</span>
                                        <input type="checkbox" className="w-5 h-5 accent-blue-600" checked={formData.admite_mascotas} onChange={e => setFormData({ ...formData, admite_mascotas: e.target.checked })} />
                                    </div>
                                    <input type="number" step="0.1" max="5" className="input-admin" placeholder="Calificación (1-5)" value={formData.calificacion || ''} onChange={e => setFormData({ ...formData, calificacion: e.target.value })} />
                                </div>
                            </div>

                            {/* COL 2: TARIFAS (Lo más importante) */}
                            <div className="space-y-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><DollarSign size={14} /> Tarifas por Temporada</span>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-bold text-blue-600 uppercase ml-1">Noche Temp. Baja</span>
                                        <input type="number" className="input-admin" value={formData.precio_temporada_baja || ''} onChange={e => setFormData({ ...formData, precio_temporada_baja: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">Temp. Media</span>
                                            <input type="number" className="input-admin" value={formData.precio_media || ''} onChange={e => setFormData({ ...formData, precio_media: e.target.value })} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">Temp. Alta</span>
                                            <input type="number" className="input-admin" value={formData.precio_alta || ''} onChange={e => setFormData({ ...formData, precio_alta: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">S. Santa</span>
                                            <input type="number" className="input-admin" value={formData.precio_semana_santa || ''} onChange={e => setFormData({ ...formData, precio_semana_santa: e.target.value })} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">S. Uribe</span>
                                            <input type="number" className="input-admin" value={formData.precio_semana_uribe || ''} onChange={e => setFormData({ ...formData, precio_semana_uribe: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 border-t pt-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-bold text-red-500 uppercase ml-1">Costo Aseo</span>
                                            <input type="number" className="input-admin" value={formData.costo_aseo || ''} onChange={e => setFormData({ ...formData, costo_aseo: e.target.value })} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-bold text-red-500 uppercase ml-1">Costo Manilla</span>
                                            <input type="number" className="input-admin" value={formData.costo_manilla || ''} onChange={e => setFormData({ ...formData, costo_manilla: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* COL 3: INFO GENERAL */}
                            <div className="space-y-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><Info size={14} /> Detalles</span>
                                <input required className="input-admin" placeholder="Título" value={formData.titulo || ''} onChange={e => setFormData({ ...formData, titulo: e.target.value })} />
                                <input required className="input-admin" placeholder="Ubicación" value={formData.ubicacion || ''} onChange={e => setFormData({ ...formData, ubicacion: e.target.value })} />
                                <input type="url" className="input-admin" placeholder="URL Video" value={formData.video_url || ''} onChange={e => setFormData({ ...formData, video_url: e.target.value })} />
                                <textarea className="input-admin min-h-[100px] pt-3" placeholder="Descripción corta..." value={formData.descripcion || ''} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} />
                                <textarea className="input-admin min-h-[80px] pt-3" placeholder="Amenities (Wifi, Piscina, Aire...)" value={formData.amenities || ''} onChange={e => setFormData({ ...formData, amenities: e.target.value })} />
                            </div>
                        </div>

                        <button type="submit" className="w-full mt-10 py-5 bg-[#0f172a] text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-xl uppercase tracking-widest text-sm active:scale-95">
                            {editingId ? "Actualizar Inventario" : "Publicar Alquiler"}
                        </button>
                    </form>
                </div>
            )}
            <style>{`.input-admin { padding: 0.8rem 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; font-weight: 500; outline: none; width: 100%; transition: all 0.3s; font-size: 14px; color: #1e293b; } .input-admin:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }`}</style>
        </>
    );
};

export default InventoryAlquiler;