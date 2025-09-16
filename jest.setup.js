import '@testing-library/jest-dom'

// Mock fetch globally
global.fetch = jest.fn()

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}))

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    isSignedIn: true,
    userId: 'mock-user-id',
    signOut: jest.fn(),
  }),
  useUser: () => ({
    user: {
      id: 'mock-user-id',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      firstName: 'Test',
      lastName: 'User',
    },
  }),
  SignIn: ({ children }) => children,
  SignUp: ({ children }) => children,
  ClerkProvider: ({ children }) => children,
}))

// Mock environment variables
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_mock'
process.env.CLERK_SECRET_KEY = 'sk_test_mock'
process.env.N8N_WEBHOOK_URL = 'https://mock-webhook.com'
process.env.UPSTASH_REDIS_REST_URL = 'https://mock-redis.upstash.io'
process.env.UPSTASH_REDIS_REST_TOKEN = 'mock-token'