"use client";

import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Lock, Shield } from "lucide-react";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      toast.success("✅ User created successfully!");
      setForm({ name: "", email: "", password: "", role: "STUDENT" });
   
    } catch (err: any) {
      toast.error("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6 border border-purple-100"
      >
        <h1 className="text-3xl font-bold text-center text-purple-700">
          Admin Signup
        </h1>
        <p className="text-center text-gray-500">
          Create an account for managing the system
        </p>

        {/* Name */}
        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400 transition">
          <User className="w-5 h-5 text-purple-500 mr-2" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 outline-none text-gray-700 placeholder-gray-400"
            required
          />
        </div>

        {/* Email */}
        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400 transition">
          <Mail className="w-5 h-5 text-purple-500 mr-2" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 outline-none text-gray-700 placeholder-gray-400"
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400 transition">
          <Lock className="w-5 h-5 text-purple-500 mr-2" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 outline-none text-gray-700 placeholder-gray-400"
            required
          />
        </div>

        {/* Role */}
        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400 transition">
          <Shield className="w-5 h-5 text-purple-500 mr-2" />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 outline-none bg-transparent text-gray-700"
          >
            <option value="STUDENT">Student</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-purple-700 hover:shadow-lg transition-all disabled:opacity-70"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/user/signin"
            className="text-purple-600 font-semibold hover:underline cursor-pointer"
          >
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}
