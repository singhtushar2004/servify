const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['carwash', 'plumber', 'carpenter', 'maid', 'cook'],
      required: [true, 'Category is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    features: {
      type: [String],
      default: [],
    },

    //this is toggle which can be used to hide or show the service in the frontend.
    //like ex: new services is added and some services are disconyinued.
    //the frontend shows the services which are active and hides the services which are not active.
    isActive: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: String,
      default: '2-3 hours',
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
