const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Best-effort auto-assignment: returns a provider ID if one is free, or null.
// null is fine — the booking stays pending and any matching provider can claim it.
const findAvailableProvider = async (category, scheduledAt) => {
  try {
    const providerProfiles = await ProviderProfile.find({
      specialization: category,
      isAvailable: true,
    }).populate('userId');

    for (const profile of providerProfiles) {
      if (!profile.userId) continue;
      const conflictingBooking = await Booking.findOne({
        providerId: profile.userId._id,
        status: { $in: ['accepted', 'in_progress'] },
        scheduledAt: {
          $gte: new Date(new Date(scheduledAt).getTime() - 2 * 60 * 60 * 1000),
          $lte: new Date(new Date(scheduledAt).getTime() + 2 * 60 * 60 * 1000),
        },
      });
      if (!conflictingBooking) {
        return profile.userId._id;
      }
    }
  } catch {
    // silently fall through — booking will be created unassigned
  }
  return null;
};

exports.createBooking = async (req, res, next) => {
  try {
    const { serviceId, address, scheduledAt, notes } = req.body;

    if (!serviceId || !address || !scheduledAt) {
      return errorResponse(res, 400, 'Service, address, and scheduled date are required.');
    }

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return errorResponse(res, 404, 'Service not found.');
    }

    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      return errorResponse(res, 400, 'Scheduled date must be in the future.');
    }

    const providerId = await findAvailableProvider(service.category, scheduledDate);

    const booking = await Booking.create({
      customerId: req.user._id,
      providerId,
      serviceId,
      address,
      totalAmount: service.price,
      scheduledAt: scheduledDate,
      notes: notes || '',
      status: 'pending',
      paymentStatus: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('serviceId', 'name category price image')
      .populate('customerId', 'name email phone')
      .populate('providerId', 'name email phone');

    return successResponse(res, 201, 'Booking created successfully.', { booking: populatedBooking });
  } catch (error) {
    next(error);
  }
};

exports.getCustomerBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { customerId: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('serviceId', 'name category price image duration')
        .populate('providerId', 'name email phone avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Booking.countDocuments(filter),
    ]);

    return successResponse(res, 200, 'Bookings fetched successfully.', {
      bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return errorResponse(res, 404, 'Booking not found.');
    }

    if (booking.customerId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized to cancel this booking.');
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      return errorResponse(res, 400, `Cannot cancel a booking that is already ${booking.status}.`);
    }

    booking.status = 'cancelled';
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('serviceId', 'name category price image')
      .populate('providerId', 'name email');

    return successResponse(res, 200, 'Booking cancelled successfully.', { booking: populatedBooking });
  } catch (error) {
    next(error);
  }
};

exports.getCustomerDashboard = async (req, res, next) => {
  try {
    const customerId = req.user._id;

    const [totalBookings, completedBookings, pendingBookings, cancelledBookings, recentBookings] =
      await Promise.all([
        Booking.countDocuments({ customerId }),
        Booking.countDocuments({ customerId, status: 'completed' }),
        Booking.countDocuments({ customerId, status: { $in: ['pending', 'accepted', 'in_progress'] } }),
        Booking.countDocuments({ customerId, status: 'cancelled' }),
        Booking.find({ customerId })
          .populate('serviceId', 'name category price image')
          .populate('providerId', 'name email avatar')
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    const totalSpent = await Booking.aggregate([
      { $match: { customerId: customerId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    return successResponse(res, 200, 'Dashboard data fetched.', {
      stats: {
        totalBookings,
        completedBookings,
        pendingBookings,
        cancelledBookings,
        totalSpent: totalSpent[0]?.total || 0,
      },
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('serviceId', 'name category price image description features duration')
      .populate('providerId', 'name email phone avatar')
      .populate('customerId', 'name email phone');

    if (!booking) {
      return errorResponse(res, 404, 'Booking not found.');
    }

    if (
      booking.customerId._id.toString() !== req.user._id.toString() &&
      booking.providerId?.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, 403, 'Not authorized to view this booking.');
    }

    return successResponse(res, 200, 'Booking retrieved.', { booking });
  } catch (error) {
    next(error);
  }
};
