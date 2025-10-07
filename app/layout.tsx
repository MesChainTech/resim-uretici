import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { Footer, Header } from '@/components';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'HidLight MedyaTech',
    description: 'AI teknolojisi kullanarak çarpıcı ürün görselleri oluşturun',
    keywords: ['AI', 'ürün fotoğrafçılığı', 'görsel oluşturma', 'e-ticaret'],
    authors: [{ name: 'HidLight MedyaTech Ekibi' }],
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL?.replace(/['"]/g, '') || 'http://localhost:3000'),
    openGraph: {
        title: 'HidLight MedyaTech',
        description: 'AI teknolojisi kullanarak çarpıcı ürün görselleri oluşturun',
        url: process.env.NEXT_PUBLIC_APP_URL?.replace(/['"]/g, '') || 'http://localhost:3000',
        siteName: 'HidLight MedyaTech',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'HidLight MedyaTech',
            },
        ],
        locale: 'tr_TR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'HidLight MedyaTech',
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
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_ZGlzY3JldGUtYnVubnktMjQuY2xlcmsuYWNjb3VudHMuZGV2JA';
    
    return (
        <ClerkProvider publishableKey={publishableKey}>
            <html lang="tr" className="dark">
                <head>
                    <link rel="icon" href="/favicon.ico" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.svg" />
                    <link rel="icon" type="image/svg+xml" sizes="32x32" href="/favicon-32x32.svg" />
                    <link rel="icon" type="image/svg+xml" sizes="16x16" href="/favicon-16x16.svg" />
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