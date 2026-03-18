import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Calendar, Users } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useLanguage } from '../context/LanguageContext';

const BookingCard = ({
  property,
  checkIn = null,
  checkOut = null,
  numGuests = 1
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guestsCount, setGuestsCount] = useState(1);

  // 1. LÓGICA DE TEMPORADAS CORREGIDA
  const getSeasonPrice = (date) => {
    if (!date || !property) return (property?.precio_temporada_baja || 0) * 1000;

    const d = new Date(date);
    const month = d.getMonth() + 1; // Enero es 1, Diciembre es 12
    const day = d.getDate();

    // Formato YYYY-MM-DD para festivos específicos
    const dateStr = format(d, 'yyyy-MM-dd');

    // 1. SEMANA SANTA 2026 (Marzo 29 a Abril 5)
    if (dateStr >= '2026-03-29' && dateStr <= '2026-04-05') {
      console.log("Detectado: Semana Santa");
      return (property?.precio_semana_santa || property?.precio_temporada_alta || 0) * 1000;
    }

    // 2. TEMPORADA ALTA (Diciembre 15 a Enero 15)
    if ((month === 12 && day >= 15) || (month === 1 && day <= 15)) {
      console.log("Detectado: Temporada Alta");
      return (property?.precio_alta || 0) * 1000;
    }

    // 3. SEMANA DE URIBE / RECESO (Octubre 5 al 12)
    if (month === 10 && day >= 5 && day <= 12) {
      console.log("Detectado: Semana Uribe");
      return (property?.precio_semana_uribe || property?.precio_temporada_media || 0) * 1000;
    }

    // 4. TEMPORADA MEDIA / FESTIVOS 2026
    const festivos = [
      '2026-03-23', '2026-05-01', '2026-05-18', '2026-06-08',
      '2026-06-15', '2026-06-29', '2026-07-20', '2026-08-07', '2026-08-17'
    ];
    if (festivos.includes(dateStr)) {
      console.log("Detectado: Festivo / Media");
      return (property?.precio_media || property?.precio_temporada_baja || 0) * 1000;
    }

    // 5. POR DEFECTO: TEMPORADA BAJA
    return (property?.precio_temporada_baja || 0) * 1000;
  };

  // 2. CÁLCULO DE SUMATORIA (Día por día)
  const calculateStayDetails = () => {
    if (!startDate || !endDate || endDate <= startDate) return { totalNights: 0, subtotal: 0 };

    let total = 0;
    let nights = 0;
    let tempDate = new Date(startDate);

    while (tempDate < endDate) {
      const priceForThisNight = getSeasonPrice(tempDate);
      total += priceForThisNight;
      nights++;
      tempDate.setDate(tempDate.getDate() + 1);
    }

    return { totalNights: nights, subtotal: total };
  };

  const { totalNights, subtotal } = calculateStayDetails();
  // El costo de manillas también debe ir por 1000 si en la BD dice "8"
  const costManillas = ((property?.costo_manilla || 0) * 1000) * guestsCount;
  const totalGeneral = subtotal + costManillas;

  useEffect(() => {
    if (checkIn && checkIn !== "null") setStartDate(new Date(checkIn));
    if (checkOut && checkOut !== "null") setEndDate(new Date(checkOut));
    if (numGuests) setGuestsCount(parseInt(numGuests) || 1);
  }, [checkIn, checkOut, numGuests]);

  const handleReservation = () => {
    if (!startDate || !endDate) {
      alert("Por favor selecciona fechas");
      return;
    }

    // Enviamos los valores ya multiplicados por 1000 divididos por 1000 
    // para que la ReservationPage los reciba como "300" y los multiplique allá (para mantener tu lógica sincronizada)
    const params = new URLSearchParams({
      checkin: startDate.toISOString(),
      checkout: endDate.toISOString(),
      guests: guestsCount,
      subtotalAlojamiento: subtotal / 1000,
      costoManillas: costManillas / 1000,
      propertyName: property?.titulo,
      propertyId: property?.id
    });

    navigate(`/reservar?${params.toString()}`);
  };

  const formatCOP = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-24 w-full max-w-sm mx-auto z-30">
      <div className="mb-4">
        <span className="text-2xl font-bold text-gray-900">
          {formatCOP((property?.precio_temporada_baja || 0) * 1000)}
        </span>
        <span className="text-gray-500 text-sm"> / noche</span>
      </div>

      <div className="border border-gray-300 rounded-xl mb-4 overflow-hidden">
        <div className="grid grid-cols-2 border-b border-gray-300">
          <div className="p-2 border-r border-gray-300">
            <label className="block text-[10px] font-bold text-gray-500 uppercase">Llegada</label>
            <DatePicker selected={startDate} onChange={d => setStartDate(d)} minDate={new Date()} className="w-full text-sm outline-none bg-transparent" />
          </div>
          <div className="p-2">
            <label className="block text-[10px] font-bold text-gray-500 uppercase">Salida</label>
            <DatePicker selected={endDate} onChange={d => setEndDate(d)} minDate={startDate || new Date()} className="w-full text-sm outline-none bg-transparent" />
          </div>
        </div>

        <div className="p-3 bg-white">
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Huéspedes</label>
          <div className="flex items-center justify-between">
            <button onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))} className="p-1 rounded-full border border-gray-300"><Minus size={16} /></button>
            <span className="font-bold text-gray-700">{guestsCount} viajeros</span>
            <button onClick={() => setGuestsCount(guestsCount + 1)} className="p-1 rounded-full border border-gray-300"><Plus size={16} /></button>
          </div>
        </div>
      </div>

      <button onClick={handleReservation} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg mb-4">
        Reservar ahora
      </button>

      {totalNights > 0 && (
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Alojamiento ({totalNights} noches)</span>
            <span>{formatCOP(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Manillas ({guestsCount} pers.)</span>
            <span>{formatCOP(costManillas)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t">
            <span>Total base</span>
            <span className="text-blue-600">{formatCOP(totalGeneral)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;