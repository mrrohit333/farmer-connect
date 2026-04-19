import { type NextRequest, NextResponse } from "next/server"
import { hash } from "bcrypt"
import { z } from "zod"

import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["farmer", "vendor"]),
  location: z.string().min(2),
})

export async function POST(req: NextRequest) {
  try {
    console.log('Attempting to connect to MongoDB...') // Log connection attempt
    await connectDB() // Connect to MongoDB using the cached connection
    console.log('MongoDB connected successfully.') // Log successful connection

    const body = await req.json()

    // Validate request body
    const parsedResult = userSchema.safeParse(body)
    if (!parsedResult.success) {
      console.log('Invalid request data:', parsedResult.error.format()) // Log validation errors
      return NextResponse.json({ error: "Invalid request data", details: parsedResult.error.format() }, { status: 400 })
    }

    const { name, email, password, role, location } = parsedResult.data

    // Check if user already exists using Mongoose model
    console.log(`Checking if user with email ${email} already exists...`) // Log check for existing user
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log(`User with email ${email} already exists.`) // Log existing user
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create and save user using Mongoose model
    console.log('Creating new user and saving to database...') // Log attempt to save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      location,
    })

    const savedUser = await newUser.save()
    console.log('User saved successfully:', savedUser) // Log successful save

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: savedUser._id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error in signup API route:", error) // Log any errors during the process
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
