import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ride from './models/Ride.js';
import Food from './models/Food.js';

dotenv.config();

const rides = [
  {
    name: 'Tsunami Twister',
    description: 'Experience the ultimate thrill as you spiral through a massive water funnel, featuring a heart-pounding 360-degree loop that will leave you breathless.',
    image: 'https://images.pexels.com/photos/7541299/pexels-photo-7541299.jpeg',
    price: 29.99,
    thrillLevel: 'Extreme',
    minHeight: 140,
    duration: 3,
    capacity: 4
  },
  {
    name: 'River Rapids',
    description: 'Navigate through rushing waters and unexpected drops on this exciting river adventure. Perfect for families seeking a balanced mix of thrills and fun.',
    image: 'https://images.pexels.com/photos/7456112/pexels-photo-7456112.jpeg',
    price: 24.99,
    thrillLevel: 'Moderate',
    minHeight: 120,
    duration: 8,
    capacity: 6
  },
  {
    name: 'Wave Pool Paradise',
    description: 'Dive into our massive wave pool featuring different wave patterns throughout the day. From gentle ripples to powerful surf, there is something for everyone.',
    image: 'https://images.pexels.com/photos/6858673/pexels-photo-6858673.jpeg',
    price: 19.99,
    thrillLevel: 'Mild',
    minHeight: 0,
    duration: 1,
    capacity: 200
  },
  {
    name: 'Aqua Loop',
    description: 'Take on our most intense water slide featuring a vertical loop! Drop through a trap door and experience weightlessness as you complete a perfect loop.',
    image: 'https://images.pexels.com/photos/7541301/pexels-photo-7541301.jpeg',
    price: 34.99,
    thrillLevel: 'Extreme',
    minHeight: 150,
    duration: 2,
    capacity: 1
  },
  {
    name: 'Lazy River',
    description: 'Float along our scenic lazy river, winding through beautiful landscapes and gentle waterfalls. Perfect for relaxation and cooling off.',
    image: 'https://images.pexels.com/photos/7456116/pexels-photo-7456116.jpeg',
    price: 14.99,
    thrillLevel: 'Mild',
    minHeight: 0,
    duration: 30,
    capacity: 100
  }
];

const foods = [
  {
    name: 'Classic Burger',
    description: 'Juicy beef patty with fresh lettuce, tomato, cheese, and our special sauce',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    price: 12.99,
    category: 'Main Course',
    isVegetarian: false,
    preparationTime: 15
  },
  {
    name: 'Veggie Pizza',
    description: 'Fresh vegetables, mushrooms, and melted cheese on our house-made crust',
    image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg',
    price: 14.99,
    category: 'Main Course',
    isVegetarian: true,
    preparationTime: 20
  },
  {
    name: 'French Fries',
    description: 'Crispy golden fries seasoned with our special blend of spices',
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg',
    price: 4.99,
    category: 'Snacks',
    isVegetarian: true,
    preparationTime: 8
  },
  {
    name: 'Ice Cream Sundae',
    description: 'Three scoops of ice cream with chocolate sauce, whipped cream, and a cherry on top',
    image: 'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg',
    price: 7.99,
    category: 'Desserts',
    isVegetarian: true,
    preparationTime: 5
  },
  {
    name: 'Fresh Lemonade',
    description: 'Refreshing lemonade made with fresh lemons and a hint of mint',
    image: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg',
    price: 3.99,
    category: 'Beverages',
    isVegetarian: true,
    preparationTime: 3
  },
  {
    name: 'Chicken Tenders',
    description: 'Crispy breaded chicken tenders served with choice of dipping sauce',
    image: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg',
    price: 9.99,
    category: 'Main Course',
    isVegetarian: false,
    preparationTime: 12
  },
  {
    name: 'Nachos Grande',
    description: 'Tortilla chips loaded with cheese, jalapeños, and all the toppings',
    image: 'https://images.pexels.com/photos/1108775/pexels-photo-1108775.jpeg',
    price: 11.99,
    category: 'Snacks',
    isVegetarian: false,
    preparationTime: 10
  },
  {
    name: 'Chocolate Brownie',
    description: 'Warm chocolate brownie served with vanilla ice cream',
    image: 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg',
    price: 6.99,
    category: 'Desserts',
    isVegetarian: true,
    preparationTime: 5
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Ride.deleteMany({});
    await Food.deleteMany({});
    console.log('Cleared existing data');

    // Insert new data
    await Ride.insertMany(rides);
    await Food.insertMany(foods);
    console.log('Database seeded successfully');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();