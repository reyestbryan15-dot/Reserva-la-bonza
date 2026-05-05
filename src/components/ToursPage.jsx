import React from 'react';
import { Compass, MapPin, Clock, Users, CheckCircle2, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TOURS_DATA = [
    {
        id: 'bahia-concha',
        title: 'Bahía Concha',
        price: 100000,
        image: 'https://images.unsplash.com/photo-1590577976322-3d231871f9bc?q=80&w=800', // Ejemplo: Playa cristalina
        duration: 'Día completo',
        group: 'Compartido',
        includes: ['Seguro de asistencia', 'Transporte en Chiva Rumbera', 'Guía profesional', 'Almuerzo típico']
    },
    {
        id: 'playa-cristal',
        title: 'Playa Cristal',
        price: 150000,
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800',
        duration: 'Día completo',
        group: 'Compartido',
        includes: ['Transporte en Vans ida y vuelta', 'Traslado en lancha', 'Entradas al PNN Tayrona', 'Guía profesional']
    },
    {
        id: 'cabo-san-juan',
        title: 'Cabo San Juan',
        price: 150000,
        image: 'https://images.unsplash.com/photo-1589394815804-964ed9be2eb3?q=80&w=800',
        duration: 'Día completo',
        group: 'Senderismo',
        includes: ['Seguro de asistencia', 'Entradas al Parque', 'Transporte en buseta', 'Guía acompañante']
    },
    {
        id: 'minca-pozo-azul',
        title: 'Minca y Pozo Azul',
        price: 120000,
        image: 'https://images.unsplash.com/photo-1624823183493-909249704253?q=80&w=800',
        duration: '8 Horas',
        group: 'Naturaleza',
        includes: ['Desayuno', 'Almuerzo', 'Transporte Vans y Lancha', 'Guía especializado']
    }
];

const ToursPage = () => {
    const { t } = useLanguage();

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

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Hero de Tours */}
            <div className="bg-indigo-900 text-white py-20 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img src="https://images.unsplash.com/photo-1565374395427-4c8d0fb27c0f?q=80&w=1200" alt="background" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black mb-4">Experiencias La Bonanza</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        Descubre la magia de Santa Marta y el Tayrona con guías locales y servicios certificados.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {TOURS_DATA.map((tour) => (
                        <div key={tour.id} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group">
                            {/* Imagen del Tour */}
                            <div className="h-64 relative overflow-hidden">
                                <img
                                    src={tour.image}
                                    alt={tour.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl font-black text-indigo-900 shadow-sm">
                                    {formatPrice(tour.price)}
                                </div>
                            </div>

                            {/* Contenido */}
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{tour.title}</h3>

                                <div className="flex gap-4 mb-6 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><Clock size={16} /> {tour.duration}</span>
                                    <span className="flex items-center gap-1"><Users size={16} /> {tour.group}</span>
                                </div>

                                <div className="space-y-2 mb-8">
                                    {tour.includes.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleWhatsAppContact(tour.title)}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Compass size={20} />
                                    Reservar Experiencia
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ToursPage;