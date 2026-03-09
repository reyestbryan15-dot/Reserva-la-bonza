import React, { useState, useEffect } from 'react'; // Añadimos useState y useEffect
import { Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext'; 
import { BRAND } from '../config/brand'; 
import SearchEngine from './SearchEngine';

export default function HeroSection() {
  const { t } = useLanguage();
  
  // SECCIÓN: Lógica de Imagen Dinámica
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const updateHeroImage = () => {
      const hour = new Date().getHours();
      let selectedImage = "";

      if (hour >= 5 && hour < 8) {
        selectedImage = "/amanecer.jpg"; // 5am - 7:59am
      } else if (hour >= 8 && hour < 16) {
        selectedImage = "/manana.jpg";   // 8am - 3:59pm
      } else if (hour >= 16 && hour < 19) {
        selectedImage = "/tarde.jpg";    // 4pm - 6:59pm
      } else {
        selectedImage = "/noche.jpg";    // 7pm - 4:59am
      }
      
      setBackgroundImage(selectedImage);
    };

    updateHeroImage(); // Ejecutar al cargar
  }, []);

  return (
    <>
      {/* --- 3.1 HERO PRINCIPAL --- */}
      <div className="relative h-[650px] w-full bg-gray-900 flex items-center justify-center text-center px-4 overflow-visible md:overflow-hidden">
        
        {/* Imagen de Fondo Dinámica */}
        <div className="absolute inset-0 w-full h-full">
            <img 
              src={backgroundImage} 
              alt="Santa Marta" 
              className="w-full h-full object-cover opacity-60 animate-slow-zoom transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
        </div>
        
        {/* Contenido Central */}
        <div className="relative z-10 w-full max-w-5xl mx-auto mt-[-40px]">
          <span className="inline-block py-2 px-5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm md:text-lg font-bold tracking-widest uppercase mb-6 border border-white/20 shadow-md">
            Santa Marta, Colombia
          </span>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-xl tracking-tight leading-[1.1]">
            {t('hero.title1')}
            <br className="hidden md:block" /> 
            <span className="md:hidden"> </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-100">
              {t('hero.title2')}
            </span>
          </h2>

          <p className="text-lg md:text-2xl text-gray-100 font-light mb-12 max-w-2xl mx-auto drop-shadow-md">
             {t('hero.subtitle')}
          </p>
          
          <div className="w-full px-2">
            <SearchEngine />
          </div>
        </div>
      </div>

      {/* --- 3.2 BARRA DE CONFIANZA --- */}
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
            Avalado por World Trade Center Barranquilla
          </span>
        </div>
      </div>
    </>
  );
}