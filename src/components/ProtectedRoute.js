import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  if (role) {
    const userRole = user?.user?.role;

    if (
      (Array.isArray(role) && !role.includes(userRole)) ||
      (!Array.isArray(role) && userRole !== role)
    ) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}