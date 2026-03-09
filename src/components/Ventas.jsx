import React, { useEffect, useState } from 'react';
import { supabase } from '../../backend/supabaseClient';
import { Maximize, Bed, Bath, MapPin, Star, ChevronLeft, Loader2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../src/config/brand'; // Importamos tu config
import PropertyDetailsVentas from './PropertyDetailsVentas';

const Ventas = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProp, setSelectedProp] = useState(null);

  // Lógica de WhatsApp idéntica a tu componente de Contacto
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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#D4AF37]" size={48} /></div>;

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-20">
      <div className="bg-black py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 italic uppercase">Portafolio de Ventas</h1>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
        {propiedades.map((prop) => (
          <div key={prop.id} onClick={() => setSelectedProp(prop)} className="flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group">
            
            {/* Portada con fallback */}
            <div className="md:w-1/2 h-72 md:h-96 bg-cover bg-center relative"
                 style={{ backgroundImage: `url(${prop.imagenes?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000'})` }}>
              <div className="absolute top-6 left-6 bg-[#D4AF37] text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                {prop.tipo}
              </div>
            </div>

            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-black text-gray-900 mb-2">{prop.titulo}</h2>
              <p className="text-gray-500 flex items-center gap-2 mb-6 font-medium">
                <MapPin size={18} className="text-[#D4AF37]" /> {prop.ubicacion}
              </p>

              {/* PRECIO DESDE BASE DE DATOS */}
              <div className="mb-8">
                <span className="text-3xl font-black text-gray-900 block">
                  {prop.precio_cop ? `$${prop.precio_cop.toLocaleString('es-CO')}` : "Consultar Precio"}
                </span>
                {prop.precio_usd && (
                   <span className="text-sm font-bold text-[#D4AF37]">USD {prop.precio_usd.toLocaleString()}</span>
                )}
              </div>

              <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl">
                Ver Detalles y Galería
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProp && (
        <PropertyDetailsVentas 
          propiedad={selectedProp} 
          onClose={() => setSelectedProp(null)} 
          CLEAN_PHONE={CLEAN_PHONE} // Pasamos el número limpio
        />
      )}
    </div>
  );
};

export default Ventas;