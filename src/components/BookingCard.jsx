import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Users, Calendar } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const BookingCard = ({ 
  pricePerNight = 250000, 
  propertyName = "Villa", 
  propertyId = "1",
  rating = 4.8, 
  reviews = 120,
  checkIn = null,
  checkOut = null,
  numGuests = 1,
  excludedDates = [] 
}) => {
  
  const navigate = useNavigate();

  // Estados iniciales
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guestsCount, setGuestsCount] = useState(1);

  // --- EL TRUCO ESTÁ AQUÍ: SINCRONIZACIÓN REAL ---
  useEffect(() => {
    // Si llega checkIn desde la URL, lo ponemos en el calendario
    if (checkIn && checkIn !== "null") {
      setStartDate(new Date(checkIn));
    }
    // Si llega checkOut desde la URL, lo ponemos
    if (checkOut && checkOut !== "null") {
      setEndDate(new Date(checkOut));
    }
    // Si llegan huéspedes (desde 'guests' o 'adultos'), los ponemos
    if (numGuests) {
      setGuestsCount(parseInt(numGuests) || 1);
    }
  }, [checkIn, checkOut, numGuests]); // Se ejecuta cada vez que estos valores cambian en la URL

  // Cálculos dinámicos (se recalculan solos cuando cambian los estados)
  const nights = startDate && endDate && endDate > startDate ? differenceInDays(endDate, startDate) : 0;
  const subtotal = nights * pricePerNight;
  const cleaningFee = 50000; 
  const total = subtotal + cleaningFee;

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
  };

  const handleReservation = () => {
    if (!startDate || !endDate) {
      alert("Por favor selecciona las fechas de tu estadía");
      return;
    }

    const params = new URLSearchParams({
      checkin: startDate.toISOString(),
      checkout: endDate.toISOString(),
      guests: guestsCount, 
      price: pricePerNight,
      name: propertyName,
      propertyId: propertyId
    });
    
    navigate(`/reservar?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-24 w-full max-w-sm mx-auto z-30">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-2xl font-bold text-gray-900">{formatMoney(pricePerNight)}</span>
          <span className="text-gray-500 text-sm"> / noche</span>
        </div>
        <div className="flex items-center gap-1 text-sm font-bold text-gray-800">
          <Star size={16} fill="currentColor" className="text-yellow-400" />
          <span>{rating}</span>
          <span className="text-gray-400 font-normal underline ml-1">({reviews})</span>
        </div>
      </div>

      <div className="border border-gray-300 rounded-xl mb-4 overflow-hidden">
        <div className="grid grid-cols-2 border-b border-gray-300">
          <div className="p-2 border-r border-gray-300">
            <label className="block text-[10px] font-bold text-gray-500 uppercase">Llegada</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              excludeDates={excludedDates} 
              minDate={new Date()}
              placeholderText="Agregue fecha"
              className="w-full text-sm outline-none bg-transparent"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div className="p-2">
            <label className="block text-[10px] font-bold text-gray-500 uppercase">Salida</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              excludeDates={excludedDates} 
              minDate={startDate || new Date()}
              placeholderText="Agregue fecha"
              className="w-full text-sm outline-none bg-transparent"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
        <div className="p-3 bg-gray-50 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-500 uppercase">Huéspedes</span>
          <span className="text-sm font-medium text-gray-700">
            {guestsCount} {guestsCount > 1 ? 'Viajeros' : 'Viajero'}
          </span>
        </div>
      </div>

      <button 
        onClick={handleReservation}
        className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg mb-4 transform active:scale-95"
      >
        Reservar ahora
      </button>

      {nights > 0 ? (
        <div className="space-y-3 pt-2">
          <div className="flex justify-between text-gray-600 text-sm">
            <span>{formatMoney(pricePerNight)} x {nights} noches</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Gastos de limpieza</span>
            <span>{formatMoney(cleaningFee)}</span>
          </div>
          <div className="border-t pt-4 flex justify-between items-center font-bold text-gray-900 text-lg">
            <span>Total</span>
            <span className="text-indigo-600">{formatMoney(total)}</span>
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-center text-gray-400 italic">
          Selecciona fechas para calcular el precio total
        </p>
      )}
    </div>
  );
};

export default BookingCard;