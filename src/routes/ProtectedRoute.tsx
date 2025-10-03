import { Navigate } from "react-router-dom";

import type { JSX } from "react";
import { Auth } from "../AuthContext";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = Auth();

  if (!token) {
    return <Navigate to="/login" replace />; // редирект на логин
  }

  return children;
}