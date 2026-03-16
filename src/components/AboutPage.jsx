import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Target, ShieldCheck, X, Users, Briefcase, Eye, CheckCircle } from 'lucide-react';
import imgCertificado from '../../public/certificado-wtc.jpg';
import logoWTC from '../assets/logo-wtc-barranquilla.jpeg';

const AboutPage = () => {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white">
      {/* 1. HERO SECTION */}
      <div className="relative bg-indigo-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
            {t('about.title')}
          </h1>
          <p className="text-xl md:text-2xl font-light text-indigo-100">
            {t('about.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">

        {/* 2. QUIÉNES SOMOS */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-sm">
              <Users size={18} /> {t('about.who_we_are_label')}
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t('about.who_we_are_title')}
            </h2>
            <div className="text-gray-600 space-y-4 leading-relaxed text-justify">
              <p>{t('about.who_we_are_p1')}</p>
            </div>
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500">
            <img
              src="https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&q=80"
              alt="Santa Marta"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* 3. MISIÓN Y VISIÓN */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-indigo-200 shadow-lg">
              <Briefcase size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.mission_title')}</h3>
            <p className="text-gray-600 leading-relaxed text-sm text-justify">{t('about.mission_text')}</p>
          </div>

          <div className="bg-green-50 p-8 rounded-3xl border border-green-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-green-200 shadow-lg">
              <Eye size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.vision_title')}</h3>
            <p className="text-gray-600 leading-relaxed text-sm text-justify">{t('about.vision_text')}</p>
          </div>
        </section>

        {/* 4. AVAL INTERNACIONAL WTC */}
        <section className="bg-gradient-to-r from-blue-50 to-white border-2 border-blue-200 rounded-[2.5rem] p-8 md:p-12 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-10 pointer-events-none">
            <Target size={150} className="text-blue-900" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="group relative cursor-pointer" onClick={() => setShowModal(true)}>
              <div className="shrink-0 bg-white p-6 rounded-full shadow-xl border border-blue-100 transition-transform duration-300 group-hover:scale-110">
                <img src={logoWTC} alt="WTC Barranquilla" className="w-24 h-24 object-contain" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-black shadow-lg opacity-0 group-hover:opacity-100 transition-opacity uppercase whitespace-nowrap">
                {t('about.wtc_hover_label')}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-black text-blue-900 mb-4 leading-tight">
                {t('about.wtc_title')} <br className="hidden md:block" />
                <span className="text-blue-600 font-extrabold">{t('about.wtc_office')}</span>
              </h3>

              <p className="text-gray-700 text-lg leading-relaxed mb-6 italic text-justify md:text-left">
                "{t('about.wtc_quote')}"
              </p>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-blue-900 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
              >
                <ShieldCheck size={20} />
                {t('about.wtc_btn')}
              </button>
            </div>
          </div>
        </section>

        {/* 5. LEGALIDAD Y RNT */}
        <section className="bg-white border-2 border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h3 className="text-2xl font-black text-black tracking-widest">
                {t('about.legal_title')}
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed text-justify italic">
                {t('about.legal_full_description')}
              </p>
            </div>
            {/* Aquí puedes poner los logos de DIAN, FONTUR y Cámara de Comercio */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
              {/* Imágenes de los logos que tienes en la foto */}
            </div>
          </div>
        </section>
        {/* MODAL DEL CERTIFICADO */}
        {showModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h4 className="font-bold text-blue-900 flex items-center gap-2">
                  <ShieldCheck size={18} /> {t('about.wtc_modal_title')}
                </h4>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <div className="overflow-y-auto p-2 bg-gray-100 flex justify-center">
                <img src={imgCertificado} alt="Certificación WTC" className="max-w-full h-auto rounded shadow-lg" />
              </div>
              <div className="p-4 text-center bg-white border-t">
                <p className="text-xs text-gray-400 italic">{t('about.wtc_modal_footer')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPage;