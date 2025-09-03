"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Camera, QrCode, ChevronDown, ChevronUp } from "lucide-react";
import { QrReader } from "react-qr-reader";

const DEFAULT_PHOTO =
  "https://via.placeholder.com/150.png?text=No+Photo";

export default function AdminPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [reason, setReason] = useState("beard");
  const [photo, setPhoto] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [scanning, setScanning] = useState(false);
  const [showPrevComplaints, setShowPrevComplaints] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Fetch students via JWT-authenticated API
    fetch("/api/admin/students", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch(() => toast.error("Failed to fetch students"));
  }, []);

  const handleManualSearch = () => {
    const student = students.find((s) => s.email === manualEmail);
    if (student) {
      setSelectedStudent(student);
      toast.success(`Student found: ${student.name}`);
    } else {
      toast.error("No student found with that email");
    }
  };

  const handleQRScan = (data: any) => {
    if (data?.text) {
      const student = students.find((s) => s.email === data.text);
      if (student) {
        setSelectedStudent(student);
        toast.success(`Student found: ${student.name}`);
        setScanning(false);
      } else {
        toast.error("No student found for scanned QR");
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      toast.error("Camera access denied");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 320, 240);
      setPhoto(canvas.toDataURL("image/png"));
    }
  };

  const submitComplaint = async () => {
    if (!selectedStudent) return toast.error("Select a student first");
    try {
      const res = await fetch("/api/complaint/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          reason,
          photo: photo || DEFAULT_PHOTO,
        }),
      });

      if (res.ok) {
        toast.success("Complaint submitted ✅");
        setPhoto("");
        // Update student's complaints locally
        const newComplaint = await res.json();
        setSelectedStudent((prev: any) => ({
          ...prev,
          complaints: [newComplaint, ...(prev.complaints || [])],
        }));
      } else {
        toast.error("Error submitting complaint ❌");
      }
    } catch {
      toast.error("Network error ❌");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto space-y-6 text-black">
        <h1 className="text-2xl font-bold text-purple-700 text-center">
          Admin Dashboard
        </h1>

        {/* Manual Search */}
        <div className="rounded-xl border p-4 bg-white shadow-sm">
          <h2 className="font-semibold text-purple-700 mb-2">Search by Email</h2>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter student email"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleManualSearch}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            >
              Search
            </button>
          </div>
        </div>

        {/* QR Scanner */}
        <div className="rounded-xl border p-4 bg-white shadow-sm">
          <h2 className="font-semibold text-purple-700 mb-2">QR Scanner</h2>
          {!scanning ? (
            <button
              onClick={() => setScanning(true)}
              className="flex items-center justify-center w-full px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 gap-2"
            >
              <QrCode size={18} /> Start Scanning
            </button>
          ) : (
            <div className="relative">
              <div className="w-full h-48 border rounded-lg overflow-hidden">
                <QrReader
                  onResult={(result, error) => {
                    if (result) handleQRScan({ text: result.getText() });
                    if (error) console.error(error);
                  }}
                  constraints={{ facingMode: "environment" }}
                  className="w-full h-full"
                />
              </div>
              <button
                onClick={() => setScanning(false)}
                className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white rounded-md text-sm"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Selected Student */}
        {selectedStudent && (
          <div className="rounded-xl border p-4 bg-purple-50 shadow-sm space-y-4">
            <h2 className="font-semibold text-purple-700">Selected Student</h2>
            <div className="flex items-center gap-4">
              <img
                src={photo || DEFAULT_PHOTO}
                alt="captured"
                className="w-16 h-16 rounded-full border object-cover"
              />
              <div>
                <p className="text-sm font-medium">👤 {selectedStudent.name}</p>
                <p className="text-sm">📧 {selectedStudent.email}</p>
              </div>
            </div>

            {/* Camera & Reason */}
            <div className="grid gap-4 sm:grid-cols-2 mt-2">
              <div className="flex flex-col items-center gap-2 border rounded-xl p-2 bg-white shadow-sm">
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-28 h-28 rounded-lg border object-cover"
                />
                <div className="flex gap-2 w-full">
                  <button
                    onClick={startCamera}
                    className="flex-1 px-2 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    Start
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="flex-1 px-2 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center justify-center gap-1"
                  >
                    <Camera size={16} /> Capture
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 border rounded-xl p-2 bg-white shadow-sm">
                <select
                  className="w-full border rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="beard">Beard</option>
                  <option value="shoes">Shoes</option>
                  <option value="late">Late Arrival</option>
                  <option value="other">Other</option>
                </select>
                <button
                  onClick={submitComplaint}
                  className="w-full px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Submit Complaint
                </button>
              </div>
            </div>

            {/* Previous Complaints */}
            {selectedStudent.complaints && selectedStudent.complaints.length > 0 && (
              <div className="mt-4 border-t pt-2">
                <button
                  onClick={() => setShowPrevComplaints(!showPrevComplaints)}
                  className="flex items-center justify-between w-full px-2 py-1 text-sm text-purple-700 font-semibold"
                >
                  Previous Complaints
                  {showPrevComplaints ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {showPrevComplaints && (
                  <div className="mt-2 flex flex-col gap-2">
                    {selectedStudent.complaints.map((c: any) => (
                      <div
                        key={c.id}
                        className="flex justify-between items-center px-2 py-1 bg-purple-100 rounded-lg text-black text-sm"
                      >
                        <span>{c.reason}</span>
                        <span className="text-gray-500 text-xs">{formatDate(c.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
