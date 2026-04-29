import React from 'react';

const ElegantLoader = () => {
    return (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
            {/* 1. Barra superior estilo YouTube (Azul y animada) */}
            <div className="absolute top-0 left-0 h-1 bg-blue-600 w-full shadow-[0_0_15px_rgba(37,99,235,0.7)] animate-pulse">
                <div className="h-full bg-blue-400 w-1/2 animate-[loading_1.5s_ease-in-out_infinite]" style={{
                    animation: 'loading 1.5s ease-in-out infinite'
                }}></div>
            </div>

            {/* 2. Contenido central */}
            <div className="flex flex-col items-center gap-5">
                {/* Spinner animado y elegante */}
                <div className="relative flex items-center justify-center w-16 h-16">
                    <div className="absolute w-full h-full border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute w-full h-full border-4 border-t-blue-600 rounded-full animate-spin"></div>
                </div>

                {/* Texto de la marca */}
                <p className="text-slate-500 font-black text-xs tracking-[0.3em] uppercase animate-pulse">
                    Reserva La Bonanza
                </p>
            </div>

            {/* Estilos CSS inline para la animación de la barra (estilo YouTube) */}
            <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
        </div>
    );
};

export default ElegantLoader;