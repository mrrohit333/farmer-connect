import { type NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import { z } from "zod"

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  location: z.string().min(2).optional(),
})

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string, email: string, role: string }

    await connectDB()
    const user = await User.findById(decoded.userId).select("-password") // Exclude password

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user }, { status: 200 })

  } catch (error) {
    console.error("Error fetching user data:", error)
     return NextResponse.json(
      { error: "Failed to fetch user data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string, email: string, role: string }

    const body = await req.json()
    const result = updateUserSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid update data", details: result.error.format() }, { status: 400 })
    }

    await connectDB()

    const user = await User.findById(decoded.userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user fields if provided in the request body
    if (result.data.name !== undefined) {
      user.name = result.data.name
    }
    if (result.data.location !== undefined) {
      user.location = result.data.location
    }

    await user.save()

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 })

  } catch (error) {
    console.error("Error updating user data:", error)
     return NextResponse.json(
      { error: "Failed to update user data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 