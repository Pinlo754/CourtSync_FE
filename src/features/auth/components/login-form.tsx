import { useState, useRef, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Skeleton } from "../../../components/ui/skeleton";
import { Eye, EyeOff } from "lucide-react";
import { LoginUserDTO } from "../types";
import { EvervaultCard } from "../../../components/ui/evervault-card";
import { useAuthContext } from "../hooks/useAuthContext";

interface LoginFormProps {
  onSubmit: (data: LoginUserDTO) => void;
  isLoading?: boolean;
}

export const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loginMessage, setErrorMessage] = useState("");
  const AuthContext = useAuthContext();

  useEffect(() => {
    if (isFocused && passwordRef.current) {
      passwordRef.current.focus();
    }
  }, [isFocused]);

  useEffect(() => {
    setErrorMessage(AuthContext.loginMessage || "");
  }, [AuthContext.loginMessage]);

  const validateEmail = (email: string) => {
    return email.includes('@') && email.includes('.');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (!isEmailValid)
      setIsEmailValid(newEmail === '' || validateEmail(newEmail));
  };

  const handleSubmit = (onSubmit: (data: LoginUserDTO) => void) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setIsEmailValid(false);
      return;
    }

    setErrorMessage("");
    await onSubmit({ email, password });
  };

  return (
    <div
      className="animated-background mx-auto w-full items-center justify-center py-4"
    >
      <div className="absolute inset-0 -z-10">
        <EvervaultCard text="hover" />
      </div>
      <Card className="w-full max-w-sm flex">
        <CardContent className="flex flex-col">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex flex-col gap-6">
              {/* Email Field */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className={!isEmailValid ? "border-red-500" : ""}
                  onKeyDown={(e) => {
                    if (e.key === "Tab" && !e.shiftKey) {
                      e.preventDefault();
                      setIsFocused(true);
                    }
                  }}
                />
              </div>

              {/* Password Field */}
              <div className="grid gap-2 relative">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>

                {!isFocused ? (
                  <Skeleton
                    tabIndex={0}
                    className="h-10 w-full rounded-md cursor-pointer"
                    onFocus={() => setIsFocused(true)}
                    onClick={() => setIsFocused(true)}
                  />
                ) : (
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setIsFocused(false)}
                      ref={passwordRef}
                      required
                      className="pr-10 h-10"
                    />
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                )}
              </div>

              {loginMessage && (
                <p className="text-red-500 text-sm">{loginMessage}</p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2">Logging in</span>
                    <span className="animate-spin">⚪</span>
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
