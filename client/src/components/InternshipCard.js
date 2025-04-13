import React from 'react';
import { Link } from 'react-router-dom';

const InternshipCard = ({ internship }) => {
  // Format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="internship-card">
      <div className="internship-header">
        <h3>{internship.title}</h3>
        <p className="company">{internship.company}</p>
      </div>
      <div className="internship-body">
        <p className="location">Location: {internship.location}</p>
        <p className="duration">Duration: {internship.duration}</p>
        {internship.stipend && <p className="stipend">Stipend: {internship.stipend}</p>}
        <p className="posted-date">Posted: {formatDate(internship.createdAt)}</p>
      </div>
      <div className="internship-footer">
        <Link to={`/internship/${internship._id}`} className="btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default InternshipCard; 