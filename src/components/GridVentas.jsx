import React, { useEffect, useState } from 'react';
import { supabase } from '../../backend/supabaseClient';
import PropertyCard from './PropertyCard'; // Asegúrate de que PropertyCard acepte los datos de venta
import ElegantLoader from '../components/ui/ElegantLoader';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowLeft, SearchX, Tag } from 'lucide-react';

const GridVentas = ({ limit }) => {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Filtro por búsqueda o destino desde la URL
  const filtroUrl = searchParams.get('busqueda') || searchParams.get('destino'); 

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true);
        // LLAMADA A LA TABLA DE VENTAS
        let { data, error } = await supabase
          .from('ventas_propiedades')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        let resultados = data;

        // FILTRADO INTELIGENTE (Ubicación o Título)
        if (filtroUrl) {
          const termino = filtroUrl.toLowerCase().trim();
          resultados = data.filter((item) => {
            const ubicacion = (item.ubicacion || "").toLowerCase();
            const titulo = (item.titulo || "").toLowerCase();
            return ubicacion.includes(termino) || titulo.includes(termino);
          });
        }

        // LÍMITE PARA EL HOME
        if (limit) {
          resultados = resultados.slice(0, limit);
        }

        setPropiedades(resultados);
      } catch (error) {
        console.error("Error cargando propiedades de venta:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, [limit, filtroUrl]);

  if (loading) return <ElegantLoader />;
  if (error) return null;

  const tituloPagina = filtroUrl && !limit 
    ? `Propiedades en venta en "${filtroUrl}"` 
    : (limit ? "Oportunidades de Inversión" : "Catálogo de Ventas");

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      
      {!limit && (
        <div className="mb-8">
          <Link 
            to="/" 
            className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border-2 border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 hover:bg-emerald-50/50 transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft size={20} className="text-gray-400 group-hover:text-emerald-600 transition-transform group-hover:-translate-x-1" />
            <span className="font-bold text-sm text-gray-600 group-hover:text-emerald-800 uppercase tracking-wider">
              Volver al Inicio
            </span>
          </Link>
        </div>
      )}

      <div className="flex items-center gap-3 mb-8">
        <Tag className="text-emerald-600" size={32} />
        <h2 className="text-3xl font-bold text-gray-800">
          {tituloPagina}
        </h2>
      </div>
      
      {propiedades.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <SearchX size={48} className="mb-4 text-gray-300" />
            <p className="text-xl font-medium">No hay propiedades de venta disponibles en "{filtroUrl}"</p>
            <p className="text-sm mt-2">Prueba buscando en Cartagena o Santa Marta.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {propiedades.map((propiedad) => (
            <PropertyCard 
              key={propiedad.id} 
              data={{
                ...propiedad,
                // IMPORTANTE: Mapeamos 'imagenes[0]' como la imagen principal para la Card
                imagen: propiedad.imagenes && propiedad.imagenes.length > 0 
                  ? propiedad.imagenes[0] 
                  : 'https://via.placeholder.com/400x300?text=Sin+Imagen',
                precio: propiedad.precio_cop 
                  ? `$${propiedad.precio_cop.toLocaleString()} COP` 
                  : "Consultar Precio",
                esVenta: true // Bandera por si quieres cambiar el color de la etiqueta en la Card
              }} 
              searchQuery={location.search} 
            />
          ))}
        </div>
      )}

      {limit && (
        <div className="text-center">
          <Link 
            to="/ventas" 
            className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-800 text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition shadow-xl"
          >
            Explorar todas las ventas
          </Link>
        </div>
      )}
    </div>
  );
};

export default GridVentas;