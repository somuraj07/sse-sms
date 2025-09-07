import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, reason, photo } = body;

    if (!studentId || !reason) {
      return NextResponse.json(
        { error: "studentId and reason are required" },
        { status: 400 }
      );
    }
     const existingCount = await prisma.complaint.count({
      where: { studentId },
    });
    if (existingCount >= 5) {
      return NextResponse.json(
        { message: "You have reached max complaints pealse contact to prrincipal." },
        { status: 400 }
      );
    }

    const complaint = await prisma.complaint.create({
      data: {
        reason,
        photo: photo || "https://via.placeholder.com/320x240.png?text=No+Photo",
        studentId,
      },
    });

    return NextResponse.json(
      { message: "Complaint created successfully", complaint },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Error creating complaint:", err);
    return NextResponse.json(
      { error: "Failed to create complaint" },
      { status: 500 }
    );
  }
}
