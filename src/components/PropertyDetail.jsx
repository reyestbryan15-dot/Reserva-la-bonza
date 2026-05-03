import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../backend/supabaseClient';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeft, Wifi, Wind, Waves, Tv, Utensils, Car,
  Trees, Lock, Coffee, Bath, DoorOpen, MapPin, Search,
  WashingMachine, Thermometer, ShieldCheck, Sparkles, HelpCircle
} from 'lucide-react';
import BookingCard from '../components/BookingCard';
import ImageModal from './ImageModal';

const AMENITY_MAP = {
  wifi: { icon: Wifi, labelKey: 'wifi' },
  ac: { icon: Wind, labelKey: 'ac' },
  pool: { icon: Waves, labelKey: 'pool' },
  tv: { icon: Tv, labelKey: 'tv' },
  kitchen: { icon: Utensils, labelKey: 'kitchen' },
  parking: { icon: Car, labelKey: 'parking' },
  balcony: { icon: Trees, labelKey: 'balcony' },
  security: { icon: Lock, labelKey: 'security' },
  coffee: { icon: Coffee, labelKey: 'coffee' },
  view: { icon: Waves, labelKey: 'view' },
  private_bathroom: { icon: Bath, labelKey: 'private_bathroom' },
  walk_in_closet: { icon: DoorOpen, labelKey: 'walk_in_closet' },
  washer: { icon: WashingMachine, labelKey: 'washer' },
  sauna: { icon: Thermometer, labelKey: 'sauna' },
  security_24_7: { icon: ShieldCheck, labelKey: 'security_24_7' },
  monthly_cleaning: { icon: Sparkles, labelKey: 'monthly_cleaning' },
  default: { icon: HelpCircle, labelKey: 'unknown' }
};

const PropertyDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const checkIn = searchParams.get('checkin');
  const checkOut = searchParams.get('checkout');
  const guests = searchParams.get('guests');
  const { t } = useLanguage();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [activeImage, setActiveImage] = useState(null);

  // Normalización de llaves para Amenities
  const getNormalizedKey = (name) => {
    if (!name) return 'default';
    return name.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_');
  };

  useEffect(() => {
    const fetchHotelYReservas = async () => {
      try {
        setLoading(true);

        // 1. OBTENER PRECIO DINÁMICO DESDE EL RPC DE SUPABASE
        // Si no hay fecha seleccionada, usamos la de hoy para mostrar un precio inicial
        const fechaConsulta = checkIn || new Date().toISOString().split('T')[0];

        const { data: precioCalculado, error: rpcError } = await supabase
          .rpc('obtener_precio_dinamico', {
            propiedad_id: id,
            fecha_consulta: fechaConsulta
          });

        if (rpcError) console.warn("RPC Error (usando fallback):", rpcError);

        // 2. OBTENER DATOS DE LA PROPIEDAD
        const { data: hotelData, error: hotelError } = await supabase
          .from('alojamientos')
          .select('*')
          .eq('id', id)
          .single();

        if (hotelError) throw hotelError;

        // Inyectamos el precio calculado por la DB (o el base si el RPC falla)
        setHotel({
          ...hotelData,
          precio_final: precioCalculado || hotelData.precio_temporada_baja || hotelData.precio
        });

        // 3. OBTENER DISPONIBILIDAD
        const { data: reservasData, error: reservasError } = await supabase
          .from('reservas')
          .select('fecha_llegada, fecha_salida')
          .eq('propiedad_id', id)
          .neq('estado', 'cancelada');

        if (reservasError) throw reservasError;

        if (reservasData) {
          const diasParaBloquear = [];
          reservasData.forEach(reserva => {
            let fechaActual = new Date(reserva.fecha_llegada);
            const fechaFin = new Date(reserva.fecha_salida);
            while (fechaActual <= fechaFin) {
              diasParaBloquear.push(new Date(fechaActual));
              fechaActual.setDate(fechaActual.getDate() + 1);
            }
          });
          setFechasOcupadas(diasParaBloquear);
        }
      } catch (error) {
        console.error("Error general:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHotelYReservas();
  }, [id, checkIn]);

  if (loading) return <div className="h-screen flex items-center justify-center">{t('common.loading')}</div>;
  if (!hotel) return <div className="text-center py-20">{t('details.not_found')}</div>;

  const imagesSource = hotel.images || hotel.galeria || [];
  let displayImages = Array.isArray(imagesSource) && imagesSource.length > 0 ? [...imagesSource] : [hotel.imagen_url || "https://via.placeholder.com/800x600"];
  while (displayImages.length < 5) displayImages.push(displayImages[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Botón Volver traducido */}
      <Link to="/propiedades" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 font-medium">
        <ArrowLeft size={20} className="mr-2" /> {t('details.back')}
      </Link>

      {/* Galería con iconos corregidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 h-[300px] md:h-[500px] mb-10 rounded-3xl overflow-hidden shadow-xl">
        <div onClick={() => setActiveImage(displayImages[0])} className="col-span-2 md:row-span-2 relative group cursor-zoom-in overflow-hidden">
          <img src={displayImages[0]} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Principal" />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Search className="text-white" size={48} />
          </div>
        </div>
        {displayImages.slice(1, 5).map((img, index) => (
          <div key={index} onClick={() => setActiveImage(img)} className="relative overflow-hidden cursor-zoom-in group">
            <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Vista" />
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-3">{hotel.name || hotel.titulo}</h1>
            <div className="flex gap-4 text-gray-500">
              <span className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full text-blue-700">
                <MapPin size={16} /> {hotel.address || hotel.ubicacion}
              </span>
            </div>
          </div>

          <div className="prose prose-lg text-gray-600">
            <h3 className="text-xl font-bold text-gray-800">{t('details.description')}</h3>
            <p className="whitespace-pre-line">{hotel.description || hotel.descripcion}</p>
          </div>

          {/* Amenities traducidos dinámicamente - SECCIÓN CORREGIDA */}
          <div className="border-y py-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{t('details.services')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.isArray(hotel.amenities) ? (
                // CASO 1: Es un Array (comportamiento normal)
                hotel.amenities.map((amenityKey) => {
                  const key = getNormalizedKey(amenityKey);
                  const Item = AMENITY_MAP[key] || AMENITY_MAP.default;
                  return (
                    <div key={amenityKey} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border">
                      <Item.icon className="text-blue-600" size={24} />
                      <span className="font-bold text-gray-700">
                        {t(`amenities.${Item.labelKey}`, { defaultValue: amenityKey })}
                      </span>
                    </div>
                  );
                })
              ) : typeof hotel.amenities === 'string' && hotel.amenities.trim().length > 0 ? (
                // CASO 2: Alguien escribió un texto plano (como "Playa privada fácil acceso")
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border col-span-full">
                  <Sparkles className="text-blue-600" size={24} />
                  <span className="font-bold text-gray-700">
                    {hotel.amenities}
                  </span>
                </div>
              ) : (
                // CASO 3: Está vacío o es nulo
                <p className="text-gray-400 italic col-span-full">
                  {t('amenities.no_services', { defaultValue: 'No hay servicios especificados' })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta de Reserva con precio del RPC */}
        <div className="w-full md:w-[400px] sticky top-24 h-fit">
          <BookingCard
            property={{ ...hotel, precio: hotel.precio_final }}
            excludedDates={fechasOcupadas}
            checkIn={checkIn}
            checkOut={checkOut}
            numGuests={guests}
          />
          <p className="text-xs text-center text-gray-400 mt-4 italic">
            * {t('booking.select_dates_for_total')}
          </p>
        </div>
      </div>

      <ImageModal isOpen={!!activeImage} imageSrc={activeImage} onClose={() => setActiveImage(null)} />
    </div>
  );
};

export default PropertyDetail;