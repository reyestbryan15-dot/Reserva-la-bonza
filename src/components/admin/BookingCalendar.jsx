import React, { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import { isSameDay, parseISO, isWithinInterval } from 'date-fns';
import { MapPin, Search, Calendar as CalendarIcon, ChevronRight, Info, User, Phone } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import '../../assets/styles/custom-calendar.css';

const BookingCalendar = ({ alojamientos, reservas, loading }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // 1. FILTRAR: Solo alojamientos que tienen reservas en la base de datos
    const accommodationsWithBookings = useMemo(() => {
        if (!alojamientos || !reservas) return [];

        // Filtramos usando 'propiedad_id' que es tu columna real
        const idsConReserva = [...new Set(reservas.map(res => res.propiedad_id))];

        return alojamientos
            .filter(acc => idsConReserva.includes(acc.id))
            .filter(acc => {
                const nombreSafe = acc?.nombre || acc?.titulo || "";
                return nombreSafe.toLowerCase().includes(searchTerm.toLowerCase());
            });
    }, [alojamientos, reservas, searchTerm]);

    // 2. Función para pintar los días ocupados según tus columnas
    const getTileClassName = (date, view, activeBookings) => {
        if (view === 'month' && activeBookings.length > 0) {
            const reservation = activeBookings.find(res => {
                try {
                    // Usamos tus nombres de columna: fecha_llegada y fecha_salida
                    const start = parseISO(res.fecha_llegada);
                    const end = parseISO(res.fecha_salida);
                    return isWithinInterval(date, { start, end }) || isSameDay(date, start) || isSameDay(date, end);
                } catch (e) { return false; }
            });

            if (reservation) {
                // Usamos tu columna 'estado'
                const estado = reservation.estado?.toUpperCase();
                if (estado === 'CONFIRMADA' || estado === 'PAGADO') return 'tile-reserved-confirmed';
                if (estado === 'PENDIENTE') return 'tile-reserved-pending';
            }
        }
        return null;
    };

    if (loading) return <div className="p-10 text-center font-bold text-slate-500 italic">Cargando cronograma de reservas...</div>;

    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">
                    Control de <span className="text-blue-600">Disponibilidad</span>
                </h1>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar propiedad..."
                        className="w-full pl-12 pr-4 py-3 bg-white border-none shadow-sm rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {accommodationsWithBookings.length === 0 ? (
                <div className="bg-white border border-slate-100 p-12 rounded-[40px] text-center shadow-sm">
                    <Info className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-slate-500 font-medium">No hay reservas registradas para mostrar en el calendario.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {accommodationsWithBookings.map((acc) => {
                        const isExpanded = selectedId === acc.id;
                        const myBookings = reservas.filter(r => r.propiedad_id === acc.id);

                        return (
                            <div key={acc.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden transition-all">
                                {/* CABECERA */}
                                <div
                                    onClick={() => setSelectedId(isExpanded ? null : acc.id)}
                                    className="p-5 flex items-center gap-5 cursor-pointer hover:bg-slate-50 transition-colors"
                                >
                                    <img src={acc.imagen_url || acc.foto_principal} className="w-20 h-20 rounded-[24px] object-cover" alt="" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-800 text-lg">{acc.nombre || acc.titulo}</h3>
                                        <div className="flex items-center text-slate-400 text-sm mt-1 font-medium">
                                            <MapPin size={14} className="mr-1 text-blue-500" /> {acc.ubicacion}
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-full transition-all ${isExpanded ? 'bg-blue-600 text-white rotate-90' : 'bg-slate-100 text-slate-400'}`}>
                                        <ChevronRight size={20} />
                                    </div>
                                </div>

                                {/* CALENDARIO DESPLEGABLE */}
                                {isExpanded && (
                                    <div className="p-8 border-t border-slate-50 bg-[#f8fafc] flex flex-col lg:flex-row gap-10 items-start justify-center animate-in fade-in zoom-in-95 duration-300">
                                        <div className="calendar-compact-wrapper bg-white p-6 rounded-[32px] shadow-2xl shadow-blue-900/5 border border-white">
                                            <Calendar
                                                locale="es-ES"
                                                tileClassName={(props) => getTileClassName(props.date, props.view, myBookings)}
                                                className="border-none"
                                            />
                                        </div>

                                        <div className="flex-1 space-y-6 w-full max-w-sm">
                                            <div className="space-y-3">
                                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <CalendarIcon size={14} /> Estado de Fechas
                                                </h4>
                                                <div className="grid grid-cols-1 gap-2">
                                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-700 bg-white p-4 rounded-2xl border border-slate-100">
                                                        <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-200"></div>
                                                        Bloqueado (Confirmado / Pagado)
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-700 bg-white p-4 rounded-2xl border border-slate-100">
                                                        <div className="w-3 h-3 rounded-full bg-orange-400 shadow-sm shadow-orange-200"></div>
                                                        Bloqueado (Pendiente)
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Info de la última reserva */}
                                            <div className="p-5 bg-blue-600 rounded-[24px] text-white shadow-lg shadow-blue-200">
                                                <p className="text-[10px] font-bold uppercase opacity-80 mb-3 tracking-tight">Último movimiento</p>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm font-bold">
                                                        <User size={14} /> {myBookings[0]?.nombre_cliente || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs opacity-90">
                                                        <Phone size={14} /> {myBookings[0]?.telefono || 'Sin teléfono'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BookingCalendar;