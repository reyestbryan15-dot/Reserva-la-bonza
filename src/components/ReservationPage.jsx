import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Sparkles, CheckCircle, Users } from 'lucide-react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import { differenceInDays, format } from 'date-fns';

// IMPORTACIONES DE BACKEND
import { supabase } from '../../backend/supabaseClient'; 
import PaymentCard from '../components/PaymentCard'; 

registerLocale('es', es);

const ReservationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // --- ESTADOS DE LA RESERVA ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [createdReservationId, setCreatedReservationId] = useState(null);

  // --- DATOS DEL FORMULARIO ---
  const [formData, setFormData] = useState({
    nombre: '', 
    apellido: '', 
    email: '', 
    telefono: '',
    tipoDocumento: 'CC', 
    numeroDocumento: '',
    huespedes: 1 // Valor inicial que se actualizará con el useEffect
  });

  // --- ESTADOS DE FECHA ---
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // --- SERVICIOS ADICIONALES ---
  const [wantsCleaning, setWantsCleaning] = useState(false);
  const [wantsTaxi, setWantsTaxi] = useState(false);

  // --- RECUPERAR DATOS URL ---
  const pricePerNight = Number(searchParams.get('price')) || 200000;
  const propertyName = searchParams.get('name') || "Propiedad Exclusiva";
  const propertyId = searchParams.get('propertyId') || "sin-id"; 

  // --- SINCRONIZACIÓN INICIAL (Aquí se soluciona lo de los campos vacíos) ---
useEffect(() => {
    // 1. Obtenemos los valores de la URL de forma segura
    const checkinUrl = searchParams.get('checkin');
    const checkoutUrl = searchParams.get('checkout');
    
    // 2. Intentamos leer 'guests' o 'adultos' (el que venga en la URL)
    const guestsUrl = searchParams.get('guests') || searchParams.get('adultos');

    // 3. Sincronizamos las fechas si existen
    if (checkinUrl && checkinUrl !== "null") {
      const dateIn = new Date(checkinUrl);
      if (!isNaN(dateIn)) setStartDate(dateIn);
    }
    
    if (checkoutUrl && checkoutUrl !== "null") {
      const dateOut = new Date(checkoutUrl);
      if (!isNaN(dateOut)) setEndDate(dateOut);
    }

    // 4. Sincronizamos los huéspedes (Evita el NaN)
    if (guestsUrl) {
      const num = parseInt(guestsUrl);
      // Si el número es válido lo ponemos, si no, ponemos 1 por defecto
      setFormData(prev => ({ 
        ...prev, 
        huespedes: isNaN(num) ? 1 : num 
      }));
    }
  }, [searchParams]); // Se dispara cuando cambian los parámetros de la URL

  // --- CÁLCULOS ---
  const nights = startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const subtotal = (nights > 0 ? nights : 0) * pricePerNight;
  const CLEANING_PRICE = 50000;
  const TAXI_PRICE = 80000;
  const totalCleaning = wantsCleaning ? CLEANING_PRICE : 0;
  const totalTaxi = wantsTaxi ? TAXI_PRICE : 0;
  const total = subtotal + totalCleaning + totalTaxi;

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- LÓGICA DE ENVÍO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || nights < 1) {
        alert("Por favor selecciona fechas válidas.");
        return;
    }

    setIsProcessing(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const reservaData = {
            propiedad_id: propertyId,
            propiedad_titulo: propertyName,
            user_id: user?.id || null, 
            nombre_cliente: `${formData.nombre} ${formData.apellido}`,
            email: formData.email,
            telefono: formData.telefono,
            fecha_llegada: format(startDate, 'yyyy-MM-dd'),
            fecha_salida: format(endDate, 'yyyy-MM-dd'),
            noches: nights,
            huespedes: formData.huespedes,
            precio_total: total, 
            estado: 'pendiente',
            comentarios: `ID Doc: ${formData.numeroDocumento}. Taxi: ${wantsTaxi ? 'SI' : 'NO'}, Limpieza: ${wantsCleaning ? 'SI' : 'NO'}`
        };

        const { data, error } = await supabase.from('reservas').insert([reservaData]).select();

        if (error) throw error;
        if (data && data.length > 0) {
            setCreatedReservationId(data[0].id.slice(0, 8).toUpperCase());
            setReservationSuccess(true); 
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al guardar: " + error.message);
    } finally {
        setIsProcessing(false);
    }
  };

  if (reservationSuccess) {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center">
            <div className="max-w-md w-full text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle className="text-green-600 w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">¡Reserva Creada!</h1>
                <p className="text-gray-600 mt-2">Paga ahora para confirmar tu estancia.</p>
            </div>
            <PaymentCard 
                reservationId={createdReservationId}
                totalPrice={`$${total.toLocaleString()}`}
                bancolombiaNumber="517-000023-68" 
                nequiNumber="3163563784" 
            />
            <button onClick={() => navigate('/')} className="mt-8 text-indigo-600 font-bold hover:underline">Volver al inicio</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-indigo-600 font-bold mb-6">
          <ArrowLeft size={20} className="mr-2" /> Volver atrás
        </button>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Finalizar tu Reserva 🔒</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* FECHAS */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"> 
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800"><Calendar className="text-indigo-600"/> Fechas</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-3 rounded-xl">
                   <p className="text-[10px] font-bold text-indigo-500 uppercase">Llegada</p>
                   <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} selectsStart startDate={startDate} endDate={endDate} minDate={new Date()} locale="es" dateFormat="dd/MM/yyyy" className="bg-transparent font-bold text-indigo-900 outline-none w-full" />
                </div>
                <div className="bg-indigo-50 p-3 rounded-xl">
                   <p className="text-[10px] font-bold text-indigo-500 uppercase">Salida</p>
                   <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate || new Date()} locale="es" dateFormat="dd/MM/yyyy" className="bg-transparent font-bold text-indigo-900 outline-none w-full" />
                </div>
              </div>
            </section>

            {/* SERVICIOS */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800"><Sparkles className="text-indigo-600"/> Adicionales</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div onClick={() => setWantsCleaning(!wantsCleaning)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${wantsCleaning ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100'}`}>
                  <p className="font-bold text-sm">Limpieza</p>
                  <p className="text-xs text-gray-500">+${CLEANING_PRICE.toLocaleString()}</p>
                </div>
                <div onClick={() => setWantsTaxi(!wantsTaxi)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${wantsTaxi ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100'}`}>
                  <p className="font-bold text-sm">Taxi Aeropuerto</p>
                  <p className="text-xs text-gray-500">+${TAXI_PRICE.toLocaleString()}</p>
                </div>
              </div>
            </section>

            {/* DATOS */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800"><User className="text-indigo-600"/> Tus Datos</h2>
              <form id="reserva-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required name="nombre" placeholder="Nombre" onChange={handleInputChange} className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-200 outline-none" />
                <input required name="apellido" placeholder="Apellido" onChange={handleInputChange} className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-200 outline-none" />
                <input required name="numeroDocumento" placeholder="Cédula" onChange={handleInputChange} className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-200 outline-none" />
                <input required type="tel" name="telefono" placeholder="WhatsApp" onChange={handleInputChange} className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-200 outline-none" />
                <input required type="email" name="email" placeholder="Email" className="md:col-span-2 p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-200 outline-none" onChange={handleInputChange} />
              </form>
            </section>
          </div>

          {/* RESUMEN */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-28">
              <h3 className="font-bold text-lg mb-4">{propertyName}</h3>
              <div className="space-y-3 border-b pb-4 mb-4 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span className="flex items-center gap-1"><Calendar size={14}/> {nights} noches</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span className="flex items-center gap-1"><Users size={14}/> {formData.huespedes} personas</span>
                  <span className="text-green-600 font-bold">Incluido</span>
                </div>
                {wantsCleaning && <div className="flex justify-between text-indigo-600"><span>Limpieza</span><span>${CLEANING_PRICE.toLocaleString()}</span></div>}
                {wantsTaxi && <div className="flex justify-between text-indigo-600"><span>Taxi</span><span>${TAXI_PRICE.toLocaleString()}</span></div>}
              </div>
              <div className="flex justify-between font-extrabold text-xl mb-6">
                <span>Total</span>
                <span className="text-indigo-600">${total.toLocaleString()}</span>
              </div>
              <button 
                type="submit" 
                form="reserva-form"
                disabled={isProcessing}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg disabled:bg-gray-400"
              >
                {isProcessing ? 'Procesando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;