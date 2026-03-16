import React from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale'; // Para que el calendario esté en español
import { Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Registramos el idioma español
registerLocale('es', es);

const DateRangeSelector = ({ startDate, endDate, onChange, className = "" }) => {
  const { t } = useLanguage();
  
  return (
    <div className={`flex flex-col md:flex-row items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      
      {/* INPUT 1: LLEGADA */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <CalendarIcon className="h-5 w-5 text-sky-500" />
        </div>
        <DatePicker
          selected={startDate}
          onChange={(date) => onChange([date, endDate])}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()} // No permite fechas pasadas
          locale="es"
          dateFormat="dd/MM/yyyy"
          placeholderText={t('booking.check_in')}
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-700 font-bold focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all cursor-pointer outline-none"
        />
        <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold text-sky-600 uppercase tracking-wider">
          {t('booking.check_in')}
        </label>
      </div>

      {/* FLECHA DECORATIVA */}
      <ArrowRight className="hidden md:block text-gray-300 w-6 h-6" />

      {/* INPUT 2: SALIDA */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <CalendarIcon className="h-5 w-5 text-indigo-500" />
        </div>
        <DatePicker
          selected={endDate}
          onChange={(date) => onChange([startDate, date])}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate} // No puedes salir antes de llegar
          locale="es"
          dateFormat="dd/MM/yyyy"
          placeholderText={t('booking.check_out')}
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-700 font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer outline-none"
        />
         <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
          {t('booking.check_out')}
        </label>
      </div>

    </div>
  );
};

export default DateRangeSelector;