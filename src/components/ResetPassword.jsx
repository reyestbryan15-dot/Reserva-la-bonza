import React, { useState } from 'react';
import { supabase } from '../../backend/supabaseClient'; // Tu configuración de Supabase
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            alert("Error: " + error.message);
        } else {
            alert("¡Contraseña actualizada con éxito!");
            navigate('/login');
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Nueva Contraseña</h2>
                <p className="text-sm text-gray-500 mb-6 text-center">Escribe tu nueva clave para acceder a La Bonanza.</p>

                <form onSubmit={handleUpdatePassword}>
                    <input
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl mb-4 outline-none focus:border-indigo-500 transition-all"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                        {loading ? "Actualizando..." : "Confirmar Cambio"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;