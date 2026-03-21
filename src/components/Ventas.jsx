import React, { useEffect, useState } from 'react';
import { supabase } from '../../backend/supabaseClient';
import { Maximize, MapPin, Loader2, SearchX } from 'lucide-react';
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

  // Filtros provenientes del SearchEngine
  const filtroDestino = searchParams.get('destino');
  const filtroGuests = searchParams.get('guests');

  const CLEAN_PHONE = import.meta.env.VITE_WHATSAPP_NUMBER || BRAND.info.phone.replace(/[^0-9]/g, '');

  // URL de respaldo estable (reemplaza a via.placeholder)
  const PLACEHOLDER_IMG = "https://placehold.co/800x600?text=Imagen+no+disponible";

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('ventas_propiedades')
          .select('*')
          .order('created_at', { ascending: false });

        // Filtro por ubicación (Busca el texto dentro de la dirección)
        if (filtroDestino) {
          query = query.ilike('ubicacion', `%${filtroDestino}%`);
        }
        
        // Filtro por capacidad (habitaciones)
        if (filtroGuests) {
          query = query.gte('habitaciones', parseInt(filtroGuests));
        }

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
      {/* Encabezado */}
      <div className="bg-black py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 italic uppercase">
          {filtroDestino ? `${t('sales.title')}: ${filtroDestino}` : t('sales.title')}
        </h1>
        {filtroDestino && (
          <p className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm">
            Resultados encontrados: {propiedades.length}
          </p>
        )}
      </div>

      <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
        {propiedades.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] shadow-sm border-2 border-dashed border-gray-200">
            <SearchX size={64} className="text-gray-300 mb-4" />
            <p className="text-xl font-bold text-gray-500 italic">No encontramos propiedades en esta zona.</p>
            <button 
              onClick={() => window.location.href = '/ventas'}
              className="mt-4 text-[#D4AF37] font-bold hover:underline"
            >
              Ver todo el catálogo
            </button>
          </div>
        ) : (
          propiedades.map((prop) => {
            // Lógica para extraer la primera imagen de la columna 'imagenes' (Array)
            const mainImg = (prop.imagenes && prop.imagenes.length > 0) 
              ? prop.imagenes[0] 
              : (prop.imagen_principal || PLACEHOLDER_IMG);

            return (
              <div 
                key={prop.id} 
                className="flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all group"
              >
                {/* Contenedor de Imagen con Zoom */}
                <div
                  className="md:w-1/2 h-72 md:h-96 bg-cover bg-center relative cursor-zoom-in overflow-hidden bg-gray-200 shadow-inner"
                  onClick={() => setActiveImage(mainImg)}
                  style={{ backgroundImage: `url(${mainImg})` }}
                >
                  {/* Overlay de Zoom al hacer hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize className="text-white drop-shadow-lg" size={40} />
                  </div>
                  
                  {/* Etiqueta de Tipo */}
                  <div className="absolute top-6 left-6 bg-[#D4AF37] text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md">
                    {prop.tipo || 'Inmueble'}
                  </div>
                </div>

                {/* Información de la Propiedad */}
                <div 
                  className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center cursor-pointer hover:bg-gray-50/50 transition-colors" 
                  onClick={() => setSelectedProp(prop)}
                >
                  <h2 className="text-3xl font-black text-gray-900 mb-2 group-hover:text-[#D4AF37] transition-colors uppercase italic">
                    {prop.titulo}
                  </h2>
                  <p className="text-gray-500 flex items-center gap-2 mb-6 font-medium">
                    <MapPin size={18} className="text-[#D4AF37]" /> {prop.ubicacion}
                  </p>

                  <div className="mb-8 border-l-4 border-[#D4AF37] pl-4">
                    <span className="text-3xl font-black text-gray-900 block tracking-tighter">
                      {prop.precio_cop ? `$${prop.precio_cop.toLocaleString('es-CO')}` : t('sales.consult_price')}
                    </span>
                    {prop.precio_usd && (
                      <span className="text-sm font-bold text-[#D4AF37]">USD {prop.precio_usd.toLocaleString()}</span>
                    )}
                    <div className="flex gap-4 mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>{prop.habitaciones || 0} Hab</span>
                      <span>{prop.banos || 0} Baños</span>
                      {prop.area && <span>{prop.area} m²</span>}
                    </div>
                  </div>

                  <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl uppercase tracking-widest text-sm active:scale-95">
                    {t('sales.view_details_gallery')}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Lightbox de Imagen */}
      <ImageModal
        isOpen={!!activeImage}
        imageSrc={activeImage}
        onClose={() => setActiveImage(null)}
      />

      {/* Detalles de la Propiedad (Modal/Panel) */}
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