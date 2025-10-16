import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../features/auth/hooks/useAuthStore";

export function ProtectedRoute({ allowedRoles, redirectTo = "/" }) {
  const token = useAuthStore((s) => s.token);
  const roles = useAuthStore((s) => s.roles);

  const hasAccess =
    token &&
    roles?.some((role) =>
      allowedRoles.map((r) => r.toUpperCase()).includes(role.toUpperCase())
    );

  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
