const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { processMessage, getWelcomeMessage, getMainOptions } = require('../utils/assistantEngine');

const getOptionalUser = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.id).select('-password');
  } catch {
    return null;
  }
};

const chat = async (req, res) => {
  try {
    const { message, optionId } = req.body;
    const user = await getOptionalUser(req);

    if (!message && !optionId) {
      return errorResponse(res, 400, 'Message or optionId is required');
    }

    const result = await processMessage({ message, optionId, user });
    return successResponse(res, 200, 'Assistant response', result);
  } catch (error) {
    return errorResponse(res, 500, error.message || 'Assistant failed to respond');
  }
};

const getGreeting = async (req, res) => {
  try {
    const user = await getOptionalUser(req);
    return successResponse(res, 200, 'Welcome', {
      message: getWelcomeMessage(user),
      options: getMainOptions(user),
      action: null,
      intent: 'greeting',
    });
  } catch (error) {
    return errorResponse(res, 500, error.message || 'Failed to load assistant');
  }
};

module.exports = { chat, getGreeting };
