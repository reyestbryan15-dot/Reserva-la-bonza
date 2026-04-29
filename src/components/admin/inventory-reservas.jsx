import React from 'react';
import { supabase } from '../../../backend/supabaseClient';
import { Trash2, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

const InventoryReservas = ({ items, refresh, loading }) => {

    // FUNCIÓN PARA ENVIAR EL CORREO DE CONFIRMACIÓN
    const enviarEmailConfirmacion = async (reserva) => {
        const serviceId = 'service_zu8gjw7';
        const templateId = 'template_zj8rdrk';
        const publicKey = 'dbV1Lgl8cAfjnfoTz';

        const templateParams = {
            nombre_cliente: reserva.nombre_cliente,
            // Usamos el nombre que definiste en EmailJS {{email_cliente}}
            // y le pasamos el valor de la columna 'email' de tu base de datos
            email_cliente: reserva.email,
            propiedad_titulo: reserva.propiedad_titulo,
            fecha_reserva: `${reserva.fecha_inicio} al ${reserva.fecha_fin}`,
            reserva_id: reserva.id
        };

        try {
            await emailjs.send(serviceId, templateId, templateParams, publicKey);
            console.log("Correo de confirmación enviado con éxito");
        } catch (error) {
            console.error("Error al enviar el correo:", error);
        }
    };

    const handleAprobar = async (reserva) => {
        // 1. Actualizar en Base de Datos a 'confirmada'
        const { error } = await supabase
            .from('reservas')
            .update({ estado: 'confirmada' })
            .eq('id', reserva.id);

        if (!error) {
            // 2. Si la DB se actualizó, disparamos el correo
            await enviarEmailConfirmacion(reserva);
            alert("¡Reserva confirmada! Las fechas se han bloqueado y el cliente ha sido notificado.");
            refresh();
        } else {
            alert("Error al actualizar: " + error.message);
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Eliminar reserva permanentemente? Esto liberará las fechas.")) {
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
                        {items.map(res => (
                            <tr key={res.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                                <td className="p-5">
                                    <p className="font-bold text-slate-800 uppercase">{res.nombre_cliente}</p>
                                    <p className="text-[10px] text-blue-600 font-bold">{res.propiedad_titulo}</p>
                                    {/* Cambiado a res.email para que coincida con tu lógica de DB */}
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
                                            title="Confirmar y enviar correo"
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryReservas;