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
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-green-900">
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

            <main className="relative z-10 py-24 sm:py-32">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-4 py-2 text-sm font-medium text-green-400 ring-1 ring-green-500/30 backdrop-blur">
                            ✨ MesTech Sync AI Üretimi
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
    title: 'Oluştur - MesTech Sync',
    description: 'AI teknolojisi kullanarak çarpıcı ürün görselleri oluşturun',
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL?.replace(/['"]/g, '') || 'http://localhost:3000'),
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
};
