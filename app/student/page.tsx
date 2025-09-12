"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import StudentPage from "@/components/StudentPage";

// your existing code

export default function StudentProtected() {
  return (
    <ProtectedRoute roles={["STUDENT"]}>
      <StudentPage />
    </ProtectedRoute>
  );
}