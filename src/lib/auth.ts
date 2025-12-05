import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { z } from "zod"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials)

        if (!validatedFields.success) {
          return null
        }

        const { email, password } = validatedFields.data

        const user = await db.user.findUnique({
          where: { email },
        })

        if (!user || !user.password) {
          return null
        }

        const passwordsMatch = await bcrypt.compare(password, user.password)

        if (!passwordsMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (session.user) {
        session.user.name = token.name
        session.user.image = token.picture as string
      }
      return session
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id
      }
      if (trigger === "update" && session) {
        token.name = session.name
        token.picture = session.image
      }
      return token
    },
    async signIn({ user, account }) {
      // For OAuth providers, create default workspace if first time
      if (account?.provider === "google") {
        const existingUser = await db.user.findUnique({
          where: { id: user.id },
          include: { workspaces: true },
        })

        if (existingUser && existingUser.workspaces.length === 0) {
          // Create default workspace
          const workspace = await db.workspace.create({
            data: {
              name: `${user.name}'s Workspace`,
              slug: `${user.id}-workspace`,
            },
          })

          // Add user as owner
          await db.workspaceMember.create({
            data: {
              userId: user.id,
              workspaceId: workspace.id,
              role: "OWNER",
            },
          })
        }
      }
      return true
    },
  },
})
