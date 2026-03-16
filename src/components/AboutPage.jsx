import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Target, Eye, ShieldCheck, Briefcase, Users, ExternalLink, CheckCircle } from 'lucide-react';
import logoWTC from '../assets/logo-wtc-barranquilla.jpeg';

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      {/* 1. HERO SECTION */}
      <div className="relative bg-indigo-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
            {/* Cambiado de about.hero_title a about.title */}
            {t('about.title')}
          </h1>
          <p className="text-xl md:text-2xl font-light text-indigo-100">
            {/* Cambiado de about.hero_subtitle a about.subtitle */}
            {t('about.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">
        {/* 2. QUIÉNES SOMOS */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-sm">
              <Users size={18} /> {t('about.stats_hotels')} {/* Ajustado a una llave existente */}
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t('about.title')} {/* Reutilizando el título principal o el que prefieras */}
            </h2>
            <div className="text-gray-600 space-y-4 leading-relaxed text-justify">
              <p>{t('about.description')}</p>
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

        {/* 3. MISIÓN */}
        <section className="grid md:grid-cols-1 gap-8">
          <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-indigo-200 shadow-lg">
              <Briefcase size={28} />
            </div>
            {/* Cambiado de about.mission_title a about.mission */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.mission')}</h3>
            <p className="text-gray-600 leading-relaxed text-sm text-justify">{t('about.mission_text')}</p>
          </div>
        </section>

        {/* 4. ESTADÍSTICAS (Usando las llaves de stats que sí tienes) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <p className="text-4xl font-black text-indigo-600">100+</p>
            <p className="text-gray-500">{t('about.stats_hotels')}</p>
          </div>
          <div className="p-6">
            <p className="text-4xl font-black text-indigo-600">500+</p>
            <p className="text-gray-500">{t('about.stats_clients')}</p>
          </div>
          <div className="p-6">
            <p className="text-4xl font-black text-indigo-600">10+</p>
            <p className="text-gray-500">{t('about.stats_years')}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;