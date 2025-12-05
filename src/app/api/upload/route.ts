import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, we would upload to S3/Blob here.
    // For now, return a placeholder image based on timestamp to simulate change.
    const timestamp = Date.now()
    const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${timestamp}`

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}
