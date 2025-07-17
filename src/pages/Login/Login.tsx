import type React from "react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import login from "../../assets/login.webp";
import { ToastContainer } from "react-toastify";
import useLogin from "./useLogin";
export default function LoginPage() {
  const {
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
  } = useLogin();

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#16C875] to-[#6CDFAB] flex items-center justify-center p-4">
      <ToastContainer />
      <div className="flex">
        <img
          src={login}
          alt="CourtSync Logo"
          className="mx-auto h-[500px] w-auto rounded-l-lg rounded-r-none shadow-lg hidden md:block"
        />
        <Card className="w-full max-w-md h-[500px] rounded-r-lg rounded-l-none shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your CourtSync account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2 text-white">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 text-white placeholder-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 text-white pb-16">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 text-white placeholder-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-white hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full border hover:bg-green-400"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-gray-600">{"Don't have an account? "}</span>
              <a
                href="register"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign up
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
