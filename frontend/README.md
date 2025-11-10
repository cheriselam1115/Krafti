# Krafti Frontend

Next.js frontend application for the Krafti handmade collaboration platform.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your credentials
nano .env.local

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Firebase Auth**: User authentication
- **Axios**: HTTP client
- **Zustand**: State management
- **Framer Motion**: Animations
- **React Hot Toast**: Notifications

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── lib/
│   ├── api.ts             # API client
│   └── firebase.ts        # Firebase config
├── components/            # Reusable components
├── hooks/                 # Custom hooks
└── public/               # Static assets
```

## Key Features

### Landing Page
- Hero section with dual CTAs (Maker/Business)
- Feature highlights
- For Makers section with example task
- For Businesses section with pricing calculator
- Responsive design

### Authentication
- Firebase email/password authentication
- Google Sign-In
- Apple Sign-In
- Protected routes

### Maker Dashboard
- Browse available tasks
- Filter by location, category, pay
- Apply for tasks
- Track applications and earnings

### Business Dashboard
- AI-powered pricing calculator
- Create and manage tasks
- Review maker applications
- Process payments
- Analytics and reporting

## Environment Variables

See `.env.example` for all required variables.

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## Styling

Using Tailwind CSS with custom configuration:

- Primary color: Coral/Red tones
- Secondary color: Blue/Gray tones
- Custom font: Inter (body), Poppins (headings)
- Responsive breakpoints
- Dark mode support (optional)

## API Integration

API client configured in `lib/api.ts`:

```typescript
import { apiClient } from '@/lib/api'

// Example usage
const tasks = await apiClient.tasks.getAll({ status: 'open' })
```

## Firebase Setup

1. Create Firebase project
2. Enable Authentication (Email, Google, Apple)
3. Create web app and get config
4. Add config to `.env.local`

## Deployment

### Vercel (Recommended)

```bash
vercel

# Or connect GitHub repo in Vercel dashboard
```

### Other Platforms

```bash
npm run build
npm start
```

## Development Tips

1. Use TypeScript for type safety
2. Follow React best practices
3. Keep components small and focused
4. Use server components when possible
5. Optimize images with next/image
6. Test on mobile devices

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome)
