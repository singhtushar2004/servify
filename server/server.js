require('dotenv').config();
const express = require('express');

//used to handle cross-origin requests , browser restricts backend to communicate with frontend if they are on different domains, ports or protocols
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const providerRoutes = require('./routes/providers');
const serviceRoutes = require('./routes/services');

const app = express();

connectDB();

//***************************** MIDDLEWARE ****************************

//tells browser to allow req from port 5173 (frontend)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

//middleware used to convert incoming raw data stream into objects, use --- >(req.body)
app.use(express.json({ limit: '10mb' }));
//middleware to parse URL-encoded data (from forms)
//Before frameworks like React existed, the standard way to send data to a backend was by using a plain HTML <form> without any JavaScript.
//data is sent in encoded format , this decodes the data into an object
app.use(express.urlencoded({ extended: true }));


//health check to verify if the server is running and responding correctly. It returns a JSON response with status, message, and timestamp.
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servify API is running', timestamp: new Date().toISOString() });
});

//***************************** ROUTES ****************************/

//prefix all routes with /api/auth, /api/bookings, /api/providers, and /api/services respectively
//If a request comes in for /api/auth/login, this file doesn't handle the logic. It sees /api/auth, stops, and hands the entire request over to your authRoutes file to deal with.
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/services', serviceRoutes);

//Express processes requests sequentially from top to bottom, if a request makes it past all your API routes without finding a match
//it hits this 404 block. It acts as a catch-all for typos in the URL
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

//we define the port on ehich the server will listen for the incoming requests.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servify API running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health\n`);
});

module.exports = app;
