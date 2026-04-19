"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingBasket, TrendingUp, Users } from "lucide-react"
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export default function VendorDashboard() {
  const [availableProductsCount, setAvailableProductsCount] = useState<number | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorLoadingProducts, setErrorLoadingProducts] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAvailableProductsCount() {
      setLoadingProducts(true);
      setErrorLoadingProducts(null);
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setAvailableProductsCount(data.length);
        } else {
          const errorData = await response.json();
          setErrorLoadingProducts(errorData.error || 'Failed to fetch products count.');
          toast({ title: 'Error', description: errorData.error || 'Failed to fetch products count.', variant: 'destructive' });
        }
      } catch (err) {
        console.error('Error fetching products count:', err);
        setErrorLoadingProducts('An unexpected error occurred while fetching products count.');
        toast({ title: 'Error', description: 'An unexpected error occurred while fetching products count.', variant: 'destructive' });
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchAvailableProductsCount();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Welcome, Vendor!</h1>
      <p className="text-muted-foreground">Browse products and connect with local farmers from your dashboard.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingProducts ? (
              <div className="text-2xl font-bold">Loading...</div>
            ) : errorLoadingProducts ? (
              <div className="text-sm text-red-500">Error</div>
            ) : (
              <div className="text-2xl font-bold">{availableProductsCount !== null ? availableProductsCount : '-'}</div>
            )}
            <p className="text-xs text-muted-foreground">+32 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Products</CardTitle>
            <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">+3 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Farmer Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+18.2%</div>
            <p className="text-xs text-muted-foreground">Since last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent product views and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-green-700" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Viewed Organic Tomatoes</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-700" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Connected with Green Acres Farm</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
                  <ShoppingBasket className="h-5 w-5 text-amber-700" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Saved Fresh Carrots to favorites</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recommended Products</CardTitle>
            <CardDescription>Based on your previous interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-md bg-green-100"></div>
                  <div>
                    <p className="text-sm font-medium">Organic Spinach</p>
                    <p className="text-xs text-muted-foreground">Green Acres Farm</p>
                  </div>
                </div>
                <div className="text-sm font-medium">$3.99/lb</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-md bg-yellow-100"></div>
                  <div>
                    <p className="text-sm font-medium">Fresh Corn</p>
                    <p className="text-xs text-muted-foreground">Sunshine Fields</p>
                  </div>
                </div>
                <div className="text-sm font-medium">$0.75/ear</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-md bg-purple-100"></div>
                  <div>
                    <p className="text-sm font-medium">Organic Eggplant</p>
                    <p className="text-xs text-muted-foreground">Valley View Farm</p>
                  </div>
                </div>
                <div className="text-sm font-medium">$2.49/lb</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
