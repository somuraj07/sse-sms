"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SigninPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signin failed");

      toast.success("✅ Logged in successfully!");
      localStorage.setItem("token", data.token);

      if (data.role === "ADMIN") {
        router.push("/admin");
      } else if (data.role === "STUDENT") {
        router.push("/student");
      } else {
        toast.error("❌ Unknown role");
      }

      setForm({ email: "", password: "" });
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
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-500">
          Sign in to continue to your account
        </p>

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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-purple-700 hover:shadow-lg transition-all disabled:opacity-70"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
