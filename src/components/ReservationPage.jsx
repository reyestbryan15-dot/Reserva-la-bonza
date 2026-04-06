import React, { useState, useEffect } from 'react';
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

  // 1. CARGA INICIAL Y CONTROL DE PRECIO
  useEffect(() => {
    const fetchPropertyInfo = async () => {
      if (!propertyId) return;
      const { data } = await supabase.from('alojamientos').select('*').eq('id', propertyId).single();
      if (data) {
        setPropertyData(data);
        // Corrección factor 1000 para Aseo
        const costoAseoReal = data.costo_aseo < 1000 ? data.costo_aseo * 1000 : data.costo_aseo;
        setExtraPrices({ limpieza: costoAseoReal || 0 });

        // --- LA CLAVE AQUÍ ---
        // Solo si NO hay un precio en la URL, calculamos el inicial desde la DB
        const precioUrl = searchParams.get('price');
        if (precioUrl) {
          setCurrentSubtotal(parseFloat(precioUrl));
        } else {
          const checkinUrl = searchParams.get('checkin');
          const checkoutUrl = searchParams.get('checkout');
          if (checkinUrl && checkoutUrl) {
            const noches = Math.max(0, differenceInDays(new Date(checkoutUrl), new Date(checkinUrl)));
            setCurrentSubtotal((data.precio_noche || 0) * noches);
          }
        }
      }
    };

    // Seteo de estados iniciales desde URL
    const checkinUrl = searchParams.get('checkin');
    const checkoutUrl = searchParams.get('checkout');
    const guestsUrl = searchParams.get('guests');

    if (checkinUrl) setStartDate(new Date(checkinUrl));
    if (checkoutUrl) setEndDate(new Date(checkoutUrl));
    if (guestsUrl) setFormData(prev => ({ ...prev, huespedes: parseInt(guestsUrl) || 1 }));

    fetchPropertyInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]); // Solo se ejecuta al montar el componente

  // 2. RE-CÁLCULO SOLO SI EL USUARIO CAMBIA LAS FECHAS EN PANTALLA
  useEffect(() => {
    // Si ya tenemos data y las fechas cambian después de la carga inicial
    if (propertyData && startDate && endDate) {
      const noches = Math.max(0, differenceInDays(endDate, startDate));
      const precioBase = propertyData.precio_final || propertyData.precio_noche || 0;

      // Solo actualizamos si las fechas no coinciden con las de la URL original 
      // o simplemente dejamos que el usuario tome el control
      setCurrentSubtotal(precioBase * noches);
    }
  }, [startDate, endDate]); // Escucha cambios manuales en el calendario

  const nights = startDate && endDate ? Math.max(0, differenceInDays(endDate, startDate)) : 0;
  // CORRECCIÓN MANILLAS: Igual que en BookingCard
  const valorManilla = propertyData?.costo_manilla < 1000 ? propertyData.costo_manilla * 1000 : (propertyData?.costo_manilla || 0);
  const costManillas = valorManilla * formData.huespedes;
  const totalFinal = currentSubtotal + costManillas + (wantsCleaning ? extraPrices.limpieza : 0);

  const formatCOP = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

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
        await supabase.from('reservas').update({ comentario: `CC: ${formData.numeroDocumento}. Aseo: ${wantsCleaning ? 'SI' : 'NO'}` }).eq('id', data.reserva_id);
        setReservationSuccess(true);
      }
    } catch (err) { alert(err.message); } finally { setIsProcessing(false); }
  };

  if (reservationSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center pt-32">
        <CheckCircle className="text-green-600 w-16 h-16 mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold mb-2">{t('booking.success_title')}</h1>
        <PaymentCard reservationId={createdReservationId} totalPrice={formatCOP(totalFinal)} bancolombiaNumber="517-000023-68" nequiNumber="3163563784" />
        <button onClick={() => navigate('/')} className="mt-8 text-indigo-600 font-bold underline">{t('common.back_home')}</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-32 px-4 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 font-bold mb-6 hover:text-indigo-600">
          <ArrowLeft size={20} className="mr-2" /> {t('common.back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-6 rounded-2xl border shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-900"><Calendar className="text-indigo-600" /> {t('booking.dates_title')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-indigo-500 uppercase">{t('booking.check_in')}</p>
                  <DatePicker selected={startDate} onChange={setStartDate} selectsStart startDate={startDate} endDate={endDate} minDate={new Date()} locale="es" dateFormat="dd/MM/yyyy" className="bg-transparent font-bold w-full outline-none" />
                </div>
                <div className="bg-indigo-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-indigo-500 uppercase">{t('booking.check_out')}</p>
                  <DatePicker selected={endDate} onChange={setEndDate} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} locale="es" dateFormat="dd/MM/yyyy" className="bg-transparent font-bold w-full outline-none" />
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl border shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-900"><Sparkles className="text-indigo-600" /> {t('booking.extra_services')}</h2>
              <div onClick={() => setWantsCleaning(!wantsCleaning)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${wantsCleaning ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100'}`}>
                <p className="font-bold">{t('booking.cleaning_service')}</p>
                <p className="text-xs text-gray-500">+{formatCOP(extraPrices.limpieza)}</p>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl border shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-900"><User className="text-indigo-600" /> {t('booking.guest_info')}</h2>
              <form id="reserva-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder={t('booking.first_name')} value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="p-3 border rounded-xl bg-gray-50" />
                <input required placeholder={t('booking.last_name')} value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} className="p-3 border rounded-xl bg-gray-50" />
                <input required placeholder={t('booking.id_number')} value={formData.numeroDocumento} onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })} className="p-3 border rounded-xl bg-gray-50" />
                <input required placeholder={t('booking.phone')} value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="p-3 border rounded-xl bg-gray-50" />
                <input required type="email" placeholder={t('booking.email')} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="md:col-span-2 p-3 border rounded-xl bg-gray-50" />
              </form>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border p-6 sticky top-28">
              <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">{propertyName}</h3>
              <div className="space-y-3 border-b pb-4 mb-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>{nights} {t('booking.nights')}</span>
                  <span className="font-bold text-gray-900">{formatCOP(currentSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('booking.building_registration')}</span>
                  <span className="font-bold text-gray-900">{formatCOP(costManillas)}</span>
                </div>
                {wantsCleaning && <div className="flex justify-between text-indigo-600 font-bold"><span>{t('booking.cleaning')}</span><span>+{formatCOP(extraPrices.limpieza)}</span></div>}
              </div>
              <div className="flex justify-between font-extrabold text-2xl mb-6 text-indigo-900">
                <span>{t('booking.total')}</span>
                <span>{formatCOP(totalFinal)}</span>
              </div>
              <button type="submit" form="reserva-form" disabled={isProcessing} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg">
                {isProcessing ? t('common.loading') : t('booking.confirm_button')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;