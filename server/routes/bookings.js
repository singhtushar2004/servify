const express = require('express');
const router = express.Router();
const {
  createBooking,
  getCustomerBookings,
  cancelBooking,
  getCustomerDashboard,
  getBookingById,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('customer'), createBooking);
router.get('/', authorize('customer'), getCustomerBookings);
router.get('/dashboard', authorize('customer'), getCustomerDashboard);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', authorize('customer'), cancelBooking);

module.exports = router;
