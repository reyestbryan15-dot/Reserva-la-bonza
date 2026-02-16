import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Calendar as CalendarIcon, User, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext'; // Asumo que usas el contexto
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// IMPORTACIÓN DE LOCALES
import { es, fr, de } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';
import { zhCN } from 'date-fns/locale';

registerLocale('es', es);
registerLocale('en', enUS);
registerLocale('fr', fr);
registerLocale('de', de);
registerLocale('zh', zhCN);

/* ========================================================================
 * SECCIÓN 1: TRADUCCIONES (Mover a LanguageContext si es posible)
 * ======================================================================== */
const translations = {
  es: {
    dest: "Destino",
    dest_ph: "¿A dónde vas?",
    dates: "Entrada - Salida",
    guests: "Viajeros",
    guest_unit: "Huéspedes",
    adults: "Adultos",
    children: "Niños",
    age_13: "13 años o más",
    age_2_12: "De 2 a 12 años",
    search: "BUSCAR"
  },
  en: {
    dest: "Destination",
    dest_ph: "Where are you going?",
    dates: "Check-in - Check-out",
    guests: "Guests",
    guest_unit: "Guests",
    adults: "Adults",
    children: "Children",
    age_13: "13 years or older",
    age_2_12: "Ages 2 to 12",
    search: "SEARCH"
  },
  fr: {
    dest: "Destination",
    dest_ph: "Où allez-vous ?",
    dates: "Arrivée - Départ",
    guests: "Voyageurs",
    guest_unit: "Voyageurs",
    adults: "Adultes",
    children: "Enfants",
    age_13: "13 ans ou plus",
    age_2_12: "De 2 à 12 ans",
    search: "RECHERCHER"
  },
  de: {
    dest: "Reiseziel",
    dest_ph: "Wohin gehst du?",
    dates: "Anreise - Abreise",
    guests: "Reisende",
    guest_unit: "Gäste",
    adults: "Erwachsene",
    children: "Kinder",
    age_13: "13 Jahre o. älter",
    age_2_12: "2 bis 12 Jahre",
    search: "SUCHEN"
  },
  zh: {
    dest: "目的地",
    dest_ph: "你想去哪里？",
    dates: "入住 - 退房",
    guests: "人数",
    guest_unit: "位房客",
    adults: "成人",
    children: "儿童",
    age_13: "13岁或以上",
    age_2_12: "2至12岁",
    search: "搜索"
  }
};

/* ========================================================================
 * SECCIÓN 2: COMPONENTE PRINCIPAL
 * ======================================================================== */
const SearchEngine = () => {
  const navigate = useNavigate();
  const { language } = useLanguage(); // Obtenemos el idioma del contexto
  const t = translations[language] || translations.es;

  // ESTADOS LÓGICOS
  const [showGuestMenu, setShowGuestMenu] = useState(false);
  const guestMenuRef = useRef(null);
  const [location, setLocation] = useState(''); 
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [guests, setGuests] = useState({ adults: 2, children: 0 });

  // EFECTOS
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (guestMenuRef.current && !guestMenuRef.current.contains(e.target)) setShowGuestMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // LÓGICA DE NEGOCIO
  const updateGuests = (type, op, e) => {
    e.preventDefault(); e.stopPropagation();
    setGuests(prev => {
      const val = op === 'inc' ? prev[type] + 1 : prev[type] - 1;
      if (val < 0 || (type === 'adults' && val < 1)) return prev;
      return { ...prev, [type]: val };
    });
  };

  const handleSearch = (e) => {
    if(e) e.preventDefault();
    const params = new URLSearchParams();
    if (location && location !== "Santa Marta") params.append('busqueda', location);
    if (startDate) params.append('checkin', startDate.toISOString());
    if (endDate) params.append('checkout', endDate.toISOString());
    params.append('adultos', guests.adults);
    params.append('ninos', guests.children);
    navigate(`/propiedades?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto relative z-40 -mt-10 px-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-2 flex flex-col md:flex-row items-center border border-gray-100">
        
        {/* DESTINO */}
        <div className="relative w-full md:w-[25%] px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100 hover:bg-gray-50 rounded-[2rem] group transition-colors">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 group-hover:text-indigo-600">
            {t.dest}
          </label>
          <div className="flex items-center">
            <MapPin size={20} className="text-gray-400 mr-2 group-hover:text-indigo-600" />
            <select 
              className="w-full text-base font-bold text-gray-700 outline-none bg-transparent cursor-pointer appearance-none"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">{t.dest_ph}</option>
              <option value="Santa Marta">Santa Marta</option>
              <option value="Rodadero">Rodadero</option>
              <option value="Taganga">Taganga</option>
              <option value="Pozos Colorados">Pozos Colorados</option>
            </select>
          </div>
        </div>

        {/* FECHAS */}
        <div className="relative w-full md:w-[40%] px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100 hover:bg-gray-50 rounded-[2rem] group transition-colors">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 group-hover:text-indigo-600">
            {t.dates}
          </label>
          <div className="flex items-center">
            <CalendarIcon size={20} className="text-gray-400 mr-2 group-hover:text-indigo-600" />
            <DatePicker
              selectsRange startDate={startDate} endDate={endDate}
              onChange={(update) => setDateRange(update)}
              isClearable placeholderText={t.dates}
              className="w-full text-base font-bold text-gray-700 outline-none bg-transparent cursor-pointer"
              locale={language === 'zh' ? 'zh' : language}
              dateFormat="dd MMM" minDate={new Date()}
            />
          </div>
        </div>

        {/* VIAJEROS */}
        <div ref={guestMenuRef} className="relative w-full md:w-[35%] pl-6 pr-2 py-2 flex items-center justify-between hover:bg-gray-50 rounded-[2rem] cursor-pointer"
             onClick={() => setShowGuestMenu(!showGuestMenu)}>
          <div className="truncate">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              {t.guests}
            </label>
            <div className="flex items-center">
              <User size={20} className="text-gray-400 mr-2" />
              <span className="text-base font-bold text-gray-700">
                {guests.adults + guests.children} {t.guest_unit}
              </span>
            </div>
          </div>
          
          <button onClick={handleSearch} className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform">
            <Search size={20} strokeWidth={3} />
          </button>

          {/* MENU DESPLEGABLE */}
          {showGuestMenu && (
            <div className="absolute top-[120%] right-0 w-full md:w-80 bg-white rounded-3xl shadow-xl p-6 border border-gray-100 z-[60]">
              <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                <div>
                  <p className="font-bold text-gray-800">{t.adults}</p>
                  <p className="text-xs text-gray-400">{t.age_13}</p>
                </div>
                <div className="flex items-center gap-3">
                  <CounterBtn onClick={(e) => updateGuests('adults', 'dec', e)} disabled={guests.adults <= 1} icon={<Minus size={14}/>} />
                  <span className="font-bold">{guests.adults}</span>
                  <CounterBtn onClick={(e) => updateGuests('adults', 'inc', e)} icon={<Plus size={14}/>} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">{t.children}</p>
                  <p className="text-xs text-gray-400">{t.age_2_12}</p>
                </div>
                <div className="flex items-center gap-3">
                  <CounterBtn onClick={(e) => updateGuests('children', 'dec', e)} disabled={guests.children <= 0} icon={<Minus size={14}/>} />
                  <span className="font-bold">{guests.children}</span>
                  <CounterBtn onClick={(e) => updateGuests('children', 'inc', e)} icon={<Plus size={14}/>} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CounterBtn = ({ onClick, icon, disabled }) => (
  <button type="button" onClick={onClick} disabled={disabled}
    className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${disabled ? 'opacity-30' : 'hover:border-indigo-600 hover:text-indigo-600'}`}
  >
    {icon}
  </button>
);

export default SearchEngine;