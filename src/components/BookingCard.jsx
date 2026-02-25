import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { differenceInDays } from 'date-fns';

const BookingCard = ({ 
  pricePerNight = 250000, 
  propertyName = "Villa Bonanza VIP", 
  propertyId = "1",
  rating = 4.8, 
  reviews = 120,
  checkIn=null,  // Pasamos la fecha como string
  checkOut=null
}) => {
  
  const navigate = useNavigate();
  const [startDate] = useState(checkIn ? new Date(checkIn) : null);
  const [endDate] = useState(checkOut ? new Date(checkOut) : null);
  const [guests] = useState(2);

  const nights = startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const subtotal = nights * pricePerNight;
  const cleaningFee = 50000; 
  const serviceFee = subtotal * 0.10; 
  const total = subtotal + cleaningFee + serviceFee;

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
  };

  const handleReservation = () => {
    const params = new URLSearchParams({
      checkin: startDate ? startDate.toISOString() : '',
      checkout: endDate ? endDate.toISOString() : '',
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
          <span className="text-gray-400 font-normal underline ml-1">({reviews} reseñas)</span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="font-bold text-gray-700">Fechas:</span>
          <span className="text-gray-600 font-medium">
            {startDate && endDate 
              ? `${startDate.toLocaleDateString('es-CO')} al ${endDate.toLocaleDateString('es-CO')}` 
              : "Sin fechas seleccionadas"}
          </span>
        </div>
      </div>

      <button 
        onClick={handleReservation}
        className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg mb-4"
      >
        Reservar
      </button>

      {nights > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex justify-between text-gray-600 text-sm">
            <span>{formatMoney(pricePerNight)} x {nights} noches</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="border-t pt-4 flex justify-between items-center font-bold text-gray-800 text-lg">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;