import React from 'react';
import { supabase } from '../../../backend/supabaseClient';
import { Trash2, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
// 1. IMPORTAR LIBRERÍAS PARA PDF
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// HEMOS AGREGADO = false PARA QUE SI NO RECIBE LA PROP, NO DE ERROR
const InventoryReservas = ({ items = [], refresh = () => { }, loading = false }) => {

    // 2. FUNCIÓN PARA GENERAR EL PDF PROFESIONAL
    const generarFacturaPDF = (reserva) => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.text("CONFIRMACIÓN DE RESERVA", 105, 20, { align: "center" });

        doc.setFontSize(10);
        doc.text(`Reserva ID: #RES-${reserva.id ? reserva.id.slice(0, 8).toUpperCase() : '000'}`, 105, 28, { align: "center" });

        doc.setFont(undefined, 'bold');
        doc.text("Reserva La Bonanza", 15, 40);
        doc.setFont(undefined, 'normal');
        doc.text("Santa Marta, Colombia", 15, 45);
        doc.text("Email: labonanzar@gmail.com", 15, 50);

        doc.autoTable({
            startY: 60,
            head: [['Detalle', 'Información']],
            body: [
                ['Huésped', reserva.nombre_cliente || 'No especificado'],
                ['Edificio / Propiedad', reserva.propiedad_titulo || 'No especificado'],
                ['Fecha de Llegada', reserva.fecha_inicio || '---'],
                ['Fecha de Salida', reserva.fecha_fin || '---'],
                ['Estado de Pago', 'CONFIRMADO'],
            ],
            theme: 'striped',
            headStyles: { fillColor: [37, 99, 235] }
        });

        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(9);
        doc.text("Presente este documento al llegar al hotel/edificio para su ingreso.", 15, finalY);

        return doc.output('blob');
    };

    // 3. FUNCIÓN PARA ENVIAR EL EMAIL
    const enviarEmailConfirmacion = async (reserva, publicUrl) => {
        const serviceId = 'service_zu8gjw7';
        const templateId = 'template_zj8rdrk';
        const publicKey = 'dbV1Lgl8cAfjnfoTz';

        const correoDestino = (reserva.email && reserva.email.includes('@'))
            ? reserva.email
            : 'labonanzar@gmail.com';

        const templateParams = {
            nombre_cliente: reserva.nombre_cliente,
            email_cliente: correoDestino,
            propiedad_titulo: reserva.propiedad_titulo,
            fecha_reserva: `${reserva.fecha_inicio} al ${reserva.fecha_fin}`,
            reserva_id: reserva.id,
            link_factura: publicUrl,
            admin_email: 'labonanzar@gmail.com'
        };

        try {
            await emailjs.send(serviceId, templateId, templateParams, publicKey);
            console.log("Correo enviado con éxito");
        } catch (error) {
            console.error("Error al enviar el correo:", error);
        }
    };

    const handleAprobar = async (reserva) => {
        try {
            const pdfBlob = generarFacturaPDF(reserva);
            const fileName = `factura_${reserva.id}.pdf`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('facturas')
                .upload(fileName, pdfBlob, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('facturas')
                .getPublicUrl(fileName);

            const { error: dbError } = await supabase
                .from('reservas')
                .update({ estado: 'confirmada' })
                .eq('id', reserva.id);

            if (dbError) throw dbError;

            await enviarEmailConfirmacion(reserva, publicUrl);

            alert("¡Reserva confirmada! Factura enviada al cliente.");
            refresh();

        } catch (error) {
            alert("Error en el proceso: " + error.message);
            console.error(error);
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Eliminar reserva permanentemente?")) {
            const { error } = await supabase.from('reservas').delete().eq('id', id);
            if (!error) refresh();
        }
    };

    // Si loading es undefined o null, ahora vale 'false' por defecto y no rompe
    if (loading) return <div className="p-10 text-center font-bold">Cargando reservas...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-black uppercase italic">Gestión de Reservas</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-500">
                        <tr>
                            <th className="p-5">Cliente / Propiedad</th>
                            <th className="p-5">Fechas</th>
                            <th className="p-5">Estado</th>
                            <th className="p-5 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items && items.length > 0 ? (
                            items.map(res => (
                                <tr key={res.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                                    <td className="p-5">
                                        <p className="font-bold text-slate-800 uppercase">{res.nombre_cliente}</p>
                                        <p className="text-[10px] text-blue-600 font-bold">{res.propiedad_titulo}</p>
                                        <p className="text-[9px] text-slate-400">{res.email}</p>
                                    </td>
                                    <td className="p-5 text-sm font-medium">
                                        {res.fecha_inicio} al {res.fecha_fin}
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded text-[9px] font-black uppercase ${res.estado === 'confirmada'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {res.estado || 'pendiente'}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right flex justify-end gap-3">
                                        {res.estado !== 'confirmada' && (
                                            <button
                                                onClick={() => handleAprobar(res)}
                                                className="text-green-500 hover:scale-110 transition flex flex-col items-center gap-1"
                                                title="Confirmar y enviar factura"
                                            >
                                                <CheckCircle size={20} />
                                                <span className="text-[8px] font-bold">APROBAR</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleEliminar(res.id)}
                                            className="text-slate-300 hover:text-red-500 transition"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-10 text-center text-slate-400">No hay reservas para mostrar.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryReservas;