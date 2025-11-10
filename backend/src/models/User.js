const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['maker', 'business', 'both'],
    required: true
  },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    avatar: String,
    bio: String
  },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'USA' },
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    }
  },
  // Maker-specific fields
  makerProfile: {
    skills: [{ type: String }], // e.g., ['crochet', 'jewelry', 'macrame']
    tier: {
      type: String,
      enum: ['beginner', 'intermediate', 'pro'],
      default: 'beginner'
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 }
    },
    availability: {
      status: {
        type: String,
        enum: ['available', 'busy', 'unavailable'],
        default: 'available'
      },
      hoursPerWeek: Number,
      preferredSchedule: String
    },
    completedTasks: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    portfolio: [{
      imageUrl: String,
      description: String,
      taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  // Business-specific fields
  businessProfile: {
    businessName: String,
    brandLogo: String,
    description: String,
    website: String,
    isAnonymous: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    tasksPosted: { type: Number, default: 0 },
    activeTasks: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 }
  },
  // Payment information
  paymentInfo: {
    stripeCustomerId: String,
    stripeAccountId: String, // For Connect accounts (makers receiving payments)
    onboardingComplete: { type: Boolean, default: false }
  },
  // Account status
  status: {
    type: String,
    enum: ['active', 'suspended', 'inactive'],
    default: 'active'
  },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
userSchema.index({ 'location.coordinates': '2dsphere' });

// Indexes for common queries
userSchema.index({ role: 1, status: 1 });
userSchema.index({ 'makerProfile.tier': 1, 'makerProfile.rating.average': -1 });

// Instance methods
userSchema.methods.updateMakerTier = function() {
  const rating = this.makerProfile.rating.average;
  const completed = this.makerProfile.completedTasks;
  
  if (rating >= 4.5 && completed >= 50) {
    this.makerProfile.tier = 'pro';
  } else if (rating >= 4.0 && completed >= 20) {
    this.makerProfile.tier = 'intermediate';
  } else {
    this.makerProfile.tier = 'beginner';
  }
};

userSchema.methods.updateRating = function(newRating) {
  const current = this.makerProfile.rating;
  const totalRatings = current.count;
  const currentAverage = current.average;
  
  const newAverage = ((currentAverage * totalRatings) + newRating) / (totalRatings + 1);
  
  this.makerProfile.rating.average = Math.round(newAverage * 10) / 10;
  this.makerProfile.rating.count = totalRatings + 1;
  
  this.updateMakerTier();
};

module.exports = mongoose.model('User', userSchema);
