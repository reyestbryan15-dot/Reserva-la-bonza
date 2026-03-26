import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../backend/supabaseClient';
import { useLanguage } from '../context/LanguageContext';
import {
  Wifi, Wind, Waves, ArrowLeft, MapPin, Star,
  Tv, Utensils, Car, Trees, Lock, Coffee, Search
} from 'lucide-react';
import BookingCard from '../components/BookingCard';
import ImageModal from './ImageModal';

const AMENITY_MAP = {
  wifi: { icon: Wifi, label: 'Wifi Gratis' },
  ac: { icon: Wind, label: 'Aire Acondicionado' },
  pool: { icon: Waves, label: 'Piscina' },
  tv: { icon: Tv, label: 'Smart TV' },
  kitchen: { icon: Utensils, label: 'Cocina Equipada' },
  parking: { icon: Car, label: 'Parqueadero' },
  balcony: { icon: Trees, label: 'Balcón' },
  security: { icon: Lock, label: 'Seguridad' },
  coffee: { icon: Coffee, label: 'Cafetera' },
  view: { icon: Waves, label: 'Vista al Mar' }
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

  // ==========================================
  // 1. FUNCIONES DE LÓGICA DE PRECIOS (TEMPORADAS)
  // ==========================================
  const obtenerPrecioPorFecha = (propiedad, fechaInicio) => {
    if (!fechaInicio) return propiedad.precio_noche_baja || propiedad.precio;

    const fecha = new Date(fechaInicio);
    const mes = fecha.getMonth() + 1; // Ene=1, Feb=2...
    const dia = fecha.getDate();

    // Lógica Semana Santa 2026 (Marzo 29 - Abril 5)
    if ((mes === 3 && dia >= 29) || (mes === 4 && dia <= 5)) {
      return propiedad.precio_semana_santa || propiedad.precio_noche_alta;
    }

    // Lógica Navidad/Año Nuevo (Dic 15 - Ene 15)
    if ((mes === 12 && dia >= 15) || (mes === 1 && dia <= 15)) {
      return propiedad.precio_noche_alta;
    }

    // Precio por defecto (Temporada Baja)
    return propiedad.precio_noche_baja || propiedad.precio;
  };

  useEffect(() => {
    const fetchHotelYReservas = async () => {
      try {
        setLoading(true);
        // Traer datos de la propiedad
        const { data: hotelData, error: hotelError } = await supabase
          .from('alojamientos')
          .select('*')
          .eq('id', id)
          .single();

        if (hotelError) throw hotelError;

        // Inyectar el precio dinámico antes de guardar en el estado
        const precioActual = obtenerPrecioPorFecha(hotelData, checkIn);
        setHotel({ ...hotelData, precio_final: precioActual });

        // Traer reservas para bloquear calendario
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
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHotelYReservas();
  }, [id, checkIn]);

  if (loading) return <div className="h-screen flex items-center justify-center">Cargando...</div>;
  if (!hotel) return <div className="text-center py-20">Propiedad no encontrada</div>;

  // ==========================================
  // 2. LÓGICA DE GALERÍA DE IMÁGENES
  // ==========================================
  const imagesSource = hotel.images || hotel.galeria || [];
  let displayImages = Array.isArray(imagesSource) && imagesSource.length > 0 ? [...imagesSource] : [hotel.imagen_url || "https://via.placeholder.com/800x600"];
  while (displayImages.length < 5) displayImages.push(displayImages[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/propiedades" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 font-medium">
        <ArrowLeft size={20} className="mr-2" /> Volver al catálogo
      </Link>

      {/* --- SECCIÓN GALERÍA --- */}
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
        {/* --- SECCIÓN INFORMACIÓN (IZQUIERDA) --- */}
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
            <h3 className="text-xl font-bold text-gray-800">Descripción</h3>
            <p className="whitespace-pre-line">{hotel.description || hotel.descripcion}</p>
          </div>

          <div className="border-y py-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Servicios Incluidos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {hotel.amenities?.map((amenityKey) => {
                const Item = AMENITY_MAP[amenityKey];
                return Item ? (
                  <div key={amenityKey} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border">
                    <Item.icon className="text-blue-600" size={24} />
                    <span className="font-bold text-gray-700">{Item.label}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>

        {/* --- SECCIÓN RESERVA (DERECHA / ALQUILER) --- */}
        <div className="w-full md:w-[400px] sticky top-24 h-fit">
          <BookingCard
            property={{ ...hotel, precio: hotel.precio_final }} // Le pasamos el precio ya calculado
            excludedDates={fechasOcupadas}
            checkIn={checkIn}
            checkOut={checkOut}
            numGuests={guests}
          />
          {/* Aviso de Temporada */}
          <p className="text-xs text-center text-gray-400 mt-4 italic">
            * El precio se ajusta automáticamente según temporada alta/baja y festivos.
          </p>
        </div>
      </div>

      <ImageModal isOpen={!!activeImage} imageSrc={activeImage} onClose={() => setActiveImage(null)} />
    </div>
  );
};

export default PropertyDetail;