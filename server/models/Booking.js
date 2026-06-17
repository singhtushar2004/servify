//it acts as a binding contract that holds references to a Customer, a Provider, and the specific Service being performed.

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Points to the user account of the provider
      default: null,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    //At what price the service is booked, this is important because the price of a service can change over time
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Scheduled date is required'],
    },
    notes: {
      type: String,
      default: '',
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    completedAt: {
      type: Date,
      default: null,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    review: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

bookingSchema.index({ customerId: 1, createdAt: -1 });
bookingSchema.index({ providerId: 1, status: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
