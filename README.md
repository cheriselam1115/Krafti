# Krafti - Handmade Collaboration Platform

<div align="center">
  <h3>🧶 Where Handmade Dreams Meet Skilled Hands 🎨</h3>
  <p>A two-sided marketplace connecting small business owners with local makers for flexible, home-based crafting opportunities</p>
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [AI Pricing Engine](#ai-pricing-engine)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)

---

## 🎯 Overview

Krafti solves two key problems:

### For Small Business Owners
Handmade brands often struggle to scale because production depends solely on the owner. Krafti allows them to outsource repetitive tasks (like crocheting flowers or stringing bracelets) without sacrificing quality or creative control.

### For Local Moms & Makers
Many skilled moms want flexible, passion-based income, but lack accessible, family-friendly work options. Krafti provides a trusted, easy-to-use platform for them to earn through crafting at their own pace.

---

## ✨ Key Features

### 🤖 AI-Powered Pay Calculation
- Intelligent pricing algorithm that considers retail price, material costs, complexity, and maker tier
- OpenAI integration for contextual pricing insights
- Batch pricing with volume discounts
- Three pricing tiers: conservative, balanced, and generous

### 🎭 Anonymous Business Mode
- Business owners can toggle between public and anonymous posting
- Perfect for testing new products or maintaining confidentiality

### 📈 Skill Progression System
- Makers start at Beginner tier and advance to Intermediate or Pro
- Higher tiers unlock better pay rates
- Based on quality ratings and completion history

### 📍 Location-Based Matching
- Google Maps integration for local maker discovery
- Customizable search radius
- Reduces shipping costs and enables face-to-face collaboration

### 💳 Integrated Payments
- Stripe Connect for secure escrow payments
- Automatic payouts upon task approval
- Payment tracking and history

### 📚 Tutorial System
- Upload video tutorials or step-by-step photo guides
- Help makers learn specific techniques
- Maintain product consistency

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Firebase Admin SDK
- **AI**: OpenAI GPT-4
- **Payments**: Stripe & Stripe Connect
- **Location**: Google Maps API

### Frontend
- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **State Management**: Zustand
- **HTTP Client**: Axios
- **UI/UX**: Framer Motion, React Icons

---

## 📁 Project Structure

```
krafti/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── firebase.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Task.js
│   │   │   └── Message.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── tasks.js
│   │   │   ├── makers.js
│   │   │   ├── business.js
│   │   │   ├── payments.js
│   │   │   └── aiPricing.js
│   │   ├── services/
│   │   │   └── aiPricingService.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── lib/
│   │   ├── api.ts
│   │   └── firebase.ts
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Firebase project
- OpenAI API key
- Stripe account
- Google Maps API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd krafti
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
nano .env

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local with your credentials
nano .env.local

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

---

## 🔌 API Documentation

### Authentication
All authenticated endpoints require a Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

### Endpoints

#### Auth
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

#### AI Pricing
- `POST /api/ai-pricing/calculate` - Calculate fair pay for a task
- `POST /api/ai-pricing/batch` - Calculate batch pricing with volume discounts
- `POST /api/ai-pricing/optimize` - Get optimal pricing suggestions

#### Tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks` - Get all tasks with filters
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `POST /api/tasks/:id/apply` - Apply for task as maker
- `POST /api/tasks/:id/assignments/:assignmentId/accept` - Accept/reject maker

#### Makers
- `GET /api/makers` - Get all makers with filters
- `GET /api/makers/:id` - Get maker profile
- `GET /api/makers/me/tasks` - Get current maker's tasks
- `GET /api/makers/me/earnings` - Get earnings statistics

#### Business
- `GET /api/business/dashboard` - Get dashboard statistics
- `GET /api/business/tasks` - Get business owner's tasks
- `POST /api/business/toggle-anonymous` - Toggle anonymous mode

#### Payments
- `POST /api/payments/create-customer` - Create Stripe customer
- `POST /api/payments/create-connect-account` - Create Connect account
- `POST /api/payments/process-payment` - Process payment for task
- `GET /api/payments/balance` - Get maker's balance

---

## 🧠 AI Pricing Engine

The AI Pricing Engine is the core innovation of Krafti, ensuring fair compensation for both makers and business owners.

### How It Works

1. **Base Calculation**: Uses algorithmic approach considering:
   - Retail price and material cost
   - Estimated time per piece
   - Complexity level (beginner/intermediate/advanced)
   - Maker tier (beginner/intermediate/pro)
   - Desired profit margin

2. **Dual Pricing Methods**:
   - **Time-Based**: Calculates pay based on fair hourly rates ($15-$25/hr)
   - **Value-Based**: Allocates percentage of retail value after materials and owner profit
   - Takes the higher of the two to ensure fair compensation

3. **AI Refinement**: OpenAI GPT-4 provides:
   - Fairness assessment
   - Market comparison
   - Optimization suggestions
   - Concern identification
   - Alternative pricing structures

4. **Tier Multipliers**:
   - Beginner: 1.0x
   - Intermediate: 1.15x
   - Pro: 1.35x

### Example Calculation

```javascript
Input:
- Retail Price: $20
- Material Cost: $4
- Complexity: Intermediate
- Time: 30 minutes
- Maker Tier: Intermediate

Output:
- Recommended Pay: $7.20
- Maker Hourly Rate: $14.40/hr
- Owner Profit: $8.80 (44%)
- Calculation Method: Time-based
```

### API Usage

```javascript
const pricing = await fetch('/api/ai-pricing/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify({
    retailPrice: 20,
    materialCost: 4,
    desiredProfitMargin: 0.3,
    taskDescription: "Crochet mini flowers",
    estimatedTimePerPiece: 30,
    complexityLevel: "intermediate",
    makerTier: "intermediate"
  })
})
```

---

## 🔐 Environment Variables

### Backend (.env)

```bash
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/krafti

# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# OpenAI
OPENAI_API_KEY=sk-...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# JWT
JWT_SECRET=your-secret
JWT_EXPIRE=7d

# Google Maps
GOOGLE_MAPS_API_KEY=your-api-key

# App
FRONTEND_URL=http://localhost:3000
MAX_TASK_RADIUS_MILES=50
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key
```

---

## 💻 Development

### Running Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Code Quality

```bash
# Linting
npm run lint

# Type checking (frontend)
npm run type-check
```

### Database Migrations

```bash
# The app uses Mongoose which doesn't require migrations
# Schema changes are handled automatically
```

---

## 🚢 Deployment

### Backend Deployment (Heroku Example)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create krafti-api

# Set environment variables
heroku config:set MONGODB_URI=<your-mongodb-uri>
heroku config:set OPENAI_API_KEY=<your-key>
# ... (set all other env vars)

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard
```

### MongoDB Atlas Setup

1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in backend .env

---

## 📱 User Roles

### Maker Account
- Browse and apply for tasks
- Track accepted tasks and deadlines
- Submit completed work with photos
- Build portfolio
- Track earnings and ratings
- Progress through skill tiers

### Business Owner Account
- Post crafting tasks (public or anonymous)
- Use AI pricing calculator
- Review maker applications
- Track task progress
- Approve work and process payments
- Rate maker performance
- Access business dashboard

### Dual Role (Both)
- Switch between maker and business views
- Flexibility to both post and accept tasks

---

## 🔒 Security Features

- Firebase Authentication with email/Google/Apple login
- JWT token validation on all authenticated routes
- Stripe Connect for secure payment processing
- HTTPS enforcement in production
- Input validation with express-validator
- MongoDB injection protection
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js for security headers

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Stripe for payment infrastructure
- Firebase for authentication and storage
- MongoDB for database solution
- Next.js team for amazing framework
- All the makers and crafters who inspire this project

---

## 📞 Support

For questions or support:
- Email: support@krafti.com
- Documentation: [docs.krafti.com](https://docs.krafti.com)
- GitHub Issues: [github.com/krafti/issues](https://github.com/krafti/issues)

---

<div align="center">
  <p>Made with ❤️ for makers and businesses everywhere</p>
  <p>🧶 Happy Crafting! 🎨</p>
</div>
