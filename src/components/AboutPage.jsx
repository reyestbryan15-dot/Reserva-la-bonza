import React from 'react';
import { Target, Eye, ShieldCheck, MapPin, CheckCircle, Briefcase, Users } from 'lucide-react';
import logoWTC from '../assets/logo-wtc-barranquilla.jpeg'; 

const AboutPage = () => {
  return (
    <div className="bg-white">
      
      {/* 1. HERO SECTION (Encabezado con Slogan) */}
      <div className="relative bg-indigo-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
            ¡Vive la mejor experiencia en Santa Marta!
          </h1>
          <p className="text-xl md:text-2xl font-light text-indigo-100">
            La Perla del Caribe te espera.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">

        {/* 2. QUIÉNES SOMOS (Texto de la Foto 5) */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-sm">
              <Users size={18} /> ¿Quiénes Somos?
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Promoviendo el turismo sostenible en el corazón del Magdalena
            </h2>
            <div className="text-gray-600 space-y-4 leading-relaxed text-justify">
              <p>
                Somos una agencia Operadora dedicada a promover el Turismo principalmente en la ciudad de Santa Marta, Colombia. Ofrecemos asesoría y conectamos al turista con las diversas opciones de hospedaje y atracciones que ofrece esta hermosa región.
              </p>
              <p>
                Gestionamos de forma ágil, responsable y segura sus reservaciones, ofreciendo siempre la mejor opción disponible. Contamos con un equipo profesional dispuesto siempre a brindar el soporte necesario para organizar su viaje y hacer de este una experiencia inolvidable.
              </p>
            </div>
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500">
            <img 
              src="https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&q=80" 
              alt="Santa Marta Rodadero" 
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* 3. MISIÓN Y VISIÓN (Textos de Foto 3 y 4) */}
        <section className="grid md:grid-cols-2 gap-8">
          {/* Tarjeta Misión */}
          <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-indigo-200 shadow-lg">
              <Briefcase size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Misión</h3>
            <p className="text-gray-600 leading-relaxed text-sm text-justify">
              Somos una empresa prestadora de Servicios Turísticos que responde a las necesidades y expectativas de los clientes, brindando asesoría clara y oportuna para que sus vacaciones puedan ser disfrutadas a plenitud. Es nuestra responsabilidad velar por el cumplimiento total de las ofertas, con un alto compromiso ambiental, económico y sociocultural de la región.
            </p>
          </div>

          {/* Tarjeta Visión */}
          <div className="bg-green-50 p-8 rounded-3xl border border-green-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-green-200 shadow-lg">
              <Eye size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Visión</h3>
            <p className="text-gray-600 leading-relaxed text-sm text-justify">
              Ser una agencia con cobertura nacional e internacional, sólida, sistematizada y vanguardista. Queremos capitalizar nuestras experiencias para brindar un servicio de alta calidad. Buscamos ser líderes en el mercado, reconocidos por nuestra seriedad, responsabilidad y alto estándar de servicio al cliente.
            </p>
          </div>
        </section>

        {/* 4. NUESTROS SERVICIOS (Texto de Foto 2) */}
        <section className="bg-gray-50 rounded-[3rem] p-10 md:p-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Servicios que Ofrecemos</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Todo lo que necesitas para tu viaje en un solo lugar.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Asesoría, organización y venta de Servicios Turísticos.",
              "Hospedaje: Hoteles, hostales, cabañas y aptos amoblados.",
              "Paquetes turísticos a lugares de interés en Santa Marta.",
              "Acompañamiento mediante modalidad de guía turístico.",
              "Transporte terrestre y marítimo (taxis, vans, lanchas, yates).",
              "Servicio de Alimentación y Lavandería.",
              "Atención al cliente 24 horas."
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
                <p className="text-gray-700 font-medium text-sm">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. LEGALIDAD (Texto de Foto 6) */}
        <section className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0 bg-gray-100 p-4 rounded-full">
            <ShieldCheck size={48} className="text-gray-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Legalidad y Confianza</h3>
            <p className="text-gray-500 text-sm mb-2">
              <strong>Reservas La Bonanza SAS</strong> es una agencia operadora turística identificada con el <strong>NIT 901593475-7</strong>.
            </p>
            <p className="text-gray-500 text-sm">
              Registrada bajo el <strong>RNT 114606</strong> del Ministerio de Desarrollo de Industria y Comercio, y matriculada en la Cámara de Comercio de Santa Marta (Nro. 254869). Cumplimos con todos los requisitos de Ley.
            </p>
          </div>
        </section>
{/* 6. AVAL INTERNACIONAL (Nueva Sección) */}
<section className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-inner">
  <div className="shrink-0 bg-white p-4 rounded-full shadow-md">
    {/* Aquí pones tu logo del WTC */}
    <img 
      src={logoWTC}
      alt="World Trade Center" 
      className="w-16 h-16 object-contain" 
    />
  </div>
  <div>
    <h3 className="text-xl font-bold text-blue-900 mb-2">Respaldo Internacional</h3>
    <p className="text-gray-700 text-sm leading-relaxed">
      Nos enorgullece contar con el aval y respaldo del <strong>World Trade Center</strong>, 
      lo cual garantiza que nuestros estándares de servicio y calidad cumplen con las 
      exigencias y protocolos de una de las organizaciones más prestigiosas a nivel global.
    </p>
  </div>
</section>
      </div>
    </div>
  );
};

export default AboutPage;