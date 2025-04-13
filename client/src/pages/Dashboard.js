import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user && user.role !== 'employer') {
      navigate('/');
      return;
    }

    fetchEmployerInternships();
  }, [isAuthenticated, user, navigate]);

  const fetchEmployerInternships = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://find-jobs-9smp.onrender.com/api/internships/employer/me');
      setInternships(res.data);

      if (res.data.length > 0) {
        setSelectedInternship(res.data[0]._id);
        await fetchApplications(res.data[0]._id);
      }
    } catch (err) {
      setError('Failed to fetch internships');
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (internshipId) => {
    try {
      const res = await axios.get(`https://find-jobs-9smp.onrender.com/api/applications/internship/${internshipId}`);
      console.log('Fetched applications:', res.data); // For debugging
      setApplications({
        ...applications,
        [internshipId]: Array.isArray(res.data) ? res.data : [],
      });
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const handleInternshipSelect = async (internshipId) => {
    setSelectedInternship(internshipId);

    if (!applications[internshipId]) {
      await fetchApplications(internshipId);
    }
  };

  const handleApplicationStatus = async (applicationId, status) => {
    try {
      await axios.put(`https://find-jobs-9smp.onrender.com/api/applications/${applicationId}`, { status });

      if (selectedInternship && Array.isArray(applications[selectedInternship])) {
        const updatedApplications = applications[selectedInternship].map(app =>
          app._id === applicationId ? { ...app, status } : app
        );

        setApplications({
          ...applications,
          [selectedInternship]: updatedApplications
        });
      }
    } catch (err) {
      alert('Failed to update application status');
      console.error('Error updating application status:', err);
    }
  };

  const handleDeleteInternship = async (internshipId) => {
    if (!window.confirm('Are you sure you want to delete this internship posting?')) {
      return;
    }

    try {
      await axios.delete(`https://find-jobs-9smp.onrender.com/api/internships/${internshipId}`);
      setInternships(internships.filter(internship => internship._id !== internshipId));

      if (selectedInternship === internshipId) {
        setSelectedInternship(null);
      }
    } catch (err) {
      alert('Failed to delete internship');
      console.error('Error deleting internship:', err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="container">Loading dashboard...</div>;

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1>Employer Dashboard</h1>

        <div className="dashboard-actions">
          <Link to="/post-internship" className="btn-primary">
            Post New Internship
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {internships.length === 0 ? (
          <div className="empty-state">
            <h3>You haven't posted any internships yet</h3>
            <p>
              <Link to="/post-internship">Create your first internship posting</Link> to start
              receiving applications.
            </p>
          </div>
        ) : (
          <div className="dashboard-content">
            <div className="internships-list">
              <h2>Your Internships</h2>
              {internships.map((internship) => (
                <div
                  key={internship._id}
                  className={`internship-item ${selectedInternship === internship._id ? 'active' : ''}`}
                  onClick={() => handleInternshipSelect(internship._id)}
                >
                  <h3>{internship.title}</h3>
                  <p className="small">Posted: {formatDate(internship.createdAt)}</p>
                  <div className="actions">
                    <Link to={`/internship/${internship._id}`} className="btn-secondary btn-sm">
                      View
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteInternship(internship._id);
                      }}
                      className="btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="applications-panel">
              <h2>Applications</h2>

              {!selectedInternship ? (
                <p>Select an internship to view applications</p>
              ) : Array.isArray(applications[selectedInternship]) && applications[selectedInternship].length === 0 ? (
                <p>No applications received for this internship yet.</p>
              ) : (
                <div className="applications-list">
                  {Array.isArray(applications[selectedInternship]) &&
                    applications[selectedInternship].map((application) => (
                      <div key={application._id} className="application-item">
                        <div className="applicant-info">
                          <h3>{application.applicant.name}</h3>
                          <p>Email: {application.applicant.email}</p>
                          {application.applicant.bio && <p>Bio: {application.applicant.bio}</p>}
                        </div>

                        {application.coverLetter && (
                          <div className="cover-letter">
                            <h4>Cover Letter</h4>
                            <p>{application.coverLetter}</p>
                          </div>
                        )}

                        <div className="application-status">
                          <h4>
                            Status: {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </h4>
                          <div className="status-actions">
                            <button
                              onClick={() => handleApplicationStatus(application._id, 'reviewed')}
                              className={`btn-sm ${application.status === 'reviewed' ? 'active' : ''}`}
                              disabled={application.status === 'reviewed'}
                            >
                              Mark as Reviewed
                            </button>
                            <button
                              onClick={() => handleApplicationStatus(application._id, 'accepted')}
                              className={`btn-success btn-sm ${application.status === 'accepted' ? 'active' : ''}`}
                              disabled={application.status === 'accepted'}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleApplicationStatus(application._id, 'rejected')}
                              className={`btn-danger btn-sm ${application.status === 'rejected' ? 'active' : ''}`}
                              disabled={application.status === 'rejected'}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
