const express = require('express');
const Internship = require('../models/Internship');
const { protect, employerOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/internships
// @desc    Get all internships with optional filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { location, search, sort } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add location filter if provided
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    // Add text search if provided
    let internships;
    if (search) {
      internships = await Internship.find(
        { $text: { $search: search } },
        { score: { $meta: 'textScore' } }
      )
      .sort({ score: { $meta: 'textScore' } })
      .populate('postedBy', 'name companyName');
    } else {
      // Apply sorting
      let sortOption = {};
      if (sort === 'newest') {
        sortOption = { createdAt: -1 };
      } else if (sort === 'oldest') {
        sortOption = { createdAt: 1 };
      } else {
        sortOption = { createdAt: -1 }; // Default sorting
      }
      
      internships = await Internship.find(filter)
        .sort(sortOption)
        .populate('postedBy', 'name companyName');
    }
    
    res.json(internships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/internships/:id
// @desc    Get internship by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate('postedBy', 'name companyName email');
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    res.json(internship);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/internships
// @desc    Create a new internship
// @access  Private - Employer Only
router.post('/', protect, employerOnly, async (req, res) => {
  try {
    const { title, location, description, requirements, stipend, duration } = req.body;
    
    const internship = await Internship.create({
      title,
      company: req.user.companyName,
      location,
      description,
      requirements,
      stipend,
      duration,
      postedBy: req.user._id
    });
    
    res.status(201).json(internship);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/internships/:id
// @desc    Update an internship
// @access  Private - Employer Only (owner)
router.put('/:id', protect, employerOnly, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    // Check if the user is the owner of the internship
    if (internship.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own internships' });
    }
    
    const { title, location, description, requirements, stipend, duration } = req.body;
    
    internship.title = title || internship.title;
    internship.location = location || internship.location;
    internship.description = description || internship.description;
    internship.requirements = requirements || internship.requirements;
    internship.stipend = stipend || internship.stipend;
    internship.duration = duration || internship.duration;
    
    const updatedInternship = await internship.save();
    
    res.json(updatedInternship);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/internships/:id
// @desc    Delete an internship
// @access  Private - Employer Only (owner)
router.delete('/:id', protect, employerOnly, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    // Check if the user is the owner of the internship
    if (internship.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own internships' });
    }
    
    await internship.deleteOne();
    
    res.json({ message: 'Internship removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/internships/employer/me
// @desc    Get internships posted by the logged in employer
// @access  Private - Employer Only
router.get('/employer/me', protect, employerOnly, async (req, res) => {
  try {
    const internships = await Internship.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 });
      
    res.json(internships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 