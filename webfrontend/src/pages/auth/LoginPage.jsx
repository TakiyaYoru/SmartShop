import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '../../components/common/Logo';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Simulate API call
      // In a real app, this would be an actual API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login success (In production this would check with real backend)
      // Demo admin credentials
      if (username === 'admin' && password === 'password123') {
        const userData = {
          _id: 'admin1',
          username: 'admin',
          email: 'admin@smartshop.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin'
        };
        
        login('fake-jwt-token', userData);
        navigate(from, { replace: true });
      } 
      // Demo customer credentials
      else if (username === 'customer' && password === 'password123') {
        const userData = {
          _id: 'customer1',
          username: 'customer',
          email: 'customer@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'customer'
        };
        
        login('fake-jwt-token', userData);
        navigate(from, { replace: true });
      }
      else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="mb-6 flex justify-center">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
          Log in to your account
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="Enter your username"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <Link 
                to="/forgot-password" 
                className="text-blue-600 hover:text-blue-800"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full btn-primary py-2.5"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Register now
            </Link>
          </p>
          <div className="mt-4 text-xs text-gray-500">
            <p>Demo Accounts:</p>
            <p>Admin: username "admin", password "password123"</p>
            <p>Customer: username "customer", password "password123"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;