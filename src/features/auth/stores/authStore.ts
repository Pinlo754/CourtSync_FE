import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../../../types/user';
import { LoginRequest } from '../types';
import { loginUser } from '../../../api/auth/authApi';
import { jwtDecode } from 'jwt-decode';

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

                    const response = await loginUser(credentials);
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
                        throw new Error('Invalid response format: token not found');
                    }

                    try {
                        // Decode JWT to get user info
                        const decodedToken: any = jwtDecode(token);
                        console.log('Decoded token:', decodedToken); // Debug log

                        // Create user object from decoded token
                        user = {
                            userId: decodedToken.userId || decodedToken.id || decodedToken.sub || '',
                            email: decodedToken.email || '',
                            firstName: decodedToken.firstName || decodedToken.given_name || '',
                            lastName: decodedToken.lastName || decodedToken.family_name || '',
                            phoneNumber: decodedToken.phoneNumber || decodedToken.phone || '',
                            role: decodedToken.role || decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '',
                            userStatus: decodedToken.userStatus || 'Active',
                            balance: decodedToken.balance || 0
                        };
                    } catch (jwtError) {
                        console.error('JWT decode error:', jwtError);
                        // If JWT decode fails, create user from response data
                        const responseUser = response.user as any; // Type assertion for unknown properties
                        user = {
                            userId: responseUser?.id || '',
                            email: responseUser?.email || credentials.email,
                            firstName: responseUser?.firstName || '',
                            lastName: responseUser?.lastName || '',
                            phoneNumber: responseUser?.phone || responseUser?.phoneNumber || '',
                            role: responseUser?.role || '',
                            userStatus: 'Active',
                            balance: responseUser?.balance || 0
                        };
                    }

                    // Save to sessionStorage
                    sessionStorage.setItem('accessToken', JSON.stringify(response));
                    sessionStorage.setItem('loggedUser', JSON.stringify(user));

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
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('loggedUser');
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
                    const storedUser = sessionStorage.getItem('loggedUser');
                    const storedToken = sessionStorage.getItem('accessToken');

                    if (storedUser && storedToken) {
                        const user = JSON.parse(storedUser);
                        set({ user });
                    }
                } catch (error) {
                    console.error('Error initializing auth:', error);
                    // Clear invalid data
                    sessionStorage.removeItem('accessToken');
                    sessionStorage.removeItem('loggedUser');
                }
            }
        }),
        {
            name: 'auth-storage',
            // Only persist user data, not temporary states
            partialize: (state) => ({
                user: state.user
            }),
        }
    )
);

// Initialize auth on store creation
useAuthStore.getState().initializeAuth(); 