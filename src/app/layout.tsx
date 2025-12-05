import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nebula Workspace - Collaborate, Create, Succeed",
  description: "Modern workspace management platform for teams",
}

import { Providers } from "@/components/providers"
import StarField from "@/components/3d/star-field"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <StarField />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
