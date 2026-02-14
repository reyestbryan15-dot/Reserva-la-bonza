import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, User, Calendar, Sparkles, CheckCircle, Smartphone } from 'lucide-react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import { differenceInDays } from 'date-fns';

// 1. IMPORTAMOS SUPABASE Y TU COMPONENTE DE PAGO
import { supabase } from '../../backend/supabaseClient'; // Asegúrate de que esta ruta sea correcta
import PaymentCard from '../components/PaymentCard'; 

registerLocale('es', es);

const ReservationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // DATOS DEL FORMULARIO
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', telefono: '',
    tipoDocumento: 'CC', numeroDocumento: ''
  });

  // ESTADOS DE FECHA
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // SERVICIOS ADICIONALES
  const [wantsCleaning, setWantsCleaning] = useState(false);
  const [wantsTaxi, setWantsTaxi] = useState(false);

  // ESTADO DE LA RESERVA (Lógica Nueva)
  const [isProcessing, setIsProcessing] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false); // ¿Ya se guardó en DB?
  const [createdReservationId, setCreatedReservationId] = useState(null); // ID que nos da Supabase


  // RECUPERAR DATOS URL
  const pricePerNight = Number(searchParams.get('price')) || 200000;
  const propertyName = searchParams.get('name') || "Propiedad Exclusiva";
  const propertyId = searchParams.get('propertyId') || "sin-id"; 

  useEffect(() => {
    const checkinUrl = searchParams.get('checkin');
    const checkoutUrl = searchParams.get('checkout');
    if (checkinUrl) setStartDate(new Date(checkinUrl));
    if (checkoutUrl) setEndDate(new Date(checkoutUrl));
  }, [searchParams]);

  // CÁLCULOS
  const nights = startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const subtotal = nights * pricePerNight;
  const CLEANING_PRICE = 50000;
  const TAXI_PRICE = 80000;
  const totalCleaning = wantsCleaning ? CLEANING_PRICE : 0;
  const totalTaxi = wantsTaxi ? TAXI_PRICE : 0;
  const total = subtotal + totalCleaning + totalTaxi;

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- LÓGICA DE ENVÍO A SUPABASE ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate || nights < 1) {
        alert("Por favor selecciona fechas válidas.");
        return;
    }

    setIsProcessing(true);

    try {
        // 1. Construimos el objeto para la base de datos
        // Asegúrate de que los nombres coincidan con tu tabla SQL
        const reservaData = {
            propiedad_id: propertyId,
            propiedad_titulo: propertyName,
            nombre_cliente: `${formData.nombre} ${formData.apellido}`,
            email: formData.email,
            telefono: formData.telefono, // Vital para WhatsApp
            fecha_llegada: startDate,
            fecha_salida: endDate,
            noches: nights,
            precio_total: total, 
            estado: 'pendiente', // Se crea como pendiente
            comentarios: `Taxi: ${wantsTaxi ? 'SI' : 'NO'}, Limpieza: ${wantsCleaning ? 'SI' : 'NO'}`
        };

        // 2. Enviamos a Supabase
        const { data, error } = await supabase
            .from('reservas')
            .insert([reservaData])
            .select(); // .select() es importante para que nos devuelva el ID creado

        if (error) throw error;

        // 3. ¡Éxito! Cambiamos la pantalla
        if (data && data.length > 0) {
            setCreatedReservationId(data[0].id.slice(0, 8).toUpperCase()); // Tomamos los primeros 8 caracteres del ID
            setReservationSuccess(true); 
            // NO navegamos a otra página, mostramos el componente de pago AQUÍ MISMO
        }

    } catch (error) {
        console.error("Error creando reserva:", error);
        alert("Hubo un error al crear la reserva. Inténtalo de nuevo.");
    } finally {
        setIsProcessing(false);
    }
  };

  // --- RENDERIZADO CONDICIONAL ---
  
  // SI LA RESERVA YA SE CREÓ -> MOSTRAMOS LA TARJETA DE PAGO (Bancolombia/Nequi)
  if (reservationSuccess) {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 animate-in fade-in zoom-in duration-500">
            <div className="max-w-md mx-auto text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-green-600 w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">¡Reserva Creada!</h1>
                <p className="text-gray-600 mt-2">
                    Tu cupo está apartado provisionalmente. Para confirmar, realiza el pago a continuación.
                </p>
            </div>

            {/* AQUÍ MOSTRAMOS TU COMPONENTE DE PAGO */}
            <PaymentCard 
                reservationId={createdReservationId}
                totalPrice={`$${total.toLocaleString()}`}
                bancolombiaNumber="517-000023-68" // PON TU CUENTA REAL
                nequiNumber="3163563784" // TU NEQUI REAL
            />

            <button onClick={() => navigate('/')} className="block mx-auto mt-8 text-indigo-600 font-medium hover:underline">
                Volver al inicio
            </button>
        </div>
    );
  }

  // SI NO SE HA CREADO -> MOSTRAMOS EL FORMULARIO
  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-indigo-600 font-bold mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Volver atrás
        </button>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Finalizar tu Reserva 🔒</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA - FORMULARIO */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. FECHAS */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative z-20"> 
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <Calendar className="text-indigo-600"/> Fechas de Estadía
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                   <p className="text-xs font-bold text-indigo-500 uppercase mb-1">Llegada</p>
                   <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} selectsStart startDate={startDate} endDate={endDate} minDate={new Date()} locale="es" dateFormat="dd/MM/yyyy" className="bg-transparent font-bold text-indigo-900 outline-none w-full cursor-pointer" />
                </div>
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                   <p className="text-xs font-bold text-indigo-500 uppercase mb-1">Salida</p>
                   <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate || new Date()} locale="es" dateFormat="dd/MM/yyyy" className="bg-transparent font-bold text-indigo-900 outline-none w-full cursor-pointer" />
                </div>
              </div>
            </section>

            {/* 2. SERVICIOS */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <Sparkles className="text-indigo-600"/> Servicios Adicionales
              </h2>
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${wantsCleaning ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`} onClick={() => setWantsCleaning(!wantsCleaning)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${wantsCleaning ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                      {wantsCleaning && <CheckCircle size={14} className="text-white"/>}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Servicio de Limpieza</p>
                      <p className="text-xs text-gray-500">Limpieza profunda al final</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-700">+${CLEANING_PRICE.toLocaleString()}</p>
                </div>

                <div className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${wantsTaxi ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`} onClick={() => setWantsTaxi(!wantsTaxi)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${wantsTaxi ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                      {wantsTaxi && <CheckCircle size={14} className="text-white"/>}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Transporte Privado</p>
                      <p className="text-xs text-gray-500">Recogida Aeropuerto</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-700">+${TAXI_PRICE.toLocaleString()}</p>
                </div>
              </div>
            </section>

            {/* 3. DATOS PERSONALES */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <User className="text-indigo-600"/> Tus Datos
              </h2>
              <form id="reserva-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required name="nombre" placeholder="Nombre" onChange={handleInputChange} className="p-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-200" />
                <input required name="apellido" placeholder="Apellido" onChange={handleInputChange} className="p-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-200" />
                <input required name="numeroDocumento" placeholder="Cédula / ID" onChange={handleInputChange} className="p-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-200" />
                <input required type="tel" name="telefono" placeholder="Celular (WhatsApp)" onChange={handleInputChange} className="p-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-200" />
                <input required type="email" name="email" placeholder="Correo Electrónico" className="md:col-span-2 p-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-200" onChange={handleInputChange} />
              </form>
            </section>


          </div>

          {/* COLUMNA DERECHA: RESUMEN (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-28">
              <div className="mb-6 pb-4 border-b border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase">Reserva en:</p>
                <h3 className="font-bold text-xl text-gray-900 leading-tight">{propertyName}</h3>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1"><Calendar size={14}/> {nights} Noches</p>
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Alojamiento ({nights} n.)</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                
                {wantsCleaning && (
                  <div className="flex justify-between text-indigo-600 font-medium animate-fadeIn">
                    <span>+ Limpieza</span>
                    <span>${CLEANING_PRICE.toLocaleString()}</span>
                  </div>
                )}

                {wantsTaxi && (
                  <div className="flex justify-between text-indigo-600 font-medium animate-fadeIn">
                    <span>+ Taxi Aeropuerto</span>
                    <span>${TAXI_PRICE.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900 mt-2">
                  <span>Total a Pagar</span>
                  <span className="text-indigo-600">${total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                type="submit" 
                form="reserva-form"
                disabled={nights <= 0 || isProcessing}
                className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 
                  ${isProcessing 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:shadow-indigo-200 text-white transform active:scale-95'
                  }`}
              >
                {isProcessing ? 'Guardando Reserva...' : 'Confirmar Reserva'}
              </button>
              <p className="text-xs text-center text-gray-400 mt-3">No te cobraremos nada todavía.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReservationPage;