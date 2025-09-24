import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ImageGenerator } from '@/components';

export default async function GeneratePage() {
    const { userId } = await auth();

    // Redirect to sign-in if not authenticated
    if (!userId) {
        redirect('/sign-in');
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated background elements */}
            <div className="absolute inset-0 -z-10">
                {/* Floating squares */}
                <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500/30 rounded-lg animate-pulse"></div>
                <div className="absolute top-40 right-20 w-6 h-6 bg-pink-500/30 rounded-lg animate-pulse delay-1000"></div>
                <div className="absolute bottom-40 left-20 w-5 h-5 bg-cyan-500/30 rounded-lg animate-pulse delay-2000"></div>
                <div className="absolute bottom-20 right-10 w-3 h-3 bg-purple-500/30 rounded-lg animate-pulse delay-3000"></div>
                
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-pink-500/10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
            </div>

            <main className="relative z-10 py-24 sm:py-32">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-4 py-2 text-sm font-medium text-green-400 ring-1 ring-green-500/30 backdrop-blur">
                            ✨ HidLight MedyaTech AI Üretimi
                        </span>
                        <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Ürün fotoğraflarınızı saniyeler içinde yapay zeka ile dönüştürün
                            </span>
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm text-gray-300 sm:text-base sm:leading-relaxed mx-auto">
                            Fotoğraf seti kurmana gerek yok. Görsellerini yükle, stilleri seç ve markana uygun çıktıları saniyeler içinde indir.
                        </p>
                    </div>

                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur">
                        <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent opacity-75" />
                        <ImageGenerator />
                    </div>
                </div>
            </main>
        </div>
    );
}

export const metadata = {
    title: 'Oluştur - HidLight MedyaTech',
    description: 'AI teknolojisi kullanarak çarpıcı ürün görselleri oluşturun',
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL?.replace(/['"]/g, '') || 'http://localhost:3000'),
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
};
