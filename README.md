# Nebula Workspace 🚀

A modern, full-stack SaaS workspace management platform built with Next.js 15, featuring authentication, team collaboration, projects, tasks, and notes.

## ✨ Features

### Phase 0-1 (Completed)

- ✅ **Authentication System**

  - Email/password login with bcrypt hashing
  - Google OAuth integration
  - Protected routes with middleware
  - Auto-workspace creation on signup

- ✅ **Workspace Management**

  - Multiple workspaces per user
  - Role-based access control (Owner, Admin, Member)
  - Workspace switcher with dropdown
  - Create new workspaces

- ✅ **Modern UI**
  - Premium landing page with gradient hero
  - Dark mode support
  - shadcn/ui components
  - Responsive design

### Coming Soon

- 📁 Projects & Tasks with Kanban board
- 📝 Rich text notes editor
- 💬 Comments & activity feed
- 🔔 Real-time notifications
- 💳 Stripe billing integration

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (via Neon)
- **ORM:** Prisma 7
- **Auth:** Auth.js (NextAuth)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React

## 📦 Installation

1. **Clone and install dependencies:**

```bash
cd nebula-workspace
npm install
```

2. **Setup environment variables:**
   Create a `.env` file (copy from `.env.example`):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nebula_workspace"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

3. **Setup database:**

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

4. **Run development server:**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔑 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

## 📁 Project Structure

```
nebula-workspace/
├── src/
│   ├── app/
│   │   ├── (marketing)/       # Landing page
│   │   ├── (auth)/            # Login/Register
│   │   ├── (app)/             # Protected app routes
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Sidebar, Topbar
│   │   └── workspace/         # Workspace switcher
│   └── lib/
│       ├── auth.ts            # Auth.js config
│       ├── db.ts              # Prisma client
│       └── validation/        # Zod schemas
├── prisma/
│   └── schema.prisma          # Database schema
└── public/
```

## 🗄️ Database Schema

- **User** - Authentication and profile
- **Workspace** - Organizations/teams
- **WorkspaceMember** - User-workspace relationships with roles
- **Project** - Project management
- **Task** - Task tracking with status/priority
- **Note** - Rich text notes
- **Comment** - Comments on tasks/notes
- **Notification** - In-app notifications
- **Subscription** - Stripe billing (coming soon)
- **ActivityLog** - Audit trail

## 🚀 Development

```bash
# Run dev server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Prisma Studio (database GUI)
npx prisma studio
```

## 📝 Next Steps

1. **Setup Database:**

   - Create a Neon PostgreSQL database
   - Update `DATABASE_URL` in `.env`
   - Run `npx prisma db push`

2. **Configure OAuth:**

   - Setup Google OAuth credentials
   - Update `.env` with client ID/secret

3. **Test Authentication:**

   - Register a new account
   - Login with credentials
   - Test Google OAuth

4. **Explore:**
   - Check dashboard
   - Create workspaces
   - Switch between workspaces

## 🎯 Roadmap

- [x] Phase 0: Base setup
- [x] Phase 1: Auth + Workspaces
- [ ] Phase 2: Projects + Tasks
- [ ] Phase 3: Notes + Comments
- [ ] Phase 4: Realtime + Notifications
- [ ] Phase 5: Billing + Subscriptions
- [ ] Phase 6: Polish + Performance

## 📄 License

MIT

---

Built with ❤️ using Next.js 15 and modern web technologies
