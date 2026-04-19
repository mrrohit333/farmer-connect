import { type NextRequest, NextResponse } from "next/server"
import { compare } from "bcrypt"
import { z } from "zod"
import { sign } from "jsonwebtoken"
import nodemailer from 'nodemailer';

import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(["farmer", "vendor"]),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("Login attempt with:", { email: body.email, role: body.role })

    // Validate request body
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      console.log("Validation failed:", result.error.format())
      return NextResponse.json({ error: "Invalid request data", details: result.error.format() }, { status: 400 })
    }

    const { email, password, role } = result.data

    // Connect to MongoDB
    await connectDB()
    console.log("Connected to MongoDB")

    // Find user using Mongoose model
    const user = await User.findOne({ email, role })
    console.log("User lookup result:", user ? "User found" : "User not found")
    
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const passwordMatch = await compare(password, user.password)
    console.log("Password verification:", passwordMatch ? "Password matches" : "Password does not match")
    
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create JWT token
    const token = sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    )

    // Set cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    )

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    // Send login confirmation email
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Successful Login to FarmConnect',
        text: `Dear ${user.name},

This email confirms that you have successfully logged in to your FarmConnect account.

If you did not perform this action, please contact us immediately.

Thank you for using FarmConnect!

The FarmConnect Team`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending login confirmation email:', error);
        } else {
          console.log('Login confirmation email sent:', info.response);
        }
      });

    } catch (emailError) {
      console.error("Error setting up or sending email:", emailError);
      // Continue with login response even if email fails
    }

    return response
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json(
      { error: "Failed to login", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
