# 📍 Where Is My App? Quick Reference

## The Code Location

Your code is in: **`/workspace/`**

```
Current Directory: /workspace/

Your files:
├── frontend/           ← React/Next.js code (what you'll preview)
│   ├── app/
│   │   └── page.tsx   ← The landing page you'll see
│   └── ...
│
└── backend/           ← Node.js API code (optional for now)
    └── ...
```

---

## When You Run `npm run dev`

### What Happens:

```
You type:           cd /workspace/frontend
                   npm run dev

Next.js does:      ✓ Reads code from /workspace/frontend/
                   ✓ Compiles TypeScript → JavaScript
                   ✓ Starts web server on port 3000
                   ✓ Watches for file changes

Server runs at:    http://localhost:3000

Browser shows:     Your beautiful Krafti landing page!
```

### The Code Stays Put!
- ✅ Source code remains in `/workspace/frontend/`
- ✅ Next.js serves it from port 3000
- ✅ Changes you make = instantly reflected in browser

---

## How to Access Your App

### Option 1: Local Browser (if you're running locally)
1. Open your browser
2. Go to: **http://localhost:3000**
3. See your Krafti landing page! 🎉

### Option 2: If you're in a remote environment
- Check if your environment provides a URL/port forwarding
- Look for a "Preview" or "Open Browser" button in your IDE
- The server is running on port 3000

---

## File Structure Explained

### What You'll Edit:
```
/workspace/frontend/app/page.tsx
↑
This file creates the landing page you see in the browser
```

### What The Browser Shows:
```
http://localhost:3000
↑
This URL displays the compiled version of page.tsx
```

### The Flow:
```
1. You edit: /workspace/frontend/app/page.tsx
2. Next.js detects change
3. Compiles TypeScript to JavaScript
4. Hot-reloads browser
5. You see changes at http://localhost:3000
```

---

## Quick Test

Try this to see it in action:

### Step 1: Start the server
```bash
cd /workspace/frontend
npm run dev
```

You'll see:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Ready in 2.5s
```

### Step 2: Open browser
- Visit: http://localhost:3000
- You'll see the Krafti landing page

### Step 3: Make a change (optional)
```bash
# Open the landing page file
nano /workspace/frontend/app/page.tsx

# Or use your IDE to edit it
# Change the heading text and save
# Browser will auto-refresh!
```

---

## Where Files Are

### Source Code (What You Edit):
- **Location**: `/workspace/frontend/`
- **Main file**: `app/page.tsx`
- **Styles**: `app/globals.css`
- **Config**: `tailwind.config.js`

### Compiled Code (Generated Automatically):
- **Location**: `/workspace/frontend/.next/`
- **Don't edit this!** - It's auto-generated
- **Ignored by git** - Listed in .gitignore

### Node Modules (Dependencies):
- **Location**: `/workspace/frontend/node_modules/`
- **Auto-installed** when you ran `npm install`
- **Not in git** - Too large, gets reinstalled

---

## Visual Diagram

```
┌─────────────────────────────────────────┐
│  Your Computer / Workspace              │
│                                         │
│  /workspace/frontend/                   │
│  ├── app/page.tsx  ←─ Your code        │
│  └── ...                                │
│                                         │
│  When you run: npm run dev              │
│  ↓                                      │
│  Next.js Dev Server starts              │
│  ↓                                      │
│  Listening on: localhost:3000           │
│                                         │
└─────────────────────────────────────────┘
           ↓
           ↓ You open browser
           ↓
┌─────────────────────────────────────────┐
│  Browser (Chrome/Firefox/etc)           │
│                                         │
│  Address: http://localhost:3000         │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Krafti Landing Page              │ │
│  │  (Rendered from page.tsx)         │ │
│  │                                   │ │
│  │  "Where Handmade Dreams           │ │
│  │   Meet Skilled Hands"             │ │
│  │                                   │ │
│  │  [I'm a Maker] [I'm a Business]   │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Important Ports

- **Frontend (Next.js)**: Port 3000
  - URL: http://localhost:3000
  
- **Backend (Express API)**: Port 5000 (when you run it later)
  - URL: http://localhost:5000

---

## Common Questions

### Q: Does the code upload to a website?
**A:** No! When you run `npm run dev`, it's a **local development server** on your machine. Only you can access it.

### Q: Where is localhost:3000?
**A:** "localhost" means "your computer". Port 3000 is where Next.js serves your app. Think of it like `127.0.0.1:3000` or "my computer at port 3000"

### Q: Can others see my app?
**A:** Not yet! It's only on your local machine. To share it, you'd need to:
- Deploy to Vercel/Netlify (for production)
- Or use ngrok/tunneling (for temporary sharing)

### Q: What if I don't see localhost:3000?
**A:** Check if:
1. The server is actually running (look for "Ready in X.Xs" in terminal)
2. You typed the URL correctly: `http://localhost:3000` (not https)
3. Port 3000 isn't blocked by firewall
4. You're in the right directory when running `npm run dev`

### Q: Where are my changes saved?
**A:** When you edit files in `/workspace/frontend/`, they're saved to disk immediately. Next.js watches for changes and recompiles automatically.

---

## File Locations Cheat Sheet

| What                  | Where                                    |
|-----------------------|------------------------------------------|
| Landing page code     | `/workspace/frontend/app/page.tsx`       |
| Styles                | `/workspace/frontend/app/globals.css`    |
| API client            | `/workspace/frontend/lib/api.ts`         |
| Tailwind config       | `/workspace/frontend/tailwind.config.js` |
| Environment vars      | `/workspace/frontend/.env.local`         |
| Backend API           | `/workspace/backend/src/server.js`       |
| AI Pricing Engine     | `/workspace/backend/src/services/aiPricingService.js` |

---

## Next Steps

1. **Start the server**: `cd /workspace/frontend && npm run dev`
2. **Open browser**: Navigate to http://localhost:3000
3. **See your app**: The landing page is now visible!
4. **Edit files**: Changes in `/workspace/frontend/app/` will auto-reload

---

**TL;DR**: 
- Code is in `/workspace/frontend/`
- Server runs at `http://localhost:3000`
- You access it in your browser
- Nothing "goes" anywhere - it all stays on your computer!

🎉
