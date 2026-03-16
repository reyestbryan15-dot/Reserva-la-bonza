import React from 'react';
import { MessageCircle, Facebook, Instagram, Mail, MapPin } from 'lucide-react';
import { BRAND } from '../config/brand';
import { useLanguage } from '../context/LanguageContext';

const Contacto = () => {
  const { t } = useLanguage();

  // Configuración de WhatsApp
  const CLEAN_PHONE = import.meta.env.VITE_WHATSAPP_NUMBER || BRAND.info.phone.replace(/[^0-9]/g, '');
  const whatsappLink = `https://wa.me/${CLEAN_PHONE}?text=Hola, me gustaría más información sobre sus servicios.`;

  // Dirección nueva y link a Maps
  const direccionExacta = "Edificio Cristal Caribbean, Cra. 2 # 8 - 50, El Rodadero, Santa Marta";
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionExacta)}`;

  // Función para manejar el envío de Email directo a Gmail
  const handleEmailClick = (e) => {
    e.preventDefault();
    const email = "labonanzar@gmail.com";
    const subject = encodeURIComponent("Consulta sobre Reservas");
    const body = encodeURIComponent("Hola, me gustaría obtener más información.");
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {/* TARJETA CENTRAL */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-lg text-center border border-gray-100">

        <h1 className="text-4xl font-black text-black mb-2 tracking-tighter">{t('contact.title')}</h1>
        <p className="text-gray-400 font-medium mb-8 uppercase text-xs tracking-widest">{t('contact.subtitle')}</p>

        {/* Info Textual Actualizada */}
        <div className="space-y-4 mb-10 text-gray-600 bg-gray-50 p-6 rounded-3xl">
          {/* LINK A GOOGLE MAPS */}
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 font-semibold hover:text-blue-600 transition-colors"
          >
            <MapPin size={20} className="text-blue-600 flex-shrink-0" />
            <span className="text-sm">{direccionExacta}</span>
          </a>

          <p className="flex items-center justify-center gap-3 font-semibold">
            <Mail size={20} className="text-blue-600" /> {BRAND.info.email}
          </p>
        </div>

        {/* GRILLA DE BOTONES (2x2) */}
        <div className="grid grid-cols-2 gap-4">

          {/* WhatsApp */}
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 p-5 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 hover:scale-105 transition-all shadow-lg shadow-emerald-100">
            <MessageCircle size={28} />
            <span className="text-[11px] font-black uppercase tracking-wider">WhatsApp</span>
          </a>

          {/* Botón de Email */}
          <button onClick={handleEmailClick}
            className="flex flex-col items-center justify-center gap-2 p-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-100">
            <Mail size={28} />
            <span className="text-[11px] font-black uppercase tracking-wider">{t('contact.send_email')}</span>
          </button>

          {/* Facebook */}
          <a href="https://www.facebook.com/reservas2021" target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 p-5 bg-indigo-800 text-white rounded-2xl hover:bg-indigo-900 hover:scale-105 transition-all shadow-lg shadow-indigo-100">
            <Facebook size={28} />
            <span className="text-[11px] font-black uppercase tracking-wider">Facebook</span>
          </a>

          {/* Instagram */}
          <a href="https://www.instagram.com/reservaslabonanza" target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 p-5 bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 text-white rounded-2xl hover:scale-105 transition-all shadow-lg shadow-red-100">
            <Instagram size={28} />
            <span className="text-[11px] font-black uppercase tracking-wider">Instagram</span>
          </a>

        </div>

        <p className="mt-10 text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em]">
          {t('contact.footer')}
        </p>
      </div>
    </div>
  );
};

export default Contacto;