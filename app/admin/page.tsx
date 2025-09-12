"use client";

import AdminPage from "@/components/AdminPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";

 // your existing code

export default function AdminProtected() {
  return (
    <ProtectedRoute roles={["ADMIN"]}>
      <AdminPage />
    </ProtectedRoute>
  );
}