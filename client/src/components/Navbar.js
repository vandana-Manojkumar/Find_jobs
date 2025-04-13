import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <h1>Internship Job Board</h1>
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          {isAuthenticated ? (
            <>
              {user?.role === 'employer' && (
                <>
                  <li>
                    <Link to="/post-internship">Post Internship</Link>
                  </li>
                  <li>
                    <Link to="/dashboard">My Internships</Link>
                  </li>
                </>
              )}
              {user?.role === 'applicant' && (
                <li>
                  <Link to="/applications">My Applications</Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="btn-link">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 