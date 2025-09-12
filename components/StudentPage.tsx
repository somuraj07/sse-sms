"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function StudentPage() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // 🚨 Redirect immediately if no token
      window.location.replace("/user/signin");
      return;
    }

    fetch("/api/student/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          // 🚨 Invalid/expired token → clear and redirect
          localStorage.removeItem("token");
          window.location.replace("/user/signin");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch student");
        const data = await res.json();
        setStudent(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.replace("/user/signin");
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading student info...
      </div>
    );
  }

  if (!student) return null; // avoids flicker if redirecting

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-3xl p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black">
            Welcome, {student.name}
          </h1>
          <p className="text-gray-700 mt-1">{student.email}</p>
          <p className="text-gray-700 mt-1">Department: {student.department}</p>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center">
          <h2 className="font-semibold text-black mb-2">Your QR Code</h2>
          <div className="p-4 bg-purple-100 rounded-xl">
            <QRCodeCanvas value={student.email} size={150} />
          </div>
        </div>

        {/* Complaints */}
        <div>
          <h2 className="font-semibold text-black mb-3">
            Complaints Against You
          </h2>
          {student.complaintsAsStudent?.length > 0 ? (
            <div className="flex flex-col gap-3">
              {student.complaintsAsStudent.map((c: any) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 border border-purple-200 px-3 py-2 rounded-lg bg-purple-50 shadow-sm"
                >
                  {c.photo && (
                    <img
                      src={c.photo}
                      alt="Evidence"
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  )}
                  <div className="flex flex-col">
                    <p className="font-medium text-black text-sm">{c.reason}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700 text-center">No complaints yet 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
}