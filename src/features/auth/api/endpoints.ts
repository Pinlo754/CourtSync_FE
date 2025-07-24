/**
 * Authentication API endpoints
 */

export const AUTH_ENDPOINTS = {
    AUTH: {
        LOGIN: '/Users/Login',
        LOGOUT: '/Users/Logout',
        CURRENT_USER: '/Users/Me',
        REGISTER: '/Users/MemberRegister',
    },
    REGISTRATION: {
        SEND_OTP: '/Users/SendRegistrationOTP',
        VERIFY_OTP: '/Users/VerifyRegistrationOTP',
    },
    PASSWORD_RESET: {
        REQUEST_RESET: '/Users/ForgotPasswordByOTPEmail',
        VERIFY_OTP: '/Users/VerifyOTP',
        RESET_PASSWORD: '/Users/ResetPasswordByOTPEmail',
    }
}; 