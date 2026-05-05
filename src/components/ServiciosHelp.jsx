import React from 'react';
import { Home, Tag, Compass, Key, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const ServiciosHelp = () => {
    const { t } = useLanguage();

    const servicios = [
        {
            title: "Propiedades (Alquiler)",
            description: "Reserva apartamentos y casas vacacionales con total seguridad. Ideal para tus días de descanso.",
            icon: <Home className="text-blue-600" size={32} />,
            link: "/propiedades",
            color: "bg-blue-50"
        },
        {
            title: "Ventas e Inversión",
            description: "¿Buscas comprar? Aquí encuentras casas, apartamentos y proyectos nuevos para invertir.",
            icon: <Tag className="text-emerald-600" size={32} />,
            link: "/ventas",
            color: "bg-emerald-50"
        },
        {
            title: "Tours y Experiencias",
            description: "Paga y reserva tus aventuras en el Tayrona, Minca y más. Todo listo para tu llegada.",
            icon: <Compass className="text-amber-600" size={32} />,
            link: "/tours",
            color: "bg-amber-50"
        },
        {
            title: "Publicar Propiedad",
            description: "Si eres propietario, inicia sesión y publica con nosotros para empezar a ganar.",
            icon: <Key className="text-indigo-600" size={32} />,
            link: "/login",
            color: "bg-indigo-50"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            {/* Encabezado */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight">
                    ¿Cómo podemos ayudarte hoy?
                </h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Explora nuestro ecosistema de servicios. En Bonanza te acompañamos en cada paso de tu viaje o inversión.
                </p>
            </div>

            {/* Rejilla de Servicios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {servicios.map((item, index) => (
                    <Link
                        key={index}
                        to={item.link}
                        className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                    >
                        <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            {item.icon}
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                            {item.description}
                        </p>

                        <div className="flex items-center text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                            IR AHORA <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Sección Extra: ¿Necesitas algo más? */}
            <div className="mt-16 bg-gray-900 rounded-[2rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <HelpCircle className="text-blue-400" /> ¿Tienes dudas adicionales?
                    </h2>
                    <p className="text-gray-400">Nuestro equipo de soporte está listo para asesorarte en lo que necesites.</p>
                </div>
                <Link
                    to="/contacto"
                    className="bg-white text-black px-8 py-4 rounded-full font-black hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                    CONTÁCTANOS
                </Link>
            </div>
        </div>
    );
};

export default ServiciosHelp;