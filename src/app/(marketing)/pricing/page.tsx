import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Choose the right plan for your team
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-muted-foreground">
          Start small and scale as you grow. All plans include a 14-day free trial.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col justify-between rounded-3xl bg-card p-8 ring-1 ring-gray-200 dark:ring-gray-800 xl:p-10 ${
                plan.mostPopular ? "lg:z-10 lg:rounded-b-none" : "lg:mt-8"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8">{plan.name}</h3>
                  {plan.mostPopular && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary">
                      Most popular
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {plan.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  <span className="text-sm font-semibold leading-6 text-muted-foreground">
                    /month
                  </span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/register"
                className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  plan.mostPopular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-primary"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:outline-secondary"
                }`}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const plans = [
  {
    name: "Hobby",
    id: "hobby",
    price: "$0",
    description: "The essentials to provide your best work for clients.",
    features: [
      "5 projects",
      "Up to 3 team members",
      "Basic analytics",
      "48-hour support response time",
    ],
    mostPopular: false,
  },
  {
    name: "Pro",
    id: "pro",
    price: "$29",
    description: "A plan that scales with your rapidly growing business.",
    features: [
      "Unlimited projects",
      "Unlimited team members",
      "Advanced analytics",
      "24-hour support response time",
      "Custom domains",
    ],
    mostPopular: true,
  },
  {
    name: "Enterprise",
    id: "enterprise",
    price: "$99",
    description: "Dedicated support and infrastructure for your company.",
    features: [
      "Unlimited projects",
      "Unlimited team members",
      "Advanced analytics",
      "1-hour, dedicated support response time",
      "Custom domains",
      "SSO Authentication",
    ],
    mostPopular: false,
  },
]
