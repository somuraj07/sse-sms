"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Complaint {
  id: string;
  photo: string;
  reason: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  complaintsAsStudent: Complaint[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`/api/admin/users?email=${search}`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error:", err));
  }, [search]);

  const complaintStats = users
    .flatMap((u) => u.complaintsAsStudent)
    .reduce<Record<string, number>>((acc, complaint) => {
      const date = new Date(complaint.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

  const chartData = Object.entries(complaintStats).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent text-center">
        SSE – Admin Dashboard
      </h1>

      {/* Search */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="🔍 Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Complaints Chart */}
      <div className="border rounded-lg shadow p-4 bg-white overflow-x-auto">
        <h2 className="text-lg font-semibold mb-3">Complaints per Day</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No complaints data yet 🎉</p>
        )}
      </div>

      {/* Users Table */}
      <div className="border rounded-lg shadow p-4 bg-white overflow-x-auto">
        <h2 className="text-lg font-semibold mb-3">Users & Complaints</h2>
        <table className="min-w-full border rounded-lg table-auto">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Complaints</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b hover:bg-gray-50 sm:text-sm text-xs"
                >
                  <td className="p-2">{u.name}</td>
                  <td className="p-2 break-words">{u.email}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">
                    {u.complaintsAsStudent.length > 0 ? (
                      <ul className="list-disc ml-5">
                        {u.complaintsAsStudent.map((c) => (
                          <li key={c.id}>
                            <span className="font-medium">{c.reason}</span>{" "}
                            ({new Date(c.createdAt).toLocaleDateString()})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500">No complaints 🎉</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 text-center text-gray-500 italic"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
