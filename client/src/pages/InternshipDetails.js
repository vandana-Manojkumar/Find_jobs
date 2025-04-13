import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applicationStatus, setApplicationStatus] = useState(null);
  const { isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    fetchInternship();
    if (isAuthenticated && user?.role === 'applicant') {
      checkApplicationStatus();
    }
  }, [id, isAuthenticated, user]);

  const fetchInternship = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://socialaddress-manoj-backend.onrender.com/api/internships/${id}`);
      setInternship(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch internship details');
      console.error('Error fetching internship:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const res = await axios.get('https://socialaddress-manoj-backend.onrender.com/api/applications/me');
      const application = res.data.find(app => app.internship._id === id);
      if (application) {
        setApplicationStatus(application.status);
      }
    } catch (err) {
      console.error('Error checking application status:', err);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await axios.post('https://socialaddress-manoj-backend.onrender.com/api/applications', {
        internshipId: id,
        coverLetter
      });
      
      setApplicationStatus('pending');
      alert('Your application has been submitted successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application');
      console.error('Error applying for internship:', err);
    }
  };

  // Format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="container">Loading internship details...</div>;
  if (error) return <div className="container error">{error}</div>;
  if (!internship) return <div className="container">Internship not found</div>;

  return (
    <div className="internship-details-page">
      <div className="container">
        <div className="back-link">
          <Link to="/">&larr; Back to Internships</Link>
        </div>
        
        <div className="internship-details">
          <div className="internship-header">
            <h1>{internship.title}</h1>
            <p className="company">{internship.company}</p>
            <p className="posted-date">Posted on {formatDate(internship.createdAt)}</p>
          </div>
          
          <div className="internship-meta">
            <div className="meta-item">
              <span className="meta-label">Location:</span>
              <span className="meta-value">{internship.location}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Duration:</span>
              <span className="meta-value">{internship.duration}</span>
            </div>
            {internship.stipend && (
              <div className="meta-item">
                <span className="meta-label">Stipend:</span>
                <span className="meta-value">{internship.stipend}</span>
              </div>
            )}
          </div>
          
          <div className="internship-content">
            <div className="content-section">
              <h2>Description</h2>
              <p>{internship.description}</p>
            </div>
            
            <div className="content-section">
              <h2>Requirements</h2>
              <p>{internship.requirements}</p>
            </div>
          </div>
          
          {isAuthenticated && user?.role === 'applicant' && (
            <div className="application-section">
              {applicationStatus ? (
                <div className="application-status">
                  <h3>Application Status: {applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)}</h3>
                  <p>You have already applied for this internship.</p>
                </div>
              ) : (
                <>
                  <h3>Apply for this Internship</h3>
                  <form onSubmit={handleApply}>
                    <div className="form-group">
                      <label htmlFor="coverLetter">Cover Letter (Optional)</label>
                      <textarea
                        id="coverLetter"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Tell the employer why you're interested in this role and what makes you a good fit."
                        rows="6"
                      ></textarea>
                    </div>
                    <button type="submit" className="btn-primary">Submit Application</button>
                  </form>
                </>
              )}
            </div>
          )}
          
          {isAuthenticated && user?.role === 'employer' && user?._id === internship.postedBy && (
            <div className="employer-actions">
              <Link to={`/dashboard`} className="btn-secondary">
                View Applications
              </Link>
            </div>
          )}
          
          {!isAuthenticated && (
            <div className="auth-prompt">
              <p>Please <Link to="/login">login</Link> or <Link to="/register">register</Link> as an applicant to apply for this internship.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternshipDetails; 