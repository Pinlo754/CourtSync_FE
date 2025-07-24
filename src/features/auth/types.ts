import { User } from "../../types/user";

export interface AuthContextType {
  user: User | null;
  login: (user: LoginRequest) => void;
  logout: () => void;
  loginMessage: string | null;
  success: boolean;
}

// Auth API Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
}

// Registration OTP Types
export interface SendRegistrationOTPRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface SendRegistrationOTPResponse {
  message: string;
}

export interface VerifyRegistrationOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyRegistrationOTPResponse {
  message: string;
}

// Reset Password Types
export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordByOTPRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

// Auth API Response Types
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface SignUpResponse {
  token: string;
  user: User;
}

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

export interface VerifyOTPResponse {
  message: string;
  success: boolean;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

// Legacy alias - để backward compatibility
export interface LoginUserDTO extends LoginRequest { }