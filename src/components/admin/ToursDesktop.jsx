import React from 'react';
import { Edit2, Trash2, MapPin, Clock, Users } from 'lucide-react';
import { supabase } from '../../../backend/supabaseClient';

const ToursDesktop = ({ tours, onEdit, onDelete, formatPrice }) => {
    // Funcion de respaldo por si formatPrice no llega bien del padre
    const safeFormatPrice = (price) => {
        if (typeof formatPrice === 'function') return formatPrice(price);
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price || 0);
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="bg-indigo-950 text-white text-sm uppercase font-bold">
                            <th className="p-4">Imagenes</th>
                            <th className="p-4">Titulo</th>
                            <th className="p-4">Ubicacion</th>
                            <th className="p-4">Precio</th>
                            <th className="p-4">Duracion</th>
                            <th className="p-4">Tipo Servicio</th>
                            <th className="p-4">Beneficios</th>
                            <th className="p-4 text-center">Activo</th>
                            <th className="p-4 text-center">Created_at</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                        {tours && tours.length > 0 ? (
                            tours.map((tour) => {
                                if (!tour) return null;

                                // Validar de forma segura si imagenes y beneficio son arrays
                                const listaImagenes = Array.isArray(tour.imagenes) ? tour.imagenes : [];
                                const listaBeneficios = Array.isArray(tour.beneficios) ? tour.beneficios : [];

                                return (
                                    <tr key={tour.id} className="hover:bg-slate-50/80 transition-colors">
                                        {/* Columna: Imagenes */}
                                        <td className="p-4">
                                            <div className="flex -space-x-2 overflow-hidden">
                                                {listaImagenes.length > 0 ? (
                                                    listaImagenes.slice(0, 3).map((img, index) => (
                                                        <img
                                                            key={index}
                                                            src={img}
                                                            alt=""
                                                            className="w-12 h-10 object-cover rounded-xl border-2 border-white shadow-sm flex-shrink-0"
                                                        />
                                                    ))
                                                ) : (
                                                    <img
                                                        src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=100"
                                                        alt=""
                                                        className="w-12 h-10 object-cover rounded-xl border-2 border-white shadow-sm"
                                                    />
                                                )}
                                            </div>
                                        </td>

                                        {/* Columna: Titulo */}
                                        <td className="p-4 font-bold text-gray-900">{tour.titulo || 'Sin titulo'}</td>

                                        {/* Columna: Ubicacion */}
                                        <td className="p-4 capitalize">
                                            <span className="flex items-center gap-1 text-gray-600">
                                                <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                                                {tour.ubicacion || '---'}
                                            </span>
                                        </td>

                                        {/* Columna: Precio */}
                                        <td className="p-4 font-semibold text-indigo-600 whitespace-nowrap">
                                            {safeFormatPrice(tour.precio)}
                                        </td>

                                        {/* Columna: Duracion */}
                                        <td className="p-4">
                                            <span className="flex items-center gap-1 text-gray-600 whitespace-nowrap">
                                                <Clock size={14} className="text-gray-400 flex-shrink-0" />
                                                {tour.duracion || '---'}
                                            </span>
                                        </td>

                                        {/* Columna: Tipo Servicio */}
                                        <td className="p-4">
                                            <span className="flex items-center gap-1 text-gray-600 whitespace-nowrap">
                                                <Users size={14} className="text-gray-400 flex-shrink-0" />
                                                {tour.tipo_servicio || '---'}
                                            </span>
                                        </td>

                                        {/* Columna: Beneficio */}
                                        <td className="p-4 max-w-xs">
                                            <div className="flex flex-wrap gap-1">
                                                {listaBeneficios.length > 0 ? (
                                                    listaBeneficios.map((ben, idx) => (
                                                        <span key={idx} className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded-md font-medium whitespace-nowrap">
                                                            {ben}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 italic text-xs">Ninguno</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Columna: Activo */}
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => onEdit && onEdit(tour)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all hover:opacity-80 ${tour.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                            >
                                                {tour.activo ? 'Activo' : 'Inactivo'}
                                            </button>
                                        </td>

                                        {/* Columna: Created_at */}
                                        <td className="p-4 text-center text-xs text-gray-400 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-3">
                                                <span>{tour.created_at ? new Date(tour.created_at).toLocaleDateString('es-CO') : '---'}</span>
                                                <div className="flex items-center gap-1 border-l pl-2 border-gray-200">
                                                    <button onClick={() => onEdit && onEdit(tour)} className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={14} /></button>
                                                    <button onClick={() => onDelete && onDelete(tour)} className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="9" className="p-8 text-center text-gray-400 italic">No se encontraron tours registrados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ToursDesktop;