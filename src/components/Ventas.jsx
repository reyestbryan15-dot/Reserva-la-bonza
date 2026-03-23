import React, { useEffect, useState } from 'react';
import { supabase } from '../../backend/supabaseClient';
import { Maximize, MapPin, Loader2, SearchX, Video } from 'lucide-react';
import { BRAND } from '../../src/config/brand';
import PropertyDetailsVentas from './PropertyDetailsVentas';
import { useLanguage } from '../context/LanguageContext';
import ImageModal from './ImageModal';
import { useSearchParams } from 'react-router-dom';

const Ventas = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProp, setSelectedProp] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  const filtroDestino = searchParams.get('destino');
  const filtroGuests = searchParams.get('guests');

  const CLEAN_PHONE = import.meta.env.VITE_WHATSAPP_NUMBER || BRAND.info.phone.replace(/[^0-9]/g, '');
  const PLACEHOLDER_IMG = "https://placehold.co/800x600?text=Imagen+no+disponible";

  // Función para procesar el link de YouTube
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true);
        let query = supabase.from('ventas_propiedades').select('*').order('created_at', { ascending: false });
        if (filtroDestino) query = query.ilike('ubicacion', `%${filtroDestino}%`);
        if (filtroGuests) query = query.gte('habitaciones', parseInt(filtroGuests));

        const { data, error } = await query;
        if (error) throw error;
        setPropiedades(data || []);
      } catch (err) {
        console.error("Error cargando ventas:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVentas();
  }, [filtroDestino, filtroGuests]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-[#D4AF37]" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-20">
      <div className="bg-black py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 italic uppercase">
          {filtroDestino ? `${t('sales.title')}: ${filtroDestino}` : t('sales.title')}
        </h1>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
        {propiedades.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200">
            <SearchX size={64} className="text-gray-300 mb-4" />
            <p className="text-xl font-bold text-gray-500 italic">No encontramos propiedades.</p>
          </div>
        ) : (
          propiedades.map((prop) => {
            const mainImg = (prop.imagenes && prop.imagenes.length > 0) ? prop.imagenes[0] : (prop.imagen_principal || PLACEHOLDER_IMG);

            return (
              <div key={prop.id} className="flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all group">

                {/* Imagen con indicador de video corregido */}
                <div
                  className="md:w-1/2 h-72 md:h-96 bg-cover bg-center relative cursor-zoom-in overflow-hidden bg-gray-200"
                  onClick={() => setActiveImage(mainImg)}
                  style={{ backgroundImage: `url(${mainImg})` }}
                >
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize className="text-white" size={40} />
                  </div>

                  {/* Aquí estaba el error: usamos prop.video_url en lugar de propiedad.video_url */}
                  {prop.video_url && (
                    <div className="absolute top-6 right-6 bg-red-600 text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg animate-pulse z-10">
                      <Video size={14} />
                      <span className="text-[10px] font-black uppercase tracking-tighter">Video Tour</span>
                    </div>
                  )}

                  <div className="absolute top-6 left-6 bg-[#D4AF37] text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                    {prop.tipo || 'Lote Campestre'}
                  </div>
                </div>

                {/* Info */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center cursor-pointer" onClick={() => setSelectedProp(prop)}>
                  <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase italic">{prop.titulo}</h2>
                  <p className="text-gray-500 flex items-center gap-2 mb-6"><MapPin size={18} className="text-[#D4AF37]" /> {prop.ubicacion}</p>

                  <div className="mb-8 border-l-4 border-[#D4AF37] pl-4">
                    <span className="text-2xl md:text-3xl font-black text-gray-900 block">
                      {prop.precio_cop ? `$${prop.precio_cop.toLocaleString('es-CO')}` : 'Consultar precio'}
                      {prop.precio_max && ` - $${prop.precio_max.toLocaleString('es-CO')}`}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 block">
                      {prop.metros_cuadrados || '1000'} M²
                    </span>
                  </div>

                  <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all hover:bg-black">
                    {t('sales.view_details_gallery')}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ImageModal isOpen={!!activeImage} imageSrc={activeImage} onClose={() => setActiveImage(null)} />

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