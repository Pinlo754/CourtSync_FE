import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { PasswordInput } from '../../../components/ui/PasswordInput';
import { Button } from '../../../components/ui/Button';
import { ErrorMessage } from '../../../components/ui/ErrorMessage';
import { SuccessMessage } from '../../../components/ui/SuccessMessage';
import { AuthToggle } from './AuthToggle';
import { SignUpFields } from './SignUpFields';
import { LoginRequest, SignUpRequest } from '../types';
import { signUpUser } from '../../../api/auth/authApi';
import { Navigate, useNavigate } from 'react-router-dom';
import { ForgotPasswordModal } from './ForgetPasswordModal';
import { useAuthContext } from '../hooks/useAuthContext';
import { UserRole } from '../../../types/role';

export const LoginForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Sử dụng Zustand store
  const { login, isLoading, loginMessage, success: authSuccess } = useAuthContext();
  const [loginData, setLoginData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [signupData, setSignupData] = useState<SignUpRequest>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSignUp) {
      setSignupData({
        ...signupData,
        [e.target.name]: e.target.value
      });
    } else {
      setLoginData({
        ...loginData,
        [e.target.name]: e.target.value
      });
    }
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };


  const validateForm = (): boolean => {
    const currentData = isSignUp ? signupData : loginData;
    if (!currentData.email || !currentData.password) {
      setError('Please fill in all required fields');
      return false;
    }
    if (isSignUp && (!signupData.firstName || !signupData.lastName)) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleLogin = async (): Promise<void> => {
    await login(loginData);
    const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser') || '{}');
    switch (loggedUser?.role) {
      case String(UserRole.FACILITY_STAFF):
        navigate('/staff');
        return;
      case String(UserRole.FACILITY_OWNER):
        navigate('/facility-management');
        return;
      case String(UserRole.ADMIN):
        navigate('/admin');
        return;
      case String(UserRole.CUSTOMER):
        navigate('/');
        return;
      default:
        navigate('/');
        return;
    }
  };

  const handleSignup = async (): Promise<void> => {
    const response = await signUpUser(signupData);
    setSuccessMessage('Account created successfully! Please sign in with your credentials.');
    setSignupData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: ''
    });
    // Chuyển về form login sau 2 giây
    setTimeout(() => {
      setIsSignUp(false);
    }, 2000);
  };

  const handleError = (error: any): void => {
    console.error('Auth error:', error);

    if (error.response?.status === 400) {
      const data = error.response.data;

      if (data?.errors && typeof data.errors === 'object') {
        // Lấy lỗi đầu tiên từ object errors
        const errorValues = Object.values(data.errors);

        if (errorValues.length > 0 && Array.isArray(errorValues[1])) {
          setError(errorValues[1][0]);
        } else {
          setError('Invalid input'); // fallback
        }
      } else if (data?.message) {
        // Trường hợp backend trả về message riêng
        setError(data.message);
      } else {
        setError('Invalid request');
      }
    } else if (error.message?.includes('Network Error')) {
      setError('Unable to connect to server. Please try again later.');
    } else {
      setError(isSignUp ? 'Signup failed. Please try again.' : 'Login failed. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      if (!validateForm()) {
        return;
      }

      if (isSignUp) {
        await handleSignup();
      } else {
        await handleLogin();
      }
    } catch (error: any) {
      handleError(error);
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
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl shadow-black/20 max-h-[95vh] overflow-y-auto"
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
          <AuthToggle isSignUp={isSignUp} onToggle={(value) => {
            setIsSignUp(value);
            setError('');
            setSuccessMessage('');
          }} />

          {/* Error Message */}
          <ErrorMessage message={error} show={!!error} />

          {/* Success Message */}
          <SuccessMessage message={successMessage} show={!!successMessage} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Sign Up Fields */}
            <SignUpFields
              isSignUp={isSignUp}
              formData={signupData}
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
                value={isSignUp ? signupData.email : loginData.email}
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
                value={isSignUp ? signupData.password : loginData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                label="Password"
              />
            </motion.div>
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <PasswordInput
                  name="confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  label="Confirm Password"
                />
              </motion.div>
            )}

            {/* Forgot Password (Sign In Only) */}
            {!isSignUp && (
              <motion.div
                className="text-right"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <a
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-mint-400 hover:text-mint-300 transition-colors hover:cursor-pointer underline"
                >
                  Forgot password?
                </a>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: isSignUp ? 1.4 : 1.2 }}
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
            transition={{ duration: 0.4, delay: isSignUp ? 1.5 : 1.3 }}
          >
            <p className="text-slate-400 text-xs">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuccessMessage('');
              }}
              className="text-mint-400 hover:text-mint-300 transition-colors font-medium text-xs hover:underline"
            >
              {isSignUp ? 'Sign in here' : 'Create an account'}
            </button>
          </motion.div>
        </motion.div>
        <ForgotPasswordModal
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />      </div>
    </motion.div>
  );
};