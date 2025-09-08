import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";



export async function POST(request: Request){
    try {
        const body = await request.json();
        const {email, password,role,name,department} = body;
        if(!name || !email || !password || !role|| !department){
            return NextResponse.json({message: 'All fields are required'}, {status: 400})
        }
        const existing = await prisma.user.findUnique({
            where: {email}
        });
        if(existing){
            return NextResponse.json({message: 'User already exists'}, {status: 400})
        }
        const hassedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data:{
                name,
                email,
                role,
                department,
                password: hassedPassword
            }
        });
        return NextResponse.json({message: 'User created successfully', user}, {status: 201})
    } catch (error) {
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}