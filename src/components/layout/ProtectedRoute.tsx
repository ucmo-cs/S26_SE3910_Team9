import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../state/user";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiresAuth?: boolean;
};

/**
 * ProtectedRoute handles redirects for authentication-required pages.
 * Uses useEffect to redirect instead of Navigate to avoid hook violations.
 */
export function ProtectedRoute({ children, requiresAuth = true }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  useEffect(() => {
    if (requiresAuth && !isAuthenticated) {
      navigate("/account/create", { replace: true });
    } else if (!requiresAuth && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, requiresAuth, navigate]);

  // Show nothing while redirecting to prevent flash of wrong content
  if (requiresAuth && !isAuthenticated) {
    return null;
  }

  if (!requiresAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
