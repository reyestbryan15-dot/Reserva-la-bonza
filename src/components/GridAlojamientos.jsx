import React, { useEffect, useState } from 'react';
import { supabase } from '../../backend/supabaseClient';
import PropertyCard from './PropertyCard';
import ElegantLoader from '../components/ui/ElegantLoader';
// NUEVO: Agregamos useSearchParams aquí
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const GridAlojamientos = ({ limit }) => {
  const [alojamientos, setAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // NUEVO: Leemos el parámetro de búsqueda de la URL
  const [searchParams] = useSearchParams();
  const busqueda = searchParams.get('busqueda'); // Ej: "Rodadero"

  useEffect(() => {
    const fetchAlojamientos = async () => {
      try {
        setLoading(true);
        let query = supabase.from('alojamientos').select('*');

        // Si hay límite (Home), aplicamos limit y no filtramos por búsqueda
        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;

        // === ZONA DE FILTRADO (NUEVO) ===
        // Si no estamos en el Home (sin límite) y hay una búsqueda, filtramos manualmente
        let resultados = data;

        if (!limit && busqueda) {
          console.log("Filtrando por:", busqueda); // Para ver en consola
          resultados = data.filter((item) => {
            const ubicacion = (item.ubicacion || "").toLowerCase();
            const filtro = busqueda.toLowerCase();
            return ubicacion.includes(filtro);
          });
        }
        // ================================

        setAlojamientos(resultados);
      } catch (error) {
        console.error("Error cargando alojamientos:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlojamientos();
  }, [limit, busqueda]); // NUEVO: Agregamos 'busqueda' para que se recargue si cambia

  if (loading) return <ElegantLoader />;
  if (error) return null;

  // Lógica para el título dinámico
  const titulo = busqueda && !limit 
    ? `Resultados para "${busqueda}"` 
    : (limit ? "Destacados" : "Todos nuestros Alojamientos");

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      
      {/* 2. BOTÓN DE VOLVER */}
      {!limit && (
        <div className="mb-8">
          <Link 
            to="/" 
            className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border-2 border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 ease-in-out cursor-pointer"
          >
            <ArrowLeft 
              size={20} 
              className="text-gray-400 group-hover:text-blue-600 transition-transform duration-300 group-hover:-translate-x-1" 
            />
            <span className="font-bold text-sm text-gray-600 group-hover:text-blue-800 transition-colors uppercase tracking-wider">
              Volver al Inicio
            </span>
          </Link>
        </div>
      )}

      {/* Título (Le puse la variable 'titulo' para que cambie si buscas algo) */}
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        {titulo}
      </h2>
      
      {/* Grid de Tarjetas */}
      {/* NUEVO: Un mensajito por si no encuentra nada */}
      {alojamientos.length === 0 && !loading ? (
        <div className="text-center py-10 text-gray-500 text-lg">
           No encontramos alojamientos en "{busqueda}" 😢
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {alojamientos.map((hotel) => (
            <PropertyCard 
              key={hotel.id} 
              data={hotel} 
              searchQuery={location.search}
            />
          ))}
        </div>
      )}

      {/* Botón "Ver más" */}
      {limit && (
        <div className="text-center">
          <Link 
            to="/propiedades" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg"
          >
            Ver todas las propiedades
          </Link>
        </div>
      )}
    </div>
  );
};

export default GridAlojamientos;