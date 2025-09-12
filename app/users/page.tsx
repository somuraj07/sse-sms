"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import AdminUsersPage from "@/components/Users";

// your existing code

export default function StudentProtected() {
  return (
    <ProtectedRoute roles={["ADMIN"]}>
      <AdminUsersPage/>
    </ProtectedRoute>
  );
}