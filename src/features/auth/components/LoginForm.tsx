import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { PasswordInput } from '../../../components/ui/PasswordInput';
import { Button } from '../../../components/ui/Button';
import { ErrorMessage } from '../../../components/ui/ErrorMessage';
import { AuthToggle } from './AuthToggle';
import { SignUpFields } from './SignUpFields';
import { LoginRequest, SignUpRequest } from '../types';
import { loginUser } from '../../../api/auth/authApi';
import { Navigate, useNavigate } from 'react-router-dom';

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export const LoginForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({

    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validation
      if (!formData.email || !formData.password) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      if (isSignUp) {
        if (!formData.firstName || !formData.lastName) {
          setError('Please fill in all required fields');
          setIsLoading(false);
          return;
        }
        // TODO: Implement signup API call
        setError('Signup functionality will be implemented later');
        setIsLoading(false);
        return;
      }

      // Login API call
      const credentials: LoginRequest = {
        email: formData.email,
        password: formData.password
      };

      const response = await loginUser(credentials);

      // Store user data and token
      localStorage.setItem('loggedUser', JSON.stringify(response));

      // Handle successful login
      console.log('Login successful:', response);
      // TODO: Redirect to dashboard or update app state
      navigate('/');

    } catch (error: any) {
      console.error('Login error:', error);

      if (error.response?.status === 401) {
        setError('Invalid email or password');
      } else if (error.response?.status === 400) {
        setError('Please check your input');
      } else if (error.message?.includes('Network Error')) {
        setError('Unable to connect to server. Please try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-sm flex items-center justify-center"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
    >
      <div className="w-full">
        {/* Form Container */}
        <motion.div
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl shadow-black/20 max-h-[85vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Form Header */}
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h3 className="text-xl font-bold text-white mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h3>
            <p className="text-slate-300 text-sm">
              {isSignUp ? 'Join CourtSync to book your courts' : 'Access your account'}
            </p>
          </motion.div>

          {/* Toggle Buttons */}
          <AuthToggle isSignUp={isSignUp} onToggle={setIsSignUp} />

          {/* Error Message */}
          <ErrorMessage message={error} show={!!error} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Sign Up Fields */}
            <SignUpFields
              isSignUp={isSignUp}
              formData={formData}
              onChange={handleInputChange}
            />

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: isSignUp ? 1.1 : 0.9 }}
            >
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                label="Email Address"
                icon={Mail}
              />
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: isSignUp ? 1.2 : 1.0 }}
            >
              <PasswordInput
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                label="Password"
              />
            </motion.div>

            {/* Forgot Password (Sign In Only) */}
            {!isSignUp && (
              <motion.div
                className="text-right"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.1 }}
              >
                <a
                  href="#"
                  className="text-xs text-mint-400 hover:text-mint-300 transition-colors hover:underline"
                >
                  Forgot password?
                </a>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: isSignUp ? 1.3 : 1.2 }}
            >
              <Button
                type="submit"
                loading={isLoading}
                icon={ArrowRight}
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </motion.div>
          </form>

          {/* Footer Links */}
          <motion.div
            className="mt-4 text-center space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: isSignUp ? 1.4 : 1.3 }}
          >
            <p className="text-slate-400 text-xs">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-mint-400 hover:text-mint-300 transition-colors font-medium text-xs hover:underline"
            >
              {isSignUp ? 'Sign in here' : 'Create an account'}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};