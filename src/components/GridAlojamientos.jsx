import React, { useEffect, useState } from 'react';
import { supabase } from '../../backend/supabaseClient';
import PropertyCard from './PropertyCard';
import ElegantLoader from '../components/ui/ElegantLoader';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const GridAlojamientos = ({ limit }) => {
  const { t } = useLanguage();
  const [properties, setProperties] = useState([]); // Cambié el nombre a properties porque ahora incluye ventas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Leemos los parámetros del SearchEngine
  const filtroDestino = searchParams.get('destino'); 
  const filtroTipo = searchParams.get('tipo') || 'todo'; // alquiler, venta o todo
  const filtroGuests = searchParams.get('guests');

  useEffect(() => {
const fetchAllData = async () => {
  try {
    setLoading(true);
    let finalResults = [];
    const guestsNum = parseInt(filtroGuests) || 1;

    // --- 1. CONSULTA DE ALQUILERES ---
    if (filtroTipo === 'todo' || filtroTipo === 'alquiler') {
      let query = supabase.from('alojamientos').select('*');
      
      // Filtro de ubicación flexible (busca la palabra dentro de la dirección larga)
      if (filtroDestino) query = query.ilike('ubicacion', `%${filtroDestino}%`);

      // CORRECCIÓN: Filtramos por max_adultos (que es la columna real en tu DB)
      if (filtroGuests) query = query.gte('max_adultos', guestsNum);

      const { data: rentals, error: rentError } = await query;
      if (rentError) throw rentError;
      if (rentals) {
        finalResults = [...finalResults, ...rentals.map(item => ({ ...item, isVenta: false }))];
      }
    }

    // --- 2. CONSULTA DE VENTAS ---
    if (filtroTipo === 'todo' || filtroTipo === 'venta') {
      let query = supabase.from('ventas_propiedades').select('*');
      
      if (filtroDestino) query = query.ilike('ubicacion', `%${filtroDestino}%`);
      
      // En ventas solemos usar 'habitaciones', si falla cámbiala por la columna de ventas
      if (filtroGuests) query = query.gte('habitaciones', guestsNum);

      const { data: sales, error: saleError } = await query;
      if (saleError) throw saleError;
      if (sales) {
        finalResults = [...finalResults, ...sales.map(item => ({ ...item, isVenta: true }))];
      }
    }

    // Aplicar límite si existe (para el Home)
    if (limit) finalResults = finalResults.slice(0, limit);

    setProperties(finalResults);
  } catch (error) {
    console.error("Error cargando propiedades:", error.message);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

    fetchAllData();
  }, [limit, filtroDestino, filtroTipo, filtroGuests]); // Se activa al cambiar cualquier filtro

  if (loading) return <ElegantLoader />;
  if (error) return null;

  // Título dinámico
  let tituloPagina = limit ? t('lodging.featured') : t('lodging.all');
  if (filtroDestino && !limit) tituloPagina = `${t('lodging.results_for')} "${filtroDestino}"`;
  if (filtroTipo === 'venta' && !limit) tituloPagina = "Propiedades en Venta";
  if (filtroTipo === 'alquiler' && !limit) tituloPagina = "Alojamientos Turísticos";

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
              {t('common.back_home')}
            </span>
          </Link>
        </div>
      )}

      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        {tituloPagina}
      </h2>
      
      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <SearchX size={48} className="mb-4 text-gray-300" />
            <p className="text-xl font-medium">No encontramos resultados para tu búsqueda</p>
            <p className="text-sm mt-2">Intenta cambiando los filtros de ubicación o capacidad.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {properties.map((item) => (
            <PropertyCard 
              key={`${item.isVenta ? 'sale' : 'rent'}-${item.id}`} 
              data={item} 
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
            {t('lodging.view_all')}
          </Link>
        </div>
      )}
    </div>
  );
};

export default GridAlojamientos;