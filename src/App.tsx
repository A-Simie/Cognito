import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { useAuthStore } from "@/lib/store/authStore";
import { publicRoutes, protectedRoutes, notFoundRoute } from "@/config/routes";

/**
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-bold dark:text-slate-400 text-xl">
          LOADING...
        </p>
      </div>
    </div>
  );
}

/**
 * Private route wrapper component
 */
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <LoadingFallback />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
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
                    route.path === "/" ? (
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
