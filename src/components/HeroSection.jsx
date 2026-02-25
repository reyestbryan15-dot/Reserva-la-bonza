/* ========================================================================
 * SECCIÓN 1: IMPORTACIONES
 * ======================================================================== */
import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext'; 
import { BRAND } from '../config/brand'; 
import SearchEngine from './SearchEngine'; // <--- IMPORTAMOS EL BUSCADOR

// Activos
import heroImage from "../assets/hero_hg.jpg";

/* ========================================================================
 * SECCIÓN 2: COMPONENTE PRINCIPAL
 * ======================================================================== */
export default function HeroSection() {
  const { t } = useLanguage(); 

  return (
    <>
      {/* --- 3.1 HERO PRINCIPAL --- */}
      <div className="relative h-[650px] w-full bg-gray-900 flex items-center justify-center text-center px-4 overflow-visible md:overflow-hidden">
        
        {/* Imagen de Fondo con Overlay */}
        <div className="absolute inset-0 w-full h-full">
            <img 
              src={heroImage} 
              alt="Santa Marta" 
              className="w-full h-full object-cover opacity-60 animate-slow-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
        </div>
        
        {/* Contenido Central */}
        <div className="relative z-10 w-full max-w-5xl mx-auto mt-[-40px]">
          
          {/* Badge de Ubicación */}
          <span className="inline-block py-2 px-5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm md:text-lg font-bold tracking-widest uppercase mb-6 border border-white/20 shadow-md">
          Santa Marta, Colombia
          </span>
          
          {/* Títulos Traducidos */}
<h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-xl tracking-tight leading-[1.1]">
  {/* Parte 1: Texto Blanco Normal */}
  {t('hero.title1')}
  
  {/* Salto de línea solo en pantallas medianas/grandes */}
  <br className="hidden md:block" /> 
  <span className="md:hidden"> </span>

  {/* Parte 2: Texto "Llamativo" con degradado azulado/blanco */}
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-100">
    {t('hero.title2')}
  </span>
</h2>
          <p className="text-lg md:text-2xl text-gray-100 font-light mb-12 max-w-2xl mx-auto drop-shadow-md">
             {t('hero.subtitle')}
          </p>
          
          {/* --- AQUÍ VA EL NUEVO BUSCADOR INTELIGENTE --- */}
          <div className="w-full px-2">
            <SearchEngine />
          </div>

        </div>
      </div>

      {/* --- 3.2 BARRA DE CONFIANZA (TRUST BAR) --- */}
      <div className="bg-sky-600 py-3 text-center text-white text-sm font-medium border-t border-white/10 shadow-inner relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6">
          
          <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
            <div className="flex text-yellow-300">
              {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <span className="font-bold tracking-wide">100% RECOMENDADO</span>
          </div>
          
          <span className="opacity-90 text-xs md:text-sm font-light">
            Basado en <span className="font-bold underline cursor-pointer">7 opiniones verificadas</span> en Google Maps
          </span>
          <span className="border-l border-blue-400 pl-6 text-sm font-semibold">
            Avalado por World Trade Center
            </span>
        </div>
      </div>
    </>
  );
}