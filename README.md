# AI Product Generator

A Next.js SaaS application that uses AI to generate professional product photography by combining model images with product images.

## Features

- **AI-Powered Image Generation**: Upload model and product images to create stunning product photography
- **Multiple Categories**: Support for e-commerce, fashion, jewelry, technology, and beauty products
- **Secure Authentication**: Clerk-based user authentication and session management
- **Image Processing**: Advanced validation and optimization with Sharp
- **Modern UI**: Responsive design with Tailwind CSS and Framer Motion animations
- **Real-time Feedback**: Drag-and-drop uploads with validation and progress indicators

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui, Lucide React
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **Image Processing**: Sharp
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **File Uploads**: react-dropzone

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account for authentication
- n8n webhook endpoint for AI image generation

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd speckit-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   # Copy the environment template
   cp .env.example .env.local
   ```

4. **Configure Environment Variables**

   Edit `.env.local` with your actual values:

   ```bash
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/ai_product_generator"
   DIRECT_URL="postgresql://username:password@localhost:5432/ai_product_generator"

   # Clerk Authentication (get from https://clerk.com)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"

   # n8n Webhook for AI processing
   N8N_WEBHOOK_URL="your_n8n_webhook_url"
   N8N_API_KEY="your_n8n_api_key"
   ```

5. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev --name init
   ```

6. **Start Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── generate/      # Image generation endpoint
│   │   └── health/        # Health check endpoint
│   ├── generate/          # Main generation page
│   ├── sign-in/           # Authentication pages
│   ├── sign-up/
│   └── page.tsx           # Home page
├── components/            # React components
│   └── image-generator.tsx # Main image upload component
├── lib/                   # Utility libraries
│   ├── schemas.ts         # Zod validation schemas
│   ├── image-utils.ts     # Image processing utilities
│   ├── webhook-client.ts  # n8n webhook integration
│   └── errors.ts          # Custom error classes
├── prisma/               # Database schema and migrations
└── middleware.ts         # Clerk authentication middleware
```

## API Documentation

### POST /api/generate

Generate a new product image by combining model and product images.

**Request Body:**

```json
{
  "category": "ecommerce" | "fashion" | "jewelry" | "technology" | "beauty",
  "modelImage": "base64_encoded_image",
  "productImage": "base64_encoded_image"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "generationId": "uuid",
    "generatedImage": "base64_encoded_result",
    "downloadUrl": "https://..."
  }
}
```

### GET /api/health

Health check endpoint for monitoring application status.

## Environment Variables

| Variable                            | Description                               | Required                            |
| ----------------------------------- | ----------------------------------------- | ----------------------------------- |
| `DATABASE_URL`                      | PostgreSQL connection string              | Yes                                 |
| `DIRECT_URL`                        | Direct database connection for migrations | Yes                                 |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key                     | Yes                                 |
| `CLERK_SECRET_KEY`                  | Clerk secret key                          | Yes                                 |
| `N8N_WEBHOOK_URL`                   | n8n webhook endpoint for AI processing    | Yes                                 |
| `N8N_API_KEY`                       | n8n API authentication key                | Yes                                 |
| `N8N_WEBHOOK_TIMEOUT`               | Webhook timeout in milliseconds           | No (default: 300000)                |
| `NEXT_PUBLIC_APP_URL`               | Application base URL                      | No (default: http://localhost:3000) |

## Development

### Code Style and Linting

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm test
```

### Database Management

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

## Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Set up production environment variables**
   - Configure all required environment variables in your hosting platform
   - Ensure database is accessible and properly configured
   - Set up Clerk authentication for production domain

3. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   ```

## Authentication Setup

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Configure authentication settings:
   - Enable email/password authentication
   - Set up redirect URLs for your domain
   - Configure session settings as needed
4. Copy the publishable key and secret key to your environment variables

## n8n Webhook Setup

1. Set up an n8n instance (cloud or self-hosted)
2. Create a webhook workflow for AI image processing
3. Configure the webhook URL and authentication
4. Test the webhook integration with the health endpoint

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature/new-feature`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation for common setup issues
- Review the environment variable configuration

## Roadmap

- [ ] Add support for batch image processing
- [ ] Implement image history and management
- [ ] Add more AI models and styles
- [ ] Implement usage analytics and billing
- [ ] Add social sharing features
