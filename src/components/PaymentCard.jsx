import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, ArrowRight } from 'lucide-react';
// Asegúrate de que la ruta a tu SVG sea correcta
import bancolombiaLogo from '../assets/bancolombia.svg'; 

// --- 1. RECUPERAR VARIABLES DE ENTORNO ---
// Si no encuentra la variable, usa un string vacío o un fallback de seguridad
const ACCOUNT_NUMBER = import.meta.env.VITE_BANCOLOMBIA_ACCOUNT || "Error de Configuración";
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "573000000000";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="inline-block">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const PaymentCard = ({ 
  reservationId = "PENDIENTE", 
  totalPrice = "$0" 
  // Ya no recibimos props para el número, lo usamos directo del ENV
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ACCOUNT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppClick = () => {
    const message = `Hola ReservaLaBonanza 👋. Adjunto el comprobante de pago para la Reserva #${reservationId}. Transferí a Bancolombia el valor de ${totalPrice}.`;
    // Usamos el número del ENV
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-md mx-auto my-8 relative animate-in fade-in zoom-in duration-500">
      
      {/* 1. CABECERA */}
      <div className="bg-[#FDDA24] text-black p-6 rounded-t-3xl shadow-lg relative overflow-hidden">
        <div className="flex justify-between items-end z-10 relative">
            <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Total a Transferir</p>
                <h2 className="text-4xl font-extrabold tracking-tight">{totalPrice}</h2>
            </div>
            
            <div className="bg-white/90 px-4 py-2 rounded-lg shadow-sm border border-white/50 backdrop-blur-sm">
                <img src={bancolombiaLogo} alt="Bancolombia" className="h-8 object-contain" />
            </div>
        </div>
        
        <div className="mt-6 flex items-center gap-2 text-sm font-bold bg-black/5 p-2 rounded-lg w-max border border-black/5">
            <ShieldCheck size={16} />
            <span>ID Reserva: #{reservationId}</span>
        </div>
      </div>

      {/* 2. CUERPO */}
      <div className="bg-white rounded-b-3xl shadow-2xl border-x border-b border-gray-100 p-6 space-y-6">
        
        <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900">Transferencia o Consignación</h3>
            <p className="text-gray-500 text-sm">Cuenta de Ahorros</p>
        </div>

        {/* NÚMERO DE CUENTA (Desde ENV) */}
        <div className="space-y-2">
             <div 
                onClick={handleCopy}
                className={`group relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer bg-gray-50 ${
                    copied ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-200 hover:border-[#FDDA24] hover:bg-yellow-50/50 shadow-sm'
                }`}
            >
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Número de Cuenta</span>
                    {/* AQUÍ SE MUESTRA LA VARIABLE */}
                    <code className="text-2xl font-mono font-extrabold text-gray-900 tracking-widest">
                        {ACCOUNT_NUMBER}
                    </code>
                </div>
                <button className={`p-3 rounded-xl transition-colors ${copied ? 'text-green-600 bg-green-100' : 'text-gray-400 group-hover:text-black bg-white shadow-sm border'}`}>
                    {copied ? <Check size={20} strokeWidth={3} /> : <Copy size={20} />}
                </button>
            </div>
            {copied && (
                <p className="text-center text-xs font-bold text-green-600 animate-pulse">
                    ¡Copiado al portapapeles!
                </p>
            )}
        </div>

        {/* BOTÓN WHATSAPP */}
        <div className="pt-4 border-t border-gray-100">
            <button 
                onClick={handleWhatsAppClick}
                className="w-full group bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-green-200/50 transition-all flex items-center justify-center gap-3 transform active:scale-[0.98]"
            >
                <WhatsAppIcon />
                <span className="text-lg">Enviar Comprobante</span>
                <ArrowRight size={20} className="opacity-70 group-hover:translate-x-1 transition-transform"/>
            </button>
            <p className="text-center text-xs text-gray-400 mt-4 px-4">
                Una vez transfieras, envíanos la foto para confirmar.
            </p>
        </div>

      </div>
    </div>
  );
};

export default PaymentCard;