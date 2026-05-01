import React from 'react';
import { supabase } from '../../../backend/supabaseClient';
import { Trash2, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import jsPDF from 'jsPDF';
import autoTable from 'jspdf-autotable';

const InventoryReservas = ({ items = [], refresh = () => { }, loading = false }) => {

    // 1. FUNCIÓN PARA GENERAR EL PDF CON TODOS LOS DATOS SOLICITADOS
    const generarFacturaPDF = (reserva) => {
        const doc = new jsPDF();

        // Encabezado
        doc.setFontSize(18);
        doc.setTextColor(37, 99, 235);
        doc.text("FACTURA DE RESERVA", 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text("RESERVA LA BONANZA", 105, 28, { align: 'center' });
        doc.text("NIT: 901593475-7", 105, 33, { align: 'center' });

        // Información de la factura y fecha de transacción
        doc.setFontSize(11);
        const numeroFactura = reserva.id.toString().slice(-5).toUpperCase();
        doc.text(`Número de Factura: #INV-${numeroFactura}`, 15, 45);
        doc.text(`Fecha de Transacción: ${new Date().toLocaleDateString('es-CO')}`, 15, 52);

        // Tabla con fechas de llegada/salida y huéspedes
        autoTable(doc, {
            startY: 60,
            head: [['Descripción del Servicio', 'Detalle']],
            body: [
                ['Propiedad / Edificio', reserva.propiedad_titulo || 'No especificado'],
                ['Huésped Principal', reserva.nombre_cliente || 'No especificado'],
                ['Fecha de Llegada (Check-in)', reserva.fecha_llegada || reserva.fecha_llegada || '---'],
                ['Fecha de Salida (Check-out)', reserva.fecha_salida || reserva.fecha_salida || '---'],
                ['Cantidad de huespedes', reserva.huespedes || '1']
            ], // <-- Aquí faltaba cerrar el corchete del body y la coma
            theme: 'striped',
            headStyles: { fillColor: [37, 99, 235] }
        });

        // Valor total pagado
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        const precioFormateado = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(reserva.precio_total);

        doc.text(`TOTAL PAGADO: ${precioFormateado}`, 15, finalY);

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text("Gracias por elegir Reserva La Bonanza.", 105, finalY + 20, { align: 'center' });

        return doc.output('blob'); // Retornamos el BLOB directamente para subirlo
    };

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
        } catch (error) {
            console.error("Error EmailJS:", error);
        }
    };

    const handleAprobar = async (reserva) => {
        try {
            // Generamos el Blob del PDF
            const pdfBlob = generarFacturaPDF(reserva);
            const fileName = `factura_${reserva.id}.pdf`;

            // 2. SUBIDA A STORAGE (CON CONTENT-TYPE CORREGIDO)
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('facturas')
                .upload(fileName, pdfBlob, {
                    cacheControl: '3600',
                    upsert: true,
                    contentType: 'application/pdf' // <--- CRÍTICO PARA EVITAR ERROR 400
                });

            if (uploadError) throw uploadError;

            // Obtener URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('facturas')
                .getPublicUrl(fileName);

            // Actualizar estado en DB
            const { error: dbError } = await supabase
                .from('reservas')
                .update({ estado: 'confirmada' })
                .eq('id', reserva.id);

            if (dbError) throw dbError;

            // Enviar correo
            await enviarEmailConfirmacion(reserva, publicUrl);

            alert("¡Reserva confirmada y factura enviada!");
            refresh();

        } catch (error) {
            alert("Error: " + error.message);
            console.error(error);
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Eliminar reserva permanentemente?")) {
            const { error } = await supabase.from('reservas').delete().eq('id', id);
            if (!error) refresh();
        }
    };

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