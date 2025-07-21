import { useAuthStore } from "../stores/authStore";

export const useAuthContext = () => {
    return useAuthStore();
};