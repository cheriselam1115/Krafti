# Krafti API Examples

Real-world examples of using the Krafti API.

## Table of Contents
- [Authentication](#authentication)
- [AI Pricing](#ai-pricing)
- [Task Management](#task-management)
- [Maker Operations](#maker-operations)
- [Business Operations](#business-operations)
- [Payments](#payments)

---

## Authentication

### Register New User

```javascript
// Register as Maker
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firebaseToken: '<firebase-id-token>',
    email: 'sarah@example.com',
    role: 'maker',
    profile: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '555-0123'
    },
    location: {
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      coordinates: {
        coordinates: [-122.6765, 45.5231]  // [lng, lat]
      }
    },
    makerProfile: {
      skills: ['crochet', 'knitting', 'macrame'],
      availability: {
        status: 'available',
        hoursPerWeek: 15
      }
    }
  })
})

const data = await response.json()
console.log(data)
```

### Get Current User Profile

```javascript
const response = await fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': 'Bearer <firebase-token>'
  }
})

const data = await response.json()
console.log(data.data.user)
```

---

## AI Pricing

### Calculate Fair Pay

```javascript
const response = await fetch('http://localhost:5000/api/ai-pricing/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <firebase-token>'
  },
  body: JSON.stringify({
    retailPrice: 25,
    materialCost: 5,
    desiredProfitMargin: 0.35,
    taskDescription: 'Crochet 10 small flower appliques for hair accessories',
    quantity: 10,
    estimatedTimePerPiece: 20,  // minutes
    complexityLevel: 'intermediate',
    makerTier: 'intermediate'
  })
})

const data = await response.json()
console.log(data.data)

/* Response:
{
  recommendedPayPerPiece: 6.50,
  makerHourlyRate: 19.50,
  ownerProfit: 13.50,
  ownerProfitMargin: 54.0,
  isFeasible: true,
  breakdown: {
    retailPrice: 25,
    materialCost: 5,
    laborCost: 6.50,
    ownerProfit: 13.50,
    calculationMethod: 'time-based'
  },
  recommendations: [...],
  aiRecommendations: {
    assessment: '...',
    marketComparison: '...',
    suggestions: [...],
    concerns: [],
    alternatives: [...]
  }
}
*/
```

### Batch Pricing with Volume Discounts

```javascript
const response = await fetch('http://localhost:5000/api/ai-pricing/batch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <firebase-token>'
  },
  body: JSON.stringify({
    retailPrice: 15,
    materialCost: 3,
    taskDescription: 'String beaded bracelets',
    estimatedTimePerPiece: 15,
    complexityLevel: 'beginner',
    quantities: [1, 5, 10, 25, 50]
  })
})

const data = await response.json()

/* Response:
{
  basePricing: {...},
  batchOptions: [
    { quantity: 1, pricePerPiece: 4.50, totalPay: 4.50, discount: 0 },
    { quantity: 5, pricePerPiece: 4.32, totalPay: 21.60, discount: 4 },
    { quantity: 10, pricePerPiece: 4.14, totalPay: 41.40, discount: 8 },
    { quantity: 25, pricePerPiece: 3.83, totalPay: 95.75, discount: 15 },
    { quantity: 50, pricePerPiece: 3.83, totalPay: 191.50, discount: 15 }
  ]
}
*/
```

### Get Optimal Pricing Tiers

```javascript
const response = await fetch('http://localhost:5000/api/ai-pricing/optimize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <firebase-token>'
  },
  body: JSON.stringify({
    retailPrice: 30,
    materialCost: 6,
    desiredProfitMargin: 0.3,
    taskDescription: 'Macrame wall hanging',
    estimatedTimePerPiece: 60,
    complexityLevel: 'advanced'
  })
})

const data = await response.json()

/* Response:
{
  conservative: {
    recommendedPayPerPiece: 10.50,
    description: 'Prioritizes business profit, may attract fewer makers'
  },
  balanced: {
    recommendedPayPerPiece: 12.00,
    description: 'Balanced approach for sustainable growth'
  },
  generous: {
    recommendedPayPerPiece: 14.50,
    description: 'Prioritizes maker satisfaction, builds loyalty'
  },
  recommendation: 'balanced'
}
*/
```

---

## Task Management

### Create Task

```javascript
const response = await fetch('http://localhost:5000/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <business-owner-token>'
  },
  body: JSON.stringify({
    title: 'Crochet Mini Flowers for Spring Collection',
    description: 'Need 50 small crochet flowers in pastel colors. Will provide yarn and pattern.',
    category: 'crochet',
    quantity: 50,
    complexity: 'intermediate',
    estimatedTimePerPiece: 20,
    pricing: {
      retailPrice: 8,
      materialCost: 1.50,
      payPerPiece: 2.50  // or leave blank to use AI calculation
    },
    materials: {
      providedByOwner: true,
      deliveryMethod: 'ship',
      description: 'Yarn in 5 pastel colors, crochet hook size E, pattern guide'
    },
    instructions: {
      textGuide: 'Follow the attached pattern. Each flower should be 2" diameter.',
      photos: [
        {
          url: 'https://example.com/flower-sample-1.jpg',
          caption: 'Finished flower example',
          order: 1
        }
      ]
    },
    location: {
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      coordinates: {
        coordinates: [-122.3321, 47.6062]
      },
      maxDistance: 25
    },
    requirements: {
      requiredSkills: ['crochet'],
      minimumTier: 'beginner',
      minimumRating: 4.0
    },
    timeline: {
      deadline: '2024-03-15T00:00:00.000Z'
    },
    status: 'open',
    displaySettings: {
      showBusinessName: false,  // Anonymous posting
      showBusinessLogo: false
    }
  })
})

const data = await response.json()
console.log('Task created:', data.data.task._id)
```

### Browse Tasks

```javascript
// Get tasks near me
const response = await fetch(
  'http://localhost:5000/api/tasks?' + new URLSearchParams({
    status: 'open',
    category: 'crochet',
    minPay: '2',
    maxPay: '10',
    lat: '47.6062',
    lng: '-122.3321',
    radius: '50',  // miles
    page: '1',
    limit: '20'
  })
)

const data = await response.json()
console.log(`Found ${data.data.total} tasks`)
data.data.tasks.forEach(task => {
  console.log(`${task.title} - $${task.pricing.payPerPiece} per piece`)
})
```

### Apply for Task

```javascript
const response = await fetch(
  'http://localhost:5000/api/tasks/64abc123def456/apply',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <maker-token>'
    },
    body: JSON.stringify({
      quantity: 25  // Apply for 25 of the 50 pieces
    })
  }
)

const data = await response.json()
console.log('Application submitted!')
```

---

## Maker Operations

### Find Makers by Location

```javascript
const response = await fetch(
  'http://localhost:5000/api/makers?' + new URLSearchParams({
    tier: 'intermediate',
    skills: 'crochet,macrame',
    minRating: '4.5',
    lat: '45.5231',
    lng: '-122.6765',
    radius: '30',
    page: '1',
    limit: '10'
  })
)

const data = await response.json()
data.data.makers.forEach(maker => {
  console.log(`${maker.profile.firstName} - ${maker.makerProfile.tier} - ⭐${maker.makerProfile.rating.average}`)
})
```

### Get My Tasks (Maker)

```javascript
const response = await fetch(
  'http://localhost:5000/api/makers/me/tasks?status=accepted',
  {
    headers: {
      'Authorization': 'Bearer <maker-token>'
    }
  }
)

const data = await response.json()
data.data.tasks.forEach(task => {
  const myAssignment = task.myAssignment
  console.log(`${task.title} - ${myAssignment.status}`)
  console.log(`Quantity: ${myAssignment.quantityAssigned}`)
  console.log(`Pay: $${task.pricing.payPerPiece * myAssignment.quantityAssigned}`)
})
```

### Get Earnings Statistics

```javascript
const response = await fetch(
  'http://localhost:5000/api/makers/me/earnings',
  {
    headers: {
      'Authorization': 'Bearer <maker-token>'
    }
  }
)

const data = await response.json()

/* Response:
{
  totalEarnings: 1250.50,
  paidTasks: 23,
  averagePayPerTask: 54.37,
  completedTasks: 25,
  currentTier: 'intermediate',
  rating: {
    average: 4.7,
    count: 23
  }
}
*/
```

---

## Business Operations

### Dashboard Statistics

```javascript
const response = await fetch(
  'http://localhost:5000/api/business/dashboard',
  {
    headers: {
      'Authorization': 'Bearer <business-token>'
    }
  }
)

const data = await response.json()

/* Response:
{
  totalTasks: 15,
  activeTasks: 7,
  completedTasks: 8,
  totalSpent: 2340.00,
  recentTasks: [...]
}
*/
```

### Accept/Reject Maker Application

```javascript
// Accept maker
const response = await fetch(
  'http://localhost:5000/api/tasks/64abc123def456/assignments/64xyz789abc/accept',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <business-token>'
    },
    body: JSON.stringify({
      accept: true
    })
  }
)

const data = await response.json()
console.log('Maker accepted!')
```

### Toggle Anonymous Mode

```javascript
const response = await fetch(
  'http://localhost:5000/api/business/toggle-anonymous',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <business-token>'
    },
    body: JSON.stringify({
      isAnonymous: true
    })
  }
)

const data = await response.json()
console.log('Anonymous mode enabled')
```

---

## Payments

### Create Stripe Customer

```javascript
const response = await fetch(
  'http://localhost:5000/api/payments/create-customer',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer <token>'
    }
  }
)

const data = await response.json()
console.log('Customer ID:', data.data.customerId)
```

### Setup Maker Connect Account

```javascript
const response = await fetch(
  'http://localhost:5000/api/payments/create-connect-account',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer <maker-token>'
    }
  }
)

const data = await response.json()
console.log('Complete onboarding at:', data.data.onboardingUrl)
// Redirect user to onboardingUrl
```

### Process Payment

```javascript
const response = await fetch(
  'http://localhost:5000/api/payments/process-payment',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <business-token>'
    },
    body: JSON.stringify({
      taskId: '64abc123def456',
      assignmentId: '64xyz789abc'
    })
  }
)

const data = await response.json()
console.log('Payment processed:', data.data.transferId)
console.log('Amount paid:', data.data.amount)
```

### Check Balance

```javascript
const response = await fetch(
  'http://localhost:5000/api/payments/balance',
  {
    headers: {
      'Authorization': 'Bearer <maker-token>'
    }
  }
)

const data = await response.json()

/* Response:
{
  available: 250.00,
  pending: 75.50
}
*/
```

---

## Complete Workflow Example

### Business Owner Posts Task

```javascript
// 1. Calculate pricing
const pricing = await fetch('/api/ai-pricing/calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    retailPrice: 20,
    materialCost: 4,
    taskDescription: 'Macrame keychains',
    estimatedTimePerPiece: 30,
    complexityLevel: 'beginner'
  })
}).then(r => r.json())

// 2. Create task with calculated pricing
const task = await fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    title: 'Macrame Keychains - Boho Style',
    description: 'Simple macrame keychains for summer collection',
    category: 'macrame',
    quantity: 20,
    complexity: 'beginner',
    estimatedTimePerPiece: 30,
    pricing: {
      retailPrice: 20,
      materialCost: 4,
      payPerPiece: pricing.data.recommendedPayPerPiece
    },
    // ... other fields
  })
}).then(r => r.json())

console.log('Task posted:', task.data.task._id)
```

### Maker Applies and Completes

```javascript
// 1. Browse tasks
const tasks = await fetch('/api/tasks?category=macrame&status=open', {
  headers: { 'Authorization': `Bearer ${makerToken}` }
}).then(r => r.json())

// 2. Apply for task
const application = await fetch(`/api/tasks/${tasks.data.tasks[0]._id}/apply`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${makerToken}` },
  body: JSON.stringify({ quantity: 10 })
}).then(r => r.json())

console.log('Applied for task')

// 3. After acceptance, maker completes work and gets paid
// (Business owner approves and processes payment)
```

---

## Error Handling

```javascript
try {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <token>'
    },
    body: JSON.stringify(taskData)
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('API Error:', error.message)
    if (error.errors) {
      error.errors.forEach(err => console.error(err))
    }
    return
  }

  const data = await response.json()
  console.log('Success:', data)
} catch (error) {
  console.error('Network error:', error)
}
```

---

## Rate Limiting

The API implements rate limiting. Respect these limits:
- 100 requests per 15 minutes per IP
- 1000 requests per day per user

---

For more examples, see the frontend code in `frontend/lib/api.ts`
