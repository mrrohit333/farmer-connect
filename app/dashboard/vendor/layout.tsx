import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardSidebar role="vendor">{children}</DashboardSidebar>
}
