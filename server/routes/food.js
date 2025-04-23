import express from 'express';
import Food from '../models/Food.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/food
// @desc    Get all food items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    const query = category ? { category, isAvailable: true } : { isAvailable: true };
    
    const food = await Food.find(query);
    res.json(food);
  } catch (error) {
    console.error('Get food items error:', error);
    res.status(500).json({ message: 'Server error getting food items' });
  }
});

// @route   GET /api/food/:id
// @desc    Get a single food item by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json(food);
  } catch (error) {
    console.error('Get food item error:', error);
    res.status(500).json({ message: 'Server error getting food item' });
  }
});

// @route   POST /api/food
// @desc    Create a new food item
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { 
      name, 
      description, 
      image, 
      price, 
      category, 
      isVegetarian, 
      preparationTime 
    } = req.body;

    const food = new Food({
      name,
      description,
      image,
      price,
      category,
      isVegetarian,
      preparationTime
    });

    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (error) {
    console.error('Create food item error:', error);
    res.status(500).json({ message: 'Server error creating food item' });
  }
});

// @route   PUT /api/food/:id
// @desc    Update a food item
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { 
      name, 
      description, 
      image, 
      price, 
      category, 
      isVegetarian, 
      preparationTime,
      isAvailable 
    } = req.body;

    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Update fields
    food.name = name || food.name;
    food.description = description || food.description;
    food.image = image || food.image;
    food.price = price || food.price;
    food.category = category || food.category;
    food.isVegetarian = isVegetarian !== undefined ? isVegetarian : food.isVegetarian;
    food.preparationTime = preparationTime || food.preparationTime;
    food.isAvailable = isAvailable !== undefined ? isAvailable : food.isAvailable;

    const updatedFood = await food.save();
    res.json(updatedFood);
  } catch (error) {
    console.error('Update food item error:', error);
    res.status(500).json({ message: 'Server error updating food item' });
  }
});

// @route   DELETE /api/food/:id
// @desc    Delete a food item
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    await food.deleteOne();
    res.json({ message: 'Food item removed' });
  } catch (error) {
    console.error('Delete food item error:', error);
    res.status(500).json({ message: 'Server error deleting food item' });
  }
});

export default router;