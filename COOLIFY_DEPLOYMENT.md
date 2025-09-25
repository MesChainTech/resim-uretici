# Coolify Deployment Guide

## Environment Variables

Copy these environment variables to your Coolify project:

```
DATABASE_URL=your_database_url_here
DIRECT_URL=your_direct_url_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/generate
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/generate
N8N_WEBHOOK_URL=https://n8n.srv959585.hstgr.cloud/webhook-test/933fb04d-5be0-4f5b-b1af-a99f4ec597ec
N8N_WEBHOOK_TIMEOUT=300000
N8N_API_KEY=your_n8n_api_key_here
NEXT_PUBLIC_APP_URL=https://hidlight.hidlightmedya.tr
NODE_ENV=production
GEMINI_API_KEY=AIzaSyDRy8xDLPtEMQe9TBroZOFQtsFYKPTeNLY
```

## Important Notes

1. **GEMINI_API_KEY**: Updated to new API key
2. **NEXT_PUBLIC_APP_URL**: Set to hidlight.hidlightmedya.tr
3. **Database**: Configure your database connection
4. **Clerk**: Get new API keys from Clerk dashboard
5. **n8n**: Configure webhook URL and API key

## Deployment Steps

1. Create new project in Coolify
2. Connect GitHub repository
3. Set environment variables
4. Deploy application
5. Test all features

## Troubleshooting

- **Sharp Module Error**: Fixed with Dockerfile and next.config.js
- **API Key Issues**: Ensure all environment variables are set correctly
- **Build Errors**: Check Docker logs for specific errors
