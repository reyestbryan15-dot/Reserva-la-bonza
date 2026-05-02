import React, { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import { isSameDay, parseISO, isWithinInterval } from 'date-fns';
import { MapPin, Calendar as CalendarIcon, ChevronDown, User, Phone } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import '../../assets/styles/custom-calendar.css';

const BookingCalendarMovil = ({ alojamientos, reservas }) => {
    const [selectedId, setSelectedId] = useState(null);

    const listadoConReservas = useMemo(() => {
        if (!alojamientos || !reservas) return [];
        const ids = [...new Set(reservas.map(r => r.propiedad_id))];
        return alojamientos.filter(a => ids.includes(a.id));
    }, [alojamientos, reservas]);

    const getTileClassName = (date, view, myBookings) => {
        if (view === 'month') {
            const res = myBookings.find(r => {
                try {
                    const start = parseISO(r.fecha_llegada);
                    const end = parseISO(r.fecha_salida);
                    // Agregamos isSameDay para el final también
                    return isWithinInterval(date, { start, end }) ||
                        isSameDay(date, start) ||
                        isSameDay(date, end);
                } catch (e) { return false; }
            });

            if (res) {
                // Convertimos a mayúsculas para evitar errores de escritura
                const estadoReserva = res.estado?.toUpperCase();

                if (estadoReserva === 'CONFIRMADA' || estadoReserva === 'PAGADO') {
                    return 'tile-reserved-confirmed'; // Rojo
                }
                return 'tile-reserved-pending'; // Naranja
            }
        }
        return null;
    };

    return (
        <div className="flex flex-col gap-4 pb-32 pt-4 px-2">
            <h2 className="text-xl font-black text-slate-800 px-2 italic uppercase">
                Agenda <span className="text-blue-600">Móvil</span>
            </h2>

            {listadoConReservas.map(acc => {
                const isOpen = selectedId === acc.id;
                const myBookings = reservas.filter(r => r.propiedad_id === acc.id);
                const img = acc.imagen_url || acc.foto_principal || "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=400";

                return (
                    <div key={acc.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div onClick={() => setSelectedId(isOpen ? null : acc.id)} className="p-4 flex items-center gap-4 active:bg-slate-50">
                            <img src={img} className="w-14 h-14 rounded-2xl object-cover" alt="" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-800 text-sm truncate">{acc.nombre || acc.titulo}</h3>
                                <p className="text-[10px] text-slate-400 flex items-center truncate">
                                    <MapPin size={10} className="mr-1 text-blue-500" /> {acc.ubicacion}
                                </p>
                            </div>
                            <ChevronDown size={20} className={`text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {isOpen && (
                            <div className="bg-[#f8fafc] p-4 border-t border-slate-50 animate-in fade-in slide-in-from-top-2">
                                <div className="calendar-compact-wrapper mb-6">
                                    <Calendar
                                        locale="es-ES"
                                        tileClassName={(p) => getTileClassName(p.date, p.view, myBookings)}
                                        className="rounded-2xl shadow-inner border-none mx-auto"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="bg-white p-2 rounded-xl text-[9px] font-bold text-slate-600 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500" /> Confirmado
                                    </div>
                                    <div className="bg-white p-2 rounded-xl text-[9px] font-bold text-slate-600 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-orange-400" /> Pendiente
                                    </div>
                                </div>

                                <div className="bg-blue-600 p-4 rounded-2xl text-white">
                                    <p className="text-[9px] font-bold opacity-70 mb-2 uppercase tracking-tighter">Último Huésped</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-bold">
                                            <User size={12} /> {myBookings[0]?.nombre_cliente}
                                        </div>
                                        <a href={`tel:${myBookings[0]?.telefono}`} className="bg-blue-500 p-2 rounded-full">
                                            <Phone size={12} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default BookingCalendarMovil;