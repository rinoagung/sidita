import { NextResponse } from "next/server";
import prisma from "@utils/connection";

import bcrypt from "bcryptjs";

export async function POST(req) {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Cek apakah user sudah ada
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
}