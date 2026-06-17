const Booking = require('../models/Booking');
const Service = require('../models/Service');
const ProviderProfile = require('../models/ProviderProfile');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Resolve matching service IDs for a provider's specialization
const getMatchingServiceIds = async (specialization) => {
  const services = await Service.find({ category: specialization, isActive: true }).distinct('_id');
  return services;
};

exports.getProviderBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const providerProfile = await ProviderProfile.findOne({ userId: req.user._id });

    let filter;

    if (!status || status === 'pending') {
      // Show pending jobs: both explicitly assigned to this provider AND unassigned jobs
      // that match this provider's specialization (open marketplace model)
      const matchingServiceIds = providerProfile
        ? await getMatchingServiceIds(providerProfile.specialization)
        : [];

      const pendingFilter = {
        status: 'pending',
        $or: [
          { providerId: req.user._id },
          { providerId: null, serviceId: { $in: matchingServiceIds } },
        ],
      };

      if (status === 'pending') {
        filter = pendingFilter;
      } else {
        // No status filter: return own bookings (any status) + unassigned pending
        const [ownBookings, unassignedPending] = await Promise.all([
          Booking.find({ providerId: req.user._id })
            .populate('serviceId', 'name category price image duration')
            .populate('customerId', 'name email phone avatar')
            .sort({ createdAt: -1 }),
          Booking.find({ providerId: null, status: 'pending', serviceId: { $in: matchingServiceIds } })
            .populate('serviceId', 'name category price image duration')
            .populate('customerId', 'name email phone avatar')
            .sort({ createdAt: -1 }),
        ]);

        // Merge, deduplicate by _id, own bookings first
        const seen = new Set();
        const merged = [];
        for (const b of [...ownBookings, ...unassignedPending]) {
          const id = b._id.toString();
          if (!seen.has(id)) { seen.add(id); merged.push(b); }
        }

        return successResponse(res, 200, 'Provider bookings fetched.', { bookings: merged });
      }
    } else {
      // For accepted/completed/cancelled — only their own bookings
      filter = { providerId: req.user._id, status };
    }

    const bookings = await Booking.find(filter)
      .populate('serviceId', 'name category price image duration')
      .populate('customerId', 'name email phone avatar')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Provider bookings fetched.', { bookings });
  } catch (error) {
    next(error);
  }
};

exports.acceptBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return errorResponse(res, 404, 'Booking not found.');
    }

    if (booking.status !== 'pending') {
      return errorResponse(res, 400, `Cannot accept a booking with status: ${booking.status}`);
    }

    // If no provider is assigned yet, self-assign this provider
    if (!booking.providerId) {
      booking.providerId = req.user._id;
    } else if (booking.providerId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized to accept this booking.');
    }

    booking.status = 'accepted';
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('serviceId', 'name category price image')
      .populate('customerId', 'name email phone');

    return successResponse(res, 200, 'Booking accepted successfully.', { booking: populatedBooking });
  } catch (error) {
    next(error);
  }
};

exports.rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return errorResponse(res, 404, 'Booking not found.');
    }

    // Allow rejecting if assigned to this provider OR if unassigned (providerId null)
    if (booking.providerId && booking.providerId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized to reject this booking.');
    }

    if (!['pending', 'accepted'].includes(booking.status)) {
      return errorResponse(res, 400, `Cannot reject a booking with status: ${booking.status}`);
    }

    // Keep providerId null so another provider can pick it up, or cancel it
    booking.status = 'cancelled';
    await booking.save();

    return successResponse(res, 200, 'Booking rejected.', { booking });
  } catch (error) {
    next(error);
  }
};

exports.completeBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return errorResponse(res, 404, 'Booking not found.');
    }

    if (booking.providerId?.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized to complete this booking.');
    }

    if (!['accepted', 'in_progress'].includes(booking.status)) {
      return errorResponse(res, 400, `Cannot complete a booking with status: ${booking.status}`);
    }

    booking.status = 'completed';
    booking.paymentStatus = 'paid';
    booking.completedAt = new Date();
    await booking.save();

    await ProviderProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        $inc: {
          completedJobs: 1,
          totalEarnings: booking.totalAmount,
        },
      },
      { new: true }
    );

    const populatedBooking = await Booking.findById(booking._id)
      .populate('serviceId', 'name category price image')
      .populate('customerId', 'name email phone');

    return successResponse(res, 200, 'Booking marked as completed.', { booking: populatedBooking });
  } catch (error) {
    next(error);
  }
};

exports.getProviderDashboard = async (req, res, next) => {
  try {
    const providerId = req.user._id;
    const providerProfile = await ProviderProfile.findOne({ userId: providerId });

    // Get unassigned bookings matching this provider's specialization
    const matchingServiceIds = providerProfile
      ? await getMatchingServiceIds(providerProfile.specialization)
      : [];

    const [
      ownPendingJobs,
      unassignedPendingJobs,
      acceptedJobs,
      completedJobs,
      cancelledJobs,
    ] = await Promise.all([
      Booking.countDocuments({ providerId, status: 'pending' }),
      Booking.countDocuments({ providerId: null, status: 'pending', serviceId: { $in: matchingServiceIds } }),
      Booking.countDocuments({ providerId, status: 'accepted' }),
      Booking.countDocuments({ providerId, status: 'completed' }),
      Booking.countDocuments({ providerId, status: 'cancelled' }),
    ]);

    const pendingJobs = ownPendingJobs + unassignedPendingJobs;

    // Recent bookings: own + unassigned pending
    const [ownRecent, unassignedRecent] = await Promise.all([
      Booking.find({ providerId })
        .populate('serviceId', 'name category price image')
        .populate('customerId', 'name email phone avatar')
        .sort({ createdAt: -1 })
        .limit(5),
      Booking.find({ providerId: null, status: 'pending', serviceId: { $in: matchingServiceIds } })
        .populate('serviceId', 'name category price image')
        .populate('customerId', 'name email phone avatar')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const seen = new Set();
    const recentBookings = [];
    for (const b of [...ownRecent, ...unassignedRecent]) {
      const id = b._id.toString();
      if (!seen.has(id)) { seen.add(id); recentBookings.push(b); }
    }

    return successResponse(res, 200, 'Provider dashboard data fetched.', {
      stats: {
        totalEarnings: providerProfile?.totalEarnings || 0,
        completedJobs: providerProfile?.completedJobs || 0,
        rating: providerProfile?.rating || 0,
        pendingJobs,
        acceptedJobs,
        cancelledJobs,
        totalJobs: pendingJobs + acceptedJobs + completedJobs + cancelledJobs,
      },
      profile: providerProfile,
      recentBookings: recentBookings.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};

exports.getMonthlyAnalytics = async (req, res, next) => {
  try {
    const providerId = req.user._id;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyData = await Booking.aggregate([
      {
        $match: {
          providerId: providerId,
          status: 'completed',
          completedAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$completedAt' },
            month: { $month: '$completedAt' },
          },
          revenue: { $sum: '$totalAmount' },
          jobs: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          revenue: 1,
          jobs: 1,
        },
      },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const formattedData = monthlyData.map((item) => ({
      month: monthNames[item.month - 1],
      year: item.year,
      revenue: item.revenue,
      jobs: item.jobs,
    }));

    const totalRevenue = formattedData.reduce((sum, d) => sum + d.revenue, 0);
    const totalJobsCompleted = formattedData.reduce((sum, d) => sum + d.jobs, 0);

    return successResponse(res, 200, 'Monthly analytics fetched.', {
      analytics: formattedData,
      summary: {
        totalRevenue,
        totalJobsCompleted,
        avgMonthlyRevenue: formattedData.length > 0 ? Math.round(totalRevenue / formattedData.length) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProviderProfile = async (req, res, next) => {
  try {
    const { bio, experience, baseRate, serviceArea, isAvailable, specialization } = req.body;

    const updateFields = {};
    if (bio !== undefined) updateFields.bio = bio;
    if (experience !== undefined) updateFields.experience = experience;
    if (baseRate !== undefined) updateFields.baseRate = baseRate;
    if (serviceArea !== undefined) updateFields.serviceArea = serviceArea;
    if (isAvailable !== undefined) updateFields.isAvailable = isAvailable;
    if (specialization) updateFields.specialization = specialization;

    const profile = await ProviderProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return errorResponse(res, 404, 'Provider profile not found.');
    }

    return successResponse(res, 200, 'Profile updated successfully.', { profile });
  } catch (error) {
    next(error);
  }
};
