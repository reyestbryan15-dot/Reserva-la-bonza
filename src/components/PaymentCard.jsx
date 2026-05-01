import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, MessageCircle, Loader2 } from 'lucide-react'; // Asegúrate de que los iconos coincidan con tu librería
import { MessageCircle as WhatsAppIcon } from 'lucide-react'; // Usaremos este para el botón
import emailjs from '@emailjs/browser';
import bancolombiaLogo from '../assets/bancolombia.svg';

// EXTRACCIÓN ESTRICTA DEL .ENV
const ACCOUNT_NUMBER = import.meta.env.VITE_BANCOLOMBIA_ACCOUNT;
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

const PaymentCard = ({
  reservationId = "PENDIENTE",
  totalPrice = "$0",
  customerName = "Cliente",
  customerEmail = "",
  propertyTitle = "Propiedad",
  t = {} // Objeto de traducciones
}) => {
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Función para copiar el número de cuenta
  const handleCopy = () => {
    if (!ACCOUNT_NUMBER) {
      console.error("Error: VITE_BANCOLOMBIA_ACCOUNT no definida en .env");
      return;
    }
    navigator.clipboard.writeText(ACCOUNT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentAction = async () => {
    if (!WHATSAPP_NUMBER) {
      alert("Error de configuración: Número de WhatsApp no encontrado.");
      return;
    }

    setIsSending(true);

    // Configuración EmailJS
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
      // 1. Envío de correo electrónico (Notificación para el dueño)
      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      // 2. Preparar mensaje de WhatsApp
      const baseMsg = t.whatsapp_msg || "Hola La Bonanza 👋. Adjunto comprobante de mi reserva.";
      const message = `${baseMsg}\n\n📌 ID: #${reservationId}\n🏠 ${propertyTitle}\n💰 Total: ${totalPrice}\n\nEspero confirmación.`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      // 3. Abrir WhatsApp en pestaña nueva
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error("Error en EmailJS:", error);
      // Si falla el mail, igual intentamos abrir WhatsApp
      const emergencyUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola, tengo un problema con mi reserva #${reservationId}`;
      window.open(emergencyUrl, '_blank');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 animate-in fade-in zoom-in duration-500">

      {/* CABECERA ESTILO BANCO */}
      <div className="bg-[#FDDA24] text-black p-6 rounded-t-3xl shadow-lg relative">
        <div className="flex justify-between items-end relative z-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">
              {t.total_price || "Total a Pagar"}
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight">{totalPrice}</h2>
          </div>
          <div className="bg-white/90 p-2 rounded-xl shadow-sm">
            <img src={bancolombiaLogo} alt="Bancolombia" className="h-8 w-auto object-contain" />
          </div>
        </div>
        <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-black bg-black/10 px-3 py-1 rounded-lg border border-black/5">
          <ShieldCheck size={14} />
          <span>REFERENCIA DE RESERVA: #{reservationId}</span>
        </div>
      </div>

      {/* CUERPO DE ACCIÓN */}
      <div className="bg-white rounded-b-3xl shadow-2xl p-6 space-y-6 border-x border-b border-gray-100">

        <div className="space-y-3">
          <p className="text-center text-sm font-semibold text-gray-600">
            {t.transfer_instruction || "Realiza la transferencia al número de cuenta:"}
          </p>

          <div
            onClick={handleCopy}
            className={`group p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${copied ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-[#FDDA24]'
              }`}
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                {t.account_type || "Ahorros Bancolombia"}
              </span>
              <code className="text-2xl font-mono font-black text-gray-900">
                {ACCOUNT_NUMBER || "No Configurado"}
              </code>
            </div>
            <div className="p-2 rounded-lg bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
              {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} className="text-gray-400" />}
            </div>
          </div>
          {copied && <p className="text-[10px] text-green-600 font-bold text-center animate-bounce">¡Número copiado!</p>}
        </div>

        {/* BOTÓN WHATSAPP */}
        <div className="space-y-3">
          <button
            onClick={handlePaymentAction}
            disabled={isSending}
            className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-black py-5 rounded-2xl shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-3 disabled:opacity-70 active:scale-95"
          >
            {isSending ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <WhatsAppIcon size={24} />
            )}
            <span className="text-lg">
              {isSending ? (t.processing || "Enviando...") : (t.send_receipt || "Enviar Comprobante")}
            </span>
          </button>

          <p className="text-center text-[10px] text-gray-400 font-medium leading-tight">
            {t.secure_payment_notice || "Presiona el botón para notificarnos tu pago. El chat de WhatsApp se abrirá automáticamente."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;