'use client';

import { SignInButton, useAuth } from '@clerk/nextjs';
import { ArrowRight, ImageIcon, Sparkles, Zap, Shield, ChevronUp, MessageSquare, Mic, MicOff, Calendar, Users, Globe, TrendingUp, Award, Target, Rocket, Star, CheckCircle, ExternalLink, Play, BarChart3, Wallet, ShoppingCart, Briefcase, Cpu, Database, Lock, Eye, Heart, Gift } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ChatBoard } from '@/components';

export default function HomePage() {
    const { userId } = useAuth();
    const [dolphinPosition, setDolphinPosition] = useState({ x: 50, y: 50 });
    const [showDolphin, setShowDolphin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isChatBoardOpen, setIsChatBoardOpen] = useState(true); // Chat board otomatik açık
    const [isMicrophoneActive, setIsMicrophoneActive] = useState(false); // Mikrofon durumu

    // Framer Motion hooks
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

    useEffect(() => {
        // Sayfa yüklendiğinde yunus göster
        const timer = setTimeout(() => {
            setShowDolphin(true);
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Scroll event listener
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setShowScrollTop(scrollTop > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMouseClick = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        setDolphinPosition({ x, y });
        setShowDolphin(true);
        
        // Mikrofon aktif değilse 8 saniye sonra yunus kaybolsun
        if (!isMicrophoneActive) {
            setTimeout(() => {
                setShowDolphin(false);
            }, 8000);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isMicrophoneActive && showDolphin) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            setDolphinPosition({ x, y });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleChatBoardToggle = () => {
        setIsChatBoardOpen(!isChatBoardOpen);
    };

    const handleMicrophoneToggle = () => {
        setIsMicrophoneActive(!isMicrophoneActive);
        if (!isMicrophoneActive) {
            // Mikrofon açılıyorsa yunus göster
            setShowDolphin(true);
        }
    };

    return (
        <motion.div 
            className="relative min-h-screen overflow-hidden" 
            onClick={handleMouseClick}
            onMouseMove={handleMouseMove}
            style={{ y, opacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Koyu siyah-yeşil ana gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-green-900" />
            
            {/* Yeşil tonlarında overlay - çok koyu */}
            <div className="absolute inset-0 bg-gradient-to-tr from-green-800/20 via-emerald-700/15 to-teal-600/10" />
            
            {/* Koyu grid pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
            
            {/* Kareler - çok belirgin, sol mavi, sağ pembe, soldan sağa geçiş */}
            <div className="absolute inset-0">
                {/* Sol taraf - aşağı doğru artan vektörel kareler */}
                <div className="absolute top-8 left-8 w-20 h-20 bg-transparent border-2 border-blue-400/30 shadow-lg shadow-blue-400/20 transform rotate-12">
                    <div className="absolute inset-2 border border-blue-300/20"></div>
                    <div className="absolute inset-4 border border-blue-200/10"></div>
                </div>
                <div className="absolute top-16 left-16 w-18 h-18 bg-transparent border-2 border-blue-400/28 shadow-lg shadow-blue-400/18 transform rotate-6">
                    <div className="absolute inset-2 border border-blue-300/18"></div>
                    <div className="absolute inset-3 border border-blue-200/8"></div>
                </div>
                <div className="absolute top-24 left-24 w-16 h-16 bg-transparent border-2 border-cyan-400/25 shadow-lg shadow-cyan-400/15 transform -rotate-6">
                    <div className="absolute inset-2 border border-cyan-300/15"></div>
                </div>
                <div className="absolute top-32 left-32 w-14 h-14 bg-transparent border-2 border-blue-300/22 shadow-md shadow-blue-300/12 transform rotate-45">
                    <div className="absolute inset-1 border border-blue-200/10"></div>
                </div>
                <div className="absolute top-40 left-40 w-12 h-12 bg-transparent border-2 border-cyan-300/20 shadow-md shadow-cyan-300/10 transform -rotate-30">
                    <div className="absolute inset-1 border border-cyan-200/8"></div>
                </div>
                <div className="absolute top-48 left-48 w-10 h-10 bg-transparent border-2 border-blue-200/18 shadow-sm shadow-blue-200/8 transform rotate-60">
                    <div className="absolute inset-1 border border-blue-100/6"></div>
                </div>
                
                {/* Sağ taraf - aşağı doğru artan vektörel kareler */}
                <div className="absolute top-8 right-8 w-20 h-20 bg-transparent border-2 border-pink-400/30 shadow-lg shadow-pink-400/20 transform -rotate-12">
                    <div className="absolute inset-2 border border-pink-300/20"></div>
                    <div className="absolute inset-4 border border-pink-200/10"></div>
                </div>
                <div className="absolute top-16 right-16 w-18 h-18 bg-transparent border-2 border-pink-400/28 shadow-lg shadow-pink-400/18 transform -rotate-6">
                    <div className="absolute inset-2 border border-pink-300/18"></div>
                    <div className="absolute inset-3 border border-pink-200/8"></div>
                </div>
                <div className="absolute top-24 right-24 w-16 h-16 bg-transparent border-2 border-rose-400/25 shadow-lg shadow-rose-400/15 transform rotate-6">
                    <div className="absolute inset-2 border border-rose-300/15"></div>
                </div>
                <div className="absolute top-32 right-32 w-14 h-14 bg-transparent border-2 border-pink-300/22 shadow-md shadow-pink-300/12 transform -rotate-45">
                    <div className="absolute inset-1 border border-pink-200/10"></div>
                </div>
                <div className="absolute top-40 right-40 w-12 h-12 bg-transparent border-2 border-rose-300/20 shadow-md shadow-rose-300/10 transform rotate-30">
                    <div className="absolute inset-1 border border-rose-200/8"></div>
                </div>
                <div className="absolute top-48 right-48 w-10 h-10 bg-transparent border-2 border-pink-200/18 shadow-sm shadow-pink-200/8 transform -rotate-60">
                    <div className="absolute inset-1 border border-pink-100/6"></div>
                </div>
                
                {/* Sol üst - mavi tonları - çok belirgin */}
                <div className="absolute top-20 left-12 w-24 h-24 bg-blue-500/12 rounded-2xl shadow-2xl shadow-blue-500/25 border-2 border-blue-500/20 transform rotate-12"></div>
                <div className="absolute top-32 left-32 w-16 h-16 bg-cyan-500/10 rounded-xl shadow-xl shadow-cyan-500/20 border border-cyan-500/15 transform -rotate-6"></div>
                
                {/* Sol orta - mavi-mor geçiş - çok belirgin */}
                <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-gradient-to-r from-blue-500/12 to-purple-500/12 rounded-3xl shadow-2xl shadow-blue-500/25 border-2 border-blue-500/20 transform rotate-3"></div>
                <div className="absolute top-1/2 left-1/3 w-18 h-18 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 rounded-xl shadow-xl shadow-cyan-500/20 border border-cyan-500/15 transform -rotate-9"></div>
                
                {/* Orta - mor-pembe geçiş - çok belirgin */}
                <div className="absolute top-40 left-1/2 w-12 h-12 bg-gradient-to-r from-purple-500/8 to-pink-500/8 rounded-lg shadow-lg shadow-purple-500/15 border border-purple-500/12 transform rotate-45"></div>
                <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-gradient-to-r from-indigo-500/10 to-rose-500/10 rounded-2xl shadow-xl shadow-indigo-500/20 border border-indigo-500/15 transform -rotate-12"></div>
                
                {/* Sağ orta - pembe-mor geçiş - çok belirgin */}
                <div className="absolute top-1/2 right-1/4 w-22 h-22 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl shadow-xl shadow-pink-500/20 border border-pink-500/15 transform -rotate-9"></div>
                <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-rose-500/8 to-fuchsia-500/8 rounded-xl shadow-xl shadow-rose-500/15 border border-rose-500/12 transform rotate-6"></div>
                
                {/* Sağ üst - pembe tonları - çok belirgin */}
                <div className="absolute top-24 right-16 w-20 h-20 bg-pink-500/12 rounded-2xl shadow-2xl shadow-pink-500/25 border-2 border-pink-500/20 transform -rotate-12"></div>
                <div className="absolute top-48 right-40 w-14 h-14 bg-rose-500/10 rounded-lg shadow-xl shadow-rose-500/20 border border-rose-500/15 transform rotate-6"></div>
                
                {/* Alt bölge - çok belirgin geçiş kareleri */}
                <div className="absolute bottom-24 left-20 w-18 h-18 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl shadow-2xl shadow-blue-400/30 border-2 border-blue-400/25 transform rotate-12"></div>
                <div className="absolute bottom-40 right-24 w-16 h-16 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-lg shadow-2xl shadow-pink-400/30 border-2 border-pink-400/25 transform -rotate-6"></div>
                <div className="absolute bottom-32 right-1/3 w-10 h-10 bg-gradient-to-r from-pink-400/18 to-rose-400/18 rounded-lg shadow-xl shadow-pink-400/25 border border-pink-400/20 transform -rotate-45"></div>
                
                {/* Ekstra alt kareler - çok belirgin */}
                <div className="absolute bottom-16 left-1/3 w-14 h-14 bg-gradient-to-r from-blue-500/18 to-indigo-500/18 rounded-lg shadow-xl shadow-blue-500/25 border border-blue-500/20 transform rotate-24"></div>
                <div className="absolute bottom-20 right-1/2 w-12 h-12 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 rounded-lg shadow-xl shadow-purple-500/22 border border-purple-500/18 transform -rotate-18"></div>
                <div className="absolute bottom-36 left-1/2 w-8 h-8 bg-gradient-to-r from-purple-500/12 to-pink-500/12 rounded-lg shadow-lg shadow-pink-500/20 border border-pink-500/15 transform rotate-36"></div>
                
                {/* En alt ekstra kareler - çok belirgin */}
                <div className="absolute bottom-8 left-1/4 w-10 h-10 bg-gradient-to-r from-blue-300/15 to-cyan-300/15 rounded-lg shadow-lg shadow-blue-300/20 border border-blue-300/15 transform rotate-30"></div>
                <div className="absolute bottom-12 right-1/4 w-8 h-8 bg-gradient-to-r from-purple-300/12 to-pink-300/12 rounded-lg shadow-lg shadow-purple-300/18 border border-purple-300/12 transform -rotate-30"></div>
                <div className="absolute bottom-6 left-1/2 w-6 h-6 bg-gradient-to-r from-pink-300/10 to-rose-300/10 rounded-lg shadow-md shadow-pink-300/15 border border-pink-300/10 transform rotate-60"></div>
            </div>
            
            {/* Animasyonlu Yunus Maskot - Dinamik Pozisyon */}
            {showDolphin && (
                <div 
                    className="absolute z-10 transition-all duration-1000 ease-out animate-fade-in-scale"
                    style={{
                        left: `${dolphinPosition.x}%`,
                        top: `${dolphinPosition.y}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <div className="relative">
                        {/* Ana yunus animasyonu */}
                        <div className="animate-bounce-slow">
                            <img 
                                src="/dolphin.png" 
                                alt="Yunus Maskot" 
                                className="w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl filter brightness-110 contrast-110"
                            />
                        </div>
                    
                        {/* Işık halkaları animasyonu */}
                        <div className="absolute inset-0 animate-ping">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-cyan-400/30"></div>
                        </div>
                        <div className="absolute inset-0 animate-ping" style={{animationDelay: '0.5s'}}>
                            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-blue-400/20"></div>
                        </div>
                        <div className="absolute inset-0 animate-ping" style={{animationDelay: '1s'}}>
                            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-2 border-purple-400/15"></div>
                        </div>
                        
                        {/* Parlayan efektler */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
                        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50" style={{animationDelay: '0.3s'}}></div>
                        <div className="absolute top-1/2 -left-4 w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50" style={{animationDelay: '0.6s'}}></div>
                        <div className="absolute top-1/2 -right-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse shadow-lg shadow-pink-400/50" style={{animationDelay: '0.9s'}}></div>
                        
                        {/* Su dalgaları efekti */}
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                            <div className="flex space-x-1">
                                <div className="w-1 h-4 bg-cyan-300/40 rounded-full animate-wave" style={{animationDelay: '0s'}}></div>
                                <div className="w-1 h-6 bg-blue-300/40 rounded-full animate-wave" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-1 h-5 bg-purple-300/40 rounded-full animate-wave" style={{animationDelay: '0.4s'}}></div>
                                <div className="w-1 h-7 bg-pink-300/40 rounded-full animate-wave" style={{animationDelay: '0.6s'}}></div>
                                <div className="w-1 h-4 bg-cyan-300/40 rounded-full animate-wave" style={{animationDelay: '0.8s'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <motion.section 
                className="relative overflow-hidden px-4 pt-32 pb-24 sm:px-6 sm:pt-24 sm:pb-32 lg:px-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                {/* Header Butonları */}
                <div className="absolute top-4 right-4 z-50 flex gap-3">
                    {/* Chat Board Toggle Button - Sadece chat board kapalıyken göster */}
                    {!isChatBoardOpen && (
                        <motion.button
                            onClick={handleChatBoardToggle}
                            className="p-3 rounded-full shadow-2xl transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:bg-green-600"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <MessageSquare className="w-5 h-5" />
                        </motion.button>
                    )}

                    {/* Microphone Toggle Button */}
                    <motion.button
                        onClick={handleMicrophoneToggle}
                        className={`p-3 rounded-full shadow-2xl transition-all duration-300 ${
                            isMicrophoneActive 
                                ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' 
                                : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        {isMicrophoneActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </motion.button>
                </div>

                <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
                    <motion.div 
                        className="text-left"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <motion.div 
                            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-lg ring-1 ring-white/20 backdrop-blur"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <Sparkles className="h-4 w-4" />
                            <span>MesChain AI ile stüdyo kalitesi saniyeler içinde</span>
                        </motion.div>
                        <motion.h1 
                            className="mt-8 text-4xl font-bold leading-tight text-white/60 md:text-6xl"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                MesChain ile ürün fotoğraflarınızı saniyeler içinde yapay zeka ile dönüştürün
                            </span>
                        </motion.h1>
                        <motion.p 
                            className="mt-6 max-w-2xl text-lg text-white/80 md:text-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.0 }}
                        >
                            Model ve ürün görsellerinizi yükleyin; markanıza uygun stüdyo kalitesinde kareleri tek tıkla elde edin. E-ticaret, moda, takı, teknoloji ve güzellik kategorilerinde profesyonel sonuçlar.
                        </motion.p>

                        <motion.div 
                            className="mt-10 flex flex-col gap-4 sm:flex-row"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.2 }}
                        >
                            {userId ? (
                                <a
                                    href="/generate"
                                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-purple-500/25 hover:scale-105"
                                >
                                    Hemen üretmeye başlayın
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </a>
                            ) : (
                                <SignInButton mode="modal">
                                    <button className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-purple-500/25 hover:scale-105">
                                        Ücretsiz deneyin
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </button>
                                </SignInButton>
                            )}
                            <a
                                href="#features"
                                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white shadow-lg backdrop-blur transition-all hover:bg-white/20 hover:scale-105"
                            >
                                Nasıl çalıştığını görün
                            </a>
                        </motion.div>
                    </motion.div>

                    <div className="relative">
                        <div className="absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-2xl" />
                        <div className="relative rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                                    <ImageIcon className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white/70">MesChain AI Koleksiyonu</p>
                                    <p className="text-xl font-semibold text-white">Profesyonel ürün çekimleri</p>
                                </div>
                            </div>

                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur">
                                    <div className="flex items-center gap-3">
                                        <Zap className="h-5 w-5 text-purple-400" />
                                        <span className="text-sm font-semibold text-white">MesChain Akıllı Işık</span>
                                    </div>
                                    <p className="mt-2 text-sm text-white/70">
                                        MesChain AI, ürüne göre ışık ve gölgeyi otomatik ayarlar.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur">
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-pink-400" />
                                        <span className="text-sm font-semibold text-white">MesChain Marka Tutarlılığı</span>
                                    </div>
                                    <p className="mt-2 text-sm text-white/70">
                                        MesChain AI, renk ve arka planı stil rehberinize uygun şekilde korur.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 rounded-2xl border border-dashed border-white/30 bg-white/5 p-5 text-sm text-white/80">
                                %92 MesChain kullanıcısı, ilk projede beklediğinden daha iyi sonuç aldığını söylüyor. AI teknolojisinin gücünü deneyimleyin!
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section 
                id="features" 
                className="relative py-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                            Neden MesChain'i Seçmelisiniz?
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-white/80">
                            Yapay zeka teknolojisinin gücüyle görsel yaratıcılığı demokratikleştiren MesChain, profesyonel kalitede ürün fotoğraflarına herkesin erişebilmesini sağlar.
                        </p>
                    </div>

                    <motion.div 
                        className="grid grid-cols-1 gap-8 md:grid-cols-3"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ amount: 0.3 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {/* Şimşek Hızında - Aurora Efektli */}
                        <motion.div 
                            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur transition-all duration-500 hover:border-purple-400/50 hover:shadow-purple-500/30 hover:scale-105"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            whileHover={{ 
                                scale: 1.05,
                                rotateY: 5,
                                transition: { duration: 0.3 }
                            }}
                        >
                            {/* Aurora köşe efektleri */}
                            <div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-gradient-to-br from-purple-400/60 to-pink-400/40 blur-sm"></div>
                            <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-bl from-pink-400/50 to-purple-400/30 blur-sm"></div>
                            <div className="absolute -bottom-2 -left-2 h-6 w-6 rounded-full bg-gradient-to-tr from-purple-400/40 to-pink-400/50 blur-sm"></div>
                            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-tl from-pink-400/60 to-purple-400/40 blur-sm"></div>
                            
                            {/* Hover ışık efekti */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 transition-all duration-700 group-hover:from-purple-500/10 group-hover:via-pink-500/15 group-hover:to-purple-500/10"></div>
                            
                            {/* İçerik */}
                            <div className="relative z-10">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                                    <Zap className="h-8 w-8 text-white" />
                            </div>
                                <h3 className="mb-4 text-xl font-semibold text-white">Şimşek Hızında</h3>
                                <p className="text-white/70">
                                Saatler değil saniyeler içinde profesyonel ürün fotoğrafları oluşturun. MesChain'in güçlü AI teknolojisi ile görsellerinizi yükleyin ve anında sonuç alın.
                            </p>
                        </div>
                        </motion.div>

                        {/* AI Destekli Kalite - Aurora Efektli */}
                        <motion.div 
                            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur transition-all duration-500 hover:border-pink-400/50 hover:shadow-pink-500/30 hover:scale-105"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            whileHover={{ 
                                scale: 1.05,
                                rotateY: -5,
                                transition: { duration: 0.3 }
                            }}
                        >
                            {/* Aurora köşe efektleri */}
                            <div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-gradient-to-br from-pink-400/60 to-red-400/40 blur-sm"></div>
                            <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-bl from-red-400/50 to-pink-400/30 blur-sm"></div>
                            <div className="absolute -bottom-2 -left-2 h-6 w-6 rounded-full bg-gradient-to-tr from-pink-400/40 to-red-400/50 blur-sm"></div>
                            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-tl from-red-400/60 to-pink-400/40 blur-sm"></div>
                            
                            {/* Hover ışık efekti */}
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-red-500/0 to-pink-500/0 transition-all duration-700 group-hover:from-pink-500/10 group-hover:via-red-500/15 group-hover:to-pink-500/10"></div>
                            
                            {/* İçerik */}
                            <div className="relative z-10">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500 shadow-lg shadow-pink-500/30">
                                    <Sparkles className="h-8 w-8 text-white" />
                            </div>
                                <h3 className="mb-4 text-xl font-semibold text-white">AI Destekli Kalite</h3>
                                <p className="text-white/70">
                                MesChain'in gelişmiş AI algoritmaları, profesyonel stüdyolarla yarışan yüksek kaliteli ve gerçekçi ürün fotoğrafları sağlar. Google Gemini API ve N8N entegrasyonu ile en son teknoloji.
                            </p>
                        </div>
                        </motion.div>

                        {/* Güvenli ve Özel - Aurora Efektli */}
                        <motion.div 
                            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur transition-all duration-500 hover:border-blue-400/50 hover:shadow-blue-500/30 hover:scale-105"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            whileHover={{ 
                                scale: 1.05,
                                rotateY: 5,
                                transition: { duration: 0.3 }
                            }}
                        >
                            {/* Aurora köşe efektleri */}
                            <div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-gradient-to-br from-blue-400/60 to-purple-400/40 blur-sm"></div>
                            <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-bl from-purple-400/50 to-blue-400/30 blur-sm"></div>
                            <div className="absolute -bottom-2 -left-2 h-6 w-6 rounded-full bg-gradient-to-tr from-blue-400/40 to-purple-400/50 blur-sm"></div>
                            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-tl from-purple-400/60 to-blue-400/40 blur-sm"></div>
                            
                            {/* Hover ışık efekti */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 transition-all duration-700 group-hover:from-blue-500/10 group-hover:via-purple-500/15 group-hover:to-blue-500/10"></div>
                            
                            {/* İçerik */}
                            <div className="relative z-10">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-blue-500/30">
                                    <Shield className="h-8 w-8 text-white" />
                            </div>
                                <h3 className="mb-4 text-xl font-semibold text-white">Güvenli ve Özel</h3>
                                <p className="text-white/70">
                                MesChain'de görselleriniz güvenli bir şekilde işlenir ve gereğinden uzun süre saklanmaz. Clerk authentication, HTTPS şifreleme ve GDPR uyumluluğu ile gizlilik ve güvenlik en büyük önceliğimizdir.
                            </p>
                        </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Categories Section */}
            <motion.section 
                className="relative py-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                            Her ürün kategorisi için mükemmel
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-white/80">
                            MesChain'in yapay zekası 5 farklı kategoride özel olarak eğitildi. E-ticaret, moda, takı, teknoloji ve güzellik ürünleriniz için özel ihtiyaçlarınıza uygun sonuçlar sunar.
                        </p>
                    </div>

                    <motion.div 
                        className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ amount: 0.3 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {/* E-ticaret */}
                        <motion.div 
                            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-blue-400/50 hover:shadow-blue-500/30"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            whileHover={{ 
                                y: -8,
                                rotateX: 5,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="relative p-3">
                                <div className="mb-4 flex justify-center">
                                    <div className="relative h-48 w-36 overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-2 group-hover:shadow-blue-500/40">
                                        <img 
                                            src="/E-Ticaret.webp" 
                                            alt="E-ticaret ürünleri" 
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-white">E-ticaret</h3>
                                <p className="text-xs text-white/80 leading-relaxed">
                                    Genel ürünler için profesyonel fotoğraf çekimi. MesChain ile her türlü e-ticaret ürününüzü stüdyo kalitesinde görselleştirin ve satışlarınızı artırın.
                                </p>
                            </div>
                        </motion.div>

                        {/* Giyim */}
                        <motion.div 
                            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-pink-400/50 hover:shadow-pink-500/30"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            whileHover={{ 
                                y: -8,
                                rotateX: -5,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-400/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="relative p-3">
                                <div className="mb-4 flex justify-center">
                                    <div className="relative h-48 w-36 overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-2 group-hover:shadow-pink-500/40">
                                        <img 
                                            src="/Giyim.webp" 
                                            alt="Giyim ve aksesuarlar" 
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-white">Giyim</h3>
                                <p className="text-xs text-white/80 leading-relaxed">
                                    Kıyafet ve aksesuarlar için özel ışıklandırma teknikleri. MesChain'in AI teknolojisi ile moda ürünlerinizi en çekici şekilde sergileyin ve müşteri ilgisini artırın.
                                </p>
                            </div>
                        </motion.div>

                        {/* Takı */}
                        <motion.div 
                            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-yellow-400/50 hover:shadow-yellow-500/30"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            whileHover={{ 
                                y: -8,
                                rotateX: 5,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="relative p-3">
                                <div className="mb-4 flex justify-center">
                                    <div className="relative h-48 w-36 overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-1 group-hover:shadow-yellow-500/40">
                                        <img 
                                            src="/Taki.webp" 
                                            alt="Takı ve mücevherler" 
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-white">Takı</h3>
                                <p className="text-xs text-white/80 leading-relaxed">
                                    Yüzük ve kolyeler için özel makro çekim teknikleri. MesChain'in gelişmiş AI algoritmaları ile değerli takılarınızı parlaklığıyla öne çıkarın ve lüks hissiyat yaratın.
                                </p>
                            </div>
                        </motion.div>

                        {/* Teknoloji */}
                        <motion.div 
                            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/50 hover:shadow-cyan-500/30"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            whileHover={{ 
                                y: -8,
                                rotateX: -5,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="relative p-3">
                                <div className="mb-4 flex justify-center">
                                    <div className="relative h-48 w-36 overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-1 group-hover:shadow-cyan-500/40">
                                        <img 
                                            src="/Teknoloji.webp" 
                                            alt="Teknoloji ürünleri" 
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-white">Teknoloji</h3>
                                <p className="text-xs text-white/80 leading-relaxed">
                                    Elektronik ve cihazlar için teknik detayları öne çıkaran çekimler. MesChain ile modern teknoloji ürünlerinizi profesyonelce sunun ve güven verin.
                                </p>
                            </div>
                        </motion.div>

                        {/* Güzellik */}
                        <motion.div 
                            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-rose-400/50 hover:shadow-rose-500/30"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            whileHover={{ 
                                y: -8,
                                rotateX: 5,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-400/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="relative p-3">
                                <div className="mb-4 flex justify-center">
                                    <div className="relative h-48 w-36 overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-2 group-hover:shadow-rose-500/40">
                                        <img 
                                            src="/Guzellik.webp" 
                                            alt="Güzellik ve kozmetik" 
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-white">Güzellik</h3>
                                <p className="text-xs text-white/80 leading-relaxed">
                                    Kozmetik ve cilt bakımı ürünleri için özel renk doğruluğu. MesChain'in AI teknolojisi ile güzellik ürünlerinizi en çekici şekilde gösterin ve satışları artırın.
                                </p>
                    </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* MesChain Tarihsel Gelişim Timeline */}
            <motion.section 
                className="relative py-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <motion.h2 
                            className="mb-4 text-3xl font-bold text-white md:text-4xl"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                        >
                            MesChain'in Yolculuğu
                        </motion.h2>
                        <motion.p 
                            className="mx-auto max-w-2xl text-lg text-white/80"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            2019'dan bugüne kadar MesChain'in blokzincir teknolojisi ile üretim ve tedarik zincirini dönüştürme yolculuğu
                        </motion.p>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 rounded-full"></div>
                        
                        <div className="space-y-12">
                            {/* 2019 - Kuruluş */}
                            <motion.div 
                                className="relative flex items-center"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ amount: 0.3 }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                            >
                                <div className="flex-1 pr-8 text-right">
                                    <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur">
                                        <div className="mb-3 flex items-center justify-end gap-2">
                                            <Calendar className="h-5 w-5 text-purple-400" />
                                            <span className="text-sm font-semibold text-purple-400">2019</span>
                                        </div>
                                        <h3 className="mb-2 text-xl font-bold text-white">MesChain Kuruluşu</h3>
                                        <p className="text-white/70">
                                            Ethereum ağı üzerinde çalışan MES token projesi başlatıldı. Blokzincir teknolojisini üretimden tüketime tüm süreçlere entegre etme vizyonu ortaya kondu.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                                    <Rocket className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 pl-8"></div>
                            </motion.div>

                            {/* 2019 - SWFT Ortaklığı */}
                            <motion.div 
                                className="relative flex items-center"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ amount: 0.3 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="flex-1 pr-8"></div>
                                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500 shadow-lg">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 pl-8">
                                    <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur">
                                        <div className="mb-3 flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-pink-400" />
                                            <span className="text-sm font-semibold text-pink-400">Aralık 2019</span>
                                        </div>
                                        <h3 className="mb-2 text-xl font-bold text-white">SWFT Blockchain Ortaklığı</h3>
                                        <p className="text-white/70">
                                            SWFT platformunda 200+ kripto para ile swap ve ödeme imkânı. MES tokeni küresel kripto ekosistemine entegre edildi.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* 2020 - Token Swap */}
                            <motion.div 
                                className="relative flex items-center"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ amount: 0.3 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            >
                                <div className="flex-1 pr-8 text-right">
                                    <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur">
                                        <div className="mb-3 flex items-center justify-end gap-2">
                                            <Calendar className="h-5 w-5 text-blue-400" />
                                            <span className="text-sm font-semibold text-blue-400">13 Aralık 2020</span>
                                        </div>
                                        <h3 className="mb-2 text-xl font-bold text-white">MES Token Swap</h3>
                                        <p className="text-white/70">
                                            Cointiger borsasında otomatik token değişim süreci başlatıldı. Yeni tokenlerle borsalarda işlem yapabilme imkânı sağlandı.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 pl-8"></div>
                            </motion.div>

                            {/* 2021 - Borsa Listeleme */}
                            <motion.div 
                                className="relative flex items-center"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ amount: 0.3 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <div className="flex-1 pr-8"></div>
                                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-green-500 shadow-lg">
                                    <Globe className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 pl-8">
                                    <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur">
                                        <div className="mb-3 flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-cyan-400" />
                                            <span className="text-sm font-semibold text-cyan-400">2021</span>
                                        </div>
                                        <h3 className="mb-2 text-xl font-bold text-white">Küresel Borsa Listeleme</h3>
                                        <p className="text-white/70">
                                            PancakeSwap (BSC), MEXC, CoinTiger ve FOBGLATE borsalarında işlem görmeye başladı. Küresel erişim sağlandı.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* 2022-2024 - Ekosistem Genişleme */}
                            <motion.div 
                                className="relative flex items-center"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ amount: 0.3 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                            >
                                <div className="flex-1 pr-8 text-right">
                                    <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur">
                                        <div className="mb-3 flex items-center justify-end gap-2">
                                            <Calendar className="h-5 w-5 text-green-400" />
                                            <span className="text-sm font-semibold text-green-400">2022-2024</span>
                                        </div>
                                        <h3 className="mb-2 text-xl font-bold text-white">Ekosistem Genişleme</h3>
                                        <p className="text-white/70">
                                            Allmes e-ticaret platformu, NFT pazaryeri, freelancer platformu ve stake havuzları geliştirildi. Kapsamlı ekosistem oluşturuldu.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                                    <Award className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 pl-8"></div>
                            </motion.div>

                            {/* 2025 - AI Entegrasyonu */}
                            <motion.div 
                                className="relative flex items-center"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ amount: 0.3 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                <div className="flex-1 pr-8"></div>
                                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg">
                                    <Cpu className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 pl-8">
                                    <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur">
                                        <div className="mb-3 flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-emerald-400" />
                                            <span className="text-sm font-semibold text-emerald-400">2025</span>
                                        </div>
                                        <h3 className="mb-2 text-xl font-bold text-white">AI Destekli Görsel Üretimi</h3>
                                        <p className="text-white/70">
                                            Google Gemini API ve N8N entegrasyonu ile profesyonel ürün fotoğraf üretimi başlatıldı. Yapay zeka ile görsel yaratıcılık demokratikleştirildi.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* MesChain Ekosistem ve Hizmetler */}
            <motion.section 
                className="relative py-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <motion.h2 
                            className="mb-4 text-3xl font-bold text-white md:text-4xl"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                        >
                            MesChain Ekosistemi
                        </motion.h2>
                        <motion.p 
                            className="mx-auto max-w-2xl text-lg text-white/80"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Blokzincir teknolojisi ile güçlendirilmiş kapsamlı dijital hizmetler ekosistemi
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* E-Ticaret Platformu */}
                        <motion.div 
                            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur transition-all duration-500 hover:border-purple-400/50 hover:shadow-purple-500/30 hover:scale-105"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-gradient-to-br from-purple-400/60 to-pink-400/40 blur-sm"></div>
                            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-tl from-pink-400/60 to-purple-400/40 blur-sm"></div>
                            
                            <div className="relative z-10">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                                    <ShoppingCart className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="mb-4 text-xl font-semibold text-white">Allmes E-Ticaret</h3>
                                <p className="mb-4 text-white/70">
                                    Trendyol, Hepsiburada, Amazon, eBay ve Etsy gibi küresel pazaryerlerinde satış yapın. MES token güvencesi ile sınır ötesi ticaret.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-purple-400">
                                    <ExternalLink className="h-4 w-4" />
                                    <span>Küresel Pazaryerler</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* NFT ve Crowdfunding */}
                        <motion.div 
                            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur transition-all duration-500 hover:border-pink-400/50 hover:shadow-pink-500/30 hover:scale-105"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-gradient-to-br from-pink-400/60 to-red-400/40 blur-sm"></div>
                            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-tl from-red-400/60 to-pink-400/40 blur-sm"></div>
                            
                            <div className="relative z-10">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500 shadow-lg shadow-pink-500/30">
                                    <Gift className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="mb-4 text-xl font-semibold text-white">NFT & Crowdfunding</h3>
                                <p className="mb-4 text-white/70">
                                    NFT koleksiyonları oluşturun, alın-satın. Diamond ve Blue Diamond crowdfunding projeleriyle özel yatırımlara katılın.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-pink-400">
                                    <Star className="h-4 w-4" />
                                    <span>Dijital Varlıklar</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Freelancer Platformu */}
                        <motion.div 
                            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur transition-all duration-500 hover:border-blue-400/50 hover:shadow-blue-500/30 hover:scale-105"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-gradient-to-br from-blue-400/60 to-purple-400/40 blur-sm"></div>
                            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-tl from-purple-400/60 to-blue-400/40 blur-sm"></div>
                            
                            <div className="relative z-10">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30">
                                    <Briefcase className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="mb-4 text-xl font-semibold text-white">Freelancer Platform</h3>
                                <p className="mb-4 text-white/70">
                                    Blockchain destekli freelancer hizmet platformu. Çalışanlar ve işverenler MES token ile güvenli ödemeler yapın.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-blue-400">
                                    <Users className="h-4 w-4" />
                                    <span>Serbest Çalışan Ekosistemi</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Staking Platformu */}
                        <motion.div 
                            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur transition-all duration-500 hover:border-green-400/50 hover:shadow-green-500/30 hover:scale-105"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-gradient-to-br from-green-400/60 to-emerald-400/40 blur-sm"></div>
                            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-tl from-emerald-400/60 to-green-400/40 blur-sm"></div>
                            
                            <div className="relative z-10">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30">
                                    <Wallet className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="mb-4 text-xl font-semibold text-white">Stake Platformu</h3>
                                <p className="mb-4 text-white/70">
                                    MES token kilitleyerek pasif gelir elde edin. Diamond ve Blue Diamond stake havuzlarından kâr payı alın.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-green-400">
                                    <TrendingUp className="h-4 w-4" />
                                    <span>%25 Pasif Gelir</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* MES Üretim Sistemi */}
                        <motion.div 
                            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur transition-all duration-500 hover:border-cyan-400/50 hover:shadow-cyan-500/30 hover:scale-105"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400/60 to-blue-400/40 blur-sm"></div>
                            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-tl from-blue-400/60 to-cyan-400/40 blur-sm"></div>
                            
                            <div className="relative z-10">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30">
                                    <Database className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="mb-4 text-xl font-semibold text-white">MES Üretim Sistemi</h3>
                                <p className="mb-4 text-white/70">
                                    Kalite kontrol, ürün takibi, RFID sayımı ve personel izleme. Blokzincir ile şeffaf üretim süreçleri.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-cyan-400">
                                    <Target className="h-4 w-4" />
                                    <span>Endüstriyel Verimlilik</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* AI Görsel Üretimi */}
                        <motion.div 
                            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur transition-all duration-500 hover:border-rose-400/50 hover:shadow-rose-500/30 hover:scale-105"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-gradient-to-br from-rose-400/60 to-pink-400/40 blur-sm"></div>
                            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-tl from-pink-400/60 to-rose-400/40 blur-sm"></div>
                            
                            <div className="relative z-10">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg shadow-rose-500/30">
                                    <Cpu className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="mb-4 text-xl font-semibold text-white">AI Görsel Üretimi</h3>
                                <p className="mb-4 text-white/70">
                                    Google Gemini API ile profesyonel ürün fotoğrafları. 5 kategori, saniyeler içinde stüdyo kalitesi sonuçlar.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-rose-400">
                                    <Sparkles className="h-4 w-4" />
                                    <span>Yapay Zeka Teknolojisi</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* MES Token Ekonomisi */}
            <motion.section 
                className="relative py-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <motion.h2 
                            className="mb-4 text-3xl font-bold text-white md:text-4xl"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                        >
                            MES Token Ekonomisi
                        </motion.h2>
                        <motion.p 
                            className="mx-auto max-w-2xl text-lg text-white/80"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Ethereum ağı üzerinde çalışan MES token'in çoklu kullanım alanları ve yatırım fırsatları
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Token Kullanım Alanları */}
                        <motion.div 
                            className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                        >
                            <h3 className="mb-6 text-2xl font-bold text-white">Kullanım Alanları</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                                        <ShoppingCart className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">E-Ticaret Ödemeleri</h4>
                                        <p className="text-sm text-white/70">Güvenli ve hızlı ödeme aracı olarak kullanım</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500">
                                        <Gift className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">NFT & Hizmet Ödemeleri</h4>
                                        <p className="text-sm text-white/70">NFT pazaryeri ve freelancer platformunda ödeme</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                                        <TrendingUp className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Stake & Getiri Paylaşımı</h4>
                                        <p className="text-sm text-white/70">Pasif gelir ve kâr paylaşımı imkânı</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                                        <Users className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Yönetişim & Topluluk</h4>
                                        <p className="text-sm text-white/70">Ekosistem kararlarında oy hakkı</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Yatırım Fırsatları */}
                        <motion.div 
                            className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <h3 className="mb-6 text-2xl font-bold text-white">Yatırım Fırsatları</h3>
                            <div className="space-y-6">
                                <div className="rounded-xl border border-white/20 bg-white/5 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-green-400" />
                                        <span className="font-semibold text-white">Piyasa Değeri</span>
                                    </div>
                                    <p className="text-sm text-white/70">Arz-talep dinamiklerine bağlı serbest piyasa değerlemesi</p>
                                </div>
                                <div className="rounded-xl border border-white/20 bg-white/5 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Wallet className="h-5 w-5 text-purple-400" />
                                        <span className="font-semibold text-white">Stake Havuzları</span>
                                    </div>
                                    <p className="text-sm text-white/70">Diamond ve Blue Diamond havuzlarından %25 pasif gelir</p>
                                </div>
                                <div className="rounded-xl border border-white/20 bg-white/5 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Globe className="h-5 w-5 text-blue-400" />
                                        <span className="font-semibold text-white">Küresel Entegrasyon</span>
                                    </div>
                                    <p className="text-sm text-white/70">Dünya genelinde kabul ve diğer projelerle entegrasyon</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section 
                className="relative py-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black" />
                <motion.div 
                    className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <motion.h2 
                        className="mb-6 text-3xl font-bold text-white md:text-4xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Fotoğraflarınızı dönüştürmeye hazır mısınız?
                    </motion.h2>
                    <motion.p 
                        className="mx-auto mb-8 max-w-2xl text-xl text-white/80"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        MesChain ile çarpıcı ürün fotoğrafları oluşturmak için AI kullanan binlerce işletmeye katılın. Profesyonel kalitede görselleri saniyeler içinde elde edin.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.3 }
                        }}
                    >
                    {userId ? (
                        <a
                            href="/generate"
                                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-purple-500/25 hover:scale-105"
                        >
                            Şimdi üretmeye başla
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </a>
                    ) : (
                        <SignInButton mode="modal">
                            <button className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-purple-500/25 hover:scale-105">
                                Ücretsiz başlayın
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                        </SignInButton>
                    )}
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Ortaklıklar ve Borsa Listeleme */}
            <motion.section 
                className="relative py-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <motion.h2 
                            className="mb-4 text-3xl font-bold text-white md:text-4xl"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                        >
                            Güçlü Ortaklıklar ve Küresel Erişim
                        </motion.h2>
                        <motion.p 
                            className="mx-auto max-w-2xl text-lg text-white/80"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            MesChain'in stratejik iş birlikleri ve küresel borsa listeleme başarıları
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Stratejik Ortaklıklar */}
                        <motion.div 
                            className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                        >
                            <h3 className="mb-6 text-2xl font-bold text-white">Stratejik Ortaklıklar</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">SWFT Blockchain</h4>
                                        <p className="text-sm text-white/70">200+ kripto para ile swap ve ödeme imkânı</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                                        <ShoppingCart className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">E-Ticaret Entegrasyonları</h4>
                                        <p className="text-sm text-white/70">Amazon, Ozon, Aliexpress ile altyapı çalışmaları</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                                        <Globe className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Küresel Pazaryerler</h4>
                                        <p className="text-sm text-white/70">Trendyol, Hepsiburada, eBay, Etsy entegrasyonu</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Borsa Listeleme */}
                        <motion.div 
                            className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <h3 className="mb-6 text-2xl font-bold text-white">Borsa Listeleme</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
                                        <TrendingUp className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">PancakeSwap (BSC)</h4>
                                        <p className="text-sm text-white/70">Merkeziyetsiz borsa listeleme</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500">
                                        <BarChart3 className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">MEXC & CoinTiger</h4>
                                        <p className="text-sm text-white/70">Küresel kripto borsalarında işlem</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                                        <Award className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">CoinMarketCap & CoinGecko</h4>
                                        <p className="text-sm text-white/70">Kripto veritabanlarında görünürlük</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Gelecek Vizyonu ve Roadmap */}
            <motion.section 
                className="relative py-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <motion.h2 
                            className="mb-4 text-3xl font-bold text-white md:text-4xl"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                        >
                            Gelecek Vizyonu
                        </motion.h2>
                        <motion.p 
                            className="mx-auto max-w-2xl text-lg text-white/80"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            MesChain'in sürekli AR-GE ve inovasyon vizyonu ile gelecek hedefleri
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Kısa Vadeli Hedefler */}
                        <motion.div 
                            className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                                <Calendar className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-white">Kısa Vadeli (3-6 ay)</h3>
                            <ul className="space-y-3 text-white/70">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                    <span>Daha fazla kategori ekleme</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                    <span>Batch işleme özelliği</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                    <span>API entegrasyonları</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                    <span>Mobil uygulama</span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Orta Vadeli Hedefler */}
                        <motion.div 
                            className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                                <Rocket className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-white">Orta Vadeli (6-12 ay)</h3>
                            <ul className="space-y-3 text-white/70">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-blue-400" />
                                    <span>Video içerik üretimi</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-blue-400" />
                                    <span>3D model entegrasyonu</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-blue-400" />
                                    <span>Çoklu dil desteği</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-blue-400" />
                                    <span>Gelişmiş AI modelleri</span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Uzun Vadeli Vizyon */}
                        <motion.div 
                            className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                                <Star className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-white">Uzun Vadeli (1-2 yıl)</h3>
                            <ul className="space-y-3 text-white/70">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-purple-400" />
                                    <span>AR/VR entegrasyonu</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-purple-400" />
                                    <span>Blockchain telif hakkı</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-purple-400" />
                                    <span>Global pazar genişlemesi</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-purple-400" />
                                    <span>Enterprise çözümler</span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Chat Board */}
            <ChatBoard 
                key="chat-board"
                isOpen={isChatBoardOpen}
                onToggle={handleChatBoardToggle}
                isMicrophoneActive={isMicrophoneActive}
                onMicrophoneToggle={handleMicrophoneToggle}
            />

            {/* Yukarı Çık Butonu */}
            {showScrollTop && (
                <motion.button
                    onClick={scrollToTop}
                    className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ChevronUp className="w-6 h-6" />
                </motion.button>
            )}
        </motion.div>
    );
}
