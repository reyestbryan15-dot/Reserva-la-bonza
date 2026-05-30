import React from 'react';
import { Edit2, Trash2, MapPin, Clock } from 'lucide-react';

const ToursMobile = ({ tours, onEdit, onDelete, formatPrice }) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {tours.map((tour) => (
                <div key={tour.id} className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 flex flex-col gap-3">
                    <div className="flex gap-4">
                        <img
                            src={tour.imagenes?.[0] || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=100'}
                            alt=""
                            className="w-20 h-16 object-cover rounded-xl flex-shrink-0 bg-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block ${tour.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {tour.activo ? 'Activo' : 'Inactivo'}
                            </span>
                            <h3 className="font-bold text-gray-900 text-base leading-tight mt-1 truncate">{tour.titulo}</h3>
                            <p className="text-xs text-gray-400 capitalize flex items-center gap-1 mt-0.5"><MapPin size={12} />{tour.ubicacion}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl text-xs">
                        <div><span className="text-gray-400">Precio:</span> <strong className="text-indigo-600 font-bold">{formatPrice(tour.precio)}</strong></div>
                        <div><span className="text-gray-400">Duración:</span> <strong className="text-gray-700">{tour.duracion}</strong></div>
                    </div>

                    <div className="flex justify-end gap-2 border-t pt-2 border-gray-100">
                        <button onClick={() => onEdit(tour)} className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-xl"><Edit2 size={14} /> Editar</button>
                        <button onClick={() => onDelete(tour)} className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-3 py-2 rounded-xl"><Trash2 size={14} /> Eliminar</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ToursMobile;