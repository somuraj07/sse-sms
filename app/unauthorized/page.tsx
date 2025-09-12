"use client";

export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-4 text-gray-700">
          You are not authorized to view this page.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          (Only admins can access this page)
        </p>
      </div>
    </div>
  );
}