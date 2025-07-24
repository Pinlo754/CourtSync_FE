import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowLeft, ArrowRight, Shield, Clock } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { ErrorMessage } from '../../../components/ui/ErrorMessage';
import { SuccessMessage } from '../../../components/ui/SuccessMessage';
import { authService } from '../api/authService';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'email' | 'otp' | 'reset' | 'success';

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [countdown, setCountdown] = useState(0);

    const handleEmailSubmit = async () => {
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        // Real API implementation for email OTP
        try {
            await authService.forgotPasswordByEmail({ email });
            setIsLoading(false);
            setSuccess('OTP code has been sent to your email');
            setCurrentStep('otp');
            setCountdown(60);
            startCountdown();
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response?.data?.message || 'An error occurred while sending email. Please try again.');
        }
    };

    const startCountdown = () => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpSubmit = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter the complete 6-digit OTP code');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        // Real API implementation for email OTP verification
        try {
            await authService.verifyOTP({
                email,
                otp: otpCode,
                newPassword: '', // Required by API but not used in verify step
                confirmPassword: ''
            });
            setIsLoading(false);
            setSuccess('OTP code is valid');
            setCurrentStep('reset');
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response?.data?.message || 'Invalid or expired OTP code');
        }
    };

    const handlePasswordReset = async () => {
        if (!newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const otpCode = otp.join('');
            await authService.resetPasswordByOTP({
                email,
                otp: otpCode,
                newPassword,
                confirmPassword
            });
            setIsLoading(false);
            setSuccess('Password reset successfully');
            setCurrentStep('success');
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response?.data?.message || 'An error occurred while resetting password. Please try again.');
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;

        setIsLoading(true);
        setError('');
        setSuccess('');

        // Real API implementation for resending email OTP
        try {
            await authService.forgotPasswordByEmail({ email });
            setIsLoading(false);
            setSuccess('New OTP code has been sent');
            setCountdown(60);
            startCountdown();
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response?.data?.message || 'An error occurred while resending OTP code');
        }
    };

    const resetModal = () => {
        setCurrentStep('email');
        setEmail('');
        setOtp(['', '', '', '', '', '']);
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
        setCountdown(0);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    const renderEmailStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
        >
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Enter Your Email</h3>
                <p className="text-slate-300 text-sm">
                    We'll send you a 6-digit verification code
                </p>
            </div>

            <ErrorMessage message={error} show={!!error} />
            <SuccessMessage message={success} show={!!success} />

            <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                label="Email Address"
                icon={Mail}
            />

            <Button
                onClick={handleEmailSubmit}
                loading={isLoading}
                icon={ArrowRight}
            >
                Send OTP
            </Button>
        </motion.div>
    );

    const renderOtpStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
        >
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Enter Verification Code</h3>
                <p className="text-slate-300 text-sm">
                    We've sent a 6-digit code to{' '}
                    <span className="text-mint-400">
                        {email}
                    </span>
                    {' via email'}
                </p>
            </div>

            <ErrorMessage message={error} show={!!error} />
            <SuccessMessage message={success} show={!!success} />

            <div className="flex justify-center space-x-2 mb-4">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-12 text-center text-xl font-bold bg-slate-800/50 border-2 border-slate-700/50 rounded-xl focus:border-mint-500 focus:outline-none transition-all duration-300 text-white"
                    />
                ))}
            </div>

            <div className="text-center">
                {countdown > 0 ? (
                    <p className="text-slate-400 text-sm flex items-center justify-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Resend code in {countdown}s</span>
                    </p>
                ) : (
                    <button
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-mint-400 hover:text-mint-300 text-sm hover:underline transition-colors disabled:opacity-50"
                    >
                        Resend verification code
                    </button>
                )}
            </div>

            <div className="flex space-x-3">
                <Button
                    variant="secondary"
                    onClick={() => setCurrentStep('email')}
                    icon={ArrowLeft}
                    className="flex-1"
                >
                    Back
                </Button>
                <Button
                    onClick={handleOtpSubmit}
                    loading={isLoading}
                    icon={ArrowRight}
                    className="flex-1"
                >
                    Verify Code
                </Button>
            </div>
        </motion.div>
    );

    const renderResetStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
        >
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Create New Password</h3>
                <p className="text-slate-300 text-sm">Enter your new password below</p>
            </div>

            <ErrorMessage message={error} show={!!error} />
            <SuccessMessage message={success} show={!!success} />

            <div className="space-y-3">
                <Input
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    label="New Password"
                    icon={Shield}
                />

                <Input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    label="Confirm Password"
                    icon={Shield}
                />
            </div>

            <div className="text-xs text-slate-400 space-y-1">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>6-12 characters long</li>
                    <li>At least 1 lowercase, uppercase, number, special character</li>
                </ul>
            </div>

            <Button
                onClick={handlePasswordReset}
                loading={isLoading}
                icon={ArrowRight}
            >
                Reset Password
            </Button>
        </motion.div>
    );

    const renderSuccessStep = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-4"
        >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                >
                    <Shield className="w-8 h-8 text-green-400" />
                </motion.div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
                Password Reset Successfully!
            </h3>

            <p className="text-slate-300 text-sm mb-6">
                Your password has been reset successfully. You can now sign in with your new password.
            </p>

            <Button onClick={handleClose}>
                Sign In Now
            </Button>
        </motion.div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="w-6"></div>
                    <h2 className="text-lg font-semibold text-white">Forgot Password</h2>
                    <button
                        onClick={handleClose}
                        className="w-6 h-6 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {currentStep === 'email' && renderEmailStep()}
                    {currentStep === 'otp' && renderOtpStep()}
                    {currentStep === 'reset' && renderResetStep()}
                    {currentStep === 'success' && renderSuccessStep()}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};