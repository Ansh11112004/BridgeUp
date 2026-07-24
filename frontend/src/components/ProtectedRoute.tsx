import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, Role } from "@/contexts/AuthContext";

interface Props {
  children: ReactNode;
  role?: Role; // if provided, only that role may access
}

// Wraps dashboard routes so they can't be viewed while logged out,
// and redirects a mismatched role to their own dashboard.
const ProtectedRoute = ({ children, role }: Props) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // avoid a flash-redirect while session restores

  if (!user) {
    const redirectTo = role === "sponsor" ? "/sponsor-register" : "/organizer-register";
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "organizer" ? "/organizer/dashboard" : "/sponsor/dashboard"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
