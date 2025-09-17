'use client';

import { useAuth } from '@clerk/nextjs';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { ArrowRight, Zap, Camera } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Header() {
    const { userId } = useAuth();
    const pathname = usePathname();

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <a href="/" className="flex items-center cursor-pointer group">
                            <div className="relative mr-3">
                                <Camera className="w-8 h-8 text-blue-600" />
                                <Zap className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
                            </div>
                            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent tracking-tight">
                                Axe Resim Üretici
                            </h1>
                        </a>
                    </div>

                    <nav className="flex items-center space-x-4">
                        {userId ? (
                            <>
                                {pathname !== '/' && (
                                    <a
                                        href="/"
                                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Ana Sayfa
                                    </a>
                                )}
                                {pathname !== '/generate' && (
                                    <a
                                        href="/generate"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                                    >
                                        Görsel Oluştur
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </a>
                                )}
                                <UserButton afterSignOutUrl="/" />
                            </>
                        ) : (
                            <>
                                <a
                                    href="/sign-in"
                                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Giriş Yap
                                </a>
                                <SignInButton mode="modal">
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                        Ücretsiz Başla
                                    </button>
                                </SignInButton>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}