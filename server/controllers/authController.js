const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const generateToken = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/apiResponse');

//(req, res, next): You included next here! If a massive server error happens, 
//next(error) safely passes the crash down to your global error handler

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, specialization } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 400, 'Name, email, and password are required.');
    }

    if (password.length < 6) {
      return errorResponse(res, 400, 'Password must be at least 6 characters.');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 409, 'An account with this email already exists.');
    }

    //password is passed as normal bcoz prehook manages it and hashes it before saving to db.
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      phone: phone || '',
    });

    //Now the user is created and it has a id in db
    //now check if the role is provider, if yes then create a provider profile for the user.
    if (role === 'provider') {
      await ProviderProfile.create({
        userId: user._id,
        specialization: specialization || 'plumber',
        bio: '',
        experience: 0,
        baseRate: 0,
        isAvailable: true,
      });
    }

    const token = generateToken(user._id);

    return successResponse(res, 201, 'Account created successfully.', {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Email and password are required.');
    }

    // as we set select: false in the user schema for the password field, the db does not sends password by default,
    //but we need it here to compare the password, so we use .select('+password') to explicitly include it in the query result.
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    //as we made compare the method of user we dont need to call bycrypt everytime everywhere.
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    const token = generateToken(user._id);

    return successResponse(res, 200, 'Login successful.', {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    //Before this code even runs, middleware decodes the token, 
    //extracts the owner's ID, and injects it straight into req.user
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 404, 'User not found.');
    }

    //create a null providerprofile if its a normal user then along with user null will be returned.
    let providerProfile = null;
    if (user.role === 'provider') {
      providerProfile = await ProviderProfile.findOne({ userId: user._id });
    }

    return successResponse(res, 200, 'User retrieved successfully.', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        createdAt: user.createdAt,
      },
      providerProfile,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;

    //create a new js object.
    const updateFields = {};

    //if the fronend sends a new name then only update the name.
    //if it does not send name then the name will not be updated and it will remain same as before.
    if (name) updateFields.name = name;

    //if someone erases the phone number and sends empty string.
    //If you wrote if (phone), JavaScript would see the empty string, evaluate it as false, and ignore it.
    // The user would never be able to delete their phone number!
    if (phone !== undefined) updateFields.phone = phone;
    if (avatar !== undefined) updateFields.avatar = avatar;


    //$set, you are explicitly giving MongoDB a different instruction. You are telling it:
    // "Do not touch the whole document. Only look at the specific keys I am giving you right now, and replace those exact lines."
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },

      //by default the mongoose returns the old data after update, 
      //but we want the updated data to be returned in response, so we  || set new: true. ||

      //runvalidators checks the data with schema rules before updating, 
      //if data is invalid then it throws error and does not update the data in db.
      { new: true, runValidators: true }
    );

    return successResponse(res, 200, 'Profile updated successfully.', { user });
  } catch (error) {
    next(error);
  }
};
