import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../../../types/user';
import { LoginRequest } from '../types';
import { authService } from '../api/authService';
import { jwtDecode } from 'jwt-decode';
import { saveAuthToken, saveUser, getUser, clearAuthData } from '../utils/storage';

interface AuthState {
    user: User | null;
    loginMessage: string | null;
    success: boolean;
    isLoading: boolean;
}

interface AuthActions {
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    setUser: (user: User | null) => void;
    setLoginMessage: (message: string | null) => void;
    setSuccess: (success: boolean) => void;
    setLoading: (loading: boolean) => void;
    initializeAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            // State
            user: null,
            loginMessage: null,
            success: false,
            isLoading: false,

            // Actions
            login: async (credentials: LoginRequest) => {
                try {
                    set({ isLoading: true, loginMessage: null, success: false });

                    const response = await authService.login(credentials);
                    console.log('Login response:', response); // Debug log

                    // Handle different response structures
                    let token: string = '';
                    let user: User;

                    if (typeof response === 'string') {
                        // Response is directly the token string
                        token = response;
                    } else if (response && typeof response.token === 'string') {
                        // Response has token property
                        token = response.token;
                    } else {
                        // Assume the entire response is the token
                        token = response as any;
                    }

                    try {
                        // Decode JWT to get user info
                        const decodedToken: any = jwtDecode(token);
                        console.log('Decoded token:', decodedToken); // Debug log

                        // Create user object from decoded token
                        user = {
                            userId: decodedToken.UserID || '',
                            email: decodedToken.email || '',
                            firstName:  decodedToken.FirstName  || '',
                            lastName: decodedToken.lastName || '',
                            phoneNumber: decodedToken.phoneNumber || '',
                            role: decodedToken.role || '',
                            userStatus: decodedToken.userStatus || '',
                            balance: decodedToken.balance || 0
                        };
                    } catch (jwtError) {
                        console.error('JWT decode error:', jwtError);
                        // If JWT decode fails, use email from credentials
                        user = {
                            userId: '',
                            email: '',
                            firstName: '',
                            lastName: '',
                            phoneNumber: '',
                            role: '',
                            userStatus: '',
                            balance: 0
                        };
                    }

                    // Save to sessionStorage using utility functions
                    saveAuthToken(token);
                    saveUser(user);

                    set({
                        user,
                        success: true,
                        loginMessage: 'Đăng nhập thành công!',
                        isLoading: false
                    });
                } catch (error: any) {
                    console.error('Login error:', error);
                    set({
                        loginMessage: error.response?.data?.message || 'Đăng nhập thất bại',
                        success: false,
                        isLoading: false
                    });
                    throw error;
                }
            },

            logout: () => {
                // Clear auth data using utility function
                clearAuthData();
                set({
                    user: null,
                    loginMessage: null,
                    success: false,
                    isLoading: false
                });
            },

            setUser: (user: User | null) => set({ user }),

            setLoginMessage: (message: string | null) => set({ loginMessage: message }),

            setSuccess: (success: boolean) => set({ success }),

            setLoading: (loading: boolean) => set({ isLoading: loading }),

            initializeAuth: () => {
                try {
                    const user = getUser();
                    if (user) {
                        set({ user });
                    }
                } catch (error) {
                    console.error('Error initializing auth:', error);
                    // Clear invalid data
                    clearAuthData();
                }
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user
            })
        }
    )
);

// Initialize auth on store creation
useAuthStore.getState().initializeAuth(); 