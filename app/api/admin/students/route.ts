import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"; // adjust path

// GET /api/admin/students
export async function GET() {
  try {
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true, name: true, email: true ,department:true},
    });
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}
