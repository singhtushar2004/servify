const express = require('express');
const router = express.Router();
const {
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  completeBooking,
  getProviderDashboard,
  getMonthlyAnalytics,
  updateProviderProfile,
} = require('../controllers/providerController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('provider'));

router.get('/bookings', getProviderBookings);
router.get('/dashboard', getProviderDashboard);
router.get('/analytics', getMonthlyAnalytics);
router.put('/profile', updateProviderProfile);
router.patch('/bookings/:id/accept', acceptBooking);
router.patch('/bookings/:id/reject', rejectBooking);
router.patch('/bookings/:id/complete', completeBooking);

module.exports = router;
