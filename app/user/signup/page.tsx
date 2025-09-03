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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Admin Signup</h1>

        <div className="flex items-center border rounded-lg px-3">
          <User className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 outline-none"
            required
          />
        </div>

        <div className="flex items-center border rounded-lg px-3">
          <Mail className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 outline-none"
            required
          />
        </div>

        <div className="flex items-center border rounded-lg px-3">
          <Lock className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 outline-none"
            required
          />
        </div>

        <div className="flex items-center border rounded-lg px-3">
          <Shield className="w-5 h-5 text-gray-500 mr-2" />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 outline-none bg-transparent"
          >
            <option value="STUDENT">Student</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
