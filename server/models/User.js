//This schema contains only the universal properties that every human being needs to use your website:
//whether they are customer or service provider. 
//It is a good practice to keep the user schema simple and universal, and then create separate schemas for customers and providers that extend the user schema with additional properties specific to each role.
const mongoose = require('mongoose');
//bcrypt hashes passwords into unreadable strings before storing them into the database.
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      //Mongoose instantly trims the whitespace from the beginning and end of the string.(human typo error).
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      //The unique property creates a unique index in the database, which ensures that no two users can have the same email address. This is crucial for user authentication and account management.
      unique: true,
      //all emails are stored in lowercase. Uppercase is converted to lower.
      lowercase: true,
      trim: true,
      //The match property uses a regular expression to validate that the email address is in a proper format. If the email doesn't match the pattern, Mongoose will throw a validation error with the specified message.
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    //when you query a user (e.g., tracking a booking or fetching a profile), 
    // you don't want their encrypted password payload floating around. 
    // Setting select: false means that unless your backend explicitly asks for the password field, MongoDB hides it completely from standard queries.
    
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },


    //input should be customer or provider nothing other than that.
    role: {
      type: String,
      enum: ['customer', 'provider'],
      default: 'customer',
    },
    avatar: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
  },

  //automatically adds createdAt and updatedAt timestamps to the schema, which can be very useful for tracking when users were created or last updated.
  { timestamps: true }
);

// pre-save middleware is a function that runs before a document is saved to the database. 
// In this case, it checks if the password field has been modified. 
// If it has, it hashes the password using bcrypt before saving it. 
// This ensures that passwords are always stored securely in the database.
// this is used whenever pass is modified, like when user is created or when user changes password.
//this is know as pre-hook middleware in mongoose.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//attaching a method to the user schema that can be used to compare password while login.
//this function can be used as a method of user.
//encapsulation data and methods wrapped together.
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Whenever we sent response to frontend like res.json(user), this toJSON method is called automatically. 
// It converts the Mongoose document into a plain JavaScript object and removes the password field before sending it to the client.
// This way, even if you accidentally include the user object in a response, the password will never be exposed.
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
