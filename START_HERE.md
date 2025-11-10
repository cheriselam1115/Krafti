# 🚀 START HERE - Preview Krafti

## Quick Start Command

Open your terminal and run:

```bash
cd /workspace/frontend
npm run dev
```

**That's it!** Then open your browser to: **http://localhost:3000**

---

## What You'll See

Once the server starts, you'll see this in your terminal:

```
  ▲ Next.js 14.0.4
  - Local:        http://localhost:3000
  - Ready in 2.5s

  ○ Compiling / ...
  ✓ Compiled / in 1.2s
```

---

## Open in Browser

1. Open your web browser (Chrome, Firefox, Safari, etc.)
2. Type in the address bar: `http://localhost:3000`
3. Press Enter

**You'll see the Krafti landing page!** 🎉

---

## What to Expect

### You'll See:
- ✅ Beautiful landing page with animations
- ✅ "Where Handmade Dreams Meet Skilled Hands" hero
- ✅ Feature cards (AI Pricing, Local Connections, etc.)
- ✅ "For Makers" section with example task
- ✅ "For Businesses" section with pricing calculator
- ✅ Fully responsive design

### Interactive Elements:
- Hover over cards to see effects
- Click buttons (they'll show signup/login pages when built)
- Scroll to see fade-in animations
- Resize window to see responsive design

---

## To Stop the Server

Press `Ctrl + C` in the terminal where it's running

---

## Troubleshooting

### "Port 3000 already in use"
```bash
# Kill the process and try again
lsof -ti:3000 | xargs kill -9
npm run dev
```

### "Cannot GET /"
Make sure you're at `http://localhost:3000` (not https, not port 3001)

### Nothing loads
1. Check terminal for errors
2. Make sure server shows "Ready"
3. Try refreshing browser (Ctrl+R)

---

## Next Steps After Preview

1. **Love the design?** Check `PROJECT_SUMMARY.md` for architecture
2. **Want to customize?** Edit `frontend/app/page.tsx`
3. **Ready for backend?** See `SETUP_GUIDE.md` for full setup
4. **Need API docs?** Check `API_EXAMPLES.md`

---

**Enjoy exploring Krafti!** 🎨✨
