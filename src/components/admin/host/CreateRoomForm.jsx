import React, { useState } from 'react';
import { Upload, X, DollarSign, Users, MapPin, Hash, FileText, ImageIcon, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

const CreateRoomForm = ({ onCancel, onSave }) => {
    const { t } = useLanguage();
    const [images, setImages] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        roomNumber: '',
        capacity: '',
        price: '',
        address: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = files.map(file => URL.createObjectURL(file));
            setImages([...images, ...newImages]);
        }
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header con estilo de "Estudio de Diseño" */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <button
                        onClick={onCancel}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-4 font-black uppercase text-[10px] tracking-[0.2em]"
                    >
                        <ChevronLeft size={14} /> {t('admin.btn_back')}
                    </button>
                    <h2 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">
                        {t('admin.create_title')}
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">{t('admin.create_subtitle')}</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <form className="p-8 md:p-12 space-y-12" onSubmit={(e) => e.preventDefault()}>

                    {/* SECCIÓN 1: GALERÍA VISUAL */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <ImageIcon size={18} className="text-slate-900" />
                            <label className="text-xs font-black text-slate-900 uppercase tracking-widest italic">
                                {t('admin.photos_label')}
                            </label>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <label className="group border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-8 cursor-pointer hover:border-slate-900 hover:bg-slate-50 transition-all h-40">
                                <Upload className="text-slate-300 group-hover:text-slate-900 mb-2 transition-colors" />
                                <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-tighter">
                                    {t('admin.upload_btn')}
                                </span>
                                <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                            </label>

                            {images.map((img, index) => (
                                <div key={index} className="relative group rounded-[2rem] overflow-hidden h-40 border border-slate-100">
                                    <img src={img} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-3">
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="bg-white text-slate-900 p-2 rounded-full shadow-xl hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-slate-50" />

                    {/* SECCIÓN 2: ESPECIFICACIONES TÉCNICAS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">

                        {/* Nombre de Propiedad */}
                        <div className="col-span-2">
                            <label className="label-premium">{t('admin.label_name')}</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-premium pl-12"
                                    placeholder={t('admin.ph_name')}
                                />
                                <FileText className="absolute left-4 top-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
                            </div>
                        </div>

                        {/* Dirección */}
                        <div className="col-span-2">
                            <label className="label-premium">{t('admin.label_address')}</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="input-premium pl-12"
                                    placeholder={t('admin.ph_address')}
                                />
                                <MapPin className="absolute left-4 top-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
                            </div>
                        </div>

                        {/* Nro Habitación */}
                        <div>
                            <label className="label-premium">{t('admin.label_number')}</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="roomNumber"
                                    value={formData.roomNumber}
                                    onChange={handleChange}
                                    className="input-premium pl-12"
                                    placeholder="Nro. 001"
                                />
                                <Hash className="absolute left-4 top-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
                            </div>
                        </div>

                        {/* Capacidad */}
                        <div>
                            <label className="label-premium">{t('admin.label_capacity')}</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    className="input-premium pl-12"
                                    placeholder="Huéspedes"
                                />
                                <Users className="absolute left-4 top-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
                            </div>
                        </div>

                        {/* Precio */}
                        <div className="col-span-2 md:col-span-1">
                            <label className="label-premium">{t('admin.label_price')}</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="input-premium pl-12 font-black"
                                    placeholder="0.00"
                                />
                                <DollarSign className="absolute left-4 top-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
                                <span className="absolute right-4 top-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">USD / Noche</span>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="col-span-2">
                            <label className="label-premium">{t('admin.label_description')}</label>
                            <textarea
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                className="input-premium p-4 min-h-[120px] resize-none"
                                placeholder={t('admin.ph_description')}
                            ></textarea>
                        </div>
                    </div>

                    {/* ACCIONES FINALES */}
                    <div className="pt-10 flex flex-col md:flex-row justify-end gap-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-10 py-4 rounded-2xl border border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all"
                        >
                            {t('admin.btn_cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={() => onSave(formData)}
                            className="px-10 py-4 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-700 transition-all shadow-2xl shadow-slate-200 active:scale-95"
                        >
                            {t('admin.btn_publish')}
                        </button>
                    </div>

                </form>
            </div>

            <style>{`
                .label-premium {
                    display: block;
                    font-size: 10px;
                    font-weight: 900;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    margin-bottom: 0.75rem;
                }
                .input-premium {
                    width: 100%;
                    background-color: #fcfcfb;
                    border: 1px solid #f1f1f1;
                    border-radius: 1.25rem;
                    padding-top: 0.875rem;
                    padding-bottom: 0.875rem;
                    font-weight: 600;
                    color: #0f172a;
                    outline: none;
                    transition: all 0.3s ease;
                }
                .input-premium:focus {
                    background-color: #ffffff;
                    border-color: #0f172a;
                    box-shadow: 0 10px 20px -10px rgba(0,0,0,0.05);
                }
                .input-premium::placeholder {
                    color: #cbd5e1;
                    font-weight: 500;
                }
            `}</style>
        </div>
    );
};

export default CreateRoomForm;