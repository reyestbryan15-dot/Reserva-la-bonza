import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Sparkles, CheckCircle } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import esLocale from 'date-fns/locale/es';
import { differenceInDays, format } from 'date-fns';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../../backend/supabaseClient';
import PaymentCard from '../components/PaymentCard';

registerLocale('es', esLocale);

const ReservationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();

  // Ref para bloquear recalculos automáticos que pisen la URL al inicio
  const isInitialLoad = useRef(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [createdReservationId, setCreatedReservationId] = useState(null);

  const [propertyData, setPropertyData] = useState(null);
  const [currentSubtotal, setCurrentSubtotal] = useState(0);
  const [extraPrices, setExtraPrices] = useState({ limpieza: 0 });

  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', telefono: '',
    numeroDocumento: '', huespedes: 1
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [wantsCleaning, setWantsCleaning] = useState(false);

  const propertyId = searchParams.get('propertyId');
  const propertyName = searchParams.get('propertyName') || "Propiedad";

  // 1. CARGA INICIAL: Sincronización estricta con URL y Base de Datos
  useEffect(() => {
    const fetchPropertyInfo = async () => {
      if (!propertyId) return;

      const { data, error } = await supabase
        .from('alojamientos')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (data && !error) {
        setPropertyData(data);

        // --- VALOR DE ASEO DESDE DB (Conversión 50 -> 50000) ---
        const valorAseoRaw = data.costo_aseo || 0;
        const costoAseoReal = valorAseoRaw < 1000 ? valorAseoRaw * 1000 : valorAseoRaw;
        setExtraPrices({ limpieza: costoAseoReal });

        // --- PRECIO DESDE URL (Prioridad en carga inicial) ---
        const precioUrl = searchParams.get('price');
        if (precioUrl) {
          setCurrentSubtotal(parseFloat(precioUrl));
        } else {
          // Fallback: Si no hay precio en URL, calculamos con precio x noche de DB
          const checkinUrl = searchParams.get('checkin');
          const checkoutUrl = searchParams.get('checkout');
          if (checkinUrl && checkoutUrl) {
            const noches = Math.max(0, differenceInDays(new Date(checkoutUrl), new Date(checkinUrl)));
            setCurrentSubtotal((data.precio_final || data.precio_noche || 0) * noches);
          }
        }
      }
    };

    // Capturar datos de URL a Estados de React
    const checkinUrl = searchParams.get('checkin');
    const checkoutUrl = searchParams.get('checkout');
    const guestsUrl = searchParams.get('guests');

    if (checkinUrl) setStartDate(new Date(checkinUrl));
    if (checkoutUrl) setEndDate(new Date(checkoutUrl));
    if (guestsUrl) setFormData(prev => ({ ...prev, huespedes: parseInt(guestsUrl) || 1 }));

    fetchPropertyInfo();

    // Desbloquear recalculos después de la carga inicial
    const timer = setTimeout(() => {
      isInitialLoad.current = false;
    }, 800);

    return () => clearTimeout(timer);
  }, [propertyId]);


  // 2. RE-CÁLCULO DINÁMICO: Solo si el usuario cambia fechas manualmente
  useEffect(() => {
    // Solo recalculamos si NO es la carga inicial Y tenemos la data de la propiedad
    if (!isInitialLoad.current && propertyData && startDate && endDate) {
      const noches = Math.max(0, differenceInDays(endDate, startDate));
      // Usamos precio_final, si no existe precio_noche, y si no 0
      const precioBase = propertyData.precio_final || propertyData.precio_noche || 0;
      setCurrentSubtotal(precioBase * noches);
    }
  }, [startDate, endDate, propertyData]);

  // 3. LOGICA DE MANILLAS (Registro Edificio) - CORREGIDA PARA EVITAR CEROS
  const getManillasValue = () => {
    // 1. Intentamos obtener el valor unitario de la DB
    let valorUnitario = 0;
    if (propertyData?.costo_manilla) {
      valorUnitario = propertyData.costo_manilla < 1000
        ? propertyData.costo_manilla * 1000
        : propertyData.costo_manilla;
    }

    // 2. FALLBACK: Si la DB aún no carga pero hay valor en la URL, usamos ese precio unitario
    const manillasUrl = searchParams.get('manillas');
    const guestsUrl = searchParams.get('guests') || 1;

    if (valorUnitario === 0 && manillasUrl) {
      valorUnitario = parseFloat(manillasUrl) / parseInt(guestsUrl);
    }

    // 3. Multiplicamos por los huéspedes que el usuario está escribiendo en el input
    const totalManillas = valorUnitario * (formData.huespedes || 1);

    return totalManillas;
  };

  const nights = (startDate && endDate) ? Math.max(0, differenceInDays(endDate, startDate)) : 0;
  const costManillas = getManillasValue();
  const totalFinal = currentSubtotal + costManillas + (wantsCleaning ? extraPrices.limpieza : 0);

  const formatCOP = (val) => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0
  }).format(val || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nights < 1) return alert(t('booking.alert_select_dates'));
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.rpc('insertar_reserva_segura', {
        p_propiedad_id: propertyId,
        p_propiedad_titulo: propertyName,
        p_fecha_llegada: format(startDate, 'yyyy-MM-dd'),
        p_fecha_salida: format(endDate, 'yyyy-MM-dd'),
        p_noches: nights,
        p_huespedes: formData.huespedes,
        p_precio_total: totalFinal,
        p_nombre_cliente: `${formData.nombre} ${formData.apellido}`,
        p_email: formData.email,
        p_telefono: formData.telefono
      });

      if (data?.success) {
        setCreatedReservationId(data.reserva_id.slice(0, 8).toUpperCase());
        // Info extra en comentario
        await supabase.from('reservas').update({
          comentario: `CC: ${formData.numeroDocumento}. Aseo: ${wantsCleaning ? 'SI' : 'NO'}`
        }).eq('id', data.reserva_id);
        setReservationSuccess(true);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (reservationSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center pt-32 text-center">
        <CheckCircle className="text-green-600 w-16 h-16 mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold mb-2">{t('booking.success_title')}</h1>
        <PaymentCard
          reservationId={createdReservationId}
          totalPrice={formatCOP(totalFinal)}
          bancolombiaNumber="517-000023-68"
          nequiNumber="3163563784"
        />
        <button onClick={() => navigate('/')} className="mt-8 text-indigo-600 font-bold underline">
          {t('common.back_home')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-32 px-4 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 font-bold mb-6 hover:text-indigo-600 transition-all">
          <ArrowLeft size={20} className="mr-2" /> {t('common.back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* SECCIÓN FECHAS */}
            <section className="bg-white p-6 rounded-2xl border shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-900"><Calendar size={20} className="text-indigo-600" /> {t('booking.dates_title')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                  <p className="text-[10px] font-bold text-indigo-500 uppercase">{t('booking.check_in')}</p>
                  <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} selectsStart startDate={startDate} endDate={endDate} minDate={new Date()} locale="es" dateFormat="dd/MM/yyyy" className="bg-transparent font-bold w-full outline-none" />
                </div>
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                  <p className="text-[10px] font-bold text-indigo-500 uppercase">{t('booking.check_out')}</p>
                  <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} locale="es" dateFormat="dd/MM/yyyy" className="bg-transparent font-bold w-full outline-none" />
                </div>
              </div>
            </section>

            {/* SECCIÓN SERVICIOS */}
            <section className="bg-white p-6 rounded-2xl border shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-900"><Sparkles size={20} className="text-indigo-600" /> {t('booking.extra_services')}</h2>
              <div
                onClick={() => setWantsCleaning(!wantsCleaning)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${wantsCleaning ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'}`}
              >
                <div>
                  <p className="font-bold">{t('booking.cleaning_service')}</p>
                  <p className="text-xs text-gray-400">Pago único por estadía</p>
                </div>
                <span className="font-bold text-indigo-600">{formatCOP(extraPrices.limpieza)}</span>
              </div>
            </section>

            {/* SECCIÓN DATOS CLIENTE */}
            <section className="bg-white p-6 rounded-2xl border shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-900"><User size={20} className="text-indigo-600" /> {t('booking.guest_info')}</h2>
              <form id="reserva-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder={t('booking.first_name')} value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 outline-none transition-all" />
                <input required placeholder={t('booking.last_name')} value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 outline-none" />
                <input required placeholder={t('booking.id_number')} value={formData.numeroDocumento} onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })} className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 outline-none" />
                <input required placeholder={t('booking.phone')} value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 outline-none" />
                <input required type="email" placeholder={t('booking.email')} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="md:col-span-2 p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-400 outline-none" />

                <div className="md:col-span-2 flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">{t('booking.guests')}:</span>
                  <input
                    type="number" min="1" max="15"
                    value={formData.huespedes}
                    onChange={(e) => setFormData({ ...formData, huespedes: parseInt(e.target.value) || 1 })}
                    className="bg-white border rounded-lg px-3 py-1 font-bold w-16 outline-none text-indigo-600 shadow-sm"
                  />
                </div>
              </form>
            </section>
          </div>

          {/* COLUMNA DERECHA: Resumen de Pago */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl border p-6 sticky top-28">
              <h3 className="font-black text-xl mb-6 text-gray-900 border-b pb-4">{propertyName}</h3>

              <div className="space-y-4 border-b pb-6 mb-6 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="underline decoration-gray-200">Estadía ({nights} noches)</span>
                  <span className="font-bold text-gray-900">{formatCOP(currentSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline decoration-gray-200">Registros ({formData.huespedes} pers.)</span>
                  <span className="font-bold text-gray-900">{formatCOP(costManillas)}</span>
                </div>
                {wantsCleaning && (
                  <div className="flex justify-between text-indigo-600 font-semibold italic">
                    <span>+ Servicio de Aseo</span>
                    <span>{formatCOP(extraPrices.limpieza)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between font-black text-3xl mb-8 text-indigo-950 tracking-tighter">
                <span>Total</span>
                <span>{formatCOP(totalFinal)}</span>
              </div>

              <button
                type="submit"
                form="reserva-form"
                disabled={isProcessing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:bg-gray-300 uppercase tracking-widest text-sm"
              >
                {isProcessing ? t('common.loading') : t('booking.confirm_button')}
              </button>

              <p className="text-[10px] text-gray-400 mt-4 text-center leading-tight">
                Al confirmar, aceptas nuestras políticas de reserva y cancelación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;