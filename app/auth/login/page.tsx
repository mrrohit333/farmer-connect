"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Leaf } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  role: z.enum(["farmer", "vendor"]),
})

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>("farmer")
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "farmer",
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError(null)
    try {
      console.log("Attempting login with:", { email: values.email, role: values.role })
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()
      console.log("Login response:", { status: response.status, data })

      if (response.ok) {
        console.log("Login successful!")
    if (values.role === "farmer") {
      router.push("/dashboard/farmer")
    } else {
      router.push("/dashboard/vendor")
        }
      } else {
        console.error("Login failed:", response.status, data)
        if (response.status === 401) {
          setError("Invalid email or password. Please check your credentials and try again.")
        } else {
          setError(data.error || data.details || "An error occurred during login")
        }
      }
    } catch (error) {
      console.error("Error during login:", error)
      setError("An unexpected error occurred during login. Please try again.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex flex-col items-center justify-center min-h-screen py-12">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold">FarmConnect</span>
        </Link>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Log in to your account</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials below to access your account</p>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value)
              form.setValue("role", value as "farmer" | "vendor")
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="farmer">Farmer</TabsTrigger>
              <TabsTrigger value="vendor">Vendor</TabsTrigger>
            </TabsList>
          </Tabs>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300" />
                  <label htmlFor="remember" className="text-sm text-gray-500">
                    Remember me
                  </label>
                </div>
                <Link href="#" className="text-sm text-green-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full">
                Log In
              </Button>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </form>
          </Form>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
