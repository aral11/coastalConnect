/**
 * OAuth Callback Page - Handles Google OAuth redirects
 */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Check for pending booking
        const pendingBooking = localStorage.getItem("pendingBooking");
        if (pendingBooking) {
          localStorage.removeItem("pendingBooking");
          navigate("/booking/continue", { replace: true });
        } else {
          // Redirect to dashboard or home based on user role
          const redirectPath =
            user.role === "admin"
              ? "/admin"
              : user.role === "vendor"
                ? "/vendor-dashboard"
                : user.role === "event_organizer"
                  ? "/organizer-dashboard"
                  : "/";
          navigate(redirectPath, { replace: true });
        }
      } else {
        // OAuth failed, redirect to login
        navigate("/login?error=oauth_failed", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}
