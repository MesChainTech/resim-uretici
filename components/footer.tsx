import { Camera, Zap } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative mr-3">
                            <Camera className="w-8 h-8 text-blue-400" />
                            <Zap className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
                        </div>
                        <h3 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent tracking-tight">Axe Resim Üretici</h3>
                    </div>
                    <p className="text-gray-400 mb-8">
                        Modern işletmeler için profesyonel AI destekli ürün fotoğrafçılığı.
                    </p>
                    <div className="flex justify-center space-x-8 text-sm text-gray-400">
                        <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
                        <a href="#" className="hover:text-white transition-colors">Kullanım Koşulları</a>
                        <a href="#" className="hover:text-white transition-colors">İletişim</a>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-400">
                        <p>&copy; 2025 Axe Resim Üretici. Tüm hakları saklıdır.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}