import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) throw new Error('useAuthContext context must be use inside AuthProvider');

    return context;
};