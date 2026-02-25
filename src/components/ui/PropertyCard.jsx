import React from 'react';
import { MapPin, Star, User, Heart } from 'lucide-react';
import { BRAND } from '../../config/brand'; // Ajusta la ruta según donde estés

export default function PropertyCard({ img, title, type, location, price, rating, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group relative"
    >
      {/* IMAGEN Y ETIQUETAS */}
      <div className="relative h-64 overflow-hidden rounded-t-2xl">
        <img 
          src={img} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          alt={title} 
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow text-gray-800 uppercase tracking-wide border border-gray-200">
          {type}
        </div>
        <button className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white text-gray-700 transition-colors">
          <Heart size={18} />
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center text-xs text-gray-500 font-medium mb-1">
              <MapPin size={14} className={`mr-1 ${BRAND.colors.primary}`} /> 
              {location}
            </div>
            <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#0E7C7B] transition-colors leading-tight">
              {title}
            </h4>
          </div>
          <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            <Star size={12} className="text-yellow-400 mr-1 fill-yellow-400" /> 
            <span className="text-xs font-bold">{rating}</span>
          </div>
        </div>
        
        <div className="flex items-end justify-between border-t border-gray-100 pt-4 mt-4">
          <div>
            <span className={`text-xl font-bold ${BRAND.colors.primary}`}>${price}</span>
            <span className="text-gray-400 text-xs"> / noche</span>
          </div>
          <Link to={`/detalle/${data.id}${searchParams}`}>
          Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
}