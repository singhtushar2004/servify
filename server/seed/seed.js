//seed is basically used to populate the database with some initial data.
//this sets the services collection that are shown in the frontend.
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Service = require('../models/Service');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/servify';

const services = [
  {
    name: 'Premium Car Wash',
    category: 'carwash',
    price: 499,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    description:
      'Professional car washing service at your doorstep. Our expert team uses premium products to give your car a showroom-quality finish.',
    features: [
      'Exterior hand wash & dry',
      'Interior vacuum cleaning',
      'Dashboard & console wipe',
      'Window cleaning (inside & out)',
      'Tyre & rim cleaning',
      'Air freshener application',
    ],
    duration: '1-2 hours',
    rating: 4.8,
    reviewCount: 2847,
  },
  {
    name: 'Expert Plumbing Service',
    category: 'plumber',
    price: 799,
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80',
    description:
      'Certified plumbers for all your plumbing needs. From leaky taps to complete bathroom fittings, we handle everything with precision.',
    features: [
      'Leak detection & repair',
      'Pipe fitting & replacement',
      'Tap & faucet repair',
      'Bathroom fixture installation',
      'Drainage unclogging',
      '90-day service warranty',
    ],
    duration: '2-4 hours',
    rating: 4.7,
    reviewCount: 1923,
  },
  {
    name: 'Professional Carpentry',
    category: 'carpenter',
    price: 999,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80',
    description:
      'Skilled carpenters for furniture assembly, repair, and custom woodwork. Quality craftsmanship guaranteed for all wooden works.',
    features: [
      'Furniture assembly & repair',
      'Door & window fitting',
      'Custom cabinet making',
      'Wooden flooring installation',
      'Wardrobe installation',
      '60-day workmanship guarantee',
    ],
    duration: '3-5 hours',
    rating: 4.6,
    reviewCount: 1456,
  },
  {
    name: 'Home Deep Cleaning',
    category: 'maid',
    price: 599,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    description:
      'Thorough home cleaning by trained professionals. We use eco-friendly products to leave your home spotlessly clean and fresh.',
    features: [
      'Complete floor mopping & sweeping',
      'Kitchen deep clean & degreasing',
      'Bathroom sanitization',
      'Bedroom dusting & cleaning',
      'Balcony & common area cleaning',
      'Eco-friendly cleaning products',
    ],
    duration: '4-6 hours',
    rating: 4.9,
    reviewCount: 3621,
  },
  {
    name: 'Personal Home Cook',
    category: 'cook',
    price: 799,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    description:
      'Experienced home cooks to prepare fresh, hygienic meals for you and your family. Customized menus for all dietary preferences.',
    features: [
      'Customized meal planning',
      'Breakfast, lunch & dinner preparation',
      'Special diet options (veg/non-veg/vegan)',
      'Kitchen cleaning after cooking',
      'Weekly & monthly packages available',
      'Background verified chefs',
    ],
    duration: '2-3 hours',
    rating: 4.7,
    reviewCount: 2103,
  },
];

//try to fill each service in the services array into the database
//if it exist skip it, otherwise create it.
const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    for (const serviceData of services) {
      const existing = await Service.findOne({ category: serviceData.category, name: serviceData.name });
      if (existing) {
        console.log(`⏭️  Skipping "${serviceData.name}" — already exists.`);
      } else {
        await Service.create(serviceData);
        console.log(`✅ Created service: ${serviceData.name}`);
      }
    }

    console.log('\n🌱 Seed completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
