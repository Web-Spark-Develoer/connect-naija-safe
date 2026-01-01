import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading || profileLoading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // If user has no profile and not on onboarding, redirect to onboarding
    if (!profile && location.pathname !== "/onboarding") {
      navigate("/onboarding", { replace: true });
    }
  }, [user, profile, loading, profileLoading, navigate, location.pathname]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

interface AuthRouteProps {
  children: ReactNode;
}

export const AuthRoute = ({ children }: AuthRouteProps) => {
  const { user, loading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || profileLoading) return;

    if (user) {
      // If user has no profile, go to onboarding
      if (!profile) {
        navigate("/onboarding", { replace: true });
      } else {
        navigate("/discover", { replace: true });
      }
    }
  }, [user, profile, loading, profileLoading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
};
