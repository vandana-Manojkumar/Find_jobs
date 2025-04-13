const express = require('express');
const Application = require('../models/Application');
const Internship = require('../models/Internship');
const { protect, applicantOnly, employerOnly } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/applications
// @desc    Apply for an internship
// @access  Private - Applicant Only
router.post('/', protect, applicantOnly, async (req, res) => {
  try {
    const { internshipId, coverLetter } = req.body;
    
    // Check if internship exists
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    // Check if already applied
    const existingApplication = await Application.findOne({
      internship: internshipId,
      applicant: req.user._id
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this internship' });
    }
    
    // Create application
    const application = await Application.create({
      internship: internshipId,
      applicant: req.user._id,
      coverLetter
    });
    
    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/me
// @desc    Get all applications by the logged-in applicant
// @access  Private - Applicant Only
router.get('/me', protect, applicantOnly, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'internship',
        select: 'title company location createdAt',
        populate: {
          path: 'postedBy',
          select: 'name companyName'
        }
      })
      .sort({ createdAt: -1 });
      
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/internship/:internshipId
// @desc    Get all applications for a specific internship
// @access  Private - Employer Only (owner of the internship)
router.get('/internship/:internshipId', protect, employerOnly, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.internshipId);
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    // Check if the user is the owner of the internship
    if (internship.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only view applications for your own internships' });
    }
    
    const applications = await Application.find({ internship: req.params.internshipId })
      .populate('applicant', 'name email bio')
      .sort({ createdAt: -1 });
      
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id
// @desc    Update application status
// @access  Private - Employer Only (owner of the internship)
router.put('/:id', protect, employerOnly, async (req, res) => {
  try {
    const { status } = req.body;
    
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Get the internship to check ownership
    const internship = await Internship.findById(application.internship);
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    // Check if the user is the owner of the internship
    if (internship.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update applications for your own internships' });
    }
    
    application.status = status || application.status;
    
    const updatedApplication = await application.save();
    
    res.json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 