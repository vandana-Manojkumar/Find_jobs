const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  stipend: {
    type: String
  },
  duration: {
    type: String,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search
InternshipSchema.index({ 
  title: 'text', 
  company: 'text', 
  location: 'text',
  description: 'text'
});

module.exports = mongoose.model('Internship', InternshipSchema); 