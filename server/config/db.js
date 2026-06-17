const mongoose = require('mongoose');
//mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.
//it sits between node js and mongoDB
//it turns database documents into neat JavaScript objects you can easily manipulate.

//------------------------------------------------

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);


//event listeners to handle connection errors and disconnections.
//If the connection to MongoDB is lost, the 'disconnected' event will trigger, and mongoose is is smart enough to reconnect automatically.
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    // Exit process tells the server to stop completely. This is important because if the database connection fails, the server won't be able to function properly, and it's better to crash early than to run in a broken state.
    process.exit(1);
  }
};

//exports the funtion, which is used by server.js file.
module.exports = connectDB;
