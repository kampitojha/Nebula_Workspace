import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getStripeSession } from "@/lib/stripe"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { priceId } = body

    if (!priceId) {
      return NextResponse.json({ error: "Price ID required" }, { status: 400 })
    }

    // Get user's primary workspace (or let them select, for now using first one)
    const member = await db.workspaceMember.findFirst({
      where: {
        userId: session.user.id,
        role: "OWNER",
      },
      include: {
        workspace: true,
      },
    })

    if (!member) {
      return NextResponse.json(
        { error: "No workspace found where you are an owner" },
        { status: 400 }
      )
    }

    const stripeSession = await getStripeSession(
      priceId,
      session.user.id,
      member.workspaceId
    )

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
