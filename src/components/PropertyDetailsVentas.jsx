import React, { useState } from 'react';
import { X, MapPin, MessageCircle, Maximize, Bed, Bath, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ImageModal from './ImageModal';

const PropertyDetailsVentas = ({ propiedad, onClose, CLEAN_PHONE }) => {
  const { t } = useLanguage();
  const [activeMedia, setActiveMedia] = useState(null);

  const handleContentClick = (e) => e.stopPropagation();

  // Función mejorada para detectar enlaces normales y SHORTS
  const getYoutubeId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)\??v?=?|(shorts\/))([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[8].length === 11) ? match[8] : null;
  };

  const youtubeId = getYoutubeId(propiedad.video_url || propiedad.video);
  const whatsappLink = `https://wa.me/${CLEAN_PHONE}?text=Hola, me gustaría más información sobre: ${propiedad.titulo}`;

  return (
    <>
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-md p-2 md:p-6" onClick={onClose}>
        <button onClick={onClose} className="fixed top-4 right-4 z-[1001] bg-white text-black p-3 rounded-full shadow-2xl hover:scale-110 transition-transform">
          <X size={30} strokeWidth={3} />
        </button>

        <div className="bg-white w-full max-w-6xl h-full max-h-[95vh] rounded-[3rem] overflow-hidden flex flex-col relative shadow-2xl" onClick={handleContentClick}>
          <div className="overflow-y-auto custom-scrollbar">

            {/* --- GALERÍA PROFESIONAL --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 bg-gray-50">

              {youtubeId ? (
                <div className="md:col-span-2 md:row-span-2 h-[350px] md:h-[500px] rounded-xl overflow-hidden bg-black relative">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    /* Volvemos al dominio estándar y quitamos parámetros que YouTube interpreta como 'bot' */
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&controls=1&origin=${window.location.origin}`}
                    title="Video Tour Proyecto La Esperanza"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div
                  className="md:col-span-2 md:row-span-2 h-[350px] md:h-[500px] rounded-xl overflow-hidden relative cursor-zoom-in group"
                  onClick={() => setActiveMedia(propiedad.imagenes?.[0])}
                >
                  <img
                    src={propiedad.imagenes?.[0] || 'https://via.placeholder.com/800x500'}
                    className="w-full h-full object-cover"
                    alt="Principal"
                  />
                </div>
              )}

              {/* FOTOS LATERALES */}
              <div className="flex flex-col gap-2">
                {propiedad.imagenes?.slice(youtubeId ? 0 : 1, youtubeId ? 2 : 3).map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveMedia(img)}
                    className="relative group overflow-hidden rounded-xl cursor-zoom-in h-[170px] md:h-[245px] w-full bg-gray-100"
                  >
                    <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="Vista" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Search className="text-white" size={24} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- INFO --- */}
            <div className="p-8 md:p-14 flex flex-col lg:flex-row gap-12">
              <div className="flex-1">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase italic tracking-tighter">
                  {propiedad.titulo}
                </h2>
                <p className="flex items-center gap-2 text-gray-500 text-lg mb-8 font-medium">
                  <MapPin size={22} className="text-[#D4AF37]" /> {propiedad.ubicacion}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-10 border-y border-gray-100 py-8 text-center">
                  <div>
                    <Maximize className="mx-auto mb-2 text-gray-400" />
                    <span className="block font-black text-gray-900">{propiedad.metros_cuadrados || '1000'}m²</span>
                  </div>
                  <div>
                    <Bed className="mx-auto mb-2 text-gray-400" />
                    <span className="block font-black text-gray-900">{propiedad.habitaciones || 0}</span>
                  </div>
                  <div>
                    <Bath className="mx-auto mb-2 text-gray-400" />
                    <span className="block font-black text-gray-900">{propiedad.banos || 0}</span>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed text-lg font-medium">
                  Lotes disponibles con fácil acceso desde Bondigua en Bonda, Vereda Macinga.
                </p>
              </div>

              {/* PRECIO */}
              <div className="w-full lg:w-96 sticky top-8 h-fit">
                <div className="bg-gray-900 rounded-[2.5rem] p-8 text-center shadow-2xl">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{t('sales.sale_price')}</span>
                  <div className="text-3xl font-black text-white mt-2 mb-8 tracking-tighter">
                    {propiedad.precio_cop ? `$${propiedad.precio_cop.toLocaleString('es-CO')}` : "$150.000.000"}
                  </div>

                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full bg-[#D4AF37] text-white py-5 rounded-2xl font-black hover:bg-white hover:text-black transition-all shadow-xl uppercase text-sm tracking-widest">
                    <MessageCircle size={22} /> {t('sales.talk_to_advisor')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImageModal isOpen={!!activeMedia} mediaUrl={activeMedia} onClose={() => setActiveMedia(null)} />
    </>
  );
};

export default PropertyDetailsVentas;