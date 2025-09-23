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
        <div className="relative min-h-screen overflow-hidden bg-background">
            <div className="absolute inset-0 -z-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 dark:from-primary/20 dark:via-background dark:to-secondary/20" />
            <div className="absolute -top-40 -right-24 h-72 w-72 rounded-full bg-primary/15 dark:bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-secondary/15 dark:bg-secondary/10 blur-3xl" />

            <main className="relative z-10 py-24 sm:py-32">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-card/70 px-4 py-2 text-sm font-medium text-primary ring-1 ring-primary/20 backdrop-blur">
                            Studyo kalitesinde AI uretimi
                        </span>
                        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Yeni projeni dakikalar icinde baslat
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base sm:leading-relaxed mx-auto">
                            Fotograf seti kurmana gerek yok. Gorsellerini yukle, stilleri sec ve markana uygun ciktilari saniyeler icinde indir.
                        </p>
                    </div>

                    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/80 p-8 shadow-2xl shadow-black/20 backdrop-blur">
                        <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-75" />
                        <ImageGenerator />
                    </div>
                </div>
            </main>
        </div>
    );
}

export const metadata = {
    title: 'Olustur - Axe Resim Uretici',
    description: 'AI teknolojisi kullanarak carpici urun gorselleri olusturun',
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
};
