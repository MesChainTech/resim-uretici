# Axe Resim Üretici

Model görsellerini ürün görselleri ile birleştirerek profesyonel ürün fotoğrafçılığı oluşturmak için AI kullanan bir Next.js SaaS uygulaması.

## Özellikler

- **AI Destekli Görsel Üretimi**: Model ve ürün görsellerini yükleyerek çarpıcı ürün fotoğrafları oluşturun
- **Çoklu Kategoriler**: E-ticaret, giyim, takı, teknoloji ve güzellik ürünleri için destek
- **Güvenli Kimlik Doğrulama**: Clerk tabanlı kullanıcı kimlik doğrulama ve oturum yönetimi
- **Görsel İşleme**: Sharp ile gelişmiş doğrulama ve optimizasyon
- **Modern Arayüz**: Tailwind CSS ve Framer Motion animasyonları ile duyarlı tasarım
- **Gerçek Zamanlı Geri Bildirim**: Doğrulama ve ilerleme göstergeleri ile sürükle-bırak yükleme

## 📸 Ekran Görüntüleri

### Ana Sayfa

![Ana Sayfa](./screenshots/homepage.png)
_Modern ve kullanıcı dostu ana sayfa tasarımı_

### Görsel Üretim Paneli

![Görsel Üretim](./screenshots/generate.png)
_Sürükle-bırak ile kolay dosya yükleme ve kategori seçimi_

## Teknoloji Yığını

- **Framework**: Next.js 15 (App Router)
- **Dil**: TypeScript
- **Stil**: Tailwind CSS v4
- **UI Bileşenleri**: shadcn/ui, Lucide React
- **Kimlik Doğrulama**: Clerk
- **Veritabanı**: Prisma ORM ile PostgreSQL
- **Görsel İşleme**: Sharp
- **Form İşleme**: Zod doğrulama ile React Hook Form
- **Animasyonlar**: Framer Motion
- **Dosya Yükleme**: react-dropzone

## Başlarken

### Ön Gereksinimler

- Node.js 18+
- PostgreSQL veritabanı
- Kimlik doğrulama için Clerk hesabı
- AI görsel üretimi için n8n webhook uç noktası

### Kurulum

1. **Depoyu klonlayın**

   ```bash
   git clone <repository-url>
   cd speckit-app
   ```

2. **Bağımlılıkları yükleyin**

   ```bash
   npm install
   ```

3. **Ortam Kurulumu**

   ```bash
   # Ortam şablonunu kopyalayın
   cp .env.example .env.local
   ```

4. **Ortam Değişkenlerini Yapılandırın**

   `.env.local` dosyasını gerçek değerlerinizle düzenleyin:

   ```bash
   # Veritabanı
   DATABASE_URL="postgresql://kullaniciadi:sifre@localhost:5432/ai_product_generator"
   DIRECT_URL="postgresql://kullaniciadi:sifre@localhost:5432/ai_product_generator"

   # Clerk Kimlik Doğrulama (https://clerk.com adresinden alın)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="clerk_publishable_key_iniz"
   CLERK_SECRET_KEY="clerk_secret_key_iniz"

   # AI işleme için n8n Webhook
   N8N_WEBHOOK_URL="n8n_webhook_url_iniz"
   N8N_API_KEY="n8n_api_key_iniz"
   ```

5. **Veritabanı Kurulumu**

   ```bash
   # Prisma istemcisini oluşturun
   npx prisma generate

   # Veritabanı migrasyonlarını çalıştırın
   npx prisma migrate dev --name init
   ```

6. **Geliştirme Sunucusunu Başlatın**

   ```bash
   npm run dev
   ```

   Uygulama `http://localhost:3000` adresinde erişilebilir olacaktır

## Proje Yapısı

```
├── app/                    # Next.js App Router sayfaları
│   ├── api/               # API rotaları
│   │   ├── generate/      # Görsel üretimi uç noktası
│   │   └── health/        # Sağlık kontrolü uç noktası
│   ├── generate/          # Ana üretim sayfası
│   ├── sign-in/           # Kimlik doğrulama sayfaları
│   ├── sign-up/
│   └── page.tsx           # Ana sayfa
├── components/            # React bileşenleri
│   └── image-generator.tsx # Ana görsel yükleme bileşeni
├── lib/                   # Yardımcı kütüphaneler
│   ├── schemas.ts         # Zod doğrulama şemaları
│   ├── image-utils.ts     # Görsel işleme yardımcıları
│   ├── webhook-client.ts  # n8n webhook entegrasyonu
│   └── errors.ts          # Özel hata sınıfları
├── prisma/               # Veritabanı şeması ve migrasyonları
└── middleware.ts         # Clerk kimlik doğrulama ara yazılımı
```

## API Dokümantasyonu

### POST /api/generate

Model ve ürün görsellerini birleştirerek yeni bir ürün görseli oluşturun.

**İstek Gövdesi:**

```json
{
  "category": "eticaret" | "giyim" | "taki" | "teknoloji" | "guzellik",
  "modelImage": "base64_kodlu_gorsel",
  "productImage": "base64_kodlu_gorsel"
}
```

**Yanıt:**

```json
{
  "success": true,
  "data": {
    "generationId": "uuid",
    "generatedImage": "base64_kodlu_sonuc",
    "downloadUrl": "https://..."
  }
}
```

### GET /api/health

Uygulama durumunu izlemek için sağlık kontrolü uç noktası.

## Ortam Değişkenleri

| Değişken                            | Açıklama                                         | Gerekli                                   |
| ----------------------------------- | ------------------------------------------------ | ----------------------------------------- |
| `DATABASE_URL`                      | PostgreSQL bağlantı dizesi                       | Evet                                      |
| `DIRECT_URL`                        | Migrasyonlar için doğrudan veritabanı bağlantısı | Evet                                      |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk genel anahtarı                             | Evet                                      |
| `CLERK_SECRET_KEY`                  | Clerk gizli anahtarı                             | Evet                                      |
| `N8N_WEBHOOK_URL`                   | AI işleme için n8n webhook uç noktası            | Evet                                      |
| `N8N_API_KEY`                       | n8n API kimlik doğrulama anahtarı                | Evet                                      |
| `N8N_WEBHOOK_TIMEOUT`               | Webhook zaman aşımı (milisaniye)                 | Hayır (varsayılan: 300000)                |
| `NEXT_PUBLIC_APP_URL`               | Uygulama temel URL'si                            | Hayır (varsayılan: http://localhost:3000) |

## Geliştirme

### Kod Stili ve Linting

```bash
# Linting çalıştır
npm run lint

# Tip kontrolü çalıştır
npm run type-check

# Testleri çalıştır
npm test
```

### Veritabanı Yönetimi

```bash
# Yeni migrasyon oluştur
npx prisma migrate dev --name migrasyon_adi

# Veritabanını sıfırla
npx prisma migrate reset

# Veritabanını Prisma Studio'da görüntüle
npx prisma studio
```

## Dağıtım

1. **Uygulamayı derleyin**

   ```bash
   npm run build
   ```

2. **Üretim ortam değişkenlerini ayarlayın**
   - Hosting platformunuzda tüm gerekli ortam değişkenlerini yapılandırın
   - Veritabanının erişilebilir ve düzgün yapılandırıldığından emin olun
   - Üretim domaini için Clerk kimlik doğrulamasını ayarlayın

3. **Veritabanı migrasyonlarını çalıştırın**
   ```bash
   npx prisma migrate deploy
   ```

## Kimlik Doğrulama Kurulumu

1. [clerk.com](https://clerk.com) adresinde bir Clerk hesabı oluşturun
2. Yeni bir uygulama oluşturun
3. Kimlik doğrulama ayarlarını yapılandırın:
   - Email/şifre kimlik doğrulamasını etkinleştirin
   - Domaininiz için yönlendirme URL'lerini ayarlayın
   - Gerektiğinde oturum ayarlarını yapılandırın
4. Genel anahtar ve gizli anahtarı ortam değişkenlerinize kopyalayın

## n8n Webhook Kurulumu

1. Bir n8n örneği kurun (bulut veya kendi sunucunuzda)
2. AI görsel işleme için bir webhook iş akışı oluşturun
3. Webhook URL'sini ve kimlik doğrulamasını yapılandırın
4. Sağlık uç noktası ile webhook entegrasyonunu test edin

## Katkıda Bulunma

1. Depoyu fork edin
2. Özellik dalı oluşturun: `git checkout -b feature/yeni-ozellik`
3. Değişikliklerinizi yapın ve testler ekleyin
4. Değişikliklerinizi commit edin: `git commit -am 'Yeni özellik ekle'`
5. Dala push edin: `git push origin feature/yeni-ozellik`
6. Bir pull request gönderin

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır - ayrıntılar için LICENSE dosyasına bakın.

## Destek

Destek ve sorular için:

- GitHub deposunda bir issue oluşturun
- Yaygın kurulum sorunları için dokümantasyonu kontrol edin
- Ortam değişkeni yapılandırmasını gözden geçirin

## Yol Haritası

- [ ] Toplu görsel işleme desteği ekle
- [ ] Görsel geçmişi ve yönetimi uygula
- [ ] Daha fazla AI modeli ve stil ekle
- [ ] Kullanım analitikleri ve faturalandırma uygula
- [ ] Sosyal paylaşım özellikleri ekle
