import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import DateRangeSelector from './DateRangeSelector';
import { supabase } from '../../backend/supabaseClient';

const BookingCard = ({ property, excludedDates, checkIn, checkOut, numGuests }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // 1. ESTADOS INICIALES
  const [startDate, setStartDate] = useState(checkIn ? new Date(checkIn) : null);
  const [endDate, setEndDate] = useState(checkOut ? new Date(checkOut) : null);
  const [guests, setGuests] = useState(parseInt(numGuests) || 1);

  // 2. CONFIGURACIÓN DE COSTOS (Con protección contra nulos)
  const valorManilla = (property?.costo_manilla < 1000 ? property.costo_manilla * 1000 : property?.costo_manilla) || 25000;
  const precioBaseNoche = property?.precio_final || property?.precio_noche || 0;

  // 3. CÁLCULO DE NOCHES (Calculado directamente en el render para evitar delays de useEffect)
  const totalNoches = (startDate && endDate)
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

    // Formateamos las fechas a YYYY-MM-DD
    const checkinStr = startDate.toISOString().split('T')[0];
    const checkoutStr = endDate.toISOString().split('T')[0];

    try {
      // Ajustamos la lógica: Una reserva choca si:
      // (Inicio de la nueva es ANTES del fin de la existente) AND (Fin de la nueva es DESPUÉS del inicio de la existente)
      const { data: conflictos, error } = await supabase
        .from('reservas')
        .select('estado')
        .eq('propiedad_id', property.id)
        // Usamos una sintaxis más limpia para evitar el error 400
        .filter('fecha_llegada', 'lt', checkoutStr)
        .filter('fecha_salida', 'gt', checkinStr);

      if (error) throw error;

      if (conflictos && conflictos.length > 0) {
        const tieneConfirmada = conflictos.some(r => r.estado === 'confirmada');

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

      navigate(`/reservar?propertyId=${property.id}&propertyName=${encodeURIComponent(property.titulo || property.nombre)}&checkin=${checkinStr}&checkout=${checkoutStr}&guests=${guests}&price=${subtotalEstadia}&manillas=${costoTotalManillas}`);

    } catch (err) {
      console.error("Error validando disponibilidad:", err);
      // Si falla la red o hay error 400, al menos dejamos que intente reservar 
      // pero avisamos que no se pudo verificar.
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

      {/* DESGLOSE: Ahora se actualiza al instante al cambiar 'guests' */}
      {totalNoches > 0 && (
        <div className="space-y-3 pt-4 border-t border-dashed text-sm">
          <div className="flex justify-between text-gray-600">
            <span className="underline decoration-gray-300">
              {formatCurrency(precioBaseNoche)} x {totalNoches} noches
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