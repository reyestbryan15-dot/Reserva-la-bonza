import React, { useState } from 'react';
import { supabase } from '../../../backend/supabaseClient';
import { Calendar, Plus, X, Check, Trash2 } from 'lucide-react';

const InventoryBloqueos = ({ items, alojamientos, refresh, loading }) => {
    const [isBlockFormOpen, setIsBlockFormOpen] = useState(false);
    const [blockFormData, setBlockFormData] = useState({
        alojamientos: '', fecha_llegada: '', fecha_salida: '', plataforma: 'Airbnb', notas: ''
    });

    const handleOpenBlockForm = () => {
        setBlockFormData({
            alojamientos: alojamientos[0]?.id || '',
            fecha_llegada: '',
            fecha_salida: '',
            plataforma: 'Airbnb',
            notas: ''
        });
        setIsBlockFormOpen(true);
    };

    const handleSaveBlock = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('bloqueos_admin')
                .insert([
                    {
                        alojamientos: blockFormData.alojamientos, // 🌟 Columna actualizada a 'alojamientos'
                        fecha_llegada: blockFormData.fecha_llegada,
                        fecha_salida: blockFormData.fecha_salida,
                        plataforma: blockFormData.plataforma,
                        notas: blockFormData.notas
                    }
                ])
                .select();

            if (error) throw error;
            setIsBlockFormOpen(false);
            refresh();
        } catch (error) {
            alert('Error al guardar el bloqueo: ' + error.message);
        }
    };

    const handleDeleteBlock = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este bloqueo de fechas?')) return;
        try {
            const { error } = await supabase.from('bloqueos_admin').delete().eq('id', id);
            if (error) throw error;
            refresh();
        } catch (error) {
            alert('Error al eliminar bloqueo: ' + error.message);
        }
    };

    return (
        <div className="animate-in fade-in duration-500 w-full">
            {/* Encabezado */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-indigo-950">Bloqueo de Fechas</h1>
                    <p className="text-xs md:text-sm text-gray-500">Sincroniza y bloquea manualmente los días vendidos en Airbnb o Booking</p>
                </div>
                <button onClick={handleOpenBlockForm} className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-5 rounded-2xl text-sm shadow-md transition-all">
                    <Calendar size={18} /> Bloquear Fechas
                </button>
            </div>

            {/* Tabla de datos */}
            {loading ? (
                <div className="text-center py-20 text-indigo-900 font-bold animate-pulse">Sincronizando bloqueos...</div>
            ) : items.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-dashed border-gray-200 text-center text-gray-400 font-semibold">
                    No hay fechas bloqueadas manualmente en este momento.
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase border-b">
                                <th className="p-4">Alojamientos</th>
                                <th className="p-4">Plataforma</th>
                                <th className="p-4">Llegada</th>
                                <th className="p-4">Salida</th>
                                <th className="p-4">Notas</th>
                                <th className="p-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y text-gray-700">
                            {items.map((bloqueo) => (
                                <tr key={bloqueo.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 font-bold text-indigo-950">{bloqueo.alojamientos?.titulo || 'Alojamientos Desconocido'}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-black ${bloqueo.plataforma === 'Airbnb' ? 'bg-orange-50 text-orange-600' : bloqueo.plataforma === 'Booking' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {bloqueo.plataforma}
                                        </span>
                                    </td>
                                    <td className="p-4 font-semibold">{bloqueo.fecha_llegada}</td>
                                    <td className="p-4 font-semibold">{bloqueo.fecha_salida}</td>
                                    <td className="p-4 text-xs text-gray-400 italic max-w-xs truncate">{bloqueo.notas || 'Sin notas'}</td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => handleDeleteBlock(bloqueo.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-xl transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL FORMULARIO */}
            {isBlockFormOpen && (
                <div className="fixed inset-0 z-50 bg-indigo-950/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-black text-indigo-950">Bloquear Fechas</h2>
                            <button onClick={() => setIsBlockFormOpen(false)} className="p-1.5 rounded-xl text-gray-400"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSaveBlock} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Seleccionar Alojamientos</label>
                                <select required value={blockFormData.alojamientos} onChange={(e) => setBlockFormData({ ...blockFormData, alojamientos: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-sm bg-white font-medium text-gray-800">
                                    {alojamientos.map((item) => (
                                        <option key={item.id} value={item.id}>{item.titulo}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Origen / Plataforma</label>
                                <select value={blockFormData.plataforma} onChange={(e) => setBlockFormData({ ...blockFormData, plataforma: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-sm bg-white font-medium text-gray-800">
                                    <option value="Airbnb">Airbnb</option>
                                    <option value="Booking">Booking</option>
                                    <option value="Manual">Otro / Bloqueo Manual</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Fecha Llegada</label>
                                    <input type="date" required value={blockFormData.fecha_llegada} onChange={(e) => setBlockFormData({ ...blockFormData, fecha_llegada: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-sm font-semibold text-gray-700" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Fecha Salida</label>
                                    <input type="date" required value={blockFormData.fecha_salida} onChange={(e) => setBlockFormData({ ...blockFormData, fecha_salida: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-sm font-semibold text-gray-700" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Notas / Motivo (Opcional)</label>
                                <textarea value={blockFormData.notas} onChange={(e) => setBlockFormData({ ...blockFormData, notas: e.target.value })} rows="2" placeholder="Ej: Reserva de John Doe en Airbnb" className="w-full px-4 py-2 rounded-xl border text-sm placeholder:text-gray-300"></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsBlockFormOpen(false)} className="px-5 py-2.5 rounded-xl text-sm bg-gray-100 font-bold">Cancelar</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl text-sm bg-rose-600 text-white font-bold flex items-center gap-1 hover:bg-rose-700 transition-colors"><Check size={16} /> Aplicar Bloqueo</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryBloqueos;