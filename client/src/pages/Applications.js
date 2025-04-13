import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Applications = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user && user.role !== 'applicant') {
      navigate('/');
      return;
    }

    fetchApplications();
  }, [isAuthenticated, user, navigate]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://find-jobs-9smp.onrender.com/api/applications/me');
      setApplications(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'reviewed':
        return 'badge-info';
      case 'accepted':
        return 'badge-success';
      case 'rejected':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  if (loading) return <div className="container">Loading applications...</div>;

  return (
    <div className="applications-page">
      <div className="container">
        <h1>My Applications</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        {applications.length === 0 ? (
          <div className="empty-state">
            <h3>You haven't applied to any internships yet</h3>
            <p>
              <Link to="/">Browse available internships</Link> and start applying!
            </p>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((application) => (
              <div key={application._id} className="application-card">
                <div className="application-header">
                  <h2>{application.internship.title}</h2>
                  <span className={`status-badge ${getStatusBadgeClass(application.status)}`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>

                <div className="application-details">
                  <p><strong>Company:</strong> {application.internship.company}</p>
                  <p><strong>Location:</strong> {application.internship.location}</p>
                  <p><strong>Applied on:</strong> {formatDate(application.createdAt)}</p>
                </div>

                {application.coverLetter && (
                  <div className="cover-letter">
                    <h3>Your Cover Letter</h3>
                    <p>{application.coverLetter}</p>
                  </div>
                )}

                <div className="application-footer">
                  <Link to={`/internship/${application.internship._id}`} className="btn-secondary">
                    View Internship
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications; 