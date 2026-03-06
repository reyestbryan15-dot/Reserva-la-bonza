import React, { useEffect, useState } from 'react';
import { supabase } from '../../backend/supabaseClient';
import PropertyCard from './PropertyCard';
import ElegantLoader from '../components/ui/ElegantLoader';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react'; // Agregué SearchX para cuando no hay resultados

const GridAlojamientos = ({ limit }) => {
  const [alojamientos, setAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // CORRECCIÓN AQUÍ: Leemos 'busqueda' O 'destino' para que coincida con el SearchEngine
  const filtroUrl = searchParams.get('busqueda') || searchParams.get('destino'); 

  useEffect(() => {
    const fetchAlojamientos = async () => {
      try {
        setLoading(true);
        // Traemos los datos de Supabase
        let query = supabase.from('alojamientos').select('*');

        const { data, error } = await query;
        if (error) throw error;

        let resultados = data;

        // === FILTRADO INTELIGENTE ===
        if (filtroUrl) {
          const termino = filtroUrl.toLowerCase().trim();
          
          resultados = data.filter((item) => {
            const ubicacion = (item.ubicacion || "").toLowerCase();
            const titulo = (item.titulo || "").toLowerCase();
            // Filtra si el término está en la ubicación O en el título
            return ubicacion.includes(termino) || titulo.includes(termino);
          });
        }

        // Si estamos en el Home (limit), solo mostramos los primeros N
        if (limit) {
          resultados = resultados.slice(0, limit);
        }

        setAlojamientos(resultados);
      } catch (error) {
        console.error("Error cargando alojamientos:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlojamientos();
  }, [limit, filtroUrl]); // Se recarga cuando cambia el destino en la URL

  if (loading) return <ElegantLoader />;
  if (error) return null;

  // Título dinámico corregido
  const tituloPagina = filtroUrl && !limit 
    ? `Resultados para "${filtroUrl}"` 
    : (limit ? "Propiedades Destacadas" : "Todos nuestros Alojamientos");

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      
      {!limit && (
        <div className="mb-8">
          <Link 
            to="/" 
            className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border-2 border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft size={20} className="text-gray-400 group-hover:text-indigo-600 transition-transform group-hover:-translate-x-1" />
            <span className="font-bold text-sm text-gray-600 group-hover:text-indigo-800 uppercase tracking-wider">
              Volver al Inicio
            </span>
          </Link>
        </div>
      )}

      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        {tituloPagina}
      </h2>
      
      {alojamientos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <SearchX size={48} className="mb-4 text-gray-300" />
            <p className="text-xl font-medium">No encontramos nada en "{filtroUrl}"</p>
            <p className="text-sm mt-2">Intenta con otra ubicación o destino.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {alojamientos.map((hotel) => (
            <PropertyCard 
              key={hotel.id} 
              data={hotel} 
              // Pasamos los parámetros de búsqueda para que no se pierdan al entrar al detalle
              searchQuery={location.search} 
            />
          ))}
        </div>
      )}

      {limit && (
        <div className="text-center">
          <Link 
            to="/propiedades" 
            className="inline-block bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition shadow-xl"
          >
            Ver todas las propiedades
          </Link>
        </div>
      )}
    </div>
  );
};

export default GridAlojamientos;