import { type NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { compare, hash } from "bcrypt"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import { z } from "zod"

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(8, { message: "New password must be at least 8 characters." }),
})

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string, email: string, role: string }

    const body = await req.json()
    const result = changePasswordSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", details: result.error.format() }, { status: 400 })
    }

    const { currentPassword, newPassword } = result.data

    await connectDB()

    const user = await User.findById(decoded.userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify current password
    const passwordMatch = await compare(currentPassword, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid current password" }, { status: 400 })
    }

    // Hash and update new password
    const hashedPassword = await hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()

    return NextResponse.json({ message: "Password changed successfully" }, { status: 200 })

  } catch (error) {
    console.error("Error changing password:", error)
     return NextResponse.json(
      { error: "Failed to change password", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 