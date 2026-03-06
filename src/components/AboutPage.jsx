import React from 'react';
import { Target, Eye, ShieldCheck, MapPin, CheckCircle, Briefcase, Users, ExternalLink, Globe, X } from 'lucide-react';
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

{/* 6. AVAL INTERNACIONAL - World Trade Center */}
<section className="bg-gradient-to-r from-blue-50 to-white border-2 border-blue-200 rounded-[2.5rem] p-8 md:p-12 shadow-lg relative overflow-hidden mt-20">
  <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-10 pointer-events-none">
    <Target size={150} className="text-blue-900" />
  </div>

  <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
    {/* Logo que abre la imagen en pestaña nueva */}
    <div className="group relative">
      <a 
        href="/certificado-wtc.jpg" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block shrink-0 bg-white p-6 rounded-full shadow-xl border border-blue-100 transition-transform duration-300 hover:scale-110 cursor-pointer"
      >
        <img 
          src={logoWTC}
          alt="World Trade Center Barranquilla" 
          className="w-24 h-24 object-contain" 
        />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-black shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
          VER DOCUMENTO
        </div>
      </a>
    </div>

    <div className="flex-1 text-center md:text-left">
      <h3 className="text-2xl md:text-3xl font-black text-blue-900 mb-4 leading-tight">
        World Trade Center Barranquilla — <br className="hidden md:block"/>
        <span className="text-blue-600 font-extrabold text-xl md:text-2xl">Oficina de Representación Reserva La Bonanza Santa Marta</span>
      </h3>
      
      <p className="text-gray-700 text-lg leading-relaxed mb-6 italic text-justify md:text-left">
        "Como oficina oficial de <strong>WTC Barranquilla</strong> en Santa Marta, en <strong>Reserva La Bonanza</strong> fusionamos nuestra experiencia en turismo con la red de negocios más potente del mundo. Nuestra misión es proyectar el potencial de nuestra región hacia una <strong>expansión nacional y mundial</strong>, conectando el Caribe con oportunidades globales bajo estándares internacionales".
      </p>

      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Botón que abre la certificación en pantalla completa */}
        <a 
          href="/certificado-wtc.jpg" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-900 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
          <ShieldCheck size={20} />
          Ver Certificación de Apoyo Legal
          <ExternalLink size={16} className="ml-1" />
        </a>
        <p className="text-[11px] text-gray-400 font-medium">
          * Operada bajo licencia exclusiva de World Trade Center Barranquilla.
        </p>
      </div>
    </div>
  </div>
</section>

      </div>

    </div>

  );

};



export default AboutPage;