# Krafti Setup Guide

Complete step-by-step guide to set up Krafti locally.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] MongoDB installed (or MongoDB Atlas account)
- [ ] Firebase account
- [ ] Stripe account
- [ ] OpenAI API key
- [ ] Google Cloud account (for Maps API)

---

## Step 1: MongoDB Setup

### Option A: Local MongoDB

```bash
# Install MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Connection string:
mongodb://localhost:27017/krafti
```

### Option B: MongoDB Atlas (Cloud)

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Create database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get connection string:
   ```
   mongodb+srv://<user>:<password>@cluster.mongodb.net/krafti
   ```

---

## Step 2: Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create new project (or use existing)
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google
   - Enable Apple (optional)

4. Create Web App:
   - Go to Project Settings > General
   - Click "Add app" > Web
   - Register app
   - Copy config values

5. Generate Admin SDK:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save JSON file securely
   - Extract: `project_id`, `private_key`, `client_email`

6. Enable Storage:
   - Go to Storage
   - Click "Get Started"
   - Use default rules

---

## Step 3: OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to API Keys
4. Create new secret key
5. Copy and save securely
6. Add payment method (required for API usage)

---

## Step 4: Stripe Setup

### Create Account
1. Go to [stripe.com](https://stripe.com)
2. Sign up for account
3. Complete business verification (or use test mode)

### Get API Keys
1. Go to Developers > API Keys
2. Copy "Publishable key" (pk_test_...)
3. Copy "Secret key" (sk_test_...)

### Enable Connect
1. Go to Connect > Get Started
2. Complete onboarding
3. Enable Express accounts

### Webhook (for production)
1. Go to Developers > Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `account.updated`
4. Copy webhook secret (whsec_...)

---

## Step 5: Google Maps API

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project (or use existing)
3. Enable APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API
4. Go to Credentials
5. Create API Key
6. Restrict key (optional but recommended):
   - HTTP referrers for frontend
   - IP addresses for backend

---

## Step 6: Backend Configuration

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
nano .env
```

Update `.env` with your credentials:

```bash
PORT=5000
NODE_ENV=development

# MongoDB (use your connection string)
MONGODB_URI=mongodb://localhost:27017/krafti

# Firebase Admin (from service account JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# OpenAI
OPENAI_API_KEY=sk-...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# JWT
JWT_SECRET=your-random-secret-key-here
JWT_EXPIRE=7d

# Google Maps
GOOGLE_MAPS_API_KEY=AIza...

# App
FRONTEND_URL=http://localhost:3000
MAX_TASK_RADIUS_MILES=50
```

### Test Backend

```bash
npm run dev

# Should see:
# ✅ MongoDB Connected
# ✅ Firebase Admin SDK initialized
# 🚀 Krafti API server running on port 5000
```

Test health endpoint:
```bash
curl http://localhost:5000/health
```

---

## Step 7: Frontend Configuration

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local
nano .env.local
```

Update `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Firebase (from web app config)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
```

### Test Frontend

```bash
npm run dev

# Should see:
# ✓ Ready in 2.5s
# ○ Local: http://localhost:3000
```

Open browser to `http://localhost:3000`

---

## Step 8: Verify Everything Works

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Test AI Pricing (requires auth)
First register a user, then:
```bash
curl -X POST http://localhost:5000/api/ai-pricing/calculate \
  -H "Authorization: Bearer <your-firebase-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "retailPrice": 20,
    "materialCost": 4,
    "desiredProfitMargin": 0.3,
    "taskDescription": "Crochet mini flowers",
    "estimatedTimePerPiece": 30,
    "complexityLevel": "intermediate"
  }'
```

### 3. Test Frontend
- Visit `http://localhost:3000`
- Click "Get Started"
- Try to register new user
- Check if Firebase auth works

---

## Common Issues & Solutions

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service:
```bash
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Firebase Auth Error
```
Error: Invalid token
```
**Solution**: 
- Check FIREBASE_PRIVATE_KEY has proper line breaks (`\n`)
- Verify project ID matches
- Ensure service account has proper permissions

### OpenAI API Error
```
Error: Incorrect API key provided
```
**Solution**:
- Verify API key starts with `sk-`
- Check for extra spaces in .env
- Ensure billing is set up

### Stripe Connection Failed
```
Error: Invalid API Key
```
**Solution**:
- Use test keys (sk_test_..., pk_test_...)
- Verify keys match the same Stripe account
- Check for whitespace in .env

### CORS Errors
```
Access to fetch blocked by CORS policy
```
**Solution**: Update FRONTEND_URL in backend .env to match frontend URL

---

## Next Steps

1. ✅ Both servers running
2. ✅ Can register users
3. ✅ AI pricing working
4. ✅ Database connected

Now you can:
- Create test users (maker and business)
- Post sample tasks
- Test the full workflow
- Start customizing features

---

## Production Deployment

See main README.md for deployment instructions for:
- Backend (Heroku, Railway, Render)
- Frontend (Vercel, Netlify)
- Database (MongoDB Atlas)

---

## Need Help?

- Check main README.md for detailed documentation
- Review API documentation in backend/README.md
- Check frontend README.md for UI guidelines
- Open GitHub issue for bugs

Happy building! 🚀
