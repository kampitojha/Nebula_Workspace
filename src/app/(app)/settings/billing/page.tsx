"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, CreditCard, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"

const plans = [
  {
    name: "Hobby",
    id: "price_hobby", // Replace with real Stripe Price ID
    price: "$0",
    description: "The essentials to provide your best work for clients.",
    features: ["5 projects", "Up to 3 team members", "Basic analytics"],
  },
  {
    name: "Pro",
    id: "price_pro", // Replace with real Stripe Price ID
    price: "$29",
    description: "A plan that scales with your rapidly growing business.",
    features: [
      "Unlimited projects",
      "Unlimited team members",
      "Advanced analytics",
      "Custom domains",
    ],
  },
]

export default function BillingPage() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleUpgrade = async (priceId: string) => {
    setIsLoading(priceId)
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error("Failed to start checkout")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing & Plans</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing details.
        </p>
      </div>

      {searchParams.get("success") && (
        <div className="bg-green-500/15 text-green-600 px-4 py-3 rounded-md text-sm font-medium">
          Subscription updated successfully!
        </div>
      )}

      {searchParams.get("canceled") && (
        <div className="bg-yellow-500/15 text-yellow-600 px-4 py-3 rounded-md text-sm font-medium">
          Subscription update canceled.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-3xl font-bold mb-6">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleUpgrade(plan.id)}
                disabled={isLoading === plan.id}
              >
                {isLoading === plan.id && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {plan.name === "Hobby" ? "Current Plan" : "Upgrade"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            Manage your payment details and billing history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <CreditCard className="h-6 w-6" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Visa ending in 4242
              </p>
              <p className="text-sm text-muted-foreground">
                Expires 12/2024
              </p>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
