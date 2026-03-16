/* ========================================================================
 * SECCIÓN 1: IMPORTACIONES
 * ======================================================================== */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BRAND } from '../config/brand';
import PropertyCard from './PropertyCard'; 

// Activos (Imágenes)
import imgTaganga from "../assets/hotel_taganga.jpg";
import imgHuasipungo from "../assets/hotel_huasipungo.jpg";
import imgSalinas from "../assets/hotel_salinas.jpg";

/* ========================================================================
 * SECCIÓN 2: DATOS ESTÁTICOS (DESTACADOS)
 * ======================================================================== */
const FEATURED_DATA = [
  {
    id: 1,
    img: imgTaganga,
    title: "El mirador de taganga",
    type: "Hostal",
    location: "Cra. 2 #18-208, Taganga",
    price: "245.000 COP",
    rating: "5.0"
  },
  {
    id: 2,
    img: imgHuasipungo,
    title: "Edificio Huasipungo",
    type: "Hotel",
    location: "El Rodadero, Santa Marta",
    price: "120.000 COP",
    rating: "4.8"
  },
  {
    id: 3,
    img: imgSalinas,
    title: "Salinas del Mar",
    type: "Condominio",
    location: "Pozo Colorado, Sta Marta",
    price: "521.729 COP",
    rating: "4.9"
  }
];

/* ========================================================================
 * SECCIÓN 3: COMPONENTE PRINCIPAL
 * ======================================================================== */
const FeaturedProperties = () => {
  // 3.1 Hooks
  const { t } = useLanguage();

/* ========================================================================
 * SECCIÓN 4: RENDERIZADO (JSX)
 * ======================================================================== */
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 bg-gray-50">
      
      {/* Encabezado de Sección */}
      <div className="text-center mb-16 animate-in slide-in-from-bottom-4 duration-700">
        <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          {t('properties.section_title')}
        </h3>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          {t('properties.section_subtitle')}
        </p>
      </div>

      {/* Grid de Propiedades Destacadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURED_DATA.map((prop) => (
           <PropertyCard 
             key={prop.id}
             {...prop}
             onClick={() => alert(`${t('properties.coming_soon')}: ${prop.title}`)}
           />
        ))}
      </div>

      {/* Botón "Ver Todo" */}
      <div className="text-center mt-16">
        <Link 
          to="/propiedades" 
          className={`inline-flex items-center gap-2 border-2 ${BRAND.colors.borderPrimary || 'border-gray-900'} ${BRAND.colors.primary || 'text-gray-900'} font-bold py-3 px-10 rounded-full hover:bg-teal-50 transition-all hover:scale-105 mx-auto`}
        >
          {t('properties.btn_view_all')} <ArrowRight size={18} />
        </Link>
      </div>
      
    </div>
  );
};

export default FeaturedProperties;