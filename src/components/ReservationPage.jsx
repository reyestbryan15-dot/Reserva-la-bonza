import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Sparkles, CheckCircle, Users } from 'lucide-react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import { differenceInDays, format, addDays } from 'date-fns';
import { useLanguage } from '../context/LanguageContext';

// IMPORTACIONES DE BACKEND
import { supabase } from '../../backend/supabaseClient';
import PaymentCard from '../components/PaymentCard';

const ReservationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();

  const [isProcessing, setIsProcessing] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [createdReservationId, setCreatedReservationId] = useState(null);

  // --- ESTADOS DE PRECIOS Y PROPIEDAD ---
  const [propertyData, setPropertyData] = useState(null);
  const [extraPrices, setExtraPrices] = useState({ limpieza: 0, taxi: 80000 });
  const [currentSubtotal, setCurrentSubtotal] = useState(0);

  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', telefono: '',
    tipoDocumento: 'CC', numeroDocumento: '', huespedes: 1
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [wantsCleaning, setWantsCleaning] = useState(false);
  const [wantsTaxi, setWantsTaxi] = useState(false);

  const propertyId = searchParams.get('propertyId');
  const propertyName = searchParams.get('propertyName') || "Propiedad";

  // 1. CARGAR DATOS COMPLETOS DE LA PROPIEDAD (PRECIOS DE TODAS LAS TEMPORADAS)
  useEffect(() => {
    const fetchPropertyInfo = async () => {
      if (!propertyId || propertyId === "sin-id") return;

      const { data, error } = await supabase
        .from('alojamientos')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (data && !error) {
        setPropertyData(data);
        // Si el aseo en la BD es < 1000 (ej: 50), lo volvemos 50.000. Si ya es 50000, se queda igual.
        const valorAseo = data.costo_aseo < 1000 ? data.costo_aseo * 1000 : data.costo_aseo;
        setExtraPrices(prev => ({ ...prev, limpieza: valorAseo }));
      }
    };
    fetchPropertyInfo();
  }, [propertyId]);

  // 2. SINCRONIZACIÓN INICIAL DESDE LA URL
  useEffect(() => {
    const checkinUrl = searchParams.get('checkin');
    const checkoutUrl = searchParams.get('checkout');
    const guestsUrl = searchParams.get('guests');

    if (checkinUrl && checkinUrl !== "null") setStartDate(new Date(checkinUrl));
    if (checkoutUrl && checkoutUrl !== "null") setEndDate(new Date(checkoutUrl));
    if (guestsUrl) setFormData(prev => ({ ...prev, huespedes: parseInt(guestsUrl) || 1 }));
  }, [searchParams]);

  // 3. EL "CEREBRO" DE TEMPORADAS (Sincronizado con BookingCard)
  const getSeasonPrice = (date, data) => {
    if (!date || !data) return 0;

    const d = new Date(date);
    const dateStr = format(d, 'yyyy-MM-dd');
    const month = d.getMonth() + 1;
    const day = d.getDate();

    // TEMPORADA ALTA (Diciembre 15 - Enero 15)
    if ((month === 12 && day >= 15) || (month === 1 && day <= 15)) {
      const p = data.precio_alta || data.precio_alta || data.precio_temporada_baja;
      return Number(p) * 1000;
    }

    // SEMANA SANTA 2026
    if (dateStr >= '2026-03-29' && dateStr <= '2026-04-05') {
      const p = data.precio_semana_santa || data.precio_temporada_alta;
      return Number(p) * 1000;
    }

    // SEMANA URIBE (Octubre 5-12)
    if (month === 10 && day >= 5 && day <= 12) {
      const p = data.precio_semana_uribe || data.precio_temporada_media;
      return Number(p) * 1000;
    }

    // FESTIVOS
    const festivos = ['2026-03-23', '2026-05-01', '2026-05-18', '2026-06-08', '2026-06-15', '2026-06-29', '2026-07-20', '2026-08-07', '2026-08-17'];
    if (festivos.includes(dateStr)) {
      const p = data.precio_media || data.precio_festivo || data.precio_temporada_baja;
      return Number(p) * 1000;
    }

    // TEMPORADA BAJA (Por defecto)
    const pBase = data.precio_temporada_baja || data.precio_baja || 0;
    return Number(pBase) * 1000;
  };

  // 4. RECÁLCULO DINÁMICO CUANDO CAMBIAN LAS FECHAS O CARGAN LOS DATOS
  useEffect(() => {
    if (startDate && endDate && propertyData) {
      let totalAcumulado = 0;
      let tempDate = new Date(startDate);
      const limitDate = new Date(endDate);

      while (tempDate < limitDate) {
        totalAcumulado += getSeasonPrice(tempDate, propertyData);
        tempDate.setDate(tempDate.getDate() + 1);
      }
      setCurrentSubtotal(totalAcumulado);
    }
  }, [startDate, endDate, propertyData]);

  // Totales finales
  const nights = startDate && endDate ? Math.max(0, differenceInDays(endDate, startDate)) : 0;
  const costManillas = ((propertyData?.costo_manilla || 0) * 1000) * formData.huespedes;
  const totalFinal = currentSubtotal + costManillas + (wantsCleaning ? extraPrices.limpieza : 0) + (wantsTaxi ? extraPrices.taxi : 0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatCOP = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nights < 1) return alert("Selecciona fechas válidas");
    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.from('reservas').insert([{
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
        precio_total: totalFinal,
        estado: 'pendiente',
        comentarios: `Cédula: ${formData.numeroDocumento}. Aseo: ${wantsCleaning ? 'SI' : 'NO'}`
      }]).select();

      if (error) throw error;
      setCreatedReservationId(data[0].id.slice(0, 8).toUpperCase());
      setReservationSuccess(true);
    } catch (err) {
      alert("Error al crear reserva: " + err.message);
    } finally { setIsProcessing(false); }
  };

  if (reservationSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center">
        <CheckCircle className="text-green-600 w-16 h-16 mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold">¡Reserva Creada!</h1>
        <PaymentCard reservationId={createdReservationId} totalPrice={formatCOP(totalFinal)} bancolombiaNumber="517-000023-68" nequiNumber="3163563784" />
        <button onClick={() => navigate('/')} className="mt-8 text-indigo-600 font-bold underline">Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24 px-4 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 font-bold mb-6 hover:text-indigo-600">
          <ArrowLeft size={20} className="mr-2" /> Volver atrás
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* CALENDARIO DE AJUSTE FINAL */}
            <section className="bg-white p-6 rounded-2xl border shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Calendar className="text-indigo-600" /> Fechas de Estancia</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-indigo-500 uppercase">Llegada</p>
                  <DatePicker selected={startDate} onChange={setStartDate} selectsStart startDate={startDate} endDate={endDate} minDate={new Date()} locale="es" dateFormat="dd/MM/yyyy" className="bg-transparent font-bold w-full outline-none" />
                </div>
                <div className="bg-indigo-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-indigo-500 uppercase">Salida</p>
                  <DatePicker selected={endDate} onChange={setEndDate} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} locale="es" dateFormat="dd/MM/yyyy" className="bg-transparent font-bold w-full outline-none" />
                </div>
              </div>
            </section>

            {/* SERVICIOS ADICIONALES */}
            <section className="bg-white p-6 rounded-2xl border shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Sparkles className="text-indigo-600" /> Servicios Adicionales</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div onClick={() => setWantsCleaning(!wantsCleaning)} className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${wantsCleaning ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'}`}>
                  <p className="font-bold">Servicio de Aseo</p>
                  <p className="text-xs text-gray-500">+{formatCOP(extraPrices.limpieza)}</p>
                </div>
                <div onClick={() => setWantsTaxi(!wantsTaxi)} className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${wantsTaxi ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'}`}>
                  <p className="font-bold">Taxi al Aeropuerto</p>
                  <p className="text-xs text-gray-500">+{formatCOP(extraPrices.taxi)}</p>
                </div>
              </div>
            </section>

            {/* FORMULARIO DE CLIENTE */}
            <section className="bg-white p-6 rounded-2xl border shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><User className="text-indigo-600" /> Información del Huésped</h2>
              <form id="reserva-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required name="nombre" placeholder="Nombre" onChange={handleInputChange} className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-100 outline-none" />
                <input required name="apellido" placeholder="Apellido" onChange={handleInputChange} className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-100 outline-none" />
                <input required name="numeroDocumento" placeholder="Cédula / Pasaporte" onChange={handleInputChange} className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-100 outline-none" />
                <input required name="telefono" placeholder="WhatsApp (con código de país)" onChange={handleInputChange} className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-100 outline-none" />
                <input required name="email" type="email" placeholder="Correo Electrónico" onChange={handleInputChange} className="md:col-span-2 p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-100 outline-none" />
              </form>
            </section>
          </div>

          {/* RESUMEN DE PAGO FINAL */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border p-6 sticky top-28">
              <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">{propertyName}</h3>
              <div className="space-y-3 border-b pb-4 mb-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 font-medium"><Calendar size={14} /> {nights} Noches</span>
                  <span className="font-bold text-gray-900">{formatCOP(currentSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 font-medium"><Users size={14} /> Manillas</span>
                  <span className="font-bold text-gray-900">{formatCOP(costManillas)}</span>
                </div>
                {wantsCleaning && <div className="flex justify-between text-indigo-600 font-bold"><span>Aseo</span><span>+{formatCOP(extraPrices.limpieza)}</span></div>}
                {wantsTaxi && <div className="flex justify-between text-indigo-600 font-bold"><span>Taxi</span><span>+{formatCOP(extraPrices.taxi)}</span></div>}
              </div>
              <div className="flex justify-between font-extrabold text-2xl mb-6 text-indigo-900">
                <span>Total</span>
                <span>{formatCOP(totalFinal)}</span>
              </div>
              <button type="submit" form="reserva-form" disabled={isProcessing} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all disabled:bg-gray-400">
                {isProcessing ? "Procesando..." : "Confirmar Reserva"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;