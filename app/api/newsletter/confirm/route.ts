/*
John 1:5
The light shines in darkness, but the darkness has not understood it 
*/
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: "Subscription confirmed successfully!",
    })
  } catch (error) {
    console.error("Error in newsletter confirmation:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
