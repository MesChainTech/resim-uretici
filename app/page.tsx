import { auth } from '@clerk/nextjs/server';
import { SignInButton } from '@clerk/nextjs';
import { ArrowRight, ImageIcon, Sparkles, Zap, Shield } from 'lucide-react';

export default async function HomePage() {
    const { userId } = await auth();

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Leonardo.Ai tarzı gradient arka plan */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900" />
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMGgydjRINHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            
            {/* Loş ışık efektleri */}
            <div className="absolute -top-40 -right-20 h-96 w-96 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl" />
            <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-gradient-to-r from-pink-500/20 to-red-500/20 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-gradient-to-r from-purple-400/10 to-red-400/10 blur-3xl" />

            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 pt-32 pb-24 sm:px-6 sm:pt-24 sm:pb-32 lg:px-8">

                <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-lg ring-1 ring-white/20 backdrop-blur">
                            <Sparkles className="h-4 w-4" />
                            <span>Stüdyo kalitesi saniyeler içinde</span>
                        </div>
                        <h1 className="mt-8 text-4xl font-bold leading-tight text-white md:text-6xl">
                            Ürün fotoğraflarınızı saniyeler içinde{' '}
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">yapay zeka ile dönüştürün</span>
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

                        <dl className="mt-12 grid max-w-lg grid-cols-2 gap-6">
                            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
                                <dt className="text-sm font-medium text-white/70">Üretim hızı</dt>
                                <dd className="mt-2 text-3xl font-semibold text-white">10x</dd>
                                <dd className="mt-2 text-sm text-white/70">Klasik stüdyo çekimlerine kıyasla çok daha hızlı teslimat.</dd>
                            </div>
                            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
                                <dt className="text-sm font-medium text-white/70">Memnun kullanıcı</dt>
                                <dd className="mt-2 text-3xl font-semibold text-white">500+</dd>
                                <dd className="mt-2 text-sm text-white/70">Dünya çapında markalar Axe Resim Üretici'ye güveniyor.</dd>
                            </div>
                        </dl>
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
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
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
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
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
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black" />
                <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                        Ürün fotoğraflarınızı dönüştürmeye hazır mısınız?
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

