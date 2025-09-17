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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Main Content */}
            <main className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ImageGenerator />
                </div>
            </main>
        </div>
    );
}

export const metadata = {
    title: 'Oluştur - Axe Resim Üretici',
    description: 'AI teknolojisi kullanarak çarpıcı ürün görselleri oluşturun',
};