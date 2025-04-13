import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PostInternship = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    requirements: '',
    stipend: '',
    duration: ''
  });
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { title, location, description, requirements, stipend, duration } = formData;
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user && user.role !== 'employer') {
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError(null); // Clear error on input change
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !location || !description || !requirements || !duration) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      await axios.post('https://socialaddress-manoj-backend.onrender.com/api/internships', formData);
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error creating internship');
      console.error('Error creating internship:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-internship-page">
      <div className="container">
        <h1>Post New Internship</h1>
        
        {formError && <div className="alert alert-danger">{formError}</div>}
        
        <form onSubmit={onSubmit} className="internship-form">
          <div className="form-group">
            <label htmlFor="title">Internship Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={onChange}
              placeholder="e.g., Frontend Developer Intern"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location*</label>
            <input
              type="text"
              id="location"
              name="location"
              value={location}
              onChange={onChange}
              placeholder="e.g., Remote, New York, NY"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="duration">Duration*</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={duration}
              onChange={onChange}
              placeholder="e.g., 3 months, Summer 2023"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="stipend">Stipend (Optional)</label>
            <input
              type="text"
              id="stipend"
              name="stipend"
              value={stipend}
              onChange={onChange}
              placeholder="e.g., $1000/month, Unpaid"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={onChange}
              placeholder="Describe the internship role, responsibilities, and what interns will learn"
              rows="5"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="requirements">Requirements*</label>
            <textarea
              id="requirements"
              name="requirements"
              value={requirements}
              onChange={onChange}
              placeholder="List the skills, qualifications, and experience required for this internship"
              rows="5"
              required
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Posting...' : 'Post Internship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostInternship; 