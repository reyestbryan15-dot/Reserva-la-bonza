import React, { useState } from 'react';
import { MapPin, Star, ArrowRight, Heart, Maximize2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import ImageModal from './ImageModal';

const PropertyCard = ({ data }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [zoomImage, setZoomImage] = useState(null);

  if (!data) return null;

  // Extraemos todas las posibles columnas de ambas tablas
  const {
    id,
    titulo,
    nombre, // Ventas a veces usa nombre
    tipo,
    ubicacion,
    precio_noche,
    precio_cop, // Ventas
    calificacion,
    imagen_url, // Alquiler
    galeria,    // Alquiler (Array)
    imagenes,   // Ventas (Array)
    imagen_principal, // Ventas (String)
    isVenta     // Marcador que pusimos en GridAlojamientos
  } = data;

  // --- LÓGICA DE IMAGEN UNIFICADA ---
  const FALLBACK = "https://placehold.co/600x400?text=Imagen+No+Disponible";
  let displayImage = FALLBACK;

  // 1. Intentar con la tabla de Alquiler (galeria o imagen_url)
  if (galeria && Array.isArray(galeria) && galeria.length > 0) {
    displayImage = galeria[0];
  } else if (imagen_url) {
    displayImage = imagen_url;
  }
  // 2. Si sigue siendo el fallback, intentar con la tabla de Ventas (imagenes o imagen_principal)
  else if (imagenes && Array.isArray(imagenes) && imagenes.length > 0) {
    displayImage = imagenes[0];
  } else if (imagen_principal) {
    displayImage = imagen_principal;
  }

  // --- LÓGICA DE PRECIO ---
  const precioMostrar = isVenta ? precio_cop : precio_noche;
  const precioFormateado = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(precioMostrar || 0);

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
        <div className="relative h-72 overflow-hidden bg-gray-200">
          <img
            src={displayImage}
            alt={titulo || nombre}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/600x400?text=Error+al+cargar+foto";
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Etiqueta dinámica */}
          <div className={`absolute top-4 left-4 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${isVenta ? 'bg-green-600 text-white border-green-400' : 'bg-white/95 text-gray-800 border-white/50'
            }`}>
            {isVenta ? 'En Venta' : (tipo || 'Alquiler')}
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

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
              {titulo || nombre}
            </h3>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-gray-800">{calificacion || '4.5'}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-gray-500 text-sm mb-6 flex-grow">
            <MapPin size={16} className="mt-1 text-indigo-400" />
            <span className="line-clamp-2">{ubicacion}</span>
          </div>

          <div className="pt-5 border-t border-gray-100 flex items-center justify-between mt-auto">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {isVenta ? 'Precio Total' : 'Precio por noche'}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-indigo-600">{precioFormateado}</span>
                {!isVenta && <span className="text-xs text-gray-400">/ noche</span>}
              </div>
            </div>

            <button className="bg-gray-50 group-hover:bg-indigo-600 text-gray-900 group-hover:text-white p-3 rounded-2xl transition-all">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={!!zoomImage}
        imageSrc={zoomImage}
        onClose={() => setZoomImage(null)}
      />
    </>
  );
};

export default PropertyCard;