# Krafti Backend API

REST API for the Krafti handmade collaboration platform.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
nano .env

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## API Routes

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### AI Pricing Engine
- `POST /api/ai-pricing/calculate` - Calculate fair pay
- `POST /api/ai-pricing/batch` - Batch pricing
- `POST /api/ai-pricing/optimize` - Optimal pricing

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - List tasks
- `GET /api/tasks/:id` - Get task
- `PUT /api/tasks/:id` - Update task
- `POST /api/tasks/:id/apply` - Apply as maker

### Makers
- `GET /api/makers` - List makers
- `GET /api/makers/:id` - Get maker
- `GET /api/makers/me/tasks` - My tasks
- `GET /api/makers/me/earnings` - Earnings

### Business
- `GET /api/business/dashboard` - Dashboard stats
- `GET /api/business/tasks` - My tasks
- `POST /api/business/toggle-anonymous` - Toggle anonymous

### Payments
- `POST /api/payments/create-customer` - Create Stripe customer
- `POST /api/payments/create-connect-account` - Setup Connect
- `POST /api/payments/process-payment` - Process payment
- `GET /api/payments/balance` - Get balance

## Environment Variables

See `.env.example` for all required environment variables.

## Database Models

### User
- Authentication and profile
- Maker profile (skills, tier, rating)
- Business profile (brand, verification)
- Location data

### Task
- Task details and requirements
- Pricing information
- Assignments and submissions
- Payment tracking

### Message
- Task-related messaging
- Conversation tracking

## Scripts

```bash
npm run dev      # Development with nodemon
npm start        # Production
npm test         # Run tests
```

## Authentication

All protected routes require Firebase ID token:

```
Authorization: Bearer <firebase-id-token>
```

## Error Handling

API returns consistent error format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

## Development

1. Start MongoDB locally or use Atlas
2. Configure Firebase Admin SDK
3. Set up Stripe test keys
4. Get OpenAI API key
5. Run `npm run dev`
