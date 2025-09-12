"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: ("STUDENT" | "ADMIN")[];
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/user/signin");
    } else if (!roles.includes(user.role)) {
      router.replace("/unauthorized");
    }
  }, [user, roles, router]);

  if (!user) return <div>Loading...</div>;

  return <>{children}</>;
}