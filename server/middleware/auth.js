const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {

    //react sends the token in the header .It attaches it to the HTTP request headers.
    //This line reaches into the incoming message headers and grabs that specific line.
    const authHeader = req.headers.authorization;

    //checks if the authorization header is missing or it doesnt start with industry standard "bearer" prefix.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    //the string is like ("bearer token") so we split at space and take index 1,which means we take token.
    const token = authHeader.split(' ')[1];

    //this line decodes the token using the secret key stored in your environment variables.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //finds user by _id stored in db for every user.     //leave the password and give others.
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found. Token invalid.' });
    }


    //By assigning the MongoDB user data to req.user, 
    // you are attaching the logged-in user's identity directly to that tray. 
    // Now, when the request finally arrives at your getMe or updateProfile controller, 
    // those functions can easily read | req.user._id  |or| req.user.role | without doing any database lookups themselves!
    req.user = user;
    //passes the control to the next middleware or route handler in the stack.
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
