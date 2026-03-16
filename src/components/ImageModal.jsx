import React from 'react';
import { X } from 'lucide-react';

const ImageModal = ({ isOpen, imageSrc, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <button
                className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors bg-white/10 p-2 rounded-full"
                onClick={onClose}
            >
                <X size={32} />
            </button>

            <img
                src={imageSrc}
                alt="Visualización"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            />
        </div>
    );
};

export default ImageModal;