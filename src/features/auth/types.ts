import { User } from "../../types/user";

export interface AuthContextType {
    user: User | null;
    login: (user: LoginUserDTO) => void;
    logout: () => void;
    loginMessage: string | null;
    success: boolean;
  }

export interface LoginUserDTO {
    email: string;
    password: string;
}