import React, { useEffect, useState } from 'react';
import { supabase } from '../../backend/supabaseClient';
import { Maximize, MapPin, Loader2 } from 'lucide-react';
import { BRAND } from '../../src/config/brand';
import PropertyDetailsVentas from './PropertyDetailsVentas';
import { useLanguage } from '../context/LanguageContext';
import ImageModal from './ImageModal'; // Asegúrate de importar esto

const Ventas = () => {
  const { t } = useLanguage();
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProp, setSelectedProp] = useState(null);
  const [activeImage, setActiveImage] = useState(null); // Estado para zoom

  const CLEAN_PHONE = import.meta.env.VITE_WHATSAPP_NUMBER || BRAND.info.phone.replace(/[^0-9]/g, '');

  useEffect(() => {
    const fetchVentas = async () => {
      const { data, error } = await supabase
        .from('ventas_propiedades')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setPropiedades(data);
      setLoading(false);
    };
    fetchVentas();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-[#D4AF37]" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-20">
      <div className="bg-black py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 italic uppercase">{t('sales.title')}</h1>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
        {propiedades.map((prop) => (
          <div key={prop.id} className="flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all group">

            {/* Portada con función de Zoom */}
            <div
              className="md:w-1/2 h-72 md:h-96 bg-cover bg-center relative cursor-zoom-in overflow-hidden"
              onClick={() => setActiveImage(prop.imagenes?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000')}
              style={{ backgroundImage: `url(${prop.imagenes?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000'})` }}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize className="text-white" size={40} />
              </div>
              <div className="absolute top-6 left-6 bg-[#D4AF37] text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                {prop.tipo}
              </div>
            </div>

            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center cursor-pointer" onClick={() => setSelectedProp(prop)}>
              <h2 className="text-3xl font-black text-gray-900 mb-2">{prop.titulo}</h2>
              <p className="text-gray-500 flex items-center gap-2 mb-6 font-medium">
                <MapPin size={18} className="text-[#D4AF37]" /> {prop.ubicacion}
              </p>

              <div className="mb-8">
                <span className="text-3xl font-black text-gray-900 block">
                  {prop.precio_cop ? `$${prop.precio_cop.toLocaleString('es-CO')}` : t('sales.consult_price')}
                </span>
                {prop.precio_usd && (
                  <span className="text-sm font-bold text-[#D4AF37]">USD {prop.precio_usd.toLocaleString()}</span>
                )}
              </div>

              <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl">
                {t('sales.view_details_gallery')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para ver la imagen grande */}
      <ImageModal
        isOpen={!!activeImage}
        imageSrc={activeImage}
        onClose={() => setActiveImage(null)}
      />

      {selectedProp && (
        <PropertyDetailsVentas
          propiedad={selectedProp}
          onClose={() => setSelectedProp(null)}
          CLEAN_PHONE={CLEAN_PHONE}
        />
      )}
    </div>
  );
};

export default Ventas;