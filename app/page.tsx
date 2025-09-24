import { auth } from '@clerk/nextjs/server';
import { SignInButton } from '@clerk/nextjs';
import { ArrowRight, ImageIcon, Sparkles, Zap, Shield } from 'lucide-react';

export default async function HomePage() {
    const { userId } = await auth();

    return (
                <div className="relative min-h-screen overflow-hidden">
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
                    
                    {/* Işık efektleri - mavi-pembe geçiş */}
                    <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-gradient-to-br from-pink-500/12 to-rose-400/6 blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-500/10 to-cyan-400/5 blur-3xl" />
                    <div className="absolute top-1/3 left-1/3 h-64 w-64 rounded-full bg-gradient-to-br from-purple-500/8 to-pink-400/4 blur-3xl" />

            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 pt-32 pb-24 sm:px-6 sm:pt-24 sm:pb-32 lg:px-8">

                <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-lg ring-1 ring-white/20 backdrop-blur">
                            <Sparkles className="h-4 w-4" />
                            <span>Stüdyo kalitesi saniyeler içinde</span>
                        </div>
                                <h1 className="mt-8 text-4xl font-bold leading-tight text-white/60 md:text-6xl">
                                    <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                        Ürün fotoğraflarınızı saniyeler içinde yapay zeka ile dönüştürün
                                    </span>
                                </h1>
                        <p className="mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
                            Model ve ürün görsellerinizi yükleyin; markanıza uygun stüdyo kalitesinde kareleri tek tıkla elde edin.
                        </p>

                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
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
                        </div>

                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-2xl" />
                        <div className="relative rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                                    <ImageIcon className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white/70">Öne çıkan koleksiyon</p>
                                    <p className="text-xl font-semibold text-white">Premium ürün çekimleri</p>
                                </div>
                            </div>

                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur">
                                    <div className="flex items-center gap-3">
                                        <Zap className="h-5 w-5 text-purple-400" />
                                        <span className="text-sm font-semibold text-white">Akıllı ışık</span>
                                    </div>
                                    <p className="mt-2 text-sm text-white/70">
                                        AI, ürüne göre ışık ve gölgeyi otomatik ayarlar.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur">
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-pink-400" />
                                        <span className="text-sm font-semibold text-white">Marka tutarlılığı</span>
                                    </div>
                                    <p className="mt-2 text-sm text-white/70">
                                        Renk ve arka planı stil rehberinize uygun şekilde korur.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 rounded-2xl border border-dashed border-white/30 bg-white/5 p-5 text-sm text-white/80">
                                %92 müşteri, ilk projede beklediğinden daha iyi sonuç aldığını söylüyor.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative py-20">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                            Neden Axe Resim Üretici'yi Seçmelisiniz?
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-white/80">
                            Zaman kazandıran ve profesyonel sonuçlar sunan AI destekli ürün fotoğrafçılığının gücünü deneyimleyin.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="rounded-lg border border-white/20 bg-white/10 p-8 text-center shadow-lg backdrop-blur">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                                <Zap className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-white">Şimşek Hızında</h3>
                            <p className="text-white/70">
                                Saatler değil saniyeler içinde profesyonel ürün fotoğrafları oluşturun. Görsellerinizi yükleyin ve anında sonuç alın.
                            </p>
                        </div>

                        <div className="rounded-lg border border-white/20 bg-white/10 p-8 text-center shadow-lg backdrop-blur">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500">
                                <Sparkles className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-white">AI Destekli Kalite</h3>
                            <p className="text-white/70">
                                Gelişmiş AI algoritmalarımız, profesyonel stüdyolarla yarışan yüksek kaliteli ve gerçekçi ürün fotoğrafları sağlar.
                            </p>
                        </div>

                        <div className="rounded-lg border border-white/20 bg-white/10 p-8 text-center shadow-lg backdrop-blur">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
                                <Shield className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-white">Güvenli ve Özel</h3>
                            <p className="text-white/70">
                                Görselleriniz güvenli bir şekilde işlenir ve gereğinden uzun süre saklanmaz. Gizlilik ve güvenlik en büyük önceliğimizdir.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="relative py-20">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                            Her ürün kategorisi için mükemmel
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-white/80">
                            Yapay zekamız çeşitli ürün kategorilerinde eğitildi ve özel ihtiyaçlarınıza uygun sonuçlar sunar.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
                        {[
                            { name: 'E-ticaret', description: 'Genel ürünler' },
                            { name: 'Giyim', description: 'Kıyafet ve aksesuarlar' },
                            { name: 'Takı', description: 'Yüzük ve kolyeler' },
                            { name: 'Teknoloji', description: 'Elektronik ve cihazlar' },
                            { name: 'Güzellik', description: 'Kozmetik ve cilt bakımı' },
                        ].map((category) => (
                            <div key={category.name} className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 px-6 py-8 text-center shadow-lg backdrop-blur transition-all hover:-translate-y-1 hover:border-purple-400/50 hover:shadow-purple-500/20">
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                <h3 className="mt-1 mb-3 text-lg font-semibold text-white">{category.name}</h3>
                                <p className="text-sm text-white/70">{category.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black" />
                <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                                Fotoğraflarınızı dönüştürmeye hazır mısınız?
                            </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-xl text-white/80">
                        Çarpıcı ürün fotoğrafları oluşturmak için AI kullanan binlerce işletmeye katılın.
                    </p>

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
                </div>
            </section>
        </div>
    );
}

export const metadata = {
    title: 'AI Product Generator - Transform Your Photos with AI',
    description: 'Create stunning product photography using AI. Upload your model and product images to generate professional-quality photos in seconds.',
};

