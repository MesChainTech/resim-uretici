'use client';

export default function TestImagesPage() {
  const images = [
    '/image/Dentalai/dental_06.png',
    '/image/Dentalai/dentalai_01.png',
    '/image/Dentalai/dental_02.png',
    '/image/Dentalai/dental_03.png',
    '/image/Dentalai/dental_04.png',
    '/image/Dentalai/dental_05.png',
    '/dolphin.png',
    '/E-Ticaret.webp',
    '/Giyim.webp',
    '/Taki.webp',
    '/Teknoloji.webp',
    '/Guzellik.webp',
    '/chat.jpg'
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Resim Yolu Test Sayfası</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((src, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm mb-2 truncate">{src}</h3>
            <div className="relative">
              <img 
                src={src} 
                alt={`Test image ${index + 1}`}
                className="w-full h-48 object-cover rounded"
                onError={(e) => {
                  console.error(`Image failed to load: ${src}`);
                  e.currentTarget.style.border = '2px solid red';
                }}
                onLoad={() => {
                  console.log(`Image loaded successfully: ${src}`);
                }}
              />
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                ✓
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
