import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { Footer, Header } from '@/components';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Axe Resim Üretici',
    description: 'AI teknolojisi kullanarak çarpıcı ürün görselleri oluşturun',
    keywords: ['AI', 'ürün fotoğrafçılığı', 'görsel oluşturma', 'e-ticaret'],
    authors: [{ name: 'Axe Resim Üretici Ekibi' }],
    openGraph: {
        title: 'Axe Resim Üretici',
        description: 'AI teknolojisi kullanarak çarpıcı ürün görselleri oluşturun',
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        siteName: 'Axe Resim Üretici',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Axe Resim Üretici',
            },
        ],
        locale: 'tr_TR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Axe Resim Üretici',
        description: 'AI teknolojisi kullanarak çarpıcı ürün görselleri oluşturun',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="tr" className="dark">
                <head>
                    <link rel="icon" href="/favicon.ico" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                    <link rel="manifest" href="/site.webmanifest" />
                </head>
                <body className={`${inter.className} bg-background text-foreground antialiased`}>
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <main className="flex-grow">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </body>
            </html>
        </ClerkProvider>
    );
}