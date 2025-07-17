import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async () => {    
    try {
      setLoading(true);
      const response = await axios.post("/api/account/login", {
        email: email,
        password: password,
      });
      setLoading(false);
      const data = response.data;

      if (!data?.token) {
        throw new Error("Failed to login");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", response.data.role[0]);
      console.log("role:" + response.data.role[0]);

      if (response.data.role[0] === "User") navigate("/main");
      else if (response.data.role[0] === "Admin") navigate("/Admin");
      else navigate("/staff/main");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };
  return {
    navigate,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    toast,
    handleLogin,
    loading,
    setLoading,
  };
};

export default useLogin;
