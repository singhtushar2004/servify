const mongoose = require('mongoose');

const providerProfileSchema = new mongoose.Schema(
  {
    
    //userID is s reference to the user model .
    //This creates a relationship between the provider profile and the user who owns it.
    //user id is basically the _id field from the database.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      enum: ['carwash', 'plumber', 'carpenter', 'maid', 'cook'],
      required: [true, 'Specialization is required'],
    },
    bio: {
      type: String,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    experience: {
      type: Number,
      default: 0,
      min: [0, 'Experience cannot be negative'],
    },
    baseRate: {
      type: Number,
      default: 0,
      min: [0, 'Base rate cannot be negative'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    serviceArea: {
      type: String,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProviderProfile', providerProfileSchema);
