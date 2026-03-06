import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../backend/supabaseClient'; // Asegúrate que la ruta sea correcta
import { useLanguage } from '../context/LanguageContext';
import { 
  Wifi, Wind, Waves, ArrowLeft, MapPin, Star, 
  Tv, Utensils, Car, Trees, Lock, Coffee 
} from 'lucide-react'; // Importamos más íconos
import BookingCard from '../components/BookingCard';


// 1. DICCIONARIO DE ÍCONOS (Frontend)
// Conecta el ID de la base de datos con el Ícono visual y el texto
const AMENITY_MAP = {
  wifi:    { icon: Wifi, label: 'Wifi Gratis' },
  ac:      { icon: Wind, label: 'Aire Acondicionado' },
  pool:    { icon: Waves, label: 'Piscina' },
  tv:      { icon: Tv, label: 'Smart TV' },
  kitchen: { icon: Utensils, label: 'Cocina Equipada' },
  parking: { icon: Car, label: 'Parqueadero' },
  balcony: { icon: Trees, label: 'Balcón' },
  security:{ icon: Lock, label: 'Seguridad' },
  coffee:  { icon: Coffee, label: 'Cafetera' },
  view:    { icon: Waves, label: 'Vista al Mar' }
};

const PropertyDetail = () => {

  const { id } = useParams();
  const [searchParams] = useSearchParams(); // AGREGA ESTA LÍNEA
  const checkIn = searchParams.get('checkin'); 
  const checkOut = searchParams.get('checkout');
  const guests = searchParams.get('guests');
  const { t } = useLanguage();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);



// 1. Agrega este nuevo estado arriba junto a los otros (hotel, loading...)
const [fechasOcupadas, setFechasOcupadas] = useState([]);

useEffect(() => {
  const fetchHotelYReservas = async () => {
    try {
      setLoading(true);

      // --- PARTE 1: TRAER DATOS DEL HOTEL (Lo que ya tenías) ---
      const { data: hotelData, error: hotelError } = await supabase
        .from('alojamientos')
        .select('*')
        .eq('id', id)
        .single();

      if (hotelError) throw hotelError;
      setHotel(hotelData);

      // --- PARTE 2: TRAER RESERVAS EXISTENTES (Nuevo: Paso 2A) ---
      const { data: reservasData, error: reservasError } = await supabase
        .from('reservas')
        .select('fecha_llegada, fecha_salida')
        .eq('propiedad_id', id)
        .neq('estado', 'cancelada'); // No bloqueamos si la reserva fue cancelada

      if (reservasError) throw reservasError;

      // Convertimos los rangos (Inicio/Fin) en una lista de días individuales
      if (reservasData) {
        const diasParaBloquear = [];
        
        reservasData.forEach(reserva => {
          // Convertimos strings a objetos Date de JS
          let fechaActual = new Date(reserva.fecha_llegada);
          const fechaFin = new Date(reserva.fecha_salida);

          // Llenamos el array con cada día que esté en medio del rango
          while (fechaActual <= fechaFin) {
            diasParaBloquear.push(new Date(fechaActual));
            fechaActual.setDate(fechaActual.getDate() + 1);
          }
        });
        
        setFechasOcupadas(diasParaBloquear);
      }

    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (id) fetchHotelYReservas();
}, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center text-gray-500 font-medium">{t('details.loading')}...</div>;
  if (!hotel) return <div className="text-center py-20 text-red-500">Propiedad no encontrada</div>;

  // --- LÓGICA DE IMÁGENES ---
  const fallbackImage = "https://via.placeholder.com/800x600?text=No+Image";
  // Verificamos si 'images' (nuevo formato) o 'galeria' existe
  const imagesSource = hotel.images || hotel.galeria || [];
  
  // Si hay array de imágenes, usamos ese. Si no, usamos imagen_url o fallback
  let displayImages = [];
  if (Array.isArray(imagesSource) && imagesSource.length > 0) {
      displayImages = [...imagesSource];
  } else if (hotel.imagen_url) {
      displayImages = [hotel.imagen_url];
  } else {
      displayImages = [fallbackImage];
  }

  // Rellenar para mantener el diseño grid si hay pocas fotos
  while (displayImages.length < 5) {
    displayImages.push(displayImages[0] || fallbackImage);
  }
  // --- FIN LÓGICA IMÁGENES ---
console.log("Fechas desde URL:", { checkIn, checkOut });
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      <Link to="/propiedades" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium">
        <ArrowLeft size={20} className="mr-2" /> 
        {t('details.back')}
      </Link>
      
      {/* GALERÍA DE FOTOS */}
      <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-2 md:gap-3 h-auto md:h-[500px] mb-10 rounded-3xl overflow-hidden shadow-xl">
        <div className="col-span-2 md:col-span-2 md:row-span-2 relative group cursor-pointer h-[300px] md:h-full">
           <img 
             src={displayImages[0]} 
             alt="Principal" 
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
           />
        </div>
        {displayImages.slice(1, 5).map((img, index) => (
            <div key={index} className="relative overflow-hidden h-[150px] md:h-full">
                <img src={img} alt={`Vista ${index}`} className="w-full h-full object-cover opacity-95 hover:opacity-100 hover:scale-110 transition-all duration-500" />
            </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        
        {/* COLUMNA IZQUIERDA: INFORMACIÓN */}
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 leading-tight">{hotel.name || hotel.titulo}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm md:text-base">
                <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                    <MapPin size={16}/> {hotel.address || hotel.ubicacion}
                </span>
                <span className="flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full font-medium">
                    <Star size={16} className="fill-yellow-500 text-yellow-500"/> {hotel.rating || hotel.calificacion || 'New'}
                </span>
            </div>
          </div>

          <div className="prose prose-lg text-gray-600">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{t('details.description')}</h3>
            <p className="leading-relaxed whitespace-pre-line">{hotel.description || hotel.descripcion}</p>
          </div>

          {/* --- AQUÍ ESTÁ LA MAGIA DE LOS ÍCONOS DINÁMICOS --- */}
          <div className="border-t border-b border-gray-100 py-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{t('details.services')}</h3>
            
            <div className="flex flex-wrap gap-4 md:gap-6">
                {/* Verificamos si hay amenities guardados */}
                {hotel.amenities && Array.isArray(hotel.amenities) && hotel.amenities.length > 0 ? (
                    hotel.amenities.map((amenityKey) => {
                        const Item = AMENITY_MAP[amenityKey]; // Buscamos en el diccionario
                        if (!Item) return null; // Si no existe el ícono, no renderiza nada
                        
                        const IconComponent = Item.icon;
                        return (
                            <div key={amenityKey} className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                                <IconComponent className="text-blue-600" size={24}/>
                                <span className="font-semibold text-gray-700">{Item.label}</span>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-400 italic">No hay servicios especificados.</p>
                )}
            </div>
          </div>
          {/* ------------------------------------------------ */}

        </div>

       
 {/* TARJETA DERECHA (Booking) */}
<div className="w-full md:w-[350px] flex-shrink-0 sticky top-24 z-10">
    <BookingCard 
        pricePerNight={hotel.price || hotel.precio_noche} 
        propertyName={hotel.name || hotel.titulo}
        propertyId={hotel.id}
        rating={hotel.rating || 4.8}
        checkIn={checkIn}   
        checkOut={checkOut}
        numGuests={guests}
        // NUEVO: Pasamos las fechas ocupadas al componente de reserva
        excludedDates={fechasOcupadas} 
    />
</div>

      </div>
    </div>
  );
};

export default PropertyDetail;