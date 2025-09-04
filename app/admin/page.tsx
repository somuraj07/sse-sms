"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { QrCode } from "lucide-react";
import { QrReader } from "react-qr-reader";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

const DEFAULT_PHOTO = "https://via.placeholder.com/150.png?text=No+Photo";

export default function AdminPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [reason, setReason] = useState("beard");
  const [photo, setPhoto] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [scanning, setScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [otherReason, setOtherReason] = useState("");

  const webcamRef = useRef<Webcam>(null);
   const Router = useRouter();
  useEffect(() => {
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

  const handleCapture = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      setPhoto(screenshot);
      setShowCamera(false);
      toast.success("Photo captured 📸");
    }
  };

  const submitComplaint = async () => {
    if (!selectedStudent) return toast.error("Select a student first");

    const finalReason = reason === "other" ? otherReason : reason; // ✅ Fix here

    if (reason === "other" && !otherReason.trim()) {
      return toast.error("Please enter a reason");
    }

    try {
      const res = await fetch("/api/complaint/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          reason: finalReason, // ✅ use finalReason
          photo: photo || DEFAULT_PHOTO,
        }),
      });

      if (res.ok) {
        toast.success("Complaint submitted ✅");
        setPhoto("");
        const newComplaint = await res.json();
        setSelectedStudent((prev: any) => ({
          ...prev,
          complaintsAsStudent: [
            newComplaint,
            ...(prev.complaintsAsStudent || []),
          ],
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* ✅ Floating Details Button */}
      <button
        onClick={() => Router.push("/users")}
        className="fixed top-4 right-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow z-50 text-sm sm:text-base"
      >
        Details
      </button>

      <div className="max-w-xl mx-auto space-y-6 text-black">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 text-center">
          Admin Dashboard
        </h1>
         
        {/* Manual Search */}
        <div className="rounded-xl border p-4 bg-white shadow-sm">
          <h2 className="font-semibold text-purple-700 mb-2 text-sm sm:text-base">
            Search by Email
          </h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter student email"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleManualSearch}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-sm"
            >
              Search
            </button>
          </div>
        </div>

        {/* QR Scanner */}
        <div className="rounded-xl border p-4 bg-white shadow-sm">
          <h2 className="font-semibold text-purple-700 mb-2 text-sm sm:text-base">
            QR Scanner
          </h2>
          {!scanning ? (
            <button
              onClick={() => setScanning(true)}
              className="flex items-center justify-center w-full px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 gap-2 text-sm"
            >
              <QrCode size={18} /> Start Scanning
            </button>
          ) : (
            <div className="relative">
              <div className="w-full h-52 sm:h-56 border rounded-lg overflow-hidden">
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
                className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white rounded-md text-xs sm:text-sm"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Selected Student */}
        {selectedStudent && (
          <div className="rounded-xl border p-4 sm:p-6 bg-white shadow-lg space-y-6">
            <h2 className="font-semibold text-purple-700">Selected Student</h2>
            <div>
              <p className="text-sm font-medium">👤 {selectedStudent.name}</p>
              <p className="text-sm text-gray-600">
                📧 {selectedStudent.email}
              </p>
            </div>

            {/* Complaint Form */}
            <div className="space-y-6 border-t pt-4">
              {/* Camera Section */}
              <div className="text-center space-y-2">
                <p className="font-semibold">Capture Photo</p>
                <p className="text-xs text-gray-500">Used for verification</p>

                {photo ? (
                  <>
                    <img
                      src={photo}
                      alt="Captured"
                      className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full border border-orange-200 object-cover"
                    />
                    <button
                      type="button"
                      className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded text-sm"
                      onClick={() => {
                        setPhoto("");
                        setShowCamera(true);
                      }}
                    >
                      Retake Photo
                    </button>
                  </>
                ) : showCamera ? (
                  <div className="space-y-2">
                    <div className="overflow-hidden rounded-full w-28 h-28 sm:w-32 sm:h-32 mx-auto border-4 border-[#f9843d]">
                      <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                        videoConstraints={{ facingMode: "user" }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleCapture}
                      className="bg-[#f9843d] hover:bg-[#e77428] text-white px-4 py-2 rounded shadow text-sm"
                    >
                      Capture Photo
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowCamera(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow text-sm"
                  >
                    Open Camera
                  </button>
                )}
              </div>

              {/* Complaint Reason */}
              <div className="flex flex-col gap-3 border rounded-xl p-3 bg-gray-50 shadow-sm">
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

                {reason === "other" && (
                  <input
                    type="text"
                    placeholder="Enter your reason"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                )}

                <button
                  onClick={submitComplaint}
                  className="w-full px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Submit Complaint
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
