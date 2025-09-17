import { auth } from '@clerk/nextjs/server';
import { SignInButton } from '@clerk/nextjs';
import { ArrowRight, ImageIcon, Sparkles, Zap, Shield } from 'lucide-react';

export default async function HomePage() {
    const { userId } = await auth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

            {/* Hero Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Ürün Fotoğraflarınızı{' '}
                        <span className="text-blue-600">AI Sihri</span> ile Dönüştürün
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Model ve ürün görsellerinizi yükleyerek saniyeler içinde çarpıcı, profesyonel kalitede
                        ürün fotoğrafçılığı oluşturun. E-ticaret, giyim, takı ve daha fazlası için mükemmel.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {userId ? (
                            <a
                                href="/generate"
                                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
                            >
                                Ürün Oluşturmaya Başla
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </a>
                        ) : (
                            <SignInButton mode="modal">
                                <button className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg">
                                    Ücretsiz Başlayın
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </button>
                            </SignInButton>
                        )}
                        <a
                            href="#features"
                            className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-lg"
                        >
                            Daha Fazla Bilgi
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Neden Axe Resim Üretici'yi Seçmelisiniz?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Zaman kazandıran ve profesyonel sonuçlar sunan AI destekli ürün fotoğrafçılığının gücünü deneyimleyin.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-8 rounded-lg bg-blue-50">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Şimşek Hızında</h3>
                            <p className="text-gray-600">
                                Saatler değil saniyeler içinde profesyonel ürün fotoğrafları oluşturun.
                                Görsellerinizi yükleyin ve anında sonuç alın.
                            </p>
                        </div>

                        <div className="text-center p-8 rounded-lg bg-purple-50">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Destekli Kalite</h3>
                            <p className="text-gray-600">
                                Gelişmiş AI algoritmaları, profesyonel stüdyolarla rekabet edebilecek
                                yüksek kaliteli, gerçekçi ürün fotoğrafçılığı sağlar.
                            </p>
                        </div>

                        <div className="text-center p-8 rounded-lg bg-green-50">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Güvenli ve Özel</h3>
                            <p className="text-gray-600">
                                Görselleriniz güvenli bir şekilde işlenir ve gerekenden uzun süre saklanmaz.
                                Gizlilik ve güvenlik en büyük önceliğimizdir.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Her Ürün Kategorisi İçin Mükemmel
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            AI'ımız çeşitli ürün kategorilerinde eğitilmiştir ve özel ihtiyaçlarınız için en uygun sonuçları sunar.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {[
                            { name: 'E-ticaret', description: 'Genel ürünler' },
                            { name: 'Giyim', description: 'Kıyafet ve aksesuarlar' },
                            { name: 'Takı', description: 'Yüzük ve kolyeler' },
                            { name: 'Teknoloji', description: 'Elektronik ve gadgetlar' },
                            { name: 'Güzellik', description: 'Kozmetik ve cilt bakımı' },
                        ].map((category) => (
                            <div key={category.name} className="bg-white p-6 rounded-lg shadow-sm text-center">
                                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                                <p className="text-sm text-gray-600">{category.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ürün Fotoğraflarınızı Dönüştürmeye Hazır mısınız?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Çarpıcı ürün fotoğrafçılığı oluşturmak için AI kullanmakta olan binlerce işletmeye katılın.
                    </p>

                    {userId ? (
                        <a
                            href="/generate"
                            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
                        >
                            Şimdi Üretmeye Başla
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </a>
                    ) : (
                        <SignInButton mode="modal">
                            <button className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg">
                                Ücretsiz Başlayın
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </button>
                        </SignInButton>
                    )}
                </div>
            </section>
        </div>
    );
}

export const metadata = {
    title: 'AI Product Generator - Transform Your Photos with AI',
    description: 'Create stunning product photography using AI. Upload your model and product images to generate professional-quality photos in seconds.',
};