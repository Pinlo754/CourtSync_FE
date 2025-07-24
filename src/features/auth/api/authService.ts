import axiosInstance from "../../../api/axiosInstance";
import {
    LoginRequest,
    LoginResponse,
    SignUpRequest,
    SignUpResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    VerifyOTPRequest,
    VerifyOTPResponse,
    ResetPasswordByOTPRequest,
    ResetPasswordResponse,
    SendRegistrationOTPRequest,
    SendRegistrationOTPResponse,
    VerifyRegistrationOTPRequest,
    VerifyRegistrationOTPResponse
} from "../types";
import { AUTH_ENDPOINTS } from "./endpoints";

/**
 * Authentication service
 * Contains all API calls related to authentication
 */
export const authService = {
    // Authentication
    login: (credentials: LoginRequest): Promise<LoginResponse> =>
        axiosInstance.post(AUTH_ENDPOINTS.AUTH.LOGIN, credentials).then((res) => res.data),
    
    logout: (): Promise<void> =>
        axiosInstance.post(AUTH_ENDPOINTS.AUTH.LOGOUT).then((res) => res.data),
    
    getCurrentUser: (): Promise<LoginResponse['user']> =>
        axiosInstance.get(AUTH_ENDPOINTS.AUTH.CURRENT_USER).then((res) => res.data),
    
    register: (userData: SignUpRequest): Promise<SignUpResponse> =>
        axiosInstance.post(AUTH_ENDPOINTS.AUTH.REGISTER, userData).then((res) => res.data),

    // Registration OTP
    sendRegistrationOTP: (userData: SendRegistrationOTPRequest): Promise<SendRegistrationOTPResponse> =>
        axiosInstance.post(AUTH_ENDPOINTS.REGISTRATION.SEND_OTP, userData).then((res) => res.data),

    verifyRegistrationOTP: (verifyData: VerifyRegistrationOTPRequest): Promise<VerifyRegistrationOTPResponse> =>
        axiosInstance.post(AUTH_ENDPOINTS.REGISTRATION.VERIFY_OTP, verifyData).then((res) => res.data),

    // Password Reset
    forgotPasswordByEmail: (request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> =>
        axiosInstance.post(AUTH_ENDPOINTS.PASSWORD_RESET.REQUEST_RESET, request).then((res) => res.data),

    verifyOTP: (request: VerifyOTPRequest): Promise<VerifyOTPResponse> =>
        axiosInstance.post(AUTH_ENDPOINTS.PASSWORD_RESET.VERIFY_OTP, request).then((res) => res.data),

    resetPasswordByOTP: (request: ResetPasswordByOTPRequest): Promise<ResetPasswordResponse> =>
        axiosInstance.post(AUTH_ENDPOINTS.PASSWORD_RESET.RESET_PASSWORD, request).then((res) => res.data),
};

// For backward compatibility
export const loginUser = authService.login;
export const signUpUser = authService.register;
export const logoutUser = authService.logout;
export const getCurrentUser = authService.getCurrentUser;
export const sendRegistrationOTP = authService.sendRegistrationOTP;
export const verifyRegistrationOTP = authService.verifyRegistrationOTP;
export const forgotPasswordByEmail = authService.forgotPasswordByEmail;
export const verifyOTP = authService.verifyOTP;
export const resetPasswordByOTP = authService.resetPasswordByOTP;
