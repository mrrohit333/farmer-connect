"use client"

import { useState, useEffect } from "react"
import { BookmarkPlus, Filter, Heart, Search, SlidersHorizontal } from "lucide-react"
import { toast } from '@/components/ui/use-toast'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProductData {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  description: string;
  imageUrl?: string;
  status: string;
  farmerId: string; // Assuming farmerId is stored as a string ObjectId
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [viewType, setViewType] = useState("grid")
  const [favorites, setFavorites] = useState<string[]>([])
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to fetch products.')
          toast({ title: 'Error', description: errorData.error || 'Failed to fetch products.', variant: 'destructive' })
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('An unexpected error occurred while fetching products.')
        toast({ title: 'Error', description: 'An unexpected error occurred while fetching products.', variant: 'destructive' })
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false
      const matchesCategory =
        categoryFilter === "all" || product.category.toLowerCase() === categoryFilter.toLowerCase()
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

      return matchesSearch && matchesCategory && matchesPrice
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "price-low") {
        return a.price - b.price
      } else if (sortBy === "price-high") {
        return b.price - a.price
      }
      return 0
    })

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Browse Products</h1>
        <p className="text-muted-foreground">Discover fresh products from local farmers</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products or farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="vegetables">Vegetables</SelectItem>
                <SelectItem value="fruits">Fruits</SelectItem>
                <SelectItem value="dairy">Dairy</SelectItem>
                <SelectItem value="herbs">Herbs</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                  <SheetDescription>Refine your product search with these filters</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Categories</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {["All", "Vegetables", "Fruits", "Dairy", "Herbs", "Other"].map((category) => (
                        <Button
                          key={category}
                          variant={categoryFilter === category.toLowerCase() ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCategoryFilter(category.toLowerCase())}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Price Range</h4>
                      <p className="text-sm text-muted-foreground">
                        ₹{priceRange[0]} - ₹{priceRange[1]}
                      </p>
                    </div>
                    <Slider
                      defaultValue={[0, 1000]}
                      max={1000}
                      step={1}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Location</h4>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="or">Oregon</SelectItem>
                        <SelectItem value="wa">Washington</SelectItem>
                        <SelectItem value="other">Other States</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCategoryFilter("all")
                      setPriceRange([0, 1000])
                    }}
                  >
                    Reset
                  </Button>
                  <Button>Apply Filters</Button>
                </div>
              </SheetContent>
            </Sheet>

            <Tabs value={viewType} onValueChange={setViewType} className="w-[100px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="grid" className="px-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                </TabsTrigger>
                <TabsTrigger value="list" className="px-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <line x1="8" x2="21" y1="6" y2="6" />
                    <line x1="8" x2="21" y1="12" y2="12" />
                    <line x1="8" x2="21" y1="18" y2="18" />
                    <line x1="3" x2="3.01" y1="6" y2="6" />
                    <line x1="3" x2="3.01" y1="12" y2="12" />
                    <line x1="3" x2="3.01" y1="18" y2="18" />
                  </svg>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="mt-2">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-3">
                <Filter className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No products found</h3>
              <p className="mt-2 text-center text-muted-foreground">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : viewType === "grid" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <Card key={product._id} className="overflow-hidden">
                  <div className="relative aspect-square">
                    <img
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                      onClick={() => toggleFavorite(product._id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${favorites.includes(product._id) ? "fill-red-500 text-red-500" : ""}`}
                      />
                      <span className="sr-only">Add to favorites</span>
                    </Button>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {product.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold">
                        ₹{product.price.toFixed(2)}/{product.unit}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {product.quantity} {product.unit} available
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full">
                      <BookmarkPlus className="mr-2 h-4 w-4" />
                      Save Product
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <Card key={product._id}>
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-48 w-full sm:h-auto sm:w-48">
                      <img
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                        onClick={() => toggleFavorite(product._id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${favorites.includes(product._id) ? "fill-red-500 text-red-500" : ""}`}
                        />
                        <span className="sr-only">Add to favorites</span>
                      </Button>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <CardHeader className="p-0 pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{product.name}</CardTitle>
                            <CardDescription>
                              {product.category}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              ₹{product.price.toFixed(2)}/{product.unit}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {product.quantity} {product.unit} available
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 p-0 py-2">
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-end p-0 pt-2">
                        <Button>
                          <BookmarkPlus className="mr-2 h-4 w-4" />
                          Save Product
                        </Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
