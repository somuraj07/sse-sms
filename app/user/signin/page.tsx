"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

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

      // Store JWT in localStorage
      localStorage.setItem("token", data.token);

      // Redirect based on role
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Sign In</h1>

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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
