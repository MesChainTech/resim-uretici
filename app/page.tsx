import { auth } from '@clerk/nextjs/server';
import { SignInButton } from '@clerk/nextjs';
import { ArrowRight, ImageIcon, Sparkles, Zap, Shield } from 'lucide-react';

export default async function HomePage() {
    const { userId } = await auth();

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            <div className="absolute inset-0 -z-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 dark:from-primary/20 dark:via-background dark:to-secondary/20" />

            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 pt-32 pb-24 sm:px-6 sm:pt-24 sm:pb-32 lg:px-8">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-background to-accent/15 dark:from-primary/25 dark:via-background dark:to-secondary/25" />
                <div className="absolute -top-40 -right-20 h-72 w-72 rounded-full bg-primary/25 dark:bg-primary/15 blur-3xl" />
                <div className="absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-secondary/25 dark:bg-secondary/15 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2 rounded-full bg-card/80 px-4 py-2 text-sm font-medium text-primary shadow-lg ring-1 ring-primary/15 dark:ring-primary/25 backdrop-blur">
                            <Sparkles className="h-4 w-4" />
                            <span>Stüdyo kalitesi saniyeler içinde</span>
                        </div>
                        <h1 className="mt-8 text-4xl font-bold leading-tight text-foreground md:text-6xl">
                            Ürün fotoğraflarınızı saniyeler içinde{' '}
                            <span className="text-primary">yapay zeka ile dönüştürün</span>
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
                            Model ve ürün görsellerinizi yükleyin; markanıza uygun stüdyo kalitesinde kareleri tek tıkla elde edin.
                        </p>

                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            {userId ? (
                                <a
                                    href="/generate"
                                    className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg ring-1 ring-primary/15 dark:ring-primary/25 transition-colors hover:bg-primary/90"
                                >
                                    Hemen üretmeye başlayın
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </a>
                            ) : (
                                <SignInButton mode="modal">
                                    <button className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg ring-1 ring-primary/15 dark:ring-primary/25 transition-colors hover:bg-primary/90">
                                        Ücretsiz deneyin
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </button>
                                </SignInButton>
                            )}
                            <a
                                href="#features"
                                className="inline-flex items-center justify-center rounded-xl border border-border/50 bg-card/70 px-8 py-4 text-lg font-semibold text-primary shadow-lg shadow-black/10 backdrop-blur ring-1 ring-primary/15 dark:ring-primary/25 transition-colors hover:bg-card/60"
                            >
                                Nasıl çalıştığını görün
                            </a>
                        </div>

                        <dl className="mt-12 grid max-w-lg grid-cols-2 gap-6">
                            <div className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur">
                                <dt className="text-sm font-medium text-muted-foreground">Üretim hızı</dt>
                                <dd className="mt-2 text-3xl font-semibold text-foreground">10x</dd>
                                <dd className="mt-2 text-sm text-muted-foreground">Klasik stüdyo çekimlerine kıyasla çok daha hızlı teslimat.</dd>
                            </div>
                            <div className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur">
                                <dt className="text-sm font-medium text-muted-foreground">Memnun kullanıcı</dt>
                                <dd className="mt-2 text-3xl font-semibold text-foreground">500+</dd>
                                <dd className="mt-2 text-sm text-muted-foreground">Dünya çapında markalar Axe Resim Üretici'ye güveniyor.</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-3xl bg-primary/15 dark:bg-primary/10 blur-2xl" />
                        <div className="relative rounded-3xl border border-border/50 bg-card/80 p-8 shadow-2xl shadow-black/20 ring-1 ring-primary/15 dark:ring-primary/25 backdrop-blur">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                                    <ImageIcon className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Öne çıkan koleksiyon</p>
                                    <p className="text-xl font-semibold text-foreground">Premium ürün çekimleri</p>
                                </div>
                            </div>

                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-lg shadow-black/10 backdrop-blur">
                                    <div className="flex items-center gap-3">
                                        <Zap className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-semibold text-foreground">Akıllı ışık</span>
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        AI, ürüne göre ışık ve gölgeyi otomatik ayarlar.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-lg shadow-black/10 backdrop-blur">
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-semibold text-foreground">Marka tutarlılığı</span>
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Renk ve arka planı stil rehberinize uygun şekilde korur.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 rounded-2xl border border-dashed border-border/50 bg-card/60 p-5 text-sm text-primary">
                                %92 müşteri, ilk projede beklediğinden daha iyi sonuç aldığını söylüyor.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-background">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                            Neden Axe Resim Üretici'yi Seçmelisiniz?
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            Zaman kazandıran ve profesyonel sonuçlar sunan AI destekli ürün fotoğrafçılığının gücünü deneyimleyin.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="rounded-lg border border-border/50 bg-card/70 p-8 text-center shadow-lg shadow-black/10 backdrop-blur">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                                <Zap className="h-8 w-8 text-primary-foreground" />
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-foreground">Şimşek Hızında</h3>
                            <p className="text-muted-foreground">
                                Saatler değil saniyeler içinde profesyonel ürün fotoğrafları oluşturun. Görsellerinizi yükleyin ve anında sonuç alın.
                            </p>
                        </div>

                        <div className="rounded-lg border border-border/50 bg-card/70 p-8 text-center shadow-lg shadow-black/10 backdrop-blur">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                                <Sparkles className="h-8 w-8 text-accent-foreground" />
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-foreground">AI Destekli Kalite</h3>
                            <p className="text-muted-foreground">
                                Gelişmiş AI algoritmalarımız, profesyonel stüdyolarla yarışan yüksek kaliteli ve gerçekçi ürün fotoğrafları sağlar.
                            </p>
                        </div>

                        <div className="rounded-lg border border-border/50 bg-card/70 p-8 text-center shadow-lg shadow-black/10 backdrop-blur">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                                <Shield className="h-8 w-8 text-secondary-foreground" />
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-foreground">Güvenli ve Özel</h3>
                            <p className="text-muted-foreground">
                                Görselleriniz güvenli bir şekilde işlenir ve gereğinden uzun süre saklanmaz. Gizlilik ve güvenlik en büyük önceliğimizdir.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 bg-muted">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                            Her ürün kategorisi için mükemmel
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
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
                            <div key={category.name} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 px-6 py-8 text-center shadow-lg shadow-black/5 backdrop-blur transition-transform hover:-translate-y-1 hover:border-primary/50 hover:shadow-primary/20">
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                <h3 className="mt-1 mb-3 text-lg font-semibold text-foreground">{category.name}</h3>
                                <p className="text-sm text-muted-foreground">{category.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-4xl">
                        Ürün fotoğraflarınızı dönüştürmeye hazır mısınız?
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-foreground/80">
                        Çarpıcı ürün fotoğrafları oluşturmak için AI kullanan binlerce işletmeye katılın.
                    </p>

                    {userId ? (
                        <a
                            href="/generate"
                            className="inline-flex items-center justify-center rounded-xl bg-card/70 px-8 py-4 text-lg font-semibold text-primary shadow-lg shadow-black/10 backdrop-blur transition-colors hover:bg-card/50"
                        >
                            Şimdi üretmeye başla
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </a>
                    ) : (
                        <SignInButton mode="modal">
                            <button className="inline-flex items-center justify-center rounded-xl bg-card/70 px-8 py-4 text-lg font-semibold text-primary shadow-lg shadow-black/10 backdrop-blur transition-colors hover:bg-card/50">
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

