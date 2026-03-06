import React from 'react';
import { Link } from 'react-router-dom';
import { Maximize, Bed, Bath, Waves, MapPin, Star, ChevronLeft, Car } from 'lucide-react';

const Ventas = () => {
  const PHONE = "573218661366";

  // 1. BASE DE DATOS DE VENTAS
  const propiedadesVenta = [
    {
      id: 1,
      nombre: "Edificio Bavaria - Dúplex Premium",
      ciudad: "Cartagena",
      ubicacion: "Pisos 23 y 24",
      precio: "$1.680.000.000 COP",
      usd: "USD 450,000",
      area: "168m²",
      hab: "3",
      banos: "4",
      detalles: ["Totalmente Amueblado", "Estrato 6", "Título Limpio", "Vista al Mar"],
      imagen: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070",
      tipo: "Dúplex de Lujo"
    },
    {
      id: 2,
      nombre: "Edificio SKY TOWER - Apto 1007",
      ciudad: "Santa Marta",
      ubicacion: "Piso 10",
      precio: "Consultar Precio", // Aquí puedes cambiarlo por el valor real
      usd: "Oportunidad de Inversión",
      area: "55m² + 9.85m² Terraza",
      hab: "1", // Ajustar si son más
      banos: "1",
      detalles: ["Apto para Arrendar", "Piscina", "Parqueadero 15.5m²", "Piso 2 (#06)"],
      imagen: "https://images.unsplash.com/photo-1493397212122-2b85edf8106b?q=80&w=2070",
      tipo: "Apto. Inversión / Rentas"
    },
    {
    id: 3,
    nombre: "Edificio Meraki - Serena del Mar",
    ciudad: "Cartagena",
    ubicacion: "Zona Norte (La Ciudad Soñada)",
    precio: "$850.000.000 COP",
    usd: "USD 215,000 aprox.",
    area: "86m² Privados",
    hab: "1",
    banos: "1",
    detalles: ["Para Estrenar", "Estrato 6", "Piso 3", "Club Residencial", "Cerca al Hospital Serena"],
    imagen: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070", // Usar foto real del proyecto Meraki
    tipo: "Apartamento de Lujo"
  },
  {
    id: 4,
    nombre: "Burano - Serena del Mar (Torre 5)",
    ciudad: "Cartagena",
    ubicacion: "Apto 206 - Zona Norte",
    precio: "$580.000.000 COP",
    usd: "Opción: $570M (Sin muebles)",
    area: "Consultar m²", // Generalmente estos aptos tienen entre 60 y 80 m²
    hab: "2", // Confirmar si es de 2 o 3 habitaciones
    banos: "2",
    detalles: [
      "Opción Puerta Cerrada", 
      "Incluye Parqueadero", 
      "Depósito Incluido", 
      "Aires Acondicionados", 
      "Entrega de Llaves Inmediata"
    ],
    imagen: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080", 
    tipo: "Venta Urgente"
  },
  {
    id: 5,
    nombre: "Eco Seine Ken Tayrona",
    ciudad: "Santa Marta / Vía Tayrona",
    ubicacion: "Sector Ecoturístico",
    precio: "Consultar Lanzamiento", 
    usd: "Inversión Sostenible",
    area: "Varias áreas disponibles",
    hab: "1 - 2",
    banos: "1 - 2",
    detalles: [
      "Proyecto Ecológico", 
      "Cerca al Parque Tayrona", 
      "Alta Valorización", 
      "Enfoque de Sostenibilidad",
      "Ideal para Glamping de Lujo / AirBnb"
    ],
    imagen: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000", 
    tipo: "Proyecto Ecoturístico"
  }
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header de Sección */}
      <div className="bg-black py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 italic">PORTAFOLIO DE VENTAS</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Propiedades exclusivas seleccionadas para inversión y vivienda de alto nivel en el Caribe Colombiano.
        </p>
      </div>

      {/* Contenedor de Tarjetas */}
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-12">
        {propiedadesVenta.map((prop) => (
          <div key={prop.id} className="flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
            
            {/* LADO IMAGEN */}
            <div 
              className="md:w-1/2 h-72 md:h-auto bg-cover bg-center relative"
              style={{ backgroundImage: `url(${prop.imagen})` }}
            >
              <div className="absolute top-6 left-6 bg-[#D4AF37] text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                {prop.tipo}
              </div>
            </div>

            {/* LADO TEXTO */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-tighter mb-2">
                <Star size={14} fill="#D4AF37" /> Propiedad Verificada
              </div>
              
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">{prop.nombre}</h2>
              <p className="text-gray-500 flex items-center gap-2 mb-6">
                <MapPin size={16} /> {prop.ciudad} — {prop.ubicacion}
              </p>

              {/* Precios */}
              <div className="mb-6">
                <span className="text-2xl font-black text-gray-900 block">{prop.precio}</span>
                <span className="text-sm font-medium text-gray-400 italic">{prop.usd}</span>
              </div>

              {/* Grid de Iconos */}
              <div className="grid grid-cols-4 gap-2 mb-8 bg-gray-50 p-4 rounded-2xl">
                <div className="flex flex-col items-center border-r border-gray-200">
                  <Maximize size={18} className="text-gray-400 mb-1" />
                  <span className="text-[10px] font-bold text-gray-600">{prop.area}</span>
                </div>
                <div className="flex flex-col items-center border-r border-gray-200">
                  <Bed size={18} className="text-gray-400 mb-1" />
                  <span className="text-[10px] font-bold text-gray-600">{prop.hab} Hab</span>
                </div>
                <div className="flex flex-col items-center border-r border-gray-200">
                  <Bath size={18} className="text-gray-400 mb-1" />
                  <span className="text-[10px] font-bold text-gray-600">{prop.banos} Baños</span>
                </div>
                <div className="flex flex-col items-center">
                  <Car size={18} className="text-gray-400 mb-1" />
                  <span className="text-[10px] font-bold text-gray-600">Parking</span>
                </div>
              </div>

              {/* Lista de Detalles */}
              <div className="flex flex-wrap gap-2 mb-8">
                {prop.detalles.map((detalle, index) => (
                  <span key={index} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-lg uppercase">
                    {detalle}
                  </span>
                ))}
              </div>

              {/* Acciones */}
              <div className="flex flex-col gap-3">
                <a 
                  href={`https://wa.me/${PHONE}?text=Me interesa el ${prop.nombre}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-gray-900 text-white text-center py-4 rounded-2xl font-bold hover:bg-black transition-all active:scale-95 shadow-lg"
                >
                  Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        ))}

        <div className="text-center pt-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors">
            <ChevronLeft size={20} /> Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Ventas;