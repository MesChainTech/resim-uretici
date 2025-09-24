import { Camera, Zap } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-border/60 bg-background/90">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="mb-6 flex items-center justify-center gap-3">
                        <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                            <Camera className="h-6 w-6" />
                            <Zap className="absolute -top-1 -right-1 h-4 w-4 text-accent" />
                        </span>
                        <h3 className="text-xl font-semibold tracking-tight text-foreground">
                            HidLight MedyaTech
                        </h3>
                    </div>

                    <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
                        Modern işletmeler için profesyonel, AI destekli ürün fotoğrafçılığı deneyimi.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                        <a href="#" className="transition-colors hover:text-foreground">
                            Gizlilik Politikası
                        </a>
                        <a href="#" className="transition-colors hover:text-foreground">
                            Kullanım Koşulları
                        </a>
                        <a href="#" className="transition-colors hover:text-foreground">
                            İletişim
                        </a>
                    </div>

                    <div className="mt-10 border-t border-border/40 pt-6 text-xs text-muted-foreground/80">
                        <p>&copy; 2025 HidLight MedyaTech. Tüm hakları saklıdır.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}