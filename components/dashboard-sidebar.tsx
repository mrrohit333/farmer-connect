"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Leaf, LogOut, Package, Settings, ShoppingBasket, Upload, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

interface DashboardSidebarProps {
  role: "farmer" | "vendor"
  children: React.ReactNode
}

export function DashboardSidebar({ role, children }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  const farmerMenuItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      href: "/dashboard/farmer",
    },
    {
      title: "Upload Product",
      icon: Upload,
      href: "/dashboard/farmer/upload",
    },
    {
      title: "Upload History",
      icon: Package,
      href: "/dashboard/farmer/history",
    },
    {
      title: "Profile",
      icon: User,
      href: "/dashboard/farmer/profile",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/farmer/settings",
    },
  ]

  const vendorMenuItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      href: "/dashboard/vendor",
    },
    {
      title: "Products",
      icon: ShoppingBasket,
      href: "/dashboard/vendor/products",
    },
    {
      title: "Profile",
      icon: User,
      href: "/dashboard/vendor/profile",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/vendor/settings",
    },
  ]

  const menuItems = role === "farmer" ? farmerMenuItems : vendorMenuItems

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex h-[60px] items-center px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Leaf className="h-6 w-6 text-green-600" />
                <span className="text-xl">FarmConnect</span>
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{role === "farmer" ? "Farmer" : "Vendor"} Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/auth/login">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col">
          <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
            <SidebarTrigger />
            <div className="font-semibold">{role === "farmer" ? "Farmer" : "Vendor"} Dashboard</div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
