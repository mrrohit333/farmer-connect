import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { ObjectId } from "mongodb"
import { verify } from "jsonwebtoken"
import { readFile, writeFile } from "fs/promises"
import path from 'path';
import fs from 'fs'; // Import fs module

import clientPromise from "@/lib/mongodb"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import Product from "@/lib/models/Product"

const productSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  price: z.number().positive(),
  description: z.string().min(10),
  imageUrl: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const search = searchParams.get("search")
    const farmerId = searchParams.get("farmerId")
    const status = searchParams.get("status")

    // Build query
    const query: any = {}

    if (category && category !== "all") {
      query.category = category
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number.parseFloat(minPrice)
      if (maxPrice) query.price.$lte = Number.parseFloat(maxPrice)
    }

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    if (farmerId) {
       query.farmerId = new ObjectId(farmerId);
    }

    if (status && status !== "all") {
      query.status = status;
    } else if (!status) {
      // Default to only fetching 'Active' products if no status is specified
      query.status = 'Active';
    }

    // Connect to MongoDB
    await connectDB(); // Ensure DB is connected

    // Get products
    const products = await Product.find(query).sort({ createdAt: -1 }).exec();

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string, email: string, role: string }
    const farmerId = decoded.userId;

    const formData = await req.formData();
    const name = formData.get('name');
    const category = formData.get('category');
    const quantity = formData.get('quantity');
    const unit = formData.get('unit');
    const price = formData.get('price');
    const description = formData.get('description');
    const image = formData.get('image') as File | null;

    // Validate request body against schema without farmerId
    const productDataForValidation = {
        name: name ? name.toString() : undefined,
        category: category ? category.toString() : undefined,
        quantity: quantity ? parseFloat(quantity.toString()) : undefined,
        unit: unit ? unit.toString() : undefined,
        price: price ? parseFloat(price.toString()) : undefined,
        description: description ? description.toString() : undefined,
    }

    console.log("Received data for validation:", productDataForValidation); // Log received data

    const result = productSchema.safeParse(productDataForValidation)

    if (!result.success) {
      console.error("Zod validation failed:", result.error.format()); // Log validation errors
      return NextResponse.json({ error: "Invalid request data", details: result.error.format() }, { status: 400 })
    }

    const productData = result.data

    // Connect to MongoDB
    await connectDB(); // Ensure DB is connected

    // Create product object without imageUrl initially
    const now = new Date()
    const product = {
      ...productData,
      farmerId: new ObjectId(farmerId),
      status: "Active", // Default status
      createdAt: now,
      updatedAt: now,
    };

    let imageUrl = undefined;

    // --- Image Handling ---
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Define the upload directory path
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'product-images');
      // Ensure upload directory exists (optional, but good practice)
      await fs.promises.mkdir(uploadDir, { recursive: true }); // Create directory if it doesn't exist

      // Create a unique filename
      const filename = `${Date.now()}-${image.name}`.replace(/[^a-zA-Z0-9._-]/g, ''); // Sanitize filename
      const imagePath = path.join(uploadDir, filename);

      await writeFile(imagePath, buffer);

      // Construct the public URL
      imageUrl = `/uploads/product-images/${filename}`; // Public path
    }
    // --------------------

    const newProduct = new Product({...product, imageUrl}); // Create a new Mongoose product document with imageUrl
    const savedProduct = await newProduct.save(); // Save the product to the database

    // Update farmer's products array
    await User.updateOne({ _id: new ObjectId(farmerId) }, { $push: { products: savedProduct._id } });

    return NextResponse.json(
      {
        message: "Product created successfully",
        productId: savedProduct._id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating product:", error)
    console.error("Detailed error:", JSON.stringify(error, null, 2));
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
