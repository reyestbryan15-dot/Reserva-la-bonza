import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import DateRangeSelector from './DateRangeSelector';
import { supabase } from '../../backend/supabaseClient';

const BookingCard = ({ property, excludedDates, checkIn, checkOut, numGuests }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // 1. ESTADOS INICIALES (Con protección)
  const [startDate, setStartDate] = useState(checkIn ? new Date(checkIn) : null);
  const [endDate, setEndDate] = useState(checkOut ? new Date(checkOut) : null);
  const [guests, setGuests] = useState(Math.max(1, parseInt(numGuests) || 1));

  // 2. CONFIGURACIÓN DE COSTOS BLINDADA
  const rawManilla = parseFloat(property?.costo_manilla);
  const valorManilla = isNaN(rawManilla)
    ? 25000
    : (rawManilla < 1000 ? rawManilla * 1000 : rawManilla);

  const precioBaseNoche = parseFloat(property?.precio_final || property?.precio_noche || 0);

  // 3. CÁLCULO DE NOCHES
  const totalNoches = (startDate instanceof Date && !isNaN(startDate) && endDate instanceof Date && !isNaN(endDate))
    ? Math.max(0, Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24)))
    : 0;

  // 4. TOTALES DINÁMICOS
  const subtotalEstadia = precioBaseNoche * totalNoches;
  const costoTotalManillas = guests * valorManilla;
  const totalReserva = subtotalEstadia + costoTotalManillas;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert(t('booking.alert_select_dates'));
      return;
    }

    const checkinStr = startDate.toISOString().split('T')[0];
    const checkoutStr = endDate.toISOString().split('T')[0];

    try {
      // 🌟 EXTRA: VALIDACIÓN DE BLOQUEOS MANUALES DE ADMINISTRACIÓN (Airbnb/Booking)
      const { data: bloqueos, error: errorBloqueos } = await supabase
        .from('bloqueos_admin')
        .select('id')
        .eq('alojamientos', property?.id) // Usando el nombre correcto de tu columna renombrada
        .filter('fecha_llegada', 'lt', checkoutStr)
        .filter('fecha_salida', 'gt', checkinStr);

      if (errorBloqueos) throw errorBloqueos;

      if (bloqueos && bloqueos.length > 0) {
        alert("Ya estos días están reservados. Disculpa la molestia, ¿podrías por favor seleccionar otros días?");
        return;
      }

      // 🌟 VALIDACIÓN NORMAL DE RESERVAS EXISTENTES
      const { data: conflictos, error } = await supabase
        .from('reservas')
        .select('estado')
        .eq('propiedad_id', property?.id)
        .filter('fecha_llegada', 'lt', checkoutStr)
        .filter('fecha_salida', 'gt', checkinStr);

      if (error) throw error;

      if (conflictos && conflictos.length > 0) {
        const tieneConfirmada = conflictos.some(r => r.estado?.toLowerCase() === 'confirmada');

        if (tieneConfirmada) {
          alert("❌ Estas fechas ya están confirmadas. Por favor selecciona otros días.");
          return;
        } else {
          const continuar = window.confirm(
            "⚠️ Hay una solicitud pendiente para estas fechas. ¿Deseas intentar continuar?"
          );
          if (!continuar) return;
        }
      }

      const propertyTitle = property?.titulo || property?.nombre || "Propiedad";
      navigate(`/reservar?propertyId=${property.id}&propertyName=${encodeURIComponent(propertyTitle)}&checkin=${checkinStr}&checkout=${checkoutStr}&guests=${guests}&price=${subtotalEstadia}&manillas=${costoTotalManillas}`);

    } catch (err) {
      console.error("Error validando disponibilidad:", err);
      alert("No se pudo verificar la disponibilidad en tiempo real, pero intentaremos procesar tu solicitud.");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sticky top-24">
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-gray-900">
            {formatCurrency(precioBaseNoche)}
          </span>
          <span className="text-gray-500 font-medium">/ {t('booking.night')}</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onChange={([start, end]) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />

        <div className="relative">
          <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {t('booking.guests')}
          </label>
          <div className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
            <button
              onClick={() => setGuests(Math.max(1, guests - 1))}
              className="p-1 hover:bg-white hover:shadow-sm rounded-full transition-all text-gray-500"
            >
              <Minus size={20} />
            </button>
            <span className="font-bold text-gray-800">
              {guests} {guests === 1 ? t('booking.travelers_singular') : t('booking.travelers_plural')}
            </span>
            <button
              onClick={() => setGuests(guests + 1)}
              className="p-1 hover:bg-white hover:shadow-sm rounded-full transition-all text-gray-500"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleBooking}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 mb-4"
      >
        {t('booking.book_now')}
      </button>

      {totalNoches > 0 && (
        <div className="space-y-3 pt-4 border-t border-dashed text-sm animate-in fade-in slide-in-from-bottom-2">
          <div className="flex justify-between text-gray-600">
            <span className="underline decoration-gray-300 italic">
              {formatCurrency(precioBaseNoche)} x {totalNoches} {totalNoches === 1 ? 'noche' : 'noches'}
            </span>
            <span>{formatCurrency(subtotalEstadia)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Registro / Manillas ({guests} pers.)</span>
            <span className="font-medium text-gray-900">{formatCurrency(costoTotalManillas)}</span>
          </div>

          <div className="flex justify-between font-black text-gray-900 text-lg pt-2 border-t mt-2">
            <span>{t('booking.total')}</span>
            <span className="text-blue-600">{formatCurrency(totalReserva)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;