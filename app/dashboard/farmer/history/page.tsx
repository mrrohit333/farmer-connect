"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, Download, Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ProductData {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  status: string;
  createdAt: string; // Assuming uploadDate is stored as createdAt timestamp
  imageUrl?: string; // Add imageUrl if you plan to display images later
}

export default function UploadHistoryPage() {
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [farmerId, setFarmerId] = useState<string | null>(null)
  const router = useRouter()

  // Fetch logged-in user's ID (farmer ID)
  useEffect(() => {
    async function fetchUserId() {
      try {
        const response = await fetch('/api/user/me')
        if (response.ok) {
          const data = await response.json()
          if (data.user && data.user.role === 'farmer') {
            setFarmerId(data.user._id)
          } else {
            // Handle case where user is not a farmer or data is invalid
            setError("User is not a farmer or user data is invalid.")
            toast.error("User is not a farmer or user data is invalid.")
            setLoading(false) // Stop loading if user is not a farmer
          }
        } else if (response.status === 401) {
          // If unauthorized, redirect to login
          router.push('/auth/login')
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to fetch user ID.')
          toast.error(errorData.error || 'Failed to fetch user ID.')
          setLoading(false) // Stop loading on error
        }
      } catch (err) {
        console.error('Error fetching user ID:', err)
        setError('An unexpected error occurred while fetching user ID.')
        toast.error('An unexpected error occurred while fetching user ID.')
        setLoading(false) // Stop loading on error
      }
    }

    fetchUserId()
  }, [router]) // Run only once on component mount

  // Fetch products when farmerId, statusFilter, or categoryFilter changes
  useEffect(() => {
    if (farmerId) { // Only fetch products if farmerId is available
      async function fetchProducts() {
        setLoading(true)
        setError(null)
        try {
          const response = await fetch(`/api/products?farmerId=${farmerId}&status=${statusFilter}&category=${categoryFilter}`)
          if (response.ok) {
            const data = await response.json()
            setProducts(data)
          } else {
            const errorData = await response.json()
            setError(errorData.error || "Failed to fetch products.")
            toast.error(errorData.error || "Failed to fetch products.")
          }
        } catch (err) {
          console.error("Error fetching products:", err)
          setError("An unexpected error occurred.")
          toast.error("An unexpected error occurred.")
        } finally {
          setLoading(false)
        }
      }

      fetchProducts()
    }
  }, [farmerId, statusFilter, categoryFilter]) // Refetch when farmerId or filters change

  // Filter the upload history based on search term (applied to the products state)
  const filteredHistory = products.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item._id.toLowerCase().includes(searchTerm.toLowerCase())
    // Status and category filtering is now done in the backend API call
    return matchesSearch
  })

  // Function to format date (you might have a helper for this)
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Upload History</h1>
        <p className="text-muted-foreground">View and manage your previously uploaded products</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Uploads</CardTitle>
          <CardDescription>You have uploaded {products.length} products in total</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-[300px]"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="sold out">Sold Out</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="herbs">Herbs</SelectItem>
                    <SelectItem value="grains">Grains</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {loading ? (
              <p>Loading products...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No products found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredHistory.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell className="font-medium">{product._id.slice(0, 6)}...</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell className="capitalize">{product.category}</TableCell>
                          <TableCell>
                            {product.quantity} {product.unit}
                          </TableCell>
                          <TableCell>₹{product.price.toFixed(2)}</TableCell>
                          <TableCell className="capitalize">{product.status}</TableCell>
                          <TableCell>{formatDate(product.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product._id)}>
                                  Copy product ID
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
