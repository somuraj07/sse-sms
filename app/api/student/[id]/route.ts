import { NextResponse } from "next/server";
import {prisma} from "@/lib/db";
export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await context.params; 
  
      const student = await prisma.user.findUnique({
        where: { id },
        include: { complaintsAsStudent: true },
      });
  
      if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
      }
  
      return NextResponse.json(student);
    } catch (err) {
      return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
    }
  }