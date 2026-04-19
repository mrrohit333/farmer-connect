import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, ShoppingBasket, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">FarmConnect</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:underline">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-green-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Connecting Local Farmers to Markets
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    A digital bridge between producers and vendors. Streamline your agricultural trade with our
                    platform.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/signup?role=farmer">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Join as Farmer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/signup?role=vendor">
                    <Button variant="outline">
                      Join as Vendor
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative h-[350px] w-[350px] rounded-full bg-green-100 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-[300px] w-[300px] rounded-full bg-green-200 flex items-center justify-center">
                      <div className="h-[250px] w-[250px] rounded-full bg-green-300 flex items-center justify-center">
                        <div className="h-[200px] w-[200px] rounded-full bg-green-400 flex items-center justify-center">
                          <Leaf className="h-24 w-24 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers a range of features to help farmers and vendors connect and trade efficiently.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
                <div className="p-3 rounded-full bg-green-100">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">For Farmers</h3>
                <p className="text-sm text-gray-500 text-center">
                  Upload your products, manage inventory, and connect directly with vendors.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
                <div className="p-3 rounded-full bg-green-100">
                  <ShoppingBasket className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">For Vendors</h3>
                <p className="text-sm text-gray-500 text-center">
                  Browse available products, filter by preferences, and connect with local farmers.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
                <div className="p-3 rounded-full bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Market Growth</h3>
                <p className="text-sm text-gray-500 text-center">
                  Expand your reach and grow your business with our digital marketplace.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform makes it easy for farmers and vendors to connect and trade.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h3 className="text-xl font-bold">Sign Up</h3>
                <p className="text-sm text-gray-500 text-center">
                  Create an account as a farmer or vendor to get started.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-bold">Connect</h3>
                <p className="text-sm text-gray-500 text-center">
                  Farmers upload products, vendors browse and find what they need.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="text-xl font-bold">Trade</h3>
                <p className="text-sm text-gray-500 text-center">
                  Communicate, negotiate, and complete transactions efficiently.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Testimonials</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what our users have to say about our platform.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-12 mt-8">
              <div className="flex flex-col space-y-4 border rounded-lg p-6 shadow-sm">
                <p className="text-gray-500 italic">
                  "FarmConnect has transformed how I sell my produce. I've connected with vendors I never would have
                  found otherwise."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-green-100"></div>
                  <div>
                    <p className="text-sm font-medium">Chethan kumar</p>
                    <p className="text-xs text-gray-500">Organic Farmer</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-4 border rounded-lg p-6 shadow-sm">
                <p className="text-gray-500 italic">
                  "As a market vendor, finding reliable local suppliers was always a challenge. FarmConnect has made it
                  simple and efficient."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-green-100"></div>
                  <div>
                    <p className="text-sm font-medium">Dhilipan</p>
                    <p className="text-xs text-gray-500">Market Vendor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-8 border-t bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-gray-50">FarmConnect</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2023 FarmConnect. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/terms" className="text-sm hover:underline text-gray-500 dark:text-gray-400">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm hover:underline text-gray-500 dark:text-gray-400">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-sm hover:underline text-gray-500 dark:text-gray-400">
              Contact Us
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
