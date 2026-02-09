import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { useAuthStore } from "@/lib/store/authStore";
import { publicRoutes, protectedRoutes, notFoundRoute } from "@/config/routes";

import { GraduationCap } from "lucide-react";

/**
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-night transition-colors duration-500">
      <div className="relative flex flex-col items-center">
        <div className="w-16 h-16 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-lg flex items-center justify-center mb-4 animate-pulse">
          <GraduationCap className="w-8 h-8 text-primary drop-shadow-sm" />
        </div>

        {/* Branding */}
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-[0.2em] uppercase opacity-90 animate-fade-in">
          Cognito
        </h2>
      </div>
    </div>
  );
}

/**
 * Private route wrapper component
 */
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingFallback />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

/**
 * Redirects authenticated users to dashboard
 */
function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

import { AuthMiddleware } from "@/components/providers/AuthMiddleware";

/**
 * Main App component
 */
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <AuthMiddleware>
            <Routes>
              {/* Public routes */}
              {publicRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    route.guestOnly ? (
                      <RedirectIfAuthenticated>
                        {route.element}
                      </RedirectIfAuthenticated>
                    ) : (
                      route.element
                    )
                  }
                />
              ))}

              {/* Protected routes */}
              {protectedRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<PrivateRoute>{route.element}</PrivateRoute>}
                />
              ))}

              {/* 404 Not Found */}
              <Route
                path={notFoundRoute.path}
                element={notFoundRoute.element}
              />
            </Routes>
          </AuthMiddleware>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
