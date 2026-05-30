import React, { useEffect, useState } from 'react';
import { Compass, Clock, Users, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
// 🔴 IMPORTANTE: Reemplaza esta ruta por el lugar real donde exportas tu 'supabase' configurado
import { supabase } from '../../backend/supabaseClient';

const ToursPage = () => {
    const { t } = useLanguage();
    // Creamos el estado para guardar los tours que traigamos de la base de datos
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    // Función para ir a buscar los tours a Supabase
    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                // Hacemos la consulta a tu tabla 'tours'
                const { data, error } = await supabase
                    .from('tours')
                    .select('*')
                    .eq('activo', true); // Solo trae los que estén activos

                if (error) throw error;

                setTours(data || []);
            } catch (error) {
                console.error('Error cargando los tours desde Supabase:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleWhatsAppContact = (tourName) => {
        const message = `Hola Bonanza! Me interesa el tour: ${tourName}. ¿Me dan más información?`;
        window.open(`https://wa.me/573000000000?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl font-bold text-indigo-900 animate-pulse">Cargando experiencias...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Hero de Tours */}
            <div className="bg-indigo-900 text-white py-20 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    {/* Usa la primera imagen del primer tour disponible como fondo, o una por defecto */}
                    <img
                        src={tours[0]?.imagenes?.[0] || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200"}
                        alt="background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black mb-4">Experiencias La Bonanza</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        Descubre la magia de Santa Marta, Cartagena y La Guajira con servicios certificados.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-12">
                {tours.length === 0 ? (
                    <p className="text-center text-gray-500">No hay tours disponibles en este momento.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tours.map((tour) => (
                            <div key={tour.id} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group">
                                {/* Imagen del Tour */}
                                <div className="h-64 relative overflow-hidden bg-gray-200">
                                    <img
                                        // Como en tu tabla guardamos un array de imágenes, tomamos la primera [0]
                                        src={tour.imagenes?.[0] || ''}
                                        alt={tour.titulo}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            // Imagen de respaldo si no hay foto en el array o el link falla
                                            e.target.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800';
                                        }}
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl font-black text-indigo-900 shadow-sm">
                                        {formatPrice(tour.price || tour.precio)}
                                    </div>
                                </div>

                                {/* Contenido */}
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{tour.titulo}</h3>

                                    <div className="flex gap-4 mb-6 text-sm text-gray-500">
                                        <span className="flex items-center gap-1"><Clock size={16} /> {tour.duracion}</span>
                                        <span className="flex items-center gap-1"><Users size={16} /> {tour.tipo_servicio}</span>
                                    </div>

                                    <div className="space-y-2 mb-8">
                                        {/* Mapeamos el array de beneficios que viene de la base de datos */}
                                        {(tour.beneficios || []).map((item, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleWhatsAppContact(tour.titulo)}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Compass size={20} />
                                        Reservar Experiencia
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ToursPage;