import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingBasket, TrendingUp, Users } from "lucide-react"

export default function FarmerDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Welcome, Farmer!</h1>
      <p className="text-muted-foreground">Manage your products and connect with vendors from your dashboard.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+1 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendor Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">Since last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent product uploads and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-green-700" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Organic Tomatoes uploaded</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-700" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">New vendor connection: Fresh Market</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
                  <ShoppingBasket className="h-5 w-5 text-amber-700" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Order received for Organic Carrots</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Popular Products</CardTitle>
            <CardDescription>Your most viewed products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-md bg-green-100"></div>
                  <div>
                    <p className="text-sm font-medium">Organic Tomatoes</p>
                    <p className="text-xs text-muted-foreground">$4.99/lb</p>
                  </div>
                </div>
                <div className="text-sm font-medium">124 views</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-md bg-orange-100"></div>
                  <div>
                    <p className="text-sm font-medium">Fresh Carrots</p>
                    <p className="text-xs text-muted-foreground">$2.49/lb</p>
                  </div>
                </div>
                <div className="text-sm font-medium">98 views</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-md bg-red-100"></div>
                  <div>
                    <p className="text-sm font-medium">Red Apples</p>
                    <p className="text-xs text-muted-foreground">$3.99/lb</p>
                  </div>
                </div>
                <div className="text-sm font-medium">87 views</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
