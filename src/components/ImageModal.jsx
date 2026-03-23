import React from 'react';
import { X } from 'lucide-react';

// Añadimos 'imageSrc' a la desestructuración por si acaso se envía con ese nombre
const ImageModal = ({ isOpen, mediaUrl, imageSrc, onClose }) => {
    // Usamos el que venga disponible
    const finalUrl = mediaUrl || imageSrc;

    if (!isOpen || !finalUrl) return null;

    // Función para detectar si es un link de YouTube
    const isYoutube = (url) => typeof url === 'string' && (url.includes('youtube.com') || url.includes('youtu.be'));

    const getEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : null;
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm" onClick={onClose}>
            <button onClick={onClose} className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
                <X size={30} />
            </button>

            <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-2" onClick={(e) => e.stopPropagation()}>
                {isYoutube(finalUrl) ? (
                    <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                        <iframe
                            className="w-full h-full"
                            src={getEmbedUrl(finalUrl)}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <img
                        src={finalUrl}
                        className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                        alt="Visualización"
                    />
                )}
            </div>
        </div>
    );
};

export default ImageModal;