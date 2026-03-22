import React from 'react';

const PropertyVideo = ({ url }) => {
    if (!url) return null;

    // Función para convertir links normales de YouTube en links de "incrustar"
    const getEmbedUrl = (videoUrl) => {
        try {
            let videoId = '';
            if (videoUrl.includes('youtube.com/watch?v=')) {
                videoId = videoUrl.split('v=')[1].split('&')[0];
            } else if (videoUrl.includes('youtu.be/')) {
                videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : videoUrl;
        } catch (e) {
            return videoUrl;
        }
    };

    const finalUrl = getEmbedUrl(url);

    return (
        <div className="mt-8 mb-12">
            <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase italic tracking-tighter">
                Recorrido Virtual
            </h3>
            <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                <iframe
                    src={finalUrl}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video de la propiedad"
                ></iframe>
            </div>
        </div>
    );
};

export default PropertyVideo;