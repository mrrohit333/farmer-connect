import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    // Your database operations here
    return NextResponse.json({ message: 'Connected to MongoDB successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to connect to MongoDB' },
      { status: 500 }
    );
  }
} 