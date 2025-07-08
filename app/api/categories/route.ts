/*
John 1:5
The light shines in darkness, but the darkness has not understood it 
*/
import { NextResponse } from "next/server"
import { getCategories } from "@/lib/actions/category-actions"

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 })
  }
}
