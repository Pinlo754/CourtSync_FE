import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/Button";
import { useAuthContext } from "../features/auth/hooks/useAuthContext";
import { AlertTriangle, Lock } from "lucide-react";
import { UserRole } from "../types/role";
import { log } from "console";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: number;
  redirectPath?: string;
}

export const AuthGuard = ({
  children,
  requiredRole,
  redirectPath = "/"
}: AuthGuardProps) => {
  const { user } = useAuthContext();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="p-6">
            <Lock className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="mb-4 text-slate-600">You need to be logged in to access this page.</p>
            <Button>
              <Link to="/login">Login Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole.toString()) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="p-6">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
            <p className="mb-4 text-slate-600">
              You don't have permission to access this page.
            </p>
            <p className="mb-4 text-sm text-slate-500">
              Current role: <span className="font-semibold">{user.role}</span>
            </p>
            <p className="mb-4 text-sm text-slate-500">
              Required role: <span className="font-semibold">{requiredRole}</span>
            </p>
            <Button>
              <Link to={redirectPath}>Go Back Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
