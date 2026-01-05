import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    gymnastics_type: '',
    gender: '',
    age: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.email, formData.password, formData.name, {
        gymnastics_type: formData.gymnastics_type,
        gender: formData.gender,
        age: formData.age
      });
      toast({
        title: "Account created",
        description: "Welcome to RAZE!"
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      toast({
        title: "Registration failed",
        description: err.message || "An error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join RAZE</p>
          </div>

          {/* Social Sign Up Buttons */}
          <div className="social-auth-buttons">
            {/* Google Sign Up Button */}
            <Button 
              type="button"
              onClick={handleGoogleLogin}
              className="social-auth-btn google-auth-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            {/* Apple Sign Up Button */}
            <Button 
              type="button"
              onClick={() => toast({ title: "Coming Soon", description: "Apple Sign-In will be available soon!" })}
              className="social-auth-btn apple-auth-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </Button>

            {/* Facebook Sign Up Button */}
            <Button 
              type="button"
              onClick={() => toast({ title: "Coming Soon", description: "Facebook Sign-In will be available soon!" })}
              className="social-auth-btn facebook-auth-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </Button>
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-field">
              <label htmlFor="name" className="form-label">Full Name</label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="gymnastics_type" className="form-label">Gymnastics Type</label>
              <select
                id="gymnastics_type"
                name="gymnastics_type"
                value={formData.gymnastics_type}
                onChange={handleChange}
                required
                className="form-input form-select"
              >
                <option value="">Select...</option>
                <option value="mag">MAG (Men's Artistic Gymnastics)</option>
                <option value="wag">WAG (Women's Artistic Gymnastics)</option>
                <option value="other">Other</option>
              </select>
            </div>

            {formData.gymnastics_type === 'other' && (
              <div className="form-field">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="form-input form-select"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="age" className="form-label">Age</label>
              <Input
                id="age"
                name="age"
                type="number"
                min="13"
                max="120"
                value={formData.age}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your age"
              />
            </div>

            <div className="form-field">
              <label htmlFor="email" className="form-label">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="password" className="form-label">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="At least 6 characters"
              />
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <Button 
              type="submit" 
              className="btn-primary btn-large"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="auth-footer">
            <p className="auth-link-text">
              Already have an account? <Link to="/login" className="auth-link">Log in</Link>
            </p>
          </div>

          <div className="auth-benefit">
            <p className="benefit-title">What you get:</p>
            <ul className="benefit-list">
              <li><strong>10 FREE RAZE Credits</strong> just for signing up!</li>
              <li>Earn 1 credit per $1 spent</li>
              <li>Order history and tracking</li>
              <li>Faster checkout</li>
              <li>Early access to drops</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
