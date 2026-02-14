/* ========================================================================
 * CONFIGURACIÓN MAESTRA DE LA MARCA (BRAND)
 * ========================================================================
 * Aquí centralizamos colores, datos y contactos.
 * Si cambias algo aquí, se actualiza en toda la página web.
 */

export const BRAND = {
  name: "Reservas La Bonanza",
  slogan: "Cabañas y Apartaestudios",
  
  // --- 1. COLORES OFICIALES ---
  // Usamos tus colores: Turquesa Mar (#0E7C7B) y Naranja Acción (#FF8C42)
  colors: {
    primary: "text-[#0E7C7B]",       // Texto Turquesa
    bgPrimary: "bg-[#0E7C7B]",        // Fondo Turquesa
    borderPrimary: "border-[#0E7C7B]",// Bordes Turquesa
    
    secondary: "text-[#FF8C42]",      // Texto Naranja
    bgSecondary: "bg-[#FF8C42]",      // Fondo Naranja (Botones)
    
    // Un gris suave para fondos claros
    light: "bg-gray-50",
  },

  // --- 2. DATOS DE CONTACTO ---
  info: {
    address: "Edificio Cristal Caribean, Rodadero. Cra 2 # 8-50",
    email: "labonanzar@gmail.com",
    
    // TELÉFONO VISIBLE (Con formato bonito para leer)
    phone: "(+57) 301 413 0338",
    
    // WHATSAPP (LÓGICA DE SEGURIDAD)
    // 1. Intenta leer el número oculto del archivo .env
    // 2. Si no existe, usa el número público de respaldo
    whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || "573014130338"
  },

  // --- 3. REDES SOCIALES ---
  social: {
    instagram: "https://instagram.com/ReservaBonanza", // Ajusta si es diferente
    facebook: "https://facebook.com/reservas2021",
    tiktok: "https://tiktok.com/@ReservaBonanza"
  },

  // --- 4. DATOS LEGALES (Opcional pero recomendado en Colombia) ---
  legal: {
    nit: "900.000.000-1", // Pon tu NIT si lo tienes
    rnt: "12345"          // Tu RNT (Registro Nacional de Turismo)
  }
};