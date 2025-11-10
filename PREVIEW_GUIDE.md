# 📱 Krafti Preview Guide

## 🎨 What You'll See

### Landing Page Features

1. **Hero Section**
   - "Where Handmade Dreams Meet Skilled Hands" headline
   - Two prominent CTAs: "I'm a Maker" and "I'm a Business"
   - Smooth fade-in animations

2. **Why Choose Krafti?**
   - 4 feature cards with icons:
     - AI-Powered Fair Pricing
     - Local Connections
     - Skill Progression
     - Trusted Community
   - Hover effects on cards

3. **For Makers Section** (Coral/Pink gradient background)
   - Benefits list with checkmarks
   - Example task card showing:
     - Task: "Crochet 10 Mini Flowers"
     - Complexity: Beginner
     - Time: ~2 hours
     - Pay: $35.00
   - "Start Crafting" CTA button

4. **For Businesses Section** (Blue gradient background)
   - Benefits list
   - Interactive pricing calculator mockup:
     - Retail Price input
     - Material Cost input
     - Suggested Maker Pay output
     - Your Profit calculation
   - "Start Scaling" CTA button

5. **Call to Action Section** (Gradient background)
   - Large "Ready to Start Your Krafti Journey?" heading
   - "Sign Up Free Today" button

6. **Footer**
   - Krafti branding
   - Navigation links
   - Copyright notice

---

## 🎬 Animations & Interactions

- ✨ **Hero**: Fade-in on page load
- ✨ **Feature Cards**: Fade-in as you scroll, staggered timing
- ✨ **Hover Effects**: Cards lift slightly on hover
- ✨ **Buttons**: Smooth color transitions
- ✨ **Responsive**: Works perfectly on mobile, tablet, and desktop

---

## 🎨 Design System

### Colors
- **Primary (Coral)**: #e3694f - Used for maker-focused sections
- **Secondary (Blue)**: #5780a2 - Used for business-focused sections
- **Gradients**: Smooth transitions between tones

### Typography
- **Headings**: Poppins font (bold, modern)
- **Body**: Inter font (clean, readable)

### Layout
- **Container**: Centered, max-width
- **Spacing**: Consistent padding and margins
- **Grid**: Responsive with Tailwind CSS

---

## 🖥️ Browser Compatibility

Tested and working on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

---

## 📸 Screenshots

The landing page includes:

```
┌─────────────────────────────────────┐
│         Krafti Logo    Login/Signup │
├─────────────────────────────────────┤
│                                     │
│   Where Handmade Dreams Meet        │
│        Skilled Hands                │
│                                     │
│   [I'm a Maker]  [I'm a Business]   │
│                                     │
├─────────────────────────────────────┤
│       Why Choose Krafti?            │
│                                     │
│  [AI Pricing] [Local] [Skills] [👥] │
│                                     │
├─────────────────────────────────────┤
│  For Makers                         │
│  • Work from home                   │
│  • Choose your tasks                │
│  • Fair pay                         │
│                                     │
│  [Example Task Card]                │
│  Crochet 10 Mini Flowers            │
│  $35.00                             │
│                                     │
├─────────────────────────────────────┤
│  For Businesses                     │
│  • AI pricing                       │
│  • Local makers                     │
│  • Quality control                  │
│                                     │
│  [Pricing Calculator Demo]          │
│                                     │
├─────────────────────────────────────┤
│  Ready to Start Your Journey?       │
│  [Sign Up Free Today]               │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔍 Navigation

Current navigation includes:
- **Krafti** (logo) - Returns to home
- **Log In** - (Will lead to login page when built)
- **Get Started** - (Will lead to signup page when built)

Footer links (placeholders for future pages):
- About
- How It Works
- Pricing
- Support

---

## 🚦 Interactive Elements

### Buttons
- **Primary CTA** - Coral/red gradient background
- **Secondary CTA** - Blue/gray gradient background
- **Text links** - Smooth color transitions

### Forms
- The pricing calculator in the "For Businesses" section shows a preview of the form inputs
- Clean, modern input styling

### Cards
- Feature cards with shadow on hover
- Task example card with structured layout
- Pricing calculator card with interactive feel

---

## 📱 Responsive Breakpoints

- **Mobile** (< 768px): Single column, stacked layout
- **Tablet** (768px - 1024px): 2-column grids
- **Desktop** (> 1024px): 4-column feature grid, 2-column sections

---

## 🎯 Next Steps After Preview

1. **Like the design?** 
   - Continue to build dashboard pages
   - Add authentication UI
   - Create task browsing page

2. **Want to customize?**
   - Edit colors in `frontend/tailwind.config.js`
   - Modify content in `frontend/app/page.tsx`
   - Update fonts in `frontend/app/layout.tsx`

3. **Ready for full functionality?**
   - Set up Firebase for authentication
   - Configure MongoDB for backend
   - Add OpenAI API key for pricing
   - Set up Stripe for payments

---

## 🐛 Common Issues

### "Cannot find module 'next'"
```bash
cd frontend
npm install
```

### "Port 3000 already in use"
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 npm run dev
```

### Page not loading
- Check terminal for errors
- Ensure you're in `/workspace/frontend` directory
- Try clearing Next.js cache: `rm -rf .next && npm run dev`

### Styles not appearing
- Tailwind CSS should be working automatically
- If issues persist, check `tailwind.config.js` and `globals.css`

---

## 💡 Tips for Best Preview Experience

1. **Use Chrome DevTools** - Open with F12 to see responsive design
2. **Test Mobile View** - Toggle device toolbar (Ctrl+Shift+M)
3. **Check Animations** - Scroll slowly to see fade-in effects
4. **Try Interactions** - Hover over cards and buttons
5. **Resize Window** - See responsive breakpoints in action

---

## 📚 Files to Explore

After previewing, check out these files to understand the code:

### Frontend
- `frontend/app/page.tsx` - Landing page component
- `frontend/app/globals.css` - Global styles
- `frontend/tailwind.config.js` - Design system config

### Backend (when ready)
- `backend/src/services/aiPricingService.js` - The AI pricing magic! ⭐
- `backend/src/routes/` - All API endpoints
- `backend/src/models/` - Database schemas

---

**Enjoy exploring Krafti! 🎨✨**
