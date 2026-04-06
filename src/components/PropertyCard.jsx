import React, { useState } from 'react';
import { MapPin, Star, ArrowRight, Maximize2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import ImageModal from './ImageModal';

const PropertyCard = ({ data }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [zoomImage, setZoomImage] = useState(null);

  if (!data) return null;

  const {
    id, titulo, nombre, tipo, ubicacion, calificacion,
    precio_temporada_baja, precio_alta, precio_semana_santa, precio_noche, // Alquiler
    precio_cop, // Ventas
    galeria, imagen_url, imagenes, imagen_principal,
    isVenta
  } = data;

  // ==========================================
  // 1. LÓGICA DE PRECIOS DIRECTA (SIN MULTIPLICADORES)
  // ==========================================
  const calcularPrecioAlquilerHoy = () => {
    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const dia = hoy.getDate();

    let precioCalculado = 0;

    // SEMANA SANTA 2026 (Marzo 29 - Abril 5)
    if ((mes === 3 && dia >= 29) || (mes === 4 && dia <= 5)) {
      precioCalculado = precio_semana_santa || precio_alta || precio_temporada_baja || precio_noche;
    }
    // TEMPORADA ALTA (Diciembre 15 - Enero 15)
    else if ((mes === 12 && dia >= 15) || (mes === 1 && dia <= 15)) {
      precioCalculado = precio_alta || precio_temporada_baja || precio_noche;
    }
    // POR DEFECTO: BAJA
    else {
      precioCalculado = precio_temporada_baja || precio_noche;
    }

    // Retorna el valor tal cual viene de Supabase (o 0 si no existe)
    return precioCalculado || 0;
  };

  // ==========================================
  // 2. IMAGEN
  // ==========================================
  const FALLBACK = "https://placehold.co/600x400?text=Imagen+No+Disponible";
  const displayImage = galeria?.[0] || imagen_url || imagenes?.[0] || imagen_principal || FALLBACK;

  // ==========================================
  // 3. FORMATEO DE MONEDA
  // ==========================================
  const precioFinal = isVenta ? precio_cop : calcularPrecioAlquilerHoy();

  const precioFormateado = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(precioFinal || 0);

  const handleCardClick = () => {
    const ruta = isVenta ? `/venta/${id}` : `/propiedad/${id}`;
    navigate(ruta);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col h-full"
      >
        {/* Contenedor de Imagen */}
        <div className="relative h-72 overflow-hidden bg-gray-200">
          <img
            src={displayImage}
            alt={titulo || nombre}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className={`absolute top-4 left-4 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${isVenta ? 'bg-green-600 text-white border-green-400' : 'bg-white/95 text-gray-800 border-white/50'
            }`}>
            {isVenta ? t('search.for_sale') : (tipo || t('search.rent_only'))}
          </div>

          <div
            onClick={(e) => { e.stopPropagation(); setZoomImage(displayImage); }}
            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-zoom-in"
          >
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30">
              <Maximize2 className="text-white" size={24} />
            </div>
          </div>
        </div>

        {/* Contenido de la Tarjeta */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{titulo || nombre}</h3>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-gray-800">{calificacion || 'New'}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-gray-500 text-sm mb-6 flex-grow">
            <MapPin size={16} className="mt-1 text-indigo-400" />
            <span className="line-clamp-2">{ubicacion}</span>
          </div>

          {/* Footer de la Tarjeta (Precio) */}
          <div className="pt-5 border-t border-gray-100 flex items-center justify-between mt-auto">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {isVenta ? t('booking.total_price') : t('booking.price_from')}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-indigo-600">
                  {precioFinal > 0 ? precioFormateado : t('common.consult')}
                </span>
                {!isVenta && precioFinal > 0 && <span className="text-xs text-gray-400">/ {t('booking.night')}</span>}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="bg-gray-50 group-hover:bg-indigo-600 text-gray-900 group-hover:text-white p-3 rounded-2xl transition-all"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <ImageModal isOpen={!!zoomImage} imageSrc={zoomImage} onClose={() => setZoomImage(null)} />
    </>
  );
};

export default PropertyCard;