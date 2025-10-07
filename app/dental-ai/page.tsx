'use client';

import { ArrowLeft, ExternalLink, CheckCircle, Star, Users, Clock, Shield, Zap, Heart, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DentalAIPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-emerald-800/10" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <Link 
                            href="/"
                            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Ana Sayfaya Dön
                        </Link>
                    </motion.div>

                    {/* Hero Content */}
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mb-8"
                        >
                            <div className="inline-flex items-center gap-3 bg-emerald-500/20 rounded-full px-6 py-3 mb-6">
                                <span className="text-3xl">🦷</span>
                                <span className="text-emerald-400 font-semibold">Dental AI Platform</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300 bg-clip-text text-transparent">
                                    Diş Hekimliğinde
                                </span>
                                <br />
                                <span className="text-white">Yapay Zeka Devrimi</span>
                            </h1>
                            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                                Diş hekimleri için özel olarak geliştirilmiş yapay zeka platformu ile 
                                hastalarınızın tedavi süreçlerini optimize edin, tanıları hızlandırın 
                                ve hasta deneyimini yeni seviyelere taşıyın.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <a 
                                href="https://dentalai.meschain.io/" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-xl hover:bg-emerald-600 transition-all duration-300 font-semibold text-lg"
                            >
                                <ExternalLink className="w-6 h-6" />
                                Platformu Keşfet
                            </a>
                            <a 
                                href="#features" 
                                className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold text-lg backdrop-blur-sm"
                            >
                                <Stethoscope className="w-6 h-6" />
                                Özellikleri İncele
                            </a>
                        </motion.div>
                    </div>

                    {/* Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="relative max-w-4xl mx-auto"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                            <img 
                                src="/image/Dentalai/dentalai_01.png" 
                                alt="Dental AI Platform Interface" 
                                className="w-full h-96 md:h-[500px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">AI Destekli Diş Hekimliği</h3>
                                    <p className="text-white/90 text-lg">
                                        Yapay zeka teknolojisi ile diş hekimliğinde yeni bir dönem başlıyor. 
                                        Hastalarınız için daha iyi sonuçlar, sizin için daha verimli çalışma.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Platform Özellikleri
                        </h2>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            Dental AI platformu ile diş hekimliği pratiğinizi yeni seviyelere taşıyın
                        </p>
                    </motion.div>

                    {/* Platform Screenshots */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.3 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-16"
                    >
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img 
                                    src="/image/Dentalai/dental_02.png" 
                                    alt="Dental AI Dashboard" 
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h4 className="text-white font-semibold">Dashboard</h4>
                                </div>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img 
                                    src="/image/Dentalai/dental_03.png" 
                                    alt="Patient Management" 
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h4 className="text-white font-semibold">Hasta Yönetimi</h4>
                                </div>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img 
                                    src="/image/Dentalai/dental_04.png" 
                                    alt="AI Analysis" 
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h4 className="text-white font-semibold">AI Analiz</h4>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                        >
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <Zap className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">AI Destekli Tanı</h3>
                            <p className="text-white/80 leading-relaxed">
                                Yapay zeka algoritmaları ile hastalarınızın röntgen ve görüntülerini 
                                analiz edin, erken tanı koyun ve tedavi planlarını optimize edin.
                            </p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                        >
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <Users className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Hasta Yönetimi</h3>
                            <p className="text-white/80 leading-relaxed">
                                Hastalarınızın tüm bilgilerini tek platformda toplayın, 
                                randevu takibi yapın ve hasta geçmişini kolayca erişin.
                            </p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                        >
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <Clock className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Tedavi Planlaması</h3>
                            <p className="text-white/80 leading-relaxed">
                                AI destekli tedavi planları oluşturun, hasta prognozlarını 
                                değerlendirin ve en uygun tedavi yöntemlerini belirleyin.
                            </p>
                        </motion.div>

                        {/* Feature 4 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                        >
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <Shield className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Güvenli Veri</h3>
                            <p className="text-white/80 leading-relaxed">
                                Hastalarınızın verilerini güvenle saklayın. HIPAA uyumlu 
                                güvenlik protokolleri ile veri güvenliğinizi garanti altına alın.
                            </p>
                        </motion.div>

                        {/* Feature 5 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                        >
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <Heart className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Hasta Deneyimi</h3>
                            <p className="text-white/80 leading-relaxed">
                                Hastalarınız için daha iyi bir deneyim yaratın. 
                                Şeffaf tedavi süreçleri ve kişiselleştirilmiş bakım planları.
                            </p>
                        </motion.div>

                        {/* Feature 6 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                        >
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <Star className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Raporlama</h3>
                            <p className="text-white/80 leading-relaxed">
                                Detaylı raporlar ve analitikler ile pratiğinizi değerlendirin, 
                                performansınızı artırın ve hasta memnuniyetini ölçün.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Sol Taraf - İçerik */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                            className="text-center lg:text-left"
                        >
                            <h2 className="text-4xl font-bold text-white mb-6">
                                Diş Hekimliğinizi Dönüştürün
                            </h2>
                            <p className="text-xl text-white/80 mb-8 leading-relaxed">
                                Dental AI platformu ile hastalarınız için daha iyi sonuçlar elde edin, 
                                çalışma verimliliğinizi artırın ve diş hekimliği pratiğinizi yeni seviyelere taşıyın.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <a 
                                    href="https://dentalai.meschain.io/" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-xl hover:bg-emerald-600 transition-all duration-300 font-semibold text-lg"
                                >
                                    <ExternalLink className="w-6 h-6" />
                                    Platformu Keşfet
                                </a>
                                <Link 
                                    href="/"
                                    className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold text-lg backdrop-blur-sm"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                    Ana Sayfaya Dön
                                </Link>
                            </div>
                        </motion.div>

                        {/* Sağ Taraf - Resim */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <img 
                                    src="/image/Dentalai/dental_05.png" 
                                    alt="Dental AI Advanced Features" 
                                    className="w-full h-96 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                        <h3 className="text-2xl font-bold text-white mb-2">Gelişmiş Özellikler</h3>
                                        <p className="text-white/90 text-lg">
                                            AI destekli tanı, hasta yönetimi ve tedavi planlaması ile 
                                            diş hekimliği pratiğinizi yeni seviyelere taşıyın.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
