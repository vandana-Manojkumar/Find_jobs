import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'applicant',
    companyName: '',
    bio: ''
  });
  
  const { name, email, password, confirmPassword, role, companyName, bio } = formData;
  const { register, isAuthenticated, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      navigate('/');
    }
    
    // Set form error from context if it exists
    if (error) {
      setFormError(error);
    }
  }, [isAuthenticated, navigate, error]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError(null); // Clear error on input change
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (role === 'employer' && !companyName) {
      setFormError('Company name is required for employers');
      return;
    }
    
    const userData = {
      name,
      email,
      password,
      role,
      companyName: role === 'employer' ? companyName : undefined,
      bio
    };
    
    const success = await register(userData);
    
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-form-container">
          <h2>Register</h2>
          {formError && <div className="alert alert-danger">{formError}</div>}
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Enter password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                placeholder="Confirm password"
                required
              />
            </div>
            <div className="form-group">
              <label>Account Type</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="applicant"
                    checked={role === 'applicant'}
                    onChange={onChange}
                  />
                  Applicant
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="employer"
                    checked={role === 'employer'}
                    onChange={onChange}
                  />
                  Employer
                </label>
              </div>
            </div>
            
            {role === 'employer' && (
              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={companyName}
                  onChange={onChange}
                  placeholder="Enter your company name"
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="bio">Bio (Optional)</label>
              <textarea
                id="bio"
                name="bio"
                value={bio}
                onChange={onChange}
                placeholder="Tell us about yourself or your company"
                rows="3"
              ></textarea>
            </div>
            
            <button type="submit" className="btn-primary btn-block">
              Register
            </button>
          </form>
          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 