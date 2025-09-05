// app/api/student/me/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    let decoded: { id: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const student = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        complaintsAsStudent: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            photo: true,
            reason: true,
            createdAt: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (err) {
    console.error("❌ Error fetching student:", err);
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
  }
}
