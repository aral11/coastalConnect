/**
 * Supabase Auth Context - 100% Supabase-driven authentication
 * No localStorage or sessionStorage - all handled by Supabase Auth
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, SupabaseUser, trackEvent } from "@/lib/supabase";

export type UserRole = "admin" | "vendor" | "customer" | "event_organizer";

interface AuthUser extends SupabaseUser {
  supabase_user?: User;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userData: Partial<AuthUser>,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  canAccess: (section: string) => boolean;
}

// Role-based permissions matrix
const ROLE_PERMISSIONS = {
  admin: [
    "admin:dashboard",
    "admin:users",
    "admin:vendors",
    "admin:bookings",
    "admin:payments",
    "admin:analytics",
    "admin:settings",
    "vendor:approve",
    "vendor:reject",
    "event:approve",
    "event:reject",
    "system:manage",
  ],
  vendor: [
    "vendor:dashboard",
    "vendor:profile",
    "vendor:bookings",
    "vendor:earnings",
    "vendor:calendar",
    "vendor:analytics",
    "service:create",
    "service:edit",
    "service:delete",
    "booking:accept",
    "booking:reject",
  ],
  customer: [
    "customer:dashboard",
    "customer:profile",
    "customer:bookings",
    "customer:reviews",
    "booking:create",
    "booking:cancel",
    "review:create",
    "review:edit",
  ],
  event_organizer: [
    "organizer:dashboard",
    "organizer:profile",
    "organizer:events",
    "organizer:registrations",
    "event:create",
    "event:edit",
    "event:delete",
    "registration:manage",
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data from our users table
  const fetchUserProfile = async (
    supabaseUser: User,
  ): Promise<AuthUser | null> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();

      if (error) {
        // If user doesn't exist in our users table, create them
        if (error.code === "PGRST116") {
          const newUser: Partial<SupabaseUser> = {
            id: supabaseUser.id,
            email: supabaseUser.email || "",
            name:
              supabaseUser.user_metadata?.name ||
              supabaseUser.email?.split("@")[0] ||
              "",
            phone: supabaseUser.phone,
            role: "customer",
            avatar_url: supabaseUser.user_metadata?.avatar_url,
            is_verified: supabaseUser.email_confirmed_at !== null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { data: createdUser, error: createError } = await supabase
            .from("users")
            .insert(newUser)
            .select()
            .single();

          if (createError) throw createError;
          return { ...createdUser, supabase_user: supabaseUser };
        }
        throw error;
      }

      return { ...data, supabase_user: supabaseUser };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }

        setSession(session);

        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          setUser(userProfile);

          // Track user login
          try {
            await trackEvent("user_login", {
              user_id: session.user.id,
              provider: session.user.app_metadata?.provider,
            });
          } catch (error) {
            console.warn("Failed to track login event:", error);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);

      setSession(session);

      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user);
        setUser(userProfile);

        if (event === "SIGNED_IN") {
          try {
            await trackEvent("user_login", {
              user_id: session.user.id,
              provider: session.user.app_metadata?.provider,
            });
          } catch (error) {
            console.warn("Failed to track login event:", error);
          }
        }
      } else {
        setUser(null);

        if (event === "SIGNED_OUT") {
          try {
            await trackEvent("user_logout");
          } catch (error) {
            console.warn("Failed to track logout event:", error);
          }
        }
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // User will be set through the auth state change listener
      try {
        await trackEvent("sign_in_attempt", { email, success: true });
      } catch (error) {
        console.warn("Failed to track sign in event:", error);
      }
    } catch (error: any) {
      try {
        await trackEvent("sign_in_attempt", {
          email,
          success: false,
          error: error.message,
        });
      } catch (trackError) {
        console.warn("Failed to track sign in attempt:", trackError);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: Partial<AuthUser>,
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            role: userData.role || "customer",
          },
        },
      });

      if (error) throw error;

      try {
        await trackEvent("sign_up_attempt", {
          email,
          role: userData.role,
          success: true,
        });
      } catch (error) {
        console.warn("Failed to track sign up event:", error);
      }
    } catch (error: any) {
      try {
        await trackEvent("sign_up_attempt", {
          email,
          success: false,
          error: error.message,
        });
      } catch (trackError) {
        console.warn("Failed to track sign up attempt:", trackError);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      try {
        await trackEvent("user_logout", { user_id: user?.id });
      } catch (error) {
        console.warn("Failed to track logout event:", error);
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // User will be cleared through the auth state change listener
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      try {
        await trackEvent("password_reset_request", { email });
      } catch (error) {
        console.warn("Failed to track password reset event:", error);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user || !session) throw new Error("No authenticated user");

    try {
      // Update user metadata in Supabase Auth if needed
      if (updates.name || updates.phone) {
        const { error: authError } = await supabase.auth.updateUser({
          data: {
            name: updates.name,
            phone: updates.phone,
          },
        });
        if (authError) throw authError;
      }

      // Update profile in our users table
      const { data, error } = await supabase
        .from("users")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      setUser({ ...data, supabase_user: session.user });

      try {
        await trackEvent("profile_updated", {
          user_id: user.id,
          fields: Object.keys(updates),
        });
      } catch (error) {
        console.warn("Failed to track profile update event:", error);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.role) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) || false;
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user || !user.role) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const canAccess = (section: string): boolean => {
    if (!user) return false;

    // Define section access rules
    const sectionPermissions: Record<string, string[]> = {
      admin: ["admin:dashboard"],
      "vendor-dashboard": ["vendor:dashboard"],
      "customer-dashboard": ["customer:dashboard"],
      "organizer-dashboard": ["organizer:dashboard"],
      bookings: ["booking:create", "booking:accept", "booking:cancel"],
      services: ["service:create", "service:edit"],
      events: ["event:create", "event:edit"],
      analytics: ["admin:analytics", "vendor:analytics"],
    };

    const requiredPermissions = sectionPermissions[section];
    if (!requiredPermissions) return true; // Public section

    return requiredPermissions.some((permission) => hasPermission(permission));
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    hasPermission,
    hasRole,
    canAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a SupabaseAuthProvider");
  }
  return context;
}

export default AuthContext;
