import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const { name, username, email, password } = await req.json();

        if (!name || !username || !email || !password) {
            return NextResponse.json({ message: "All fields are required." }, { status: 400 });
        }

        await connectDB();

        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return NextResponse.json({ message: "User with this email already exists." }, { status: 409 });
        }

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return NextResponse.json({ message: "This username is already taken." }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}