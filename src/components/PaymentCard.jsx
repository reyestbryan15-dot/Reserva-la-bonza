import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import bancolombiaLogo from '../assets/bancolombia.svg';

const ACCOUNT_NUMBER = import.meta.env.VITE_BANCOLOMBIA_ACCOUNT || "Error de Configuración";
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "573000000000";

const PaymentCard = ({
  reservationId = "PENDIENTE",
  totalPrice = "$0",
  customerName = "Cliente",
  customerEmail = "",
  propertyTitle = "Propiedad",
  // 't' sería el objeto que contiene tu JSON (por ejemplo: translations.booking)
  t = {}
}) => {
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ACCOUNT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendValidationEmail = async () => {
    setIsSending(true);

    // Configura tus IDs de EmailJS aquí
    const serviceId = 'service_zu8gjw7';
    const templateId = 'template_7ydhow2';
    const publicKey = 'dbV1Lgl8cAfjnfoTz';

    const templateParams = {
      nombre_cliente: customerName,
      email_cliente: customerEmail,
      propiedad_titulo: propertyTitle,
      reserva_id: reservationId,
      total: totalPrice
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      // Mensaje de WhatsApp usando tus variables
      const message = `Hola ReservaLaBonanza 👋. ${t.success_message} ID: #${reservationId}. Valor: ${totalPrice}.`;
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      alert(t.success_message || "Validando pago...");
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 relative animate-in fade-in zoom-in duration-500">

      {/* 1. CABECERA */}
      <div className="bg-[#FDDA24] text-black p-6 rounded-t-3xl shadow-lg relative overflow-hidden">
        <div className="flex justify-between items-end z-10 relative">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">
              {t.total_price || "Total Price"}
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight">{totalPrice}</h2>
          </div>
          <div className="bg-white/90 px-4 py-2 rounded-lg shadow-sm border border-white/50 backdrop-blur-sm">
            <img src={bancolombiaLogo} alt="Bancolombia" className="h-8 object-contain" />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2 text-sm font-bold bg-black/5 p-2 rounded-lg w-max border border-black/5">
          <ShieldCheck size={16} />
          <span>ID: #{reservationId}</span>
        </div>
      </div>

      {/* 2. CUERPO */}
      <div className="bg-white rounded-b-3xl shadow-2xl border-x border-b border-gray-100 p-6 space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900">
            {t.building_registration || "Transferencia"}
          </h3>
          <p className="text-gray-500 text-sm">Bancolombia</p>
        </div>

        <div className="space-y-2">
          <div onClick={handleCopy} className={`group relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer bg-gray-50 ${copied ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-[#FDDA24]'}`}>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-400">
                {t.id_number || "Account Number"}
              </span>
              <code className="text-2xl font-mono font-extrabold text-gray-900 tracking-widest">{ACCOUNT_NUMBER}</code>
            </div>
            <button className="p-3 rounded-xl transition-colors text-gray-400">
              {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        {/* BOTÓN DINÁMICO */}
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={sendValidationEmail}
            disabled={isSending}
            className="w-full group bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isSending ? <Loader2 className="animate-spin" /> : <ArrowRight size={20} />}
            <span className="text-lg">
              {isSending ? (t.processing || "...") : (t.confirm_button || "Confirm")}
            </span>
          </button>
          <p className="text-center text-xs text-gray-400 mt-4 px-4">
            {t.pending_notice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;