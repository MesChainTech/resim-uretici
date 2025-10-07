'use client';

import { useAuth } from '@clerk/nextjs';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { ArrowRight, Zap, Camera } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Header() {
    const { userId } = useAuth();
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 border-b border-border/30 bg-background/40 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <a href="/" className="group flex items-center gap-3">
                        <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform group-hover:scale-105">
                            <Camera className="h-6 w-6" />
                            <Zap className="absolute -top-1 -right-1 h-4 w-4 text-accent" />
                        </span>
                        <span className="text-lg font-semibold tracking-tight text-foreground">
                            MesChain
                        </span>
                    </a>
                </div>

                <nav className="flex items-center gap-3 text-sm font-medium">
                    {userId ? (
                        <>
                            {pathname !== '/' && (
                                <a
                                    href="/"
                                    className="rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Ana Sayfa
                                </a>
                            )}
                            {pathname !== '/generate' && (
                                <a
                                    href="/generate"
                                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
                                >
                                    Görsel Oluştur
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            )}
                            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "ring-2 ring-primary/40" } }} />
                        </>
                    ) : (
                        <>
                            <a
                                href="/sign-in"
                                className="rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Giriş Yap
                            </a>
                            <SignInButton mode="modal">
                                <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90">
                                    Ücretsiz Başla
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </SignInButton>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}