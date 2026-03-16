import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, User, Minus, Plus, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const SearchEngine = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  // ESTADOS DE FILTRO
  const [location, setLocation] = useState(''); 
  const [operation, setOperation] = useState(''); // Alquiler o Venta
  const [guests, setGuests] = useState(1);
  const [showGuestMenu, setShowGuestMenu] = useState(false);
  const guestMenuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (guestMenuRef.current && !guestMenuRef.current.contains(e.target)) {
        setShowGuestMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if(e) e.preventDefault();
    const params = new URLSearchParams();
    
    if (location) params.append('destino', location);
    if (operation) params.append('tipo', operation);
    params.append('guests', guests);

    navigate(`/propiedades?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto relative z-40 -mt-10 px-4">
      <div className="bg-white rounded-[2.5rem] md:rounded-full shadow-2xl p-2 flex flex-col md:flex-row items-center border border-gray-100">
        
        {/* 1. FILTRO: UBICACIÓN */}
        <div className="relative w-full md:w-[33%] px-6 py-4 border-b md:border-b-0 md:border-r border-gray-100 hover:bg-gray-50 rounded-t-[2rem] md:rounded-l-full md:rounded-r-none group transition-colors">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 text-left">{t('search.area_label')}</label>
          <div className="flex items-center">
            <MapPin size={20} className="text-gray-400 mr-3 group-hover:text-blue-600 shrink-0" />
            <select 
              className="w-full text-sm md:text-base font-bold text-gray-700 outline-none bg-transparent cursor-pointer appearance-none"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">{t('search.where_placeholder')}</option>
              <option value="Rodadero">El Rodadero</option>
              <option value="Gaira">Gaira</option>
              <option value="Bello Horizonte">Bello Horizonte</option>
              <option value="Pozos Colorados">Pozos Colorados</option>
              <option value="Centro Historico">Centro Histórico</option>
              <option value="Taganga">Taganga</option>
            </select>
          </div>
        </div>

        {/* 2. FILTRO: TIPO DE OPERACIÓN */}
        <div className="relative w-full md:w-[33%] px-6 py-4 border-b md:border-b-0 md:border-r border-gray-100 hover:bg-gray-50 group transition-colors">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 text-left">{t('search.category')}</label>
          <div className="flex items-center">
            <Tag size={20} className="text-gray-400 mr-3 group-hover:text-blue-600 shrink-0" />
            <select 
              className="w-full text-sm md:text-base font-bold text-gray-700 outline-none bg-transparent cursor-pointer appearance-none"
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
            >
              <option value="">{t('search.rent_or_sale')}</option>
              <option value="alquiler">{t('search.rent_only')}</option>
              <option value="venta">{t('search.for_sale')}</option>
            </select>
          </div>
        </div>

        {/* 3. FILTRO: CAPACIDAD */}
        <div 
          ref={guestMenuRef}
          className="relative w-full md:w-[34%] pl-6 pr-2 py-2 flex items-center justify-between hover:bg-gray-50 rounded-b-[2rem] md:rounded-r-full md:rounded-l-none cursor-pointer group"
          onClick={() => setShowGuestMenu(!showGuestMenu)}
        >
          <div className="text-left">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('search.min_capacity')}</label>
            <div className="flex items-center">
              <User size={20} className="text-gray-400 mr-3 group-hover:text-blue-600 shrink-0" />
              <span className="text-sm md:text-base font-bold text-gray-700">
                {guests} {guests === 1 ? t('search.person_singular') : t('search.person_plural')}
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleSearch} 
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all active:scale-95 ml-2"
          >
            <Search size={22} strokeWidth={3} />
          </button>

          {/* MENÚ DE SELECCIÓN DE PERSONAS */}
          {showGuestMenu && (
            <div className="absolute top-[110%] right-0 w-full md:w-64 bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 z-[60]">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800 text-sm">{t('booking.guests')}</span>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setGuests(Math.max(1, guests - 1)); }}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold w-4 text-center">{guests}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setGuests(guests + 1); }}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchEngine;