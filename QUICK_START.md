# 🚀 Quick Start - Preview Krafti

Get Krafti running in under 5 minutes!

## Option 1: Preview Frontend Only (Fastest - 2 minutes)

This lets you see the landing page without setting up the backend.

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

**Open in browser:** http://localhost:3000

You'll see:
- ✅ Beautiful landing page
- ✅ Navigation
- ✅ Feature sections
- ✅ Responsive design

**Note:** API calls won't work yet, but you can see the UI.

---

## Option 2: Full Preview with Mock Data (5 minutes)

### Step 1: Start Frontend

```bash
cd frontend

# Install dependencies (if not done)
npm install

# Create minimal env file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOF

# Start frontend
npm run dev
```

### Step 2: Start Backend (New Terminal)

```bash
cd backend

# Install dependencies
npm install

# Create minimal env file for testing
cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/krafti
JWT_SECRET=test-secret-key-for-development
FRONTEND_URL=http://localhost:3000
EOF

# Start backend
npm run dev
```

### Step 3: Test Health Check

Open: http://localhost:5000/health

You should see:
```json
{
  "status": "OK",
  "timestamp": "2024-...",
  "service": "Krafti API"
}
```

---

## Option 3: Full Setup with All Services

For the complete experience with AI pricing, payments, etc., you'll need:

1. **MongoDB** (required for backend)
2. **Firebase** (for authentication)
3. **OpenAI API** (for AI pricing)
4. **Stripe** (for payments)
5. **Google Maps** (for location features)

See **SETUP_GUIDE.md** for detailed instructions.

---

## Quick Test Without Services

You can test the frontend even without external services:

```bash
cd frontend
npm install
npm run dev
```

Then visit: http://localhost:3000

### What You Can See:
- ✅ Landing page with animations
- ✅ Hero section
- ✅ Features showcase
- ✅ For Makers section
- ✅ For Businesses section
- ✅ Footer

### What Won't Work Yet:
- ❌ User registration/login
- ❌ API calls
- ❌ Database operations

---

## Troubleshooting

### "npm: command not found"
Install Node.js from https://nodejs.org (v18 or higher)

### "Port 3000 already in use"
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### "Port 5000 already in use"
```bash
# Kill the process using port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in backend/.env
```

### Backend won't start without MongoDB
You need MongoDB running. Quick options:

**Option A: Install locally**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt install mongodb
sudo systemctl start mongodb
```

**Option B: Use MongoDB Atlas (cloud)**
1. Go to https://mongodb.com/atlas
2. Create free cluster
3. Get connection string
4. Update MONGODB_URI in backend/.env

---

## Preview Checklist

- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Frontend dependencies installed (`cd frontend && npm install`)
- [ ] Frontend running on http://localhost:3000
- [ ] (Optional) Backend dependencies installed
- [ ] (Optional) MongoDB running
- [ ] (Optional) Backend running on http://localhost:5000

---

## Next Steps After Preview

1. **Like what you see?** → Set up all services (see SETUP_GUIDE.md)
2. **Want to customize?** → Edit `frontend/app/page.tsx` for landing page
3. **Ready to develop?** → Check PROJECT_SUMMARY.md for architecture
4. **Need API examples?** → See API_EXAMPLES.md

---

## Quick Commands Reference

```bash
# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm start            # Start production server

# Backend
cd backend
npm install          # Install dependencies
npm run dev          # Start with auto-reload (http://localhost:5000)
npm start            # Start production server
```

---

**Enjoy your preview! 🎨**
