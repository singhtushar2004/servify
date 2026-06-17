const Service = require('../models/Service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.getAllServices = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;

    const services = await Service.find(filter).sort({ createdAt: -1 });

    return successResponse(res, 200, 'Services fetched successfully.', { services });
  } catch (error) {
    next(error);
  }
};

exports.getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service || !service.isActive) {
      return errorResponse(res, 404, 'Service not found.');
    }

    return successResponse(res, 200, 'Service fetched successfully.', { service });
  } catch (error) {
    next(error);
  }
};

exports.getServicesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const services = await Service.find({ category, isActive: true });

    return successResponse(res, 200, 'Services fetched.', { services });
  } catch (error) {
    next(error);
  }
};
