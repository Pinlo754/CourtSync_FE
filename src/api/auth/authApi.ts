import axiosInstance from "../axiosInstance";
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
} from "../../features/auth/types";

// Auth API functions
export const loginUser = (credentials: LoginRequest): Promise<LoginResponse> =>
    axiosInstance.post('/Users/Login', credentials).then((res) => res.data);

export const signUpUser = (userData: SignUpRequest): Promise<SignUpResponse> =>
    axiosInstance.post('/Users/MemberRegister', userData).then((res) => res.data);

// Registration OTP API functions
export const sendRegistrationOTP = (userData: SendRegistrationOTPRequest): Promise<SendRegistrationOTPResponse> =>
    axiosInstance.post('/Users/SendRegistrationOTP', userData).then((res) => res.data);

export const verifyRegistrationOTP = (verifyData: VerifyRegistrationOTPRequest): Promise<VerifyRegistrationOTPResponse> =>
    axiosInstance.post('/Users/VerifyRegistrationOTP', verifyData).then((res) => res.data);

export const logoutUser = (): Promise<void> =>
    axiosInstance.post('/Users/Logout').then((res) => res.data);

export const getCurrentUser = (): Promise<LoginResponse['user']> =>
    axiosInstance.get('/Users/Me').then((res) => res.data);

// Reset Password API functions (Email)
export const forgotPasswordByEmail = (request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> =>
    axiosInstance.post('/Users/ForgotPasswordByOTPEmail', request).then((res) => res.data);

export const verifyOTP = (request: VerifyOTPRequest): Promise<VerifyOTPResponse> =>
    axiosInstance.post('/Users/VerifyOTP', request).then((res) => res.data);

export const resetPasswordByOTP = (request: ResetPasswordByOTPRequest): Promise<ResetPasswordResponse> =>
    axiosInstance.post('/Users/ResetPasswordByOTPEmail', request).then((res) => res.data);

// User balance API function
export const getUserBalance = (): Promise<number> =>
    axiosInstance.get('/Users/GetUserBalance').then((res) => res.data); 