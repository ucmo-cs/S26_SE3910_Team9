import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../state/user";

/**
 * Custom hook to redirect unauthenticated users away from protected pages.
 * Must be called as the first hook in a component.
 * Returns whether the user is authenticated (true) or will be redirected (false).
 */
export function useAuthRedirect(): boolean {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  // Use a ref-like approach with useEffect to redirect after render
  // but return immediately so component doesn't render invalid state
  useEffect(() => {
    if (!isAuthenticated) {
      // Small delay ensures smooth redirect without rendering issues
      const timer = setTimeout(() => {
        navigate("/account/create", { replace: true });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  // Return false if not authenticated - caller should not render
  return isAuthenticated;
}
