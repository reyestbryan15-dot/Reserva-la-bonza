import React, { useState } from 'react'; // Añadido useState
import { MapPin, Star, ArrowRight, Heart, Maximize2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import ImageModal from './ImageModal'; // Asegúrate de crear este componente

const PropertyCard = ({ data }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [zoomImage, setZoomImage] = useState(null); // Estado para el Lightbox

  if (!data) return null;

  const {
    id,
    titulo,
    tipo,
    ubicacion,
    precio_noche,
    calificacion,
    imagen_url,
    galeria
  } = data;

  let displayImage = "https://via.placeholder.com/400x300?text=No+Image";

  if (galeria && Array.isArray(galeria) && galeria.length > 0) {
    displayImage = galeria[0];
  } else if (imagen_url) {
    displayImage = imagen_url;
  }

  const precioFormateado = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(precio_noche);

  const handleCardClick = () => {
    navigate(`/propiedad/${id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    console.log("Añadido a favoritos:", titulo);
  };

  const handleZoomClick = (e) => {
    e.stopPropagation(); // Evita que navegue al hacer clic para agrandar
    setZoomImage(displayImage);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col h-full"
      >
        {/* --- IMAGEN DE PORTADA --- */}
        <div className="relative h-72 overflow-hidden bg-gray-200">
          <img
            src={displayImage}
            alt={titulo}
            onError={(e) => e.target.src = "https://via.placeholder.com/400x300?text=Error+Loading"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* BOTÓN DE ZOOM (Visible al hacer hover) */}
          <div
            onClick={handleZoomClick}
            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-zoom-in"
          >
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30">
              <Maximize2 className="text-white" size={24} />
            </div>
          </div>

          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 uppercase tracking-wider shadow-sm border border-white/50">
            {tipo || 'Alojamiento'}
          </div>

          <button
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/20 hover:bg-white text-white hover:text-red-500 transition-all backdrop-blur-md border border-white/10 group-hover:scale-110 active:scale-95"
          >
            <Heart size={18} />
          </button>
        </div>

        {/* --- INFO --- */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1 pr-2">
              {titulo}
            </h3>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100 shadow-sm flex-shrink-0">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-gray-800">{calificacion || 'New'}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-gray-500 text-sm mb-6 flex-grow">
            <MapPin size={16} className="mt-1 flex-shrink-0 text-indigo-400" />
            <span className="line-clamp-2 leading-relaxed">{ubicacion}</span>
          </div>

          <div className="pt-5 border-t border-gray-100 flex items-center justify-between mt-auto">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {t('properties.price_night')}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-indigo-600">{precioFormateado}</span>
              </div>
            </div>

            <button className="bg-gray-50 group-hover:bg-indigo-600 text-gray-900 group-hover:text-white p-3 rounded-2xl transition-all duration-300 shadow-sm group-hover:shadow-indigo-300/50">
              <ArrowRight size={20} className="transform transition-transform duration-300 group-hover:-rotate-45" />
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