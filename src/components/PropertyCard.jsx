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
    precio_noche, precio_temporada_baja, precio_alta, precio_semana_santa, // Alquiler
    precio_cop, // Ventas (No tocar)
    galeria, imagen_url, imagenes, imagen_principal, // Imágenes
    isVenta
  } = data;

  // ==========================================
  // 1. LÓGICA DE PRECIOS DINÁMICOS (ALQUILER)
  // ==========================================
  const calcularPrecioAlquilerHoy = () => {
    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const dia = hoy.getDate();

    // --- TEMPORADA SEMANA SANTA 2026 (Del 27 de Marzo al 5 de Abril) ---
    // Corregido: Hoy es 25, así que NO entrará aquí hasta el 27.
    if ((mes === 3 && dia >= 27) || (mes === 4 && dia <= 5)) {
      return precio_semana_santa || precio_alta || precio_temporada_baja || precio_noche || 0;
    }

    // --- TEMPORADA ALTA (Diciembre 15 - Enero 15) ---
    if ((mes === 12 && dia >= 15) || (mes === 1 && dia <= 15)) {
      return precio_alta || precio_noche || 0;
    }

    // --- TEMPORADA BAJA (HOY 25 DE MARZO CAE AQUÍ) ---
    // Prioridad: Temporada Baja -> Precio Base -> Cualquier otro disponible
    return precio_temporada_baja || precio_noche || 0;
  };

  // ==========================================
  // 2. LÓGICA DE IMAGEN UNIFICADA (SIN CAMBIOS)
  // ==========================================
  const FALLBACK = "https://placehold.co/600x400?text=Imagen+No+Disponible";
  let displayImage = FALLBACK;
  if (galeria?.[0]) displayImage = galeria[0];
  else if (imagen_url) displayImage = imagen_url;
  else if (imagenes?.[0]) displayImage = imagenes[0];
  else if (imagen_principal) displayImage = imagen_principal;

  // ==========================================
  // 3. FORMATEO DE PRECIOS (DIVISIÓN CLARA)
  // ==========================================

  // VENTA: Se mantiene intacto como lo tenías
  // ALQUILER: Usa la nueva lógica de fechas
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
        <div className="relative h-72 overflow-hidden bg-gray-200">
          <img
            src={displayImage}
            alt={titulo || nombre}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

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

          <div className="pt-5 border-t border-gray-100 flex items-center justify-between mt-auto">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {isVenta ? 'Precio Total' : 'Precio desde'}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-indigo-600">
                  {/* Si es venta, muestra precio_cop. Si es alquiler, muestra el calculado. */}
                  {precioFinal > 0 ? precioFormateado : "Consultar"}
                </span>
                {!isVenta && precioFinal > 0 && <span className="text-xs text-gray-400">/ noche</span>}
              </div>
            </div>

            <button className="bg-gray-50 group-hover:bg-indigo-600 text-gray-900 group-hover:text-white p-3 rounded-2xl transition-all">
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