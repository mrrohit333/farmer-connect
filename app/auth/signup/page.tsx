"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Leaf } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const signupSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  role: z.enum(["farmer", "vendor"]),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
})

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<string>("farmer")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const role = searchParams.get("role")
    if (role === "farmer" || role === "vendor") {
      setActiveTab(role)
    }
  }, [searchParams])

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: activeTab as "farmer" | "vendor",
      location: "",
    },
  })

  useEffect(() => {
    form.setValue("role", activeTab as "farmer" | "vendor")
  }, [activeTab, form])

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setError(null)
    console.log("Submitting form with values:", values)
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        console.log("Signup successful! Redirecting to login.")
        router.push("/auth/login")
    } else {
        const errorData = await response.json()
        console.error("Signup failed:", response.status, errorData)
        setError(errorData.error || "Signup failed. Please try again.")
      }
    } catch (error) {
      console.error("Error during signup submission:", error)
      setError("An unexpected error occurred during signup.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex flex-col items-center justify-center min-h-screen py-12">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold">FarmConnect</span>
        </Link>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Enter your information below to create your account</p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="farmer">Farmer</TabsTrigger>
              <TabsTrigger value="vendor">Vendor</TabsTrigger>
            </TabsList>
            <TabsContent value="farmer">
              <div className="p-4 pt-6 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Join as a Farmer</h3>
                <p className="text-sm text-green-700">
                  Upload your products, manage inventory, and connect with vendors looking for your produce.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="vendor">
              <div className="p-4 pt-6 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Join as a Vendor</h3>
                <p className="text-sm text-blue-700">
                  Browse available products, connect with local farmers, and grow your business.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      <Input placeholder="Create a password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Create Account
              </Button>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </form>
          </Form>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
