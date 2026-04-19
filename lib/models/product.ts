import mongoose, { Schema, Document, models } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IProduct extends Document {
  farmerId: ObjectId;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  description: string;
  imageUrl?: string;
  status: 'Active' | 'Sold Out' | 'Inactive'; // Assuming these are the possible statuses
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  farmerId: { type: ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  status: { type: String, enum: ['Active', 'Sold Out', 'Inactive'], default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
