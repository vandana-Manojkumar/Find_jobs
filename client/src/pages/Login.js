import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { email, password } = formData;
  const { login, isAuthenticated, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
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
    
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    const success = await login({ email, password });
    
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-form-container">
          <h2>Login</h2>
          {formError && <div className="alert alert-danger">{formError}</div>}
          <form onSubmit={onSubmit}>
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
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="btn-primary btn-block">
              Login
            </button>
          </form>
          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 