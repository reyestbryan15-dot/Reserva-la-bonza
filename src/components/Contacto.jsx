import React from 'react';
import { MessageCircle, Facebook, Instagram, Mail, MapPin } from 'lucide-react';
import { BRAND } from '../config/brand';
import { useLanguage } from '../context/LanguageContext';

const Contacto = () => {
  const { t } = useLanguage();
  const CLEAN_PHONE = import.meta.env.VITE_WHATSAPP_NUMBER || BRAND.info.phone.replace(/[^0-9]/g, '');
  const whatsappLink = `https://wa.me/${CLEAN_PHONE}?text=Hola, me gustaría más información sobre sus servicios.`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {/* TARJETA CENTRAL */}
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-lg text-center border border-gray-100">
        
        <h1 className="text-3xl font-black text-black mb-6">Contacto</h1>
        
        {/* Info Textual */}
        <div className="space-y-4 mb-10 text-gray-600">
          <p className="flex items-center justify-center gap-2">
            <MapPin size={18} /> {BRAND.info.address}
          </p>
          <p className="flex items-center justify-center gap-2">
            <Mail size={18} /> {BRAND.info.email}
          </p>
        </div>

        {/* BOTONES ABAJO */}
        <div className="grid grid-cols-3 gap-3">
          {/* WhatsApp */}
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" 
             className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all">
            <MessageCircle size={20} />
            <span className="text-[10px] font-bold uppercase">WhatsApp</span>
          </a>

          {/* Facebook */}
          <a href="https://www.facebook.com/reservas2021" target="_blank" rel="noopener noreferrer" 
             className="flex flex-col items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
            <Facebook size={20} />
            <span className="text-[10px] font-bold uppercase">Facebook</span>
          </a>

          {/* Instagram */}
          <a href="https://www.instagram.com/ReservaBonanza" target="_blank" rel="noopener noreferrer" 
             className="flex flex-col items-center justify-center gap-2 p-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-all">
            <Instagram size={20} />
            <span className="text-[10px] font-bold uppercase">Instagram</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contacto;