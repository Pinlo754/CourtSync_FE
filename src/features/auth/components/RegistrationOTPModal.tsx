import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowLeft, ArrowRight, Shield, Clock } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { ErrorMessage } from '../../../components/ui/ErrorMessage';
import { SuccessMessage } from '../../../components/ui/SuccessMessage';
import {
    SendRegistrationOTPRequest,
    VerifyRegistrationOTPRequest,
    SendRegistrationOTPResponse
} from '../types';
import { authService } from '../api/authService';

interface RegistrationOTPModalProps {
    isOpen: boolean;
    onClose: () => void;
    registrationData: SendRegistrationOTPRequest;
    onVerificationSuccess: () => void;
}

type Step = 'otp' | 'success';

export const RegistrationOTPModal: React.FC<RegistrationOTPModalProps> = ({ 
    isOpen, 
    onClose, 
    registrationData,
    onVerificationSuccess
}) => {
    const [currentStep, setCurrentStep] = useState<Step>('otp');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [countdown, setCountdown] = useState(60);

    // Start countdown when component mounts
    React.useEffect(() => {
        if (isOpen) {
            startCountdown();
            
            // Simulate the loading of OTP being sent
            const timer = setTimeout(() => {
                setInitialLoading(false);
                setSuccess('OTP code has been sent to your email');
                
                // Focus the first OTP input after a small delay
                setTimeout(() => {
                    const firstInput = document.getElementById('reg-otp-0');
                    firstInput?.focus();
                }, 100);
            }, 800);
            
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const startCountdown = () => {
        setCountdown(60);
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
        // Only allow numeric input
        if (!/^\d*$/.test(value)) return;
        
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`reg-otp-${index + 1}`);
            nextInput?.focus();
        } 
        // If this is the last input and a value was entered, submit the OTP
        else if (value && index === 5) {
            // Check if all inputs are filled
            const isComplete = newOtp.every(digit => digit !== '');
            if (isComplete) {
                // Small delay to allow state update and visual feedback
                setTimeout(() => {
                    handleOtpSubmit();
                }, 300);
            }
        }
    };

    // Handle paste event for OTP inputs
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        
        // Check if pasted content is a 6-digit number
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split('');
            setOtp(digits);
            
            // Focus the last input
            const lastInput = document.getElementById(`reg-otp-5`);
            lastInput?.focus();
            
            // Auto-submit after a short delay
            setTimeout(() => {
                handleOtpSubmit();
            }, 500);
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

        try {
            await authService.verifyRegistrationOTP({
                email: registrationData.email,
                otp: otpCode
            });
            
            setIsLoading(false);
            setSuccess('Email verified successfully. Your account is now active.');
            setCurrentStep('success');
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response?.data?.message || 'Invalid or expired OTP code');
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            await authService.sendRegistrationOTP(registrationData);
            setIsLoading(false);
            setSuccess('New OTP code has been sent');
            startCountdown();
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response?.data?.message || 'An error occurred while resending OTP code');
        }
    };

    const resetModal = () => {
        setOtp(['', '', '', '', '', '']);
        setError('');
        setSuccess('');
        setCountdown(60);
        setInitialLoading(true);
    };

    const handleClose = () => {
        if (currentStep === 'success') {
            onVerificationSuccess();
        }
        resetModal();
        onClose();
    };

    const renderOtpStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
        >
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Verify Your Email</h3>
                <p className="text-slate-300 text-sm">
                    {initialLoading ? 'Sending verification code to your email...' : 
                    `We've sent a 6-digit code to ${registrationData.email}`}
                </p>
            </div>

            <ErrorMessage message={error} show={!!error} />
            <SuccessMessage message={success} show={!!success} />

            {initialLoading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mint-500"></div>
                </div>
            ) : (
                <>
                    <div className="flex justify-center space-x-2 mb-4">
                        {otp.map((digit, index) => (
                            <motion.input
                                key={index}
                                id={`reg-otp-${index}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => {
                                    // Handle backspace to go to previous input
                                    if (e.key === 'Backspace' && !digit && index > 0) {
                                        const prevInput = document.getElementById(`reg-otp-${index - 1}`);
                                        prevInput?.focus();
                                    }
                                }}
                                onPaste={index === 0 ? handlePaste : undefined}
                                className="w-12 h-12 text-center text-xl font-bold bg-slate-800/50 border-2 border-slate-700/50 rounded-xl focus:border-mint-500 focus:outline-none transition-all duration-300 text-white"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 * index }}
                            />
                        ))}
                    </div>
                    
                    <motion.p 
                        className="text-center text-xs text-slate-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        You can paste the entire 6-digit code into the first box
                    </motion.p>

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

                    <Button
                        onClick={handleOtpSubmit}
                        loading={isLoading}
                        icon={ArrowRight}
                    >
                        Verify Email
                    </Button>
                </>
            )}
        </motion.div>
    );

    const renderSuccessStep = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-4"
        >
            <motion.div 
                className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                >
                    <Shield className="w-8 h-8 text-green-400" />
                </motion.div>
            </motion.div>

            <motion.h3 
                className="text-xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                Account Activated!
            </motion.h3>

            <motion.p 
                className="text-slate-300 text-sm mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                Your email has been verified and your account is now active. You can now sign in with your credentials.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Button onClick={handleClose}>
                    Sign In Now
                </Button>
            </motion.div>
        </motion.div>
    );

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={(e) => {
                // Close modal when clicking outside
                if (e.target === e.currentTarget) {
                    handleClose();
                }
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="w-6"></div>
                    <h2 className="text-lg font-semibold text-white">Email Verification</h2>
                    <button
                        onClick={handleClose}
                        className="w-6 h-6 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {currentStep === 'otp' && renderOtpStep()}
                    {currentStep === 'success' && renderSuccessStep()}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}; 