import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function FarmerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardSidebar role="farmer">{children}</DashboardSidebar>
}
