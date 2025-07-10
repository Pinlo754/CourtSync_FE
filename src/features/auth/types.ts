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

// Legacy alias - để backward compatibility
export interface LoginUserDTO extends LoginRequest { }