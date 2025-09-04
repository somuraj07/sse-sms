"use client";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-center items-center">
      {/* Gradient Logo */}
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-purple-300 text-transparent bg-clip-text">
        SSE
      </h1>
    </nav>
  );
}
