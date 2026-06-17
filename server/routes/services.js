const express = require('express');
const router = express.Router();
const { getAllServices, getServiceById, getServicesByCategory } = require('../controllers/serviceController');

router.get('/', getAllServices);
router.get('/category/:category', getServicesByCategory);
router.get('/:id', getServiceById);

module.exports = router;
