# How to Get Your JWT Token

## Option 1: Using the API Login Endpoint

If your backend has a login endpoint (likely `/auth/login` or `/admin/login`), you can get a token by:

1. **Using curl or Postman:**
```bash
curl -X POST http://app.comdevhub-api.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

2. **Copy the token** from the response (it's usually in `data.token` or `token` field)

3. **Update `.env.local`:**
```
NEXT_PUBLIC_API_URL=http://app.comdevhub-api.com/v1
NEXT_PUBLIC_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **Restart your Next.js dev server**

## Option 2: Using Your Backend Directly

If you have access to your backend code, you can:
1. Run your backend server
2. Use a tool like Postman or Thunder Client to login
3. Copy the JWT token from the response
4. Add it to `.env.local`

## Current Status

Your `.env.local` should look like this:
```
NEXT_PUBLIC_API_URL=http://app.comdevhub-api.com/v1
NEXT_PUBLIC_AUTH_TOKEN=YOUR_JWT_TOKEN_HERE
```

Replace `YOUR_JWT_TOKEN_HERE` with your actual JWT token.
