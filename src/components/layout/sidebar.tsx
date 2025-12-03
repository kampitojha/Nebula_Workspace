"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import WorkspaceSwitcher from "@/components/workspace/workspace-switcher"
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  FileText, 
  Settings,
  Zap
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Notes", href: "/notes", icon: FileText },
]

interface SidebarProps {
  workspaces: Array<{
    id: string
    name: string
    slug: string
    role: string
  }>
}

export default function Sidebar({ workspaces }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r bg-muted/40 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Nebula</span>
        </Link>
      </div>

      {/* Workspace Switcher */}
      <div className="p-4">
        <WorkspaceSwitcher workspaces={workspaces} />
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-secondary"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* Settings */}
      <div className="p-4">
        <Link href="/settings">
          <Button
            variant={pathname === "/settings" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Button>
        </Link>
      </div>
    </div>
  )
}
