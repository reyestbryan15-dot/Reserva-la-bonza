import React from 'react';
import { X, MapPin, CheckCircle, MessageCircle, Maximize, Bed, Bath } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PropertyDetailsVentas = ({ propiedad, onClose, CLEAN_PHONE }) => {
  const { t } = useLanguage();
  const handleContentClick = (e) => e.stopPropagation();

  // Link de WhatsApp dinámico con el nombre de la propiedad
  const whatsappLink = `https://wa.me/${CLEAN_PHONE}?text=Hola, me gustaría más información sobre la propiedad: ${propiedad.titulo}`;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-md p-2 md:p-6" onClick={onClose}>
      <button onClick={onClose} className="fixed top-4 right-4 z-[1001] bg-white text-black p-3 rounded-full shadow-2xl transition-transform hover:scale-110">
        <X size={30} strokeWidth={3} />
      </button>

      <div className="bg-white w-full max-w-6xl h-full max-h-[95vh] rounded-[3rem] overflow-hidden flex flex-col relative shadow-2xl" onClick={handleContentClick}>
        <div className="overflow-y-auto custom-scrollbar">
          
          {/* GALERÍA DE FOTOS DESDE ARRAY */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 bg-gray-50">
            {propiedad.imagenes?.map((img, index) => (
              <div key={index} className={`overflow-hidden rounded-xl ${index === 0 ? 'col-span-2 row-span-2 h-[350px] md:h-[500px]' : 'h-[170px] md:h-[245px]'}`}>
                <img src={img} className="w-full h-full object-cover hover:scale-105 transition-all duration-700" alt={t('sales.image_alt')} />
              </div>
            ))}
          </div>

          <div className="p-8 md:p-14 flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{propiedad.titulo}</h2>
              <p className="flex items-center gap-2 text-gray-500 text-lg mb-8">
                <MapPin size={22} className="text-[#D4AF37]" /> {propiedad.ubicacion}
              </p>

              {/* Características Técnicas */}
              <div className="grid grid-cols-3 gap-4 mb-10 border-y border-gray-100 py-8">
                <div className="text-center">
                  <Maximize className="mx-auto mb-2 text-gray-400" />
                  <span className="block font-black text-gray-900">{propiedad.metros_cuadrados}m²</span>
                </div>
                <div className="text-center">
                  <Bed className="mx-auto mb-2 text-gray-400" />
                  <span className="block font-black text-gray-900">{propiedad.habitaciones}</span>
                </div>
                <div className="text-center">
                  <Bath className="mx-auto mb-2 text-gray-400" />
                  <span className="block font-black text-gray-900">{propiedad.banos}</span>
                </div>
              </div>
            </div>

            {/* CAJA DE PRECIO Y WHATSAPP */}
            <div className="w-full lg:w-96">
              <div className="bg-gray-900 rounded-[2.5rem] p-8 text-center shadow-2xl">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{t('sales.sale_price')}</span>
                <div className="text-3xl font-black text-white mt-2 mb-8">
                   {propiedad.precio_cop ? `$${propiedad.precio_cop.toLocaleString('es-CO')}` : t('sales.consult')}
                </div>
                
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center justify-center gap-3 w-full bg-[#D4AF37] text-white py-5 rounded-2xl font-black hover:bg-white hover:text-black transition-all shadow-xl">
                  <MessageCircle size={22} /> {t('sales.talk_to_advisor')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsVentas;