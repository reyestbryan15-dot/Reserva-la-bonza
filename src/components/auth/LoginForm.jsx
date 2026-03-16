/* ========================================================================
 * SECCIÓN 1: IMPORTACIONES
 * ======================================================================== */
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../../backend/supabaseClient';

/* ========================================================================
 * SECCIÓN 2: CONSTANTES DE ACCESO
 * ======================================================================== */
const SOCIOS_EMAILS = [
  'toncelbryan17@gmail.com',
  'luboguarnizojoserafa@gmail.com',
  'labonanzar@gmail.com'
];

/* ========================================================================
 * SECCIÓN 3: LÓGICA DEL COMPONENTE
 * ======================================================================== */
const LoginForm = ({ onLoginSuccess, onForgotPassword, showToast }) => {

  // 3.1 Hooks y Estados Locales
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 3.2 Manejadores (Handlers)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // A. Autenticación con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.session) {
        // B. Obtener datos extra del perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        // C. Verificar privilegios (Socio vs Usuario)
        const emailUsuario = data.session.user.email.toLowerCase().trim();
        const esSocio = SOCIOS_EMAILS.includes(emailUsuario);

        // D. Definir Mensaje de Bienvenida
        let mensaje = "¡Bienvenido!";

        if (esSocio) {
          mensaje = "🔒 Acceso Concedido: Super Socio";
        } else if (profile) {
          if (profile.role === 'hotel') {
            mensaje = `🏨 Bienvenido Hotelero: ${profile.company_name || 'Gestor'}`;
          } else if (profile.role === 'client') {
            mensaje = `🎒 ¡Hola Viajero, ${profile.full_name || 'Amigo'}!`;
          }
        }

        // E. Finalizar proceso
        showToast(mensaje, 'success');
        onLoginSuccess(data.session, esSocio);
      }

    } catch (error) {
      console.error("Error login:", error.message);
      showToast(t('auth.error_key') || 'Correo o contraseña incorrectos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /* ========================================================================
   * SECCIÓN 4: RENDERIZADO (JSX)
   * ======================================================================== */
  return (
    <div className="animate-in slide-in-from-left fade-in duration-300">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        {t('auth.login_title') || 'Iniciar Sesión'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Campo: Email */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {t('auth.email_label') || 'Correo Electrónico'}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder={t('auth.email_ph') || 'ejemplo@correo.com'}
            />
          </div>
        </div>

        {/* Campo: Contraseña */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {t('auth.password_label') || 'Contraseña'}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder={t('auth.password_ph') || '******'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600 focus:outline-none transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-end mt-1">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-blue-600 hover:underline hover:text-blue-800 transition-colors"
            >
              {t('auth.forgot_pass') || '¿Olvidaste tu contraseña?'}
            </button>
          </div>
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all transform flex justify-center items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
        >
          {isLoading ? (
            <span>{t('auth.btn_validating') || 'Validando...'}</span>
          ) : (
            <>
              <span>{t('auth.btn_enter') || 'Entrar'}</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Footer Seguro */}
      <div className="mt-6 pt-6 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">
          {t('auth.secure_text') || 'Acceso seguro SSL'}
        </p>
      </div>
    </div>
  );
};

export default LoginForm;