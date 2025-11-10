const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  businessOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['crochet', 'knitting', 'jewelry', 'macrame', 'sewing', 'woodworking', 'pottery', 'other']
  },
  // Task details
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  completedQuantity: {
    type: Number,
    default: 0
  },
  complexity: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  estimatedTimePerPiece: {
    type: Number, // in minutes
    required: true,
    min: 1
  },
  // Pricing information
  pricing: {
    retailPrice: { type: Number, required: true, min: 0 },
    materialCost: { type: Number, required: true, min: 0 },
    payPerPiece: { type: Number, required: true, min: 0 },
    totalBudget: { type: Number, required: true, min: 0 },
    calculationMetadata: {
      method: String,
      ownerProfit: Number,
      ownerProfitMargin: Number,
      makerHourlyRate: Number,
      aiRecommendations: mongoose.Schema.Types.Mixed
    }
  },
  // Materials
  materials: {
    providedByOwner: { type: Boolean, default: true },
    deliveryMethod: {
      type: String,
      enum: ['ship', 'local-pickup', 'local-delivery'],
      default: 'ship'
    },
    description: String,
    shippingCost: { type: Number, default: 0 }
  },
  // Tutorial/Instructions
  instructions: {
    textGuide: String,
    videoUrl: String,
    photos: [{
      url: String,
      caption: String,
      order: Number
    }],
    attachments: [{
      url: String,
      filename: String,
      fileType: String
    }]
  },
  // Location
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    },
    maxDistance: { type: Number, default: 50 } // in miles
  },
  // Requirements
  requirements: {
    requiredSkills: [String],
    minimumTier: {
      type: String,
      enum: ['beginner', 'intermediate', 'pro'],
      default: 'beginner'
    },
    minimumRating: { type: Number, default: 0, min: 0, max: 5 }
  },
  // Timeline
  timeline: {
    postedDate: { type: Date, default: Date.now },
    deadline: Date,
    estimatedStartDate: Date,
    completionDate: Date
  },
  // Status
  status: {
    type: String,
    enum: ['draft', 'open', 'in-progress', 'completed', 'cancelled', 'archived'],
    default: 'draft',
    index: true
  },
  // Assignments
  assignments: [{
    makerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quantityAssigned: Number,
    quantityCompleted: Number,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in-progress', 'submitted', 'approved', 'rejected', 'paid'],
      default: 'pending'
    },
    acceptedAt: Date,
    startedAt: Date,
    submittedAt: Date,
    completedAt: Date,
    submissions: [{
      photos: [String],
      notes: String,
      quantitySubmitted: Number,
      submittedAt: { type: Date, default: Date.now },
      reviewed: { type: Boolean, default: false },
      approved: Boolean,
      feedback: String
    }],
    payment: {
      amount: Number,
      status: {
        type: String,
        enum: ['pending', 'processing', 'paid', 'failed'],
        default: 'pending'
      },
      paidAt: Date,
      transactionId: String
    },
    rating: {
      quality: { type: Number, min: 1, max: 5 },
      communication: { type: Number, min: 1, max: 5 },
      timeliness: { type: Number, min: 1, max: 5 },
      overall: { type: Number, min: 1, max: 5 },
      comment: String,
      ratedAt: Date
    }
  }],
  // Business display settings
  displaySettings: {
    showBusinessName: { type: Boolean, default: true },
    showBusinessLogo: { type: Boolean, default: true }
  },
  // Metadata
  views: { type: Number, default: 0 },
  applications: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Create geospatial index
taskSchema.index({ 'location.coordinates': '2dsphere' });

// Indexes for common queries
taskSchema.index({ status: 1, 'timeline.postedDate': -1 });
taskSchema.index({ category: 1, status: 1 });
taskSchema.index({ businessOwnerId: 1, status: 1 });

// Virtual for remaining quantity
taskSchema.virtual('remainingQuantity').get(function() {
  const assigned = this.assignments.reduce((sum, assignment) => {
    return sum + assignment.quantityAssigned;
  }, 0);
  return this.quantity - assigned;
});

// Instance methods
taskSchema.methods.canMakerApply = function(maker) {
  // Check minimum tier requirement
  if (this.requirements.minimumTier) {
    const tierLevels = { beginner: 1, intermediate: 2, pro: 3 };
    const requiredLevel = tierLevels[this.requirements.minimumTier];
    const makerLevel = tierLevels[maker.makerProfile.tier];
    if (makerLevel < requiredLevel) return false;
  }
  
  // Check minimum rating
  if (maker.makerProfile.rating.average < this.requirements.minimumRating) {
    return false;
  }
  
  // Check if task is still open
  if (this.status !== 'open') return false;
  
  // Check if there's remaining quantity
  if (this.remainingQuantity <= 0) return false;
  
  return true;
};

taskSchema.methods.assignMaker = function(makerId, quantity) {
  if (quantity > this.remainingQuantity) {
    throw new Error('Requested quantity exceeds available quantity');
  }
  
  this.assignments.push({
    makerId,
    quantityAssigned: quantity,
    quantityCompleted: 0,
    status: 'pending'
  });
  
  if (this.remainingQuantity <= 0) {
    this.status = 'in-progress';
  }
};

module.exports = mongoose.model('Task', taskSchema);
