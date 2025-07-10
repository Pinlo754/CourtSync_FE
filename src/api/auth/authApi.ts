import axiosInstance from "../axiosInstance";
import {
    LoginRequest,
    LoginResponse,
    SignUpRequest,
    SignUpResponse
} from "../../features/auth/types";

// Auth API functions
export const loginUser = (credentials: LoginRequest): Promise<LoginResponse> =>
    axiosInstance.post('/Users/Login', credentials).then((res) => res.data);

export const signUpUser = (userData: SignUpRequest): Promise<SignUpResponse> =>
    axiosInstance.post('/Users/MemberRegister', userData).then((res) => res.data);

export const logoutUser = (): Promise<void> =>
    axiosInstance.post('/Users/Logout').then((res) => res.data);

export const getCurrentUser = (): Promise<LoginResponse['user']> =>
    axiosInstance.get('/Users/Me').then((res) => res.data); 