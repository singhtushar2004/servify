const jwt = require('jsonwebtoken');

//This function is a specialist utility. It says, "Give me a user's unique MongoDB database ID,
//and I will hand you back a locked, encoded security key.

//the token expires in 7 days by default.
//after the token has expired the user needs to login again to get a new token. 
//This is a security measure to prevent unauthorized access if the token is stolen or compromised.

//=======================================================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
