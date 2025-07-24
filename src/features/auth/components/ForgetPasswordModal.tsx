import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowLeft, ArrowRight, Shield, Clock } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { ErrorMessage } from '../../../components/ui/ErrorMessage';
import { SuccessMessage } from '../../../components/ui/SuccessMessage';
import {
    forgotPasswordByEmail,
    verifyOTP,
    resetPasswordByOTP
} from '../../../api/auth/authApi';

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
            setError('Vui lòng nhập địa chỉ email của bạn');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Vui lòng nhập địa chỉ email hợp lệ');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        // Real API implementation for email OTP
        try {
            await forgotPasswordByEmail({ email });
            setIsLoading(false);
            setSuccess('Mã OTP đã được gửi đến email của bạn');
            setCurrentStep('otp');
            setCountdown(60);
            startCountdown();
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response?.data?.message || 'Đã xảy ra lỗi khi gửi email. Vui lòng thử lại.');
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
            setError('Vui lòng nhập đầy đủ mã OTP 6 chữ số');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        // Real API implementation for email OTP verification
        try {
            await verifyOTP({
                email,
                otp: otpCode,
                newPassword: '', // Required by API but not used in verify step
                confirmPassword: ''
            });
            setIsLoading(false);
            setSuccess('Mã OTP hợp lệ');
            setCurrentStep('reset');
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn');
        }
    };

    const handlePasswordReset = async () => {
        if (!newPassword || !confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const otpCode = otp.join('');
            await resetPasswordByOTP({
                email,
                otp: otpCode,
                newPassword,
                confirmPassword
            });
            setIsLoading(false);
            setSuccess('Đặt lại mật khẩu thành công');
            setCurrentStep('success');
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response?.data?.message || 'Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại.');
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;

        setIsLoading(true);
        setError('');
        setSuccess('');

        // Real API implementation for resending email OTP
        try {
            await forgotPasswordByEmail({ email });
            setIsLoading(false);
            setSuccess('Mã OTP mới đã được gửi');
            setCountdown(60);
            startCountdown();
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response?.data?.message || 'Đã xảy ra lỗi khi gửi lại mã OTP');
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
                <h3 className="text-xl font-bold text-white mb-2">Nhập Email Của Bạn</h3>
                <p className="text-slate-300 text-sm">
                    Chúng tôi sẽ gửi cho bạn mã xác minh 6 chữ số
                </p>
            </div>

            <ErrorMessage message={error} show={!!error} />
            <SuccessMessage message={success} show={!!success} />

            <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập địa chỉ email của bạn"
                label="Địa chỉ Email"
                icon={Mail}
            />

            <Button
                onClick={handleEmailSubmit}
                loading={isLoading}
                icon={ArrowRight}
                className="w-full"
            >
                Gửi Mã OTP
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
                <h3 className="text-xl font-bold text-white mb-2">Nhập Mã Xác Minh</h3>
                <p className="text-slate-300 text-sm">
                    Chúng tôi đã gửi mã 6 chữ số đến{' '}
                    <span className="text-mint-400">
                        {email}
                    </span>
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
                        <span>Gửi lại mã sau {countdown}s</span>
                    </p>
                ) : (
                    <button
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-mint-400 hover:text-mint-300 text-sm hover:underline transition-colors disabled:opacity-50"
                    >
                        Gửi lại mã xác minh
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
                    Quay lại
                </Button>
                <Button
                    onClick={handleOtpSubmit}
                    loading={isLoading}
                    icon={ArrowRight}
                    className="flex-1"
                >
                    Xác minh
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
                <h3 className="text-xl font-bold text-white mb-2">Tạo Mật Khẩu Mới</h3>
                <p className="text-slate-300 text-sm">Nhập mật khẩu mới của bạn</p>
            </div>

            <ErrorMessage message={error} show={!!error} />
            <SuccessMessage message={success} show={!!success} />

            <div className="space-y-3">
                <Input
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    label="Mật khẩu mới"
                    icon={Shield}
                />

                <Input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu mới"
                    label="Xác nhận mật khẩu"
                    icon={Shield}
                />
            </div>

            <div className="text-xs text-slate-400 space-y-1">
                <p>Yêu cầu mật khẩu:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>6-12 ký tự</li>
                    <li>Ít nhất 1 chữ thường, chữ hoa, số, ký tự đặc biệt</li>
                </ul>
            </div>

            <div className="flex space-x-3">
                <Button
                    variant="secondary"
                    onClick={() => setCurrentStep('otp')}
                    icon={ArrowLeft}
                    className="flex-1"
                >
                    Quay lại
                </Button>
                <Button
                    onClick={handlePasswordReset}
                    loading={isLoading}
                    icon={ArrowRight}
                    className="flex-1"
                >
                    Đặt lại mật khẩu
                </Button>
            </div>
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
                Đặt Lại Mật Khẩu Thành Công!
            </h3>

            <p className="text-slate-300 text-sm mb-6">
                Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập bằng mật khẩu mới.
            </p>

            <Button onClick={handleClose}>
                Đăng Nhập Ngay
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
                    <h2 className="text-lg font-semibold text-white">Quên Mật Khẩu</h2>
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